import { createServerFn } from "@tanstack/react-start";
import { useSession } from "@tanstack/react-start/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { z } from "zod";

type GateSession = { unlocked?: boolean };

function sessionConfig() {
  const password = process.env.SITE_GATE_SESSION_SECRET;
  if (!password) throw new Error("SITE_GATE_SESSION_SECRET is not configured");
  return {
    password,
    name: "fc-site-gate",
    maxAge: 60 * 60 * 24 * 30, // 30 Tage "angemeldet bleiben"
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

// Timing-safe compare of arbitrary-length inputs by hashing both sides first.
function passwordMatches(input: string, expected: string): boolean {
  const a = createHash("sha256").update(input, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}

export const getGateStatus = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  return { unlocked: !!session.data.unlocked };
});

export const unlockSite = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ password: z.string().min(1).max(200) }).parse(d),
  )
  .handler(async ({ data }) => {
    const expected = process.env.SITE_PASSWORD;
    if (!expected) throw new Error("SITE_PASSWORD ist nicht konfiguriert.");

    // Small constant-ish delay to slow brute-force attempts.
    await new Promise((r) => setTimeout(r, 350));

    if (!passwordMatches(data.password, expected)) {
      return { ok: false as const };
    }

    const session = await useSession<GateSession>(sessionConfig());
    await session.update({ unlocked: true });
    return { ok: true as const };
  });

export const lockSite = createServerFn({ method: "POST" }).handler(async () => {
  const session = await useSession<GateSession>(sessionConfig());
  await session.clear();
  return { ok: true as const };
});
