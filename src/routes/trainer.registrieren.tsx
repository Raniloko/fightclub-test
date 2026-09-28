import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { registerTrainer } from "@/lib/trainers.functions";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/trainer/registrieren")({
  head: () => ({
    meta: [
      { title: "Trainer-Profil anlegen — Fight Club Hanau" },
      {
        name: "description",
        content:
          "Trainer der Fight Club Kampfsport Akademie Hanau legen hier ihr persönliches Profil an und pflegen es selbst.",
      },
      { property: "og:title", content: "Trainer-Profil anlegen — Fight Club Hanau" },
      {
        property: "og:description",
        content: "Registrierung für Trainer der Fight Club Kampfsport Akademie Hanau.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Das Passwort muss mindestens 8 Zeichen haben.");
      return;
    }
    if (password !== password2) {
      setError("Die beiden Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const res = await registerTrainer({
        data: { email: cleanEmail, password, display_name: name.trim() },
      });
      if (!res.ok) {
        setError(res.error);
        setLoading(false);
        return;
      }
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (signInError) {
        navigate({ to: "/trainer/login" });
        return;
      }
      navigate({ to: "/trainer/profil" });
    } catch {
      setError("Registrierung fehlgeschlagen. Bitte versuche es erneut.");
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
        <h1 className="mt-3 font-display text-4xl md:text-5xl">PROFIL ANLEGEN</h1>
        <p className="mt-4 text-[14px] leading-relaxed text-white/65">
          Lege dein Trainerprofil an. Nach der Freigabe durch die Akademie erscheint es auf der
          Startseite. Pro E-Mail-Adresse ist genau ein Profil möglich.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <Field label="Vor- und Nachname">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={80}
              autoComplete="name"
              className={inputCls}
            />
          </Field>
          <Field label="E-Mail">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputCls}
            />
          </Field>
          <Field label="Passwort (mind. 8 Zeichen)">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className={inputCls}
            />
          </Field>
          <Field label="Passwort wiederholen">
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              className={inputCls}
            />
          </Field>

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
            {loading ? "Wird angelegt …" : "Profil anlegen"}
          </button>
        </form>

        <p className="mt-6 text-[13px] text-white/55">
          Du hast schon ein Profil?{" "}
          <Link to="/trainer/login" className="text-[#C9A84C] underline underline-offset-4">
            Hier anmelden
          </Link>
        </p>
      </div>
      <Footer />
    </main>
  );
}

const inputCls =
  "w-full border border-white/15 bg-[#111] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-[#00B4DC]";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
        {label}
      </span>
      {children}
    </label>
  );
}
