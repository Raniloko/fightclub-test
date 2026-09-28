import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkLoginAllowed, recordLoginAttempt } from "@/lib/admin.functions";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/trainer/login")({
  head: () => ({
    meta: [
      { title: "Trainer-Login — Fight Club Hanau" },
      {
        name: "description",
        content: "Anmeldung für Trainer der Fight Club Kampfsport Akademie Hanau.",
      },
      { property: "og:title", content: "Trainer-Login — Fight Club Hanau" },
      {
        property: "og:description",
        content: "Anmeldung für Trainer der Fight Club Kampfsport Akademie Hanau.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TrainerLogin,
});

function TrainerLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const gate = await checkLoginAllowed({ data: { email: cleanEmail } });
      if (!gate.allowed) {
        setError(gate.reason);
        setLoading(false);
        return;
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
      navigate({ to: "/trainer/profil" });
    } catch {
      setError("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Nav />
      <div className="mx-auto max-w-md px-5 pb-24 pt-32 md:pt-40">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
          Trainerbereich
        </span>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">ANMELDEN</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
              E-Mail
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-white/15 bg-[#111] px-4 py-3 text-[15px] text-white outline-none focus:border-[#00B4DC]"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
              Passwort
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-white/15 bg-[#111] px-4 py-3 text-[15px] text-white outline-none focus:border-[#00B4DC]"
            />
          </label>

          {error && (
            <p className="border border-red-500/40 bg-red-500/10 p-3 text-[13px] text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00B4DC] py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0a0a0a] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Wird angemeldet …" : "Anmelden"}
          </button>
        </form>

        <p className="mt-6 text-[13px] text-white/55">
          Noch kein Profil?{" "}
          <Link to="/trainer/registrieren" className="text-[#C9A84C] underline underline-offset-4">
            Jetzt anlegen
          </Link>
        </p>
      </div>
      <Footer />
    </main>
  );
}
