import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/passwort-festlegen")({
  head: () => ({
    meta: [
      { title: "Passwort festlegen — Fight Club Hanau" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SetPasswordPage,
});

function SetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Recovery/invite links land here with tokens in the URL hash.
    // Supabase JS auto-processes them; wait until a session exists.
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) setReady(true);
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "USER_UPDATED") {
        setReady(true);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Mindestens 8 Zeichen.");
    if (password !== confirm) return setError("Passwörter stimmen nicht überein.");

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return setError(error.message);
    navigate({ to: "/admin" });
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
            <span className="fc-headline-underline">Passwort festlegen</span>
          </h1>

          {!ready ? (
            <p className="mt-6 text-sm text-[#999]">
              Prüfe deinen Einladungs-Link. Öffne den Link aus deiner E-Mail direkt in diesem Browser.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#999] mb-2">
                  Neues Passwort
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-white/20 px-4 py-3 text-white focus:border-[#00B4DC] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#999] mb-2">
                  Passwort bestätigen
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full bg-black border border-white/20 px-4 py-3 text-white focus:border-[#00B4DC] focus:outline-none"
                />
              </div>

              {error && (
                <div className="border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00B4DC] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black hover:bg-[#00A0C4] disabled:opacity-50"
              >
                {loading ? "…" : "Passwort speichern"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
