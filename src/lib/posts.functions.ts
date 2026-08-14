import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabase as publicSupabase } from "@/integrations/supabase/client";

export type Post = {
  id: string;
  title: string;
  body: string;
  image_path: string | null;
  image_url: string | null;
  published: boolean;
  published_at: string;
};

const postSchema = z.object({
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(5000),
  image_path: z.string().trim().max(300).nullable().optional(),
  published: z.boolean().default(true),
  published_at: z.string().min(1).optional(),
});

type Row = {
  id: string;
  title: string;
  body: string;
  image_path: string | null;
  published: boolean;
  published_at: string;
};

async function withImageUrls(rows: Row[]): Promise<Post[]> {
  const paths = rows.map((r) => r.image_path).filter((p): p is string => !!p);
  const urls = new Map<string, string>();
  if (paths.length > 0) {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin.storage
      .from("post-images")
      .createSignedUrls(paths, 60 * 60 * 24 * 7);
    (data ?? []).forEach((d) => {
      if (d.path && d.signedUrl) urls.set(d.path, d.signedUrl);
    });
  }
  return rows.map((r) => ({
    ...r,
    image_url: r.image_path ? (urls.get(r.image_path) ?? null) : null,
  }));
}

/** Public: published posts, newest first. */
export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicSupabase
    .from("posts")
    .select("id, title, body, image_path, published, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(24);
  if (error) throw new Error(error.message);
  return withImageUrls((data ?? []) as Row[]);
});

/** Team: all posts, including drafts. */
export const listAllPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("posts")
      .select("id, title, body, image_path, published, published_at")
      .order("published_at", { ascending: false });
    if (error) throw new Error(error.message);
    return withImageUrls((data ?? []) as Row[]);
  });

export const createPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => postSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("posts").insert({
      title: data.title,
      body: data.body,
      image_path: data.image_path ?? null,
      published: data.published,
      published_at: data.published_at ?? new Date().toISOString(),
      author_id: context.userId,
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const updatePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid() }).extend(postSchema.partial().shape).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...rest } = data;
    const { error } = await context.supabase.from("posts").update(rest).eq("id", id);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: row } = await context.supabase
      .from("posts")
      .select("image_path")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await context.supabase.from("posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    if (row?.image_path) {
      await context.supabase.storage.from("post-images").remove([row.image_path]);
    }
    return { ok: true as const };
  });
