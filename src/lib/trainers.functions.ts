import { createServerFn } from "@tanstack/react-start";
import { getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase as publicSupabase } from "@/integrations/supabase/client";

export const DISCIPLINES = [
  "Kickboxen",
  "Thaiboxen",
  "Boxen",
  "K1",
  "MMA",
  "Submission Grappling",
  "Wing Fight",
  "Selbstverteidigung",
  "Kindertraining",
  "Personal Training",
] as const;

export type TrainerProfile = {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  role_title: string;
  disciplines: string[];
  short_bio: string;
  bio: string;
  achievements: string[];
  avatar_path: string | null;
  avatar_url: string | null;
  instagram_url: string | null;
  sort_index: number;
  is_published: boolean;
  submitted_for_review: boolean;
};

type Row = Omit<TrainerProfile, "avatar_url">;

const SELECT_COLS =
  "id, user_id, email, display_name, role_title, disciplines, short_bio, bio, achievements, avatar_path, instagram_url, sort_index, is_published, submitted_for_review";

async function withAvatarUrls(rows: Row[]): Promise<TrainerProfile[]> {
  const paths = rows.map((r) => r.avatar_path).filter((p): p is string => !!p);
  const urls = new Map<string, string>();
  if (paths.length > 0) {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.storage
      .from("trainer-avatars")
      .createSignedUrls(paths, 60 * 60 * 24 * 7);
    (data ?? []).forEach((d) => {
      if (d.path && d.signedUrl) urls.set(d.path, d.signedUrl);
    });
  }
  return rows.map((r) => ({
    ...r,
    avatar_url: r.avatar_path ? (urls.get(r.avatar_path) ?? null) : null,
  }));
}

/** Public: published trainer profiles, in admin-defined order. */
export const listPublicTrainers = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicSupabase
    .from("trainer_profiles")
    .select(SELECT_COLS)
    .eq("is_published", true)
    .order("sort_index", { ascending: true })
    .order("display_name", { ascending: true });
  if (error) throw new Error(error.message);
  return withAvatarUrls((data ?? []) as Row[]);
});

const emailSchema = z.string().trim().toLowerCase().email().max(255);

/** Public: trainer self-registration. One profile per e-mail, enforced by a unique index. */
export const registerTrainer = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        email: emailSchema,
        password: z.string().min(8).max(200),
        display_name: z.string().trim().min(2).max(80),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ip = getRequestIP({ xForwardedFor: true }) ?? "unknown";
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { count } = await supabaseAdmin
      .from("auth_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .gte("attempted_at", since);
    if ((count ?? 0) >= 30) {
      return { ok: false as const, error: "Zu viele Versuche. Bitte versuche es später erneut." };
    }
    await supabaseAdmin.from("auth_attempts").insert({ email: data.email, ip, success: false });

    const { data: existing } = await supabaseAdmin
      .from("trainer_profiles")
      .select("id")
      .eq("email", data.email)
      .maybeSingle();
    if (existing) {
      return {
        ok: false as const,
        error: "Für diese E-Mail existiert bereits ein Trainerprofil. Bitte melde dich an.",
      };
    }

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

    if (createError || !created.user) {
      const msg = createError?.message ?? "";
      if (/already/i.test(msg)) {
        return {
          ok: false as const,
          error: "Für diese E-Mail existiert bereits ein Konto. Bitte melde dich an.",
        };
      }
      return { ok: false as const, error: "Registrierung fehlgeschlagen. Bitte versuche es erneut." };
    }

    const { error: profileError } = await supabaseAdmin.from("trainer_profiles").insert({
      user_id: created.user.id,
      email: data.email,
      display_name: data.display_name,
    });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      return {
        ok: false as const,
        error: "Für diese E-Mail existiert bereits ein Trainerprofil. Bitte melde dich an.",
      };
    }

    return { ok: true as const };
  });

/** Trainer: own profile (also works before publication). */
export const getMyTrainerProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("trainer_profiles")
      .select(SELECT_COLS)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const [profile] = await withAvatarUrls([data as Row]);
    return profile ?? null;
  });

const profileSchema = z.object({
  display_name: z.string().trim().min(2).max(80),
  role_title: z.string().trim().max(120).default(""),
  disciplines: z.array(z.string().trim().max(60)).max(12).default([]),
  short_bio: z.string().trim().max(300).default(""),
  bio: z.string().trim().max(4000).default(""),
  achievements: z.array(z.string().trim().max(200)).max(20).default([]),
  avatar_path: z.string().trim().max(300).nullable().optional(),
  instagram_url: z.string().trim().url().max(300).nullable().optional().or(z.literal("")),
  submitted_for_review: z.boolean().optional(),
});

/** Trainer: save own profile. Publication stays admin-controlled (DB trigger). */
export const saveMyTrainerProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => profileSchema.parse(d))
  .handler(async ({ data, context }) => {
    const payload = {
      display_name: data.display_name,
      role_title: data.role_title,
      disciplines: data.disciplines,
      short_bio: data.short_bio,
      bio: data.bio,
      achievements: data.achievements.filter((a) => a.length > 0),
      avatar_path: data.avatar_path ?? null,
      instagram_url: data.instagram_url ? data.instagram_url : null,
      ...(data.submitted_for_review === undefined
        ? {}
        : { submitted_for_review: data.submitted_for_review }),
    };
    const { error } = await context.supabase
      .from("trainer_profiles")
      .update(payload)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

type Ctx = { supabase: any; userId: string };

async function assertTeam(context: Ctx) {
  const { data } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId);
  const roles = (data ?? []).map((r: { role: string }) => r.role);
  if (!roles.includes("admin") && !roles.includes("staff")) {
    throw new Error("Keine Berechtigung.");
  }
}

/** Team: all trainer profiles including unpublished ones. */
export const listAllTrainers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertTeam(context);
    const { data, error } = await context.supabase
      .from("trainer_profiles")
      .select(SELECT_COLS)
      .order("sort_index", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return withAvatarUrls((data ?? []) as Row[]);
  });

/** Team: publish / unpublish a trainer, or change their order. */
export const updateTrainerStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        is_published: z.boolean().optional(),
        sort_index: z.number().int().min(0).max(999).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertTeam(context);
    const { id, ...rest } = data;
    const { error } = await context.supabase.from("trainer_profiles").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

/** Team: remove a trainer profile and its login. */
export const deleteTrainer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertTeam(context);
    const { data: row } = await context.supabase
      .from("trainer_profiles")
      .select("user_id, avatar_path")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await context.supabase.from("trainer_profiles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (row?.avatar_path) {
      await supabaseAdmin.storage.from("trainer-avatars").remove([row.avatar_path]);
    }
    if (row?.user_id) {
      await supabaseAdmin.auth.admin.deleteUser(row.user_id);
    }
    return { ok: true as const };
  });
