import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type OAuthNs = {
  getAuthorizationDetails: (id: string) => Promise<{
    data: { client?: { name?: string }; redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
  approveAuthorization: (id: string) => Promise<{
    data: { redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
  denyAuthorization: (id: string) => Promise<{
    data: { redirect_url?: string; redirect_to?: string } | null;
    error: { message: string } | null;
  }>;
};

function oauthNs(): OAuthNs {
  return (supabase.auth as unknown as { oauth: OAuthNs }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({
        to: "/admin/login",
        search: { next } as never,
      });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthNs().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
      <p>Autorisierung konnte nicht geladen werden: {String((error as Error)?.message ?? error)}</p>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const ns = oauthNs();
    const { data, error } = approve
      ? await ns.approveAuthorization(authorization_id)
      : await ns.denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Keine Weiterleitung vom Auth-Server erhalten.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "Diese Anwendung";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-white/10 bg-white/[0.03] p-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="block h-px w-8 bg-[#00B4DC]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#00B4DC]">
            Autorisierung
          </span>
        </div>
        <h1 className="font-display text-3xl">
          <span className="fc-headline-underline">{clientName}</span> verbinden?
        </h1>
        <p className="mt-4 text-sm text-white/80">
          {clientName} möchte im Namen deines Kontos auf die MCP-Tools des Fight Club Hanau zugreifen.
        </p>

        {error && (
          <div className="mt-6 border border-red-500/50 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 bg-[#00B4DC] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black hover:bg-[#00A0C4] disabled:opacity-50"
          >
            {busy ? "…" : "Zulassen"}
          </button>
          <button
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1 border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-white/5 disabled:opacity-50"
          >
            Ablehnen
          </button>
        </div>
      </div>
    </main>
  );
}
