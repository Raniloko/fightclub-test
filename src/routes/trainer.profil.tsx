import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  getMyTrainerProfile,
  saveMyTrainerProfile,
  DISCIPLINES,
  type TrainerProfile,
} from "@/lib/trainers.functions";
import { Upload, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/trainer/profil")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Mein Trainerprofil — Fight Club Hanau" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TrainerProfilePage,
});

const inputCls =
  "w-full border border-white/15 bg-[#111] px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-[#00B4DC]";

function TrainerProfilePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/trainer/login" });
      else setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate({ to: "/trainer/login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const profileQ = useQuery({
    queryKey: ["my-trainer-profile"],
    queryFn: () => getMyTrainerProfile(),
    enabled: authChecked,
  });

  const [form, setForm] = useState<{
    display_name: string;
    role_title: string;
    disciplines: string[];
    short_bio: string;
    bio: string;
    achievements: string[];
    avatar_path: string | null;
    avatar_url: string | null;
    instagram_url: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const profile = profileQ.data as TrainerProfile | null | undefined;

  useEffect(() => {
    if (profile && !form) {
      setForm({
        display_name: profile.display_name,
        role_title: profile.role_title,
        disciplines: profile.disciplines,
        short_bio: profile.short_bio,
        bio: profile.bio,
        achievements: profile.achievements.length > 0 ? profile.achievements : [""],
        avatar_path: profile.avatar_path,
        avatar_url: profile.avatar_url,
        instagram_url: profile.instagram_url ?? "",
      });
    }
  }, [profile, form]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/trainer/login", replace: true });
  }

  async function handleUpload(file: File) {
    setError(null);
    setUploading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const uid = session.session?.user.id;
      if (!uid) throw new Error("no session");
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${uid}/portrait-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("trainer-avatars")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: signed } = await supabase.storage
        .from("trainer-avatars")
        .createSignedUrl(path, 60 * 60);
      setForm((f) =>
        f ? { ...f, avatar_path: path, avatar_url: signed?.signedUrl ?? f.avatar_url } : f,
      );
    } catch {
      setError("Das Bild konnte nicht hochgeladen werden. Bitte versuche ein anderes Foto.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(submit: boolean) {
    if (!form) return;
    setSaving(true);
    setError(null);
    setMsg(null);
    try {
      await saveMyTrainerProfile({
        data: {
          display_name: form.display_name.trim(),
          role_title: form.role_title.trim(),
          disciplines: form.disciplines,
          short_bio: form.short_bio.trim(),
          bio: form.bio.trim(),
          achievements: form.achievements.map((a) => a.trim()).filter(Boolean),
          avatar_path: form.avatar_path,
          instagram_url: form.instagram_url.trim() || null,
          ...(submit ? { submitted_for_review: true } : {}),
        },
      });
      await qc.invalidateQueries({ queryKey: ["my-trainer-profile"] });
      setMsg(
        submit
          ? "Dein Profil wurde zur Freigabe eingereicht."
          : "Änderungen wurden gespeichert.",
      );
    } catch {
      setError("Speichern fehlgeschlagen. Bitte prüfe deine Eingaben.");
    } finally {
      setSaving(false);
    }
  }

  if (!authChecked || profileQ.isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0a0a0a] text-white/50">
        Wird geladen …
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#0a0a0a] px-5 text-center text-white">
        <div>
          <p className="text-white/70">Zu diesem Konto gehört noch kein Trainerprofil.</p>
          <Link
            to="/trainer/registrieren"
            className="mt-5 inline-block bg-[#00B4DC] px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0a0a0a]"
          >
            Profil anlegen
          </Link>
        </div>
      </main>
    );
  }

  const status = profile.is_published
    ? { text: "Live auf der Startseite", cls: "border-[#00B4DC]/50 bg-[#00B4DC]/10 text-[#00B4DC]" }
    : profile.submitted_for_review
      ? { text: "Wartet auf Freigabe", cls: "border-[#C9A84C]/50 bg-[#C9A84C]/10 text-[#C9A84C]" }
      : { text: "Entwurf — noch nicht eingereicht", cls: "border-white/20 bg-white/5 text-white/60" };

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-24 text-white">
      <header className="border-b border-white/10 px-5 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <span className="text-[15px] font-semibold">Mein Trainerprofil</span>
          <button onClick={signOut} className="text-[13px] text-white/50 hover:text-white">
            Abmelden
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 pt-8">
        <div className={`border px-4 py-3 text-[13px] ${status.cls}`}>{status.text}</div>

        {form && (
          <div className="mt-8 space-y-7">
            <div>
              <span className="mb-3 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                Profilfoto
              </span>
              <div className="flex items-center gap-5">
                <div className="h-28 w-24 flex-shrink-0 overflow-hidden border border-white/15 bg-[#111]">
                  {form.avatar_url ? (
                    <img src={form.avatar_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-white/25">—</div>
                  )}
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 border border-white/20 px-4 py-2.5 text-[12px] uppercase tracking-wider hover:border-[#00B4DC] hover:text-[#00B4DC]">
                  <Upload className="h-4 w-4" />
                  {uploading ? "Wird hochgeladen …" : "Foto wählen"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f);
                    }}
                  />
                </label>
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                Name
              </span>
              <input
                value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                className={inputCls}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                Funktion (z. B. Head Coach MMA)
              </span>
              <input
                value={form.role_title}
                onChange={(e) => setForm({ ...form, role_title: e.target.value })}
                className={inputCls}
              />
            </label>

            <div>
              <span className="mb-3 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                Sportarten
              </span>
              <div className="flex flex-wrap gap-2">
                {DISCIPLINES.map((d) => {
                  const on = form.disciplines.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          disciplines: on
                            ? form.disciplines.filter((x) => x !== d)
                            : [...form.disciplines, d],
                        })
                      }
                      className={`border px-3 py-1.5 text-[12px] uppercase tracking-wider transition-colors ${
                        on
                          ? "border-[#00B4DC] bg-[#00B4DC]/10 text-[#00B4DC]"
                          : "border-white/15 text-white/55 hover:border-white/40"
                      }`}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                Kurzbeschreibung (erscheint auf der Karte)
              </span>
              <textarea
                value={form.short_bio}
                onChange={(e) => setForm({ ...form, short_bio: e.target.value })}
                rows={2}
                maxLength={300}
                className={inputCls}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                Über mich
              </span>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={7}
                maxLength={4000}
                className={inputCls}
              />
            </label>

            <div>
              <span className="mb-3 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                Erfolge &amp; Lizenzen
              </span>
              <div className="space-y-2">
                {form.achievements.map((a, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={a}
                      onChange={(e) => {
                        const next = [...form.achievements];
                        next[i] = e.target.value;
                        setForm({ ...form, achievements: next });
                      }}
                      placeholder="z. B. Braungurt BJJ · Trainer-C-Lizenz"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      aria-label="Entfernen"
                      onClick={() =>
                        setForm({
                          ...form,
                          achievements: form.achievements.filter((_, x) => x !== i),
                        })
                      }
                      className="grid w-12 flex-shrink-0 place-items-center border border-white/15 text-white/40 hover:border-red-400/50 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setForm({ ...form, achievements: [...form.achievements, ""] })}
                className="mt-3 inline-flex items-center gap-2 text-[12px] uppercase tracking-wider text-[#C9A84C]"
              >
                <Plus className="h-4 w-4" /> Eintrag hinzufügen
              </button>
            </div>

            <label className="block">
              <span className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-white/60">
                Instagram-Link (optional)
              </span>
              <input
                value={form.instagram_url}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                placeholder="https://instagram.com/…"
                className={inputCls}
              />
            </label>

            {msg && (
              <p className="border border-[#00B4DC]/40 bg-[#00B4DC]/10 p-3 text-[13px] text-[#00B4DC]">
                {msg}
              </p>
            )}
            {error && (
              <p className="border border-red-500/40 bg-red-500/10 p-3 text-[13px] text-red-300">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex-1 border border-white/25 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] hover:border-white disabled:opacity-50"
              >
                {saving ? "Speichert …" : "Speichern"}
              </button>
              {!profile.is_published && (
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="flex-1 bg-[#00B4DC] py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0a0a0a] hover:opacity-90 disabled:opacity-50"
                >
                  Zur Freigabe einreichen
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
