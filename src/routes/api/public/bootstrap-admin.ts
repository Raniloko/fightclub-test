import { createFileRoute } from "@tanstack/react-router";

/**
 * One-time bootstrap: creates the initial admin user (info@fightclub-hanau.de)
 * and sends the "set password" invitation email. Does nothing once an admin
 * already exists.
 */
export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      GET: async ({ request }) => bootstrap(request),
      POST: async ({ request }) => bootstrap(request),
    },
  },
});

async function bootstrap(request: Request) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: existingAdmins, error: roleErr } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("role", "admin")
    .limit(1);
  if (roleErr) return json({ error: roleErr.message }, 500);

  if ((existingAdmins ?? []).length > 0) {
    return json({ ok: true, message: "Admin bereits vorhanden. Nichts zu tun." });
  }

  const email = "info@fightclub-hanau.de";
  const origin = new URL(request.url).origin;

  const { data: invited, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${origin}/admin/passwort-festlegen`,
  });
  if (error) return json({ error: error.message }, 500);

  if (invited.user) {
    await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: invited.user.id, role: "admin" });
  }

  return json({
    ok: true,
    message: `Einladung an ${email} verschickt. Bitte E-Mails prüfen und Passwort festlegen.`,
  });
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
