import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkLoginAllowed, recordLoginAttempt } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — Fight Club Hanau" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      const gate = await checkLoginAllowed({ data: { email: cleanEmail } });
      if (!gate.allowed) {
        setError(gate.reason);
        setLoading(false);
        return;
      }

      // "Angemeldet bleiben" — persist session across browser restarts.
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("fc-remember", remember ? "1" : "0");
        } catch {
          /* ignore */
        }
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      await recordLoginAttempt({ data: { email: cleanEmail, success: !signInError } });

      if (signInError) {
        setError("E-Mail oder Passwort ist falsch.");
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      const isSafeNext =
        !!next &&
        next.startsWith("/") &&
        !next.startsWith("//") &&
        !next.startsWith("/\\");
      if (isSafeNext) {
        try {
          const resolved = new URL(next, window.location.origin);
          if (resolved.origin === window.location.origin) {
            window.location.href = resolved.pathname + resolved.search + resolved.hash;
            return;
          }
        } catch {
          // fall through to default redirect
        }
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError(null);
    setInfo(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Bitte gib zuerst deine E-Mail ein.");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/admin/passwort-festlegen`,
    });
    if (error) setError(error.message);
    else setInfo("Falls dein Konto existiert, wurde eine E-Mail versendet.");
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 inline-block text-[11px] uppercase tracking-[0.3em] text-[#999] hover:text-white">
          ← Zur Website
        </Link>

        <div className="border border-white/10 bg-white/[0.03] p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="block h-px w-8 bg-[#00B4DC]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#00B4DC]">
              Admin
            </span>
          </div>
          <h1 className="font-display text-4xl">
            <span className="fc-headline-underline">Anmelden</span>
          </h1>
          <p className="mt-3 text-sm text-[#999]">Nur für Mitarbeiter des Fight Club Hanau.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#999] mb-2">
                E-Mail
              </label>
              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-white/20 px-4 py-3 text-white focus:border-[#00B4DC] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#999] mb-2">
                Passwort
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-white/20 px-4 py-3 text-white focus:border-[#00B4DC] focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 accent-[#00B4DC]"
              />
              <span className="text-sm text-white/80">Angemeldet bleiben</span>
            </label>

            {error && (
              <div className="border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
            {info && (
              <div className="border border-[#00B4DC]/50 bg-[#00B4DC]/10 px-4 py-3 text-sm text-[#7dd8ee]">
                {info}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00B4DC] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black hover:bg-[#00A0C4] disabled:opacity-50"
            >
              {loading ? "…" : "Anmelden"}
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="block w-full text-center text-[11px] uppercase tracking-[0.2em] text-[#999] hover:text-white"
            >
              Passwort vergessen?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
