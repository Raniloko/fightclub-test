import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { unlockSite } from "@/lib/gate.functions";
import { Logo } from "@/components/site/Logo";

const searchSchema = z.object({
  r: z.string().optional(),
});

export const Route = createFileRoute("/unlock")({
  head: () => ({
    meta: [
      { title: "Zugang — Fight Club Hanau" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (s) => searchSchema.parse(s),
  component: UnlockPage,
});

function UnlockPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/unlock" });
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { ok } = await unlockSite({ data: { password } });
      if (!ok) {
        setError("Falsches Passwort.");
        setLoading(false);
        return;
      }
      const target = search.r && search.r.startsWith("/") ? search.r : "/";
      navigate({ to: target });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size={120} />
        </div>
        <div className="border border-white/10 bg-white/[0.03] p-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="block h-px w-8 bg-[#00B4DC]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#00B4DC]">
              Geschützter Bereich
            </span>
          </div>
          <h1 className="font-display text-4xl">
            <span className="fc-headline-underline">Passwort erforderlich</span>
          </h1>
          <p className="mt-3 text-sm text-[#999]">
            Bitte gib das Zugangs-Passwort ein, um die Website zu betreten.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#999] mb-2">
                Passwort
              </label>
              <input
                type="password"
                required
                autoFocus
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "…" : "Betreten"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
