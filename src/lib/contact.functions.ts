import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Basic in-memory rate limiter (per worker instance) — mitigates trivial abuse.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const ipHits = new Map<string, number[]>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const arr = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  arr.push(now);
  ipHits.set(ip, arr);
  return arr.length <= RATE_LIMIT_MAX;
}

// Escape HTML to prevent injection into the email body.
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Zod schema: strict length limits, format checks, trims whitespace.
const ContactSchema = z.object({
  name: z.string().trim().min(2, "Name zu kurz").max(100, "Name zu lang"),
  email: z.string().trim().toLowerCase().email("Ungültige E-Mail").max(200),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+0-9 ()\/.\-]*$/, "Ungültige Telefonnummer")
    .optional()
    .or(z.literal("")),
  discipline: z
    .enum([
      "MMA",
      "K1",
      "Boxen",
      "Thaiboxen",
      "Self-Defense",
      "Wing-Fight",
      "Kindertraining",
      "Ich bin noch unentschlossen",
      "",
    ])
    .optional(),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot — bots fill hidden fields; humans don't.
  website: z.string().max(0).optional().or(z.literal("")),
});

export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => ContactSchema.parse(data))
  .handler(async ({ data }) => {
    // Honeypot triggered — silently succeed to not tip off bots.
    if (data.website && data.website.length > 0) {
      return { ok: true as const };
    }

    // Rate limit by client IP (best-effort — headers set by Cloudflare / proxy).
    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ip =
      getRequestHeader("cf-connecting-ip") ??
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (!rateLimit(ip)) {
      throw new Error("Zu viele Anfragen. Bitte später erneut versuchen.");
    }

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    if (!apiKey || !to) {
      throw new Error("E-Mail-Dienst ist nicht konfiguriert.");
    }

    const subject = `Neue Kontaktanfrage – ${data.name}`;
    const html = `
      <h2>Neue Kontaktanfrage</h2>
      <p><strong>Name:</strong> ${esc(data.name)}</p>
      <p><strong>E-Mail:</strong> ${esc(data.email)}</p>
      ${data.phone ? `<p><strong>Telefon:</strong> ${esc(data.phone)}</p>` : ""}
      ${data.discipline ? `<p><strong>Disziplin:</strong> ${esc(data.discipline)}</p>` : ""}
      ${data.message ? `<p><strong>Nachricht:</strong><br>${esc(data.message).replace(/\n/g, "<br>")}</p>` : ""}
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Fight Club Hanau <onboarding@resend.dev>",
        to: [to],
        reply_to: data.email,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      // Log server-side, don't leak provider details to client.
      console.error("Resend error", res.status, await res.text().catch(() => ""));
      throw new Error("E-Mail konnte nicht gesendet werden.");
    }

    return { ok: true as const };
  });
