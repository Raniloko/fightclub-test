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

    const FROM = "Fight Club Kampfsport Akademie Hanau <kontakt@fightclub-hanau.de>";

    // Shared brand styles (all inline — email clients strip <style>).
    const wrap = (inner: string, preview: string) => `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fight Club Hanau</title></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0a0a0a;">
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">${esc(preview)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e6e6e6;">
        <tr><td style="background:#0a0a0a;padding:28px 32px;">
          <div style="color:#ffffff;font-size:11px;letter-spacing:0.35em;text-transform:uppercase;font-weight:600;">Fight Club Hanau</div>
          <div style="color:#9a9a9a;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;margin-top:6px;">MMA · K1 · Boxen · Thaiboxen</div>
        </td></tr>
        <tr><td style="padding:36px 32px 24px 32px;">${inner}</td></tr>
        <tr><td style="background:#0a0a0a;padding:24px 32px;color:#9a9a9a;font-size:11px;line-height:1.7;letter-spacing:0.05em;">
          <div style="color:#ffffff;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;font-size:11px;margin-bottom:8px;">Fight Club Kampfsport Akademie Hanau</div>
          Geleitstraße 66 · 63456 Hanau<br>
          <a href="mailto:info@fightclub-hanau.de" style="color:#9a9a9a;text-decoration:underline;">info@fightclub-hanau.de</a> ·
          <a href="https://www.fightclub-hanau.de" style="color:#9a9a9a;text-decoration:underline;">fightclub-hanau.de</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #ececec;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#777;width:120px;vertical-align:top;">${esc(label)}</td>
        <td style="padding:12px 0;border-bottom:1px solid #ececec;font-size:15px;color:#0a0a0a;line-height:1.5;">${value}</td>
      </tr>`;

    // ---------- Admin notification ----------
    const adminInner = `
      <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#777;font-weight:600;">Neue Kontaktanfrage</div>
      <h1 style="margin:8px 0 24px 0;font-size:28px;line-height:1.15;font-weight:800;letter-spacing:-0.01em;">${esc(data.name)} hat sich gemeldet</h1>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #ececec;">
        ${row("Name", esc(data.name))}
        ${row("E-Mail", `<a href="mailto:${esc(data.email)}" style="color:#0a0a0a;text-decoration:underline;">${esc(data.email)}</a>`)}
        ${data.phone ? row("Telefon", `<a href="tel:${esc(data.phone)}" style="color:#0a0a0a;text-decoration:underline;">${esc(data.phone)}</a>`) : ""}
        ${data.discipline ? row("Disziplin", esc(data.discipline)) : ""}
        ${data.message ? row("Nachricht", esc(data.message).replace(/\n/g, "<br>")) : ""}
      </table>
      <div style="margin-top:28px;">
        <a href="mailto:${esc(data.email)}" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:14px 22px;font-size:12px;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;">Direkt antworten</a>
      </div>`;

    // ---------- User confirmation ----------
    const userInner = `
      <div style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:#777;font-weight:600;">Danke für deine Nachricht</div>
      <h1 style="margin:8px 0 20px 0;font-size:28px;line-height:1.2;font-weight:800;letter-spacing:-0.01em;">Hallo ${esc(data.name)},</h1>
      <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#333;">
        vielen Dank für dein Interesse am <strong>Fight Club Kampfsport Akademie Hanau</strong>. Wir haben deine Anfrage erhalten und melden uns so schnell wie möglich bei dir – in der Regel innerhalb von 24 Stunden.
      </p>
      <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:#333;">
        Bis dahin kannst du dich schon einmal durch unsere Disziplinen und den Trainingsplan klicken.
      </p>
      ${
        data.message || data.discipline
          ? `<div style="background:#fafafa;border-left:3px solid #0a0a0a;padding:18px 20px;margin:0 0 28px 0;">
              <div style="font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#777;font-weight:600;margin-bottom:10px;">Deine Anfrage</div>
              ${data.discipline ? `<div style="font-size:14px;margin-bottom:6px;"><strong>Disziplin:</strong> ${esc(data.discipline)}</div>` : ""}
              ${data.message ? `<div style="font-size:14px;line-height:1.6;color:#333;">${esc(data.message).replace(/\n/g, "<br>")}</div>` : ""}
            </div>`
          : ""
      }
      <div style="margin:24px 0 8px 0;">
        <a href="https://www.fightclub-hanau.de" style="display:inline-block;background:#0a0a0a;color:#ffffff;text-decoration:none;padding:14px 22px;font-size:12px;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;">Zur Website</a>
      </div>
      <p style="margin:32px 0 0 0;font-size:13px;line-height:1.6;color:#777;">
        Sportliche Grüße<br>
        <strong style="color:#0a0a0a;">Dein Fight Club Team</strong>
      </p>`;

    async function sendMail(payload: {
      to: string[];
      subject: string;
      html: string;
      reply_to?: string;
    }) {
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from: FROM, ...payload }),
      });
      if (!r.ok) {
        console.error("Resend error", r.status, await r.text().catch(() => ""));
        throw new Error("send_failed");
      }
    }

    try {
      // Send admin notification first — that one must succeed.
      await sendMail({
        to: [to],
        reply_to: data.email,
        subject: `Neue Kontaktanfrage – ${data.name}`,
        html: wrap(adminInner, `Neue Anfrage von ${data.name}`),
      });

      // Confirmation to the user — failure here is non-fatal.
      try {
        await sendMail({
          to: [data.email],
          subject: "Wir haben deine Nachricht erhalten – Fight Club Hanau",
          html: wrap(userInner, "Danke für deine Nachricht – wir melden uns in Kürze."),
        });
      } catch (e) {
        console.error("User confirmation failed", e);
      }
    } catch {
      throw new Error("E-Mail konnte nicht gesendet werden.");
    }

    return { ok: true as const };
  });
