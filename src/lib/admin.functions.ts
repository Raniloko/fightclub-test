import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const emailSchema = z.string().trim().toLowerCase().email().max(255);

/** Server-side brute-force check + logging (called BEFORE + AFTER the signInWithPassword attempt). */
export const checkLoginAllowed = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ email: emailSchema }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();

    const [{ count: emailCount }, { count: ipCount }] = await Promise.all([
      supabaseAdmin
        .from("auth_attempts")
        .select("id", { count: "exact", head: true })
        .eq("email", data.email)
        .eq("success", false)
        .gte("attempted_at", since),
      supabaseAdmin
        .from("auth_attempts")
        .select("id", { count: "exact", head: true })
        .eq("ip", ip)
        .eq("success", false)
        .gte("attempted_at", since),
    ]);

    if ((emailCount ?? 0) >= 5 || (ipCount ?? 0) >= 20) {
      return { allowed: false as const, reason: "Zu viele Fehlversuche. Bitte warte 15 Minuten." };
    }
    return { allowed: true as const };
  });

export const recordLoginAttempt = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ email: emailSchema, success: z.boolean() }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    await supabaseAdmin
      .from("auth_attempts")
      .insert({ email: data.email, ip, success: data.success });
    // opportunistic cleanup
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await supabaseAdmin.from("auth_attempts").delete().lt("attempted_at", cutoff);
    return { ok: true };
  });

/** Returns the roles of the current signed-in user. */
export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => r.role as "admin" | "staff");
  });

/** Admin-only: list all staff/admin users. */
export const listTeam = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Nur Admins können Team-Mitglieder verwalten.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
    if (error) throw new Error(error.message);

    const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
    const rolesByUser = new Map<string, string[]>();
    (roles ?? []).forEach((r) => {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role);
      rolesByUser.set(r.user_id, arr);
    });

    return users.users
      .map((u) => ({
        id: u.id,
        email: u.email ?? "",
        roles: rolesByUser.get(u.id) ?? [],
        last_sign_in_at: u.last_sign_in_at,
        invited_at: u.invited_at,
      }))
      .filter((u) => u.roles.length > 0);
  });

/** Admin-only: invite a new team member. */
export const inviteTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ email: emailSchema, role: z.enum(["admin", "staff"]) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Nur Admins können einladen.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const origin =
      process.env.SITE_URL ?? "https://fightclub-hanau.de";
    const { data: invited, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      data.email,
      { redirectTo: `${origin}/admin/passwort-festlegen` },
    );
    if (error) throw new Error(error.message);
    if (invited.user) {
      await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: invited.user.id, role: data.role });
    }
    return { ok: true };
  });

/** Admin-only: remove a team member (auth user + roles). */
export const removeTeamMember = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ user_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    if (data.user_id === context.userId) {
      throw new Error("Du kannst dich nicht selbst entfernen.");
    }
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Nur Admins können Mitglieder entfernen.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
