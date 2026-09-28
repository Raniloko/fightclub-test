import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft, MoreVertical, Plus, Pencil, Trash2, Eye, EyeOff, Camera, Upload,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

import {
  listSchedule,
  createScheduleClass,
  updateScheduleClass,
  deleteScheduleClass,
  type ScheduleClass,
  type WeekDay,
} from "@/lib/schedule.functions";
import {
  getMyRoles,
  listTeam,
  inviteTeamMember,
  removeTeamMember,
} from "@/lib/admin.functions";
import {
  listAllPosts,
  createPost,
  updatePost,
  deletePost,
  type Post,
} from "@/lib/posts.functions";
import {
  listAllTrainers,
  updateTrainerStatus,
  deleteTrainer,
  type TrainerProfile,
} from "@/lib/trainers.functions";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin — Fight Club Hanau" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

const DAYS: WeekDay[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_LABELS: Record<WeekDay, string> = {
  MON: "Montag", TUE: "Dienstag", WED: "Mittwoch", THU: "Donnerstag",
  FRI: "Freitag", SAT: "Samstag", SUN: "Sonntag",
};

function AdminDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [authChecked, setAuthChecked] = useState(false);
  const [tab, setTab] = useState<"schedule" | "posts" | "trainers" | "team">("schedule");
  const [day, setDay] = useState<WeekDay>("MON");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/admin/login" });
      else setAuthChecked(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") navigate({ to: "/admin/login" });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const rolesQ = useQuery({
    queryKey: ["my-roles"],
    queryFn: () => getMyRoles(),
    enabled: authChecked,
  });
  const scheduleQ = useQuery({
    queryKey: ["admin-schedule"],
    queryFn: () => listSchedule(),
    enabled: authChecked,
  });

  const isAdmin = (rolesQ.data ?? []).includes("admin");

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  if (!authChecked) return null;

  const classesForDay = (scheduleQ.data ?? []).filter((c) => c.day === day);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans">
      <header className="sticky top-0 z-40 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to="/"
              aria-label="Zurück zur Website"
              className="h-11 w-11 -ml-2 grid place-items-center text-[#888] hover:text-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <span className="text-[17px] font-semibold truncate">Admin</span>
          </div>
          <div className="relative">
            <button
              aria-label="Menü"
              onClick={() => setMenuOpen((v) => !v)}
              className="h-11 w-11 -mr-2 grid place-items-center text-[#888] hover:text-white"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-12 z-50 w-48 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg py-1 shadow-xl">
                  <button
                    onClick={() => { setMenuOpen(false); signOut(); }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-white/5"
                  >
                    Abmelden
                  </button>
                  <Link
                    to="/"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2.5 text-xs text-[#888] hover:text-white"
                  >
                    Website öffnen
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 flex gap-5 overflow-x-auto">
          <TabBtn active={tab === "schedule"} onClick={() => setTab("schedule")}>Stundenplan</TabBtn>
          <TabBtn active={tab === "posts"} onClick={() => setTab("posts")}>Beiträge</TabBtn>
          <TabBtn active={tab === "trainers"} onClick={() => setTab("trainers")}>Trainer</TabBtn>
          {isAdmin && (
            <TabBtn active={tab === "team"} onClick={() => setTab("team")}>Team</TabBtn>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5">
        {tab === "schedule" && (
          <ScheduleAdmin
            day={day}
            setDay={setDay}
            classes={classesForDay}
            onChanged={() => qc.invalidateQueries({ queryKey: ["admin-schedule"] })}
          />
        )}
        {tab === "posts" && <PostsAdmin />}
        {tab === "trainers" && <TrainersAdmin />}
        {tab === "team" && isAdmin && <TeamAdmin />}
      </main>
    </div>
  );
}

function TabBtn({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 px-0.5 py-2.5 text-[14px] ${
        active ? "text-white font-bold" : "text-[#888] font-normal hover:text-white"
      }`}
    >
      {children}
      {active && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[#00D4FF]" />}
    </button>
  );
}


function ScheduleAdmin({
  day, setDay, classes, onChanged,
}: {
  day: WeekDay;
  setDay: (d: WeekDay) => void;
  classes: ScheduleClass[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState<ScheduleClass | null>(null);
  const [showNew, setShowNew] = useState(false);

  const toggleCancel = useMutation({
    mutationFn: (c: ScheduleClass) =>
      updateScheduleClass({ data: { id: c.id, cancelled_today: !c.cancelled_today } }),
    onSuccess: onChanged,
  });
  const del = useMutation({
    mutationFn: (id: string) => deleteScheduleClass({ data: { id } }),
    onSuccess: onChanged,
  });

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto border-b border-white/10 mb-6">
        {DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] shrink-0 ${
              day === d ? "text-white border-b-2 border-[#00B4DC]" : "text-[#777] hover:text-white"
            }`}
          >
            {DAY_LABELS[d]}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-2xl">{DAY_LABELS[day]}</h2>
        <button
          onClick={() => setShowNew(true)}
          className="bg-[#00B4DC] text-black px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-[#00A0C4]"
        >
          + Neue Klasse
        </button>
      </div>

      {classes.length === 0 ? (
        <p className="text-[#777] py-12 text-center">Kein Training an diesem Tag.</p>
      ) : (
        <div className="space-y-2">
          {classes.map((c) => (
            <div
              key={c.id}
              className={`border p-4 flex flex-wrap items-center gap-4 ${
                c.cancelled_today ? "border-red-500/50 bg-red-500/5" : "border-white/10"
              }`}
            >
              <div className="font-display text-xl w-40">{c.start_time}<span className="text-[#666]">–</span>{c.end_time}</div>
              <div className="flex-1 min-w-[200px]">
                <div className="font-semibold">{c.discipline}</div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#999]">{c.age}</div>
                {c.note && <div className="text-xs text-[#999] mt-1">Hinweis: {c.note}</div>}
              </div>
              {c.cancelled_today && (
                <span className="border border-red-500 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-red-400">
                  Fällt heute aus
                </span>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleCancel.mutate(c)}
                  className="border border-white/20 px-3 py-2 text-[11px] uppercase tracking-[0.15em] hover:bg-white/5"
                >
                  {c.cancelled_today ? "Entfall aufheben" : "Fällt heute aus"}
                </button>
                <button
                  onClick={() => setEditing(c)}
                  className="border border-white/20 px-3 py-2 text-[11px] uppercase tracking-[0.15em] hover:bg-white/5"
                >
                  Bearbeiten
                </button>
                <button
                  onClick={() => confirm("Klasse dauerhaft löschen?") && del.mutate(c.id)}
                  className="border border-red-500/50 text-red-400 px-3 py-2 text-[11px] uppercase tracking-[0.15em] hover:bg-red-500/10"
                >
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || showNew) && (
        <ClassModal
          day={day}
          initial={editing ?? undefined}
          onClose={() => { setEditing(null); setShowNew(false); }}
          onSaved={() => { onChanged(); setEditing(null); setShowNew(false); }}
        />
      )}
    </div>
  );
}

function ClassModal({
  day, initial, onClose, onSaved,
}: {
  day: WeekDay;
  initial?: ScheduleClass;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    day: initial?.day ?? day,
    start_time: initial?.start_time ?? "18:00",
    end_time: initial?.end_time ?? "19:00",
    discipline: initial?.discipline ?? "",
    age: initial?.age ?? "",
    note: initial?.note ?? "",
    sort_index: initial?.sort_index ?? 0,
    cancelled_today: initial?.cancelled_today ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      const payload = { ...form, note: form.note.trim() || null };
      if (initial) await updateScheduleClass({ data: { id: initial.id, ...payload } });
      else await createScheduleClass({ data: payload });
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Fehler");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#0a0a0a] border border-white/20 max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-2xl mb-4">{initial ? "Klasse bearbeiten" : "Neue Klasse"}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Wochentag">
              <select
                value={form.day}
                onChange={(e) => setForm({ ...form, day: e.target.value as WeekDay })}
                className="w-full bg-black border border-white/20 px-3 py-2"
              >
                {DAYS.map((d) => <option key={d} value={d}>{DAY_LABELS[d]}</option>)}
              </select>
            </Field>
            <Field label="Reihenfolge">
              <input
                type="number"
                value={form.sort_index}
                onChange={(e) => setForm({ ...form, sort_index: Number(e.target.value) })}
                className="w-full bg-black border border-white/20 px-3 py-2"
              />
            </Field>
            <Field label="Start (HH:MM)">
              <input
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                className="w-full bg-black border border-white/20 px-3 py-2"
              />
            </Field>
            <Field label="Ende (HH:MM)">
              <input
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                className="w-full bg-black border border-white/20 px-3 py-2"
              />
            </Field>
          </div>
          <Field label="Disziplin">
            <input
              value={form.discipline}
              onChange={(e) => setForm({ ...form, discipline: e.target.value })}
              className="w-full bg-black border border-white/20 px-3 py-2"
            />
          </Field>
          <Field label="Altersgruppe">
            <input
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              className="w-full bg-black border border-white/20 px-3 py-2"
            />
          </Field>
          <Field label="Hinweis (optional)">
            <input
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full bg-black border border-white/20 px-3 py-2"
            />
          </Field>
          {err && <div className="text-red-400 text-sm">{err}</div>}
        </div>
        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={onClose} className="border border-white/20 px-4 py-2 text-[11px] uppercase tracking-[0.2em] hover:bg-white/5">
            Abbrechen
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="bg-[#00B4DC] text-black px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-[#00A0C4] disabled:opacity-50"
          >
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.2em] text-[#999] mb-1">{label}</span>
      {children}
    </label>
  );
}

function TeamAdmin() {
  const qc = useQueryClient();
  const teamQ = useQuery({ queryKey: ["team"], queryFn: () => listTeam() });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "staff">("staff");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const invite = useMutation({
    mutationFn: (input: { email: string; role: "admin" | "staff" }) =>
      inviteTeamMember({ data: input }),
    onSuccess: () => {
      setOk("Einladung verschickt.");
      setEmail("");
      qc.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (e: Error) => setErr(e.message),
  });
  const remove = useMutation({
    mutationFn: (user_id: string) => removeTeamMember({ data: { user_id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team"] }),
  });

  return (
    <div className="space-y-8">
      <div className="border border-white/10 p-6">
        <h2 className="font-display text-2xl mb-4">Neues Team-Mitglied einladen</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-black border border-white/20 px-4 py-3"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "staff")}
            className="bg-black border border-white/20 px-4 py-3"
          >
            <option value="staff">Mitarbeiter</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={() => { setErr(null); setOk(null); invite.mutate({ email, role }); }}
            disabled={invite.isPending || !email}
            className="bg-[#00B4DC] text-black px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] hover:bg-[#00A0C4] disabled:opacity-50"
          >
            Einladen
          </button>
        </div>
        {err && <div className="mt-3 text-red-400 text-sm">{err}</div>}
        {ok && <div className="mt-3 text-[#7dd8ee] text-sm">{ok}</div>}
        <p className="mt-3 text-xs text-[#777]">
          Die Person bekommt eine E-Mail mit einem Link, um ihr Passwort festzulegen.
        </p>
      </div>

      <div className="border border-white/10">
        <div className="border-b border-white/10 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-[#999]">
          Team
        </div>
        {(teamQ.data ?? []).map((u) => (
          <div key={u.id} className="border-b border-white/5 px-6 py-4 flex items-center justify-between last:border-b-0">
            <div>
              <div className="font-medium">{u.email}</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#999] mt-1">
                {u.roles.join(", ")}
                {u.last_sign_in_at ? ` · Letzter Login: ${new Date(u.last_sign_in_at).toLocaleDateString("de-DE")}` : " · Noch nie angemeldet"}
              </div>
            </div>
            <button
              onClick={() => confirm(`${u.email} entfernen?`) && remove.mutate(u.id)}
              className="border border-red-500/50 text-red-400 px-3 py-2 text-[11px] uppercase tracking-[0.15em] hover:bg-red-500/10"
            >
              Entfernen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostsAdmin() {
  const qc = useQueryClient();
  const postsQ = useQuery({ queryKey: ["admin-posts"], queryFn: () => listAllPosts() });
  const [editing, setEditing] = useState<Post | null>(null);
  const [showNew, setShowNew] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-posts"] });
  const del = useMutation({
    mutationFn: (id: string) => deletePost({ data: { id } }),
    onSuccess: refresh,
  });
  const togglePublish = useMutation({
    mutationFn: (p: Post) => updatePost({ data: { id: p.id, published: !p.published } }),
    onSuccess: refresh,
  });

  const posts = postsQ.data ?? [];

  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <div className="pb-24">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <h2 className="text-[20px] font-bold text-white leading-tight">Beiträge</h2>
          <p className="text-[13px] text-[#888] mt-0.5">
            {publishedCount} {publishedCount === 1 ? "Beitrag" : "Beiträge"} veröffentlicht
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-2 text-[13px] text-white hover:border-[#00D4FF]"
        >
          <Plus className="h-4 w-4 text-[#00D4FF]" />
          Neuer Beitrag
        </button>
      </div>

      {posts.length === 0 ? (
        <p className="text-[#888] py-12 text-center text-sm">Noch keine Beiträge.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              onEdit={() => setEditing(p)}
              onToggle={() => togglePublish.mutate(p)}
              onDelete={() => { if (confirm("Beitrag löschen?")) del.mutate(p.id); }}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowNew(true)}
        aria-label="Neuer Beitrag"
        className="fixed bottom-6 right-4 z-40 h-14 w-14 rounded-full bg-[#00D4FF] text-black grid place-items-center shadow-[0_8px_24px_rgba(0,212,255,0.35)] active:scale-95 transition-transform"
      >
        <Plus className="h-6 w-6" />
      </button>

      {(editing || showNew) && (
        <PostModal
          initial={editing ?? undefined}
          onClose={() => { setEditing(null); setShowNew(false); }}
          onSaved={() => { refresh(); setEditing(null); setShowNew(false); }}
        />
      )}
    </div>
  );
}

function PostCard({
  post, onEdit, onToggle, onDelete,
}: {
  post: Post;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [dx, setDx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY };
    moved.current = false;
  }
  function onTouchMove(e: React.TouchEvent) {
    if (!start.current) return;
    const t = e.touches[0];
    const deltaX = t.clientX - start.current.x;
    const deltaY = t.clientY - start.current.y;
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (Math.abs(deltaX) > 8) moved.current = true;
    setDx(Math.max(-140, Math.min(140, deltaX + (revealed ? -120 : 0))));
  }
  function onTouchEnd() {
    const raw = dx;
    start.current = null;
    if (raw <= -70) {
      setRevealed(true);
      setDx(-120);
    } else if (raw >= 70 && !revealed) {
      setDx(0);
      onToggle();
    } else {
      setRevealed(false);
      setDx(0);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-y-0 right-0 flex items-stretch">
        <button
          onClick={() => { setRevealed(false); setDx(0); onEdit(); }}
          aria-label="Bearbeiten"
          className="w-[60px] grid place-items-center bg-[#1A1A1A] text-white"
        >
          <Pencil className="h-5 w-5" />
        </button>
        <button
          onClick={() => { setRevealed(false); setDx(0); onDelete(); }}
          aria-label="Löschen"
          className="w-[60px] grid place-items-center bg-[#EF4444]/15 text-[#EF4444]"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={() => { if (!moved.current && !revealed) onEdit(); }}
        style={{ transform: `translateX(${dx}px)`, transition: start.current ? "none" : "transform 0.2s ease" }}
        className="relative bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4"
      >
        <div className="flex gap-3">
          {post.image_url ? (
            <img
              src={post.image_url}
              alt=""
              className="h-20 w-20 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="h-20 w-20 shrink-0 rounded-lg bg-[#0A0A0A] border border-[#2A2A2A]" />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-[16px] font-bold text-white leading-snug line-clamp-2">{post.title}</h3>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[12px] text-[#888]">
                {new Date(post.published_at).toLocaleDateString("de-DE")}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  post.published
                    ? "bg-[#22C55E]/15 text-[#22C55E]"
                    : "bg-[#888]/15 text-[#888]"
                }`}
              >
                {post.published ? "Live" : "Entwurf"}
              </span>
            </div>
            <p className="mt-1 text-[13px] text-[#888] truncate">{post.body}</p>
          </div>
        </div>

        <div className="mt-2 flex justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            aria-label="Bearbeiten"
            className="h-11 w-11 grid place-items-center text-[#888] hover:text-white"
          >
            <Pencil className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            aria-label={post.published ? "Verbergen" : "Anzeigen"}
            className="h-11 w-11 grid place-items-center text-[#888] hover:text-white"
          >
            {post.published ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            aria-label="Löschen"
            className="h-11 w-11 grid place-items-center text-[#EF4444] hover:text-[#ff6b6b]"
          >
            <Trash2 className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}


function PostModal({
  initial, onClose, onSaved,
}: {
  initial?: Post;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [imagePath, setImagePath] = useState<string | null>(initial?.image_path ?? null);
  const [preview, setPreview] = useState<string | null>(initial?.image_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File) {
    setErr(null);
    if (!file.type.startsWith("image/")) { setErr("Bitte eine Bilddatei wählen."); return; }
    if (file.size > 8 * 1024 * 1024) { setErr("Bild ist größer als 8 MB."); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("post-images")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw new Error(error.message);
      setImagePath(path);
      setPreview(URL.createObjectURL(file));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload fehlgeschlagen");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    setErr(null);
    try {
      if (initial) {
        await updatePost({ data: { id: initial.id, title, body, published, image_path: imagePath } });
      } else {
        await createPost({ data: { title, body, published, image_path: imagePath } });
      }
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Fehler");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!initial) return;
    if (!confirm("Beitrag wirklich löschen?")) return;
    setSaving(true);
    setErr(null);
    try {
      await deletePost({ data: { id: initial.id } });
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Löschen fehlgeschlagen");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-[#0A0A0A] border-b border-[#2A2A2A]">
        <div className="relative flex items-center justify-between h-14 px-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1 h-11 text-[#888] hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-[14px] font-normal">Zurück</span>
          </button>
          <h1 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-normal text-white normal-case">
            {initial ? "Bearbeiten" : "Neuer Beitrag"}
          </h1>
          <button
            onClick={save}
            disabled={saving || uploading || !title.trim() || !body.trim()}
            className="h-11 text-[14px] font-bold text-[#00D4FF] disabled:opacity-40"
          >
            {saving ? "Speichern…" : "Speichern"}
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-4">
          <MobileField label="Titel">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titel des Beitrags"
              className="w-full h-11 px-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[15px] text-white placeholder-[#888] focus:outline-none focus:border-[#00D4FF]"
            />
          </MobileField>

          <MobileField label="Inhalt">
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Text eingeben…"
              className="w-full px-3 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[15px] text-white placeholder-[#888] focus:outline-none focus:border-[#00D4FF] resize-none"
            />
          </MobileField>

          <div>
            <label className="block text-[12px] text-[#888] mb-2 normal-case">Bild</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
              className="hidden"
            />
            {preview ? (
              <div className="space-y-1">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="relative block w-fit rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
                >
                  <img
                    src={preview}
                    alt="Vorschau"
                    className="w-[120px] h-[120px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 grid place-items-center">
                    <div className="flex items-center gap-1.5 text-white text-[12px] font-medium">
                      <Camera className="h-4 w-4" />
                      Ändern
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => { setImagePath(null); setPreview(null); }}
                  className="flex items-center min-h-[44px] text-[12px] text-[#EF4444] hover:text-[#ff6b6b]"
                >
                  Bild entfernen
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full h-28 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#2A2A2A] bg-[#1A1A1A] text-[#888] active:border-[#00D4FF] active:text-white"
              >
                <Upload className="h-6 w-6" />
                <span className="text-[13px]">Bild hinzufügen</span>
              </button>
            )}
            {uploading && <div className="mt-2 text-[12px] text-[#888]">Bild wird hochgeladen…</div>}
          </div>

          <div>
            <label className="block text-[12px] text-[#888] mb-2 normal-case">Status</label>
            <div className="flex items-center gap-3 min-h-[44px]">
              <button
                onClick={() => setPublished(false)}
                className={`text-[14px] h-11 ${!published ? "text-white font-semibold" : "text-[#888]"}`}
              >
                Entwurf
              </button>
              <button
                onClick={() => setPublished((v) => !v)}
                aria-checked={published}
                role="switch"
                aria-label="Status wechseln"
                className="relative inline-flex h-11 w-16 shrink-0 items-center justify-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
              >
                <span className="relative inline-flex h-7 w-12 items-center rounded-full" style={{ backgroundColor: published ? "#22C55E" : "#2A2A2A" }}>
                  <span
                    className="inline-block h-5 w-5 rounded-full bg-white transition-transform"
                    style={{ transform: published ? "translateX(24px)" : "translateX(4px)" }}
                  />
                </span>
              </button>
              <button
                onClick={() => setPublished(true)}
                className={`text-[14px] h-11 ${published ? "text-[#22C55E] font-semibold" : "text-[#888]"}`}
              >
                Veröffentlicht
              </button>
            </div>
          </div>

          {err && <div className="text-[13px] text-[#EF4444]">{err}</div>}
        </div>

        <div className="mt-6 space-y-3 pb-8">
          <button
            onClick={save}
            disabled={saving || uploading || !title.trim() || !body.trim()}
            className="w-full h-12 rounded-lg bg-[#00D4FF] text-white text-[15px] font-bold hover:bg-[#00c2ea] active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {saving ? "Speichern…" : "Speichern"}
          </button>
          <button
            onClick={onClose}
            className="block w-full h-11 text-[14px] text-[#888] hover:text-white"
          >
            Abbrechen
          </button>
          {initial && (
            <button
              onClick={onDelete}
              className="block w-full h-11 text-[14px] text-[#EF4444] hover:text-[#ff6b6b]"
            >
              Beitrag löschen
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function MobileField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[12px] text-[#888] mb-2 normal-case">{label}</span>
      {children}
    </label>
  );
}

function TrainersAdmin() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-trainers"],
    queryFn: () => listAllTrainers(),
  });
  const trainers = (data ?? []) as TrainerProfile[];
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(t: TrainerProfile) {
    setBusy(t.id);
    try {
      await updateTrainerStatus({ data: { id: t.id, is_published: !t.is_published } });
      await qc.invalidateQueries({ queryKey: ["admin-trainers"] });
    } finally {
      setBusy(null);
    }
  }

  async function move(t: TrainerProfile, delta: number) {
    setBusy(t.id);
    try {
      const next = Math.max(0, Math.min(999, t.sort_index + delta));
      await updateTrainerStatus({ data: { id: t.id, sort_index: next } });
      await qc.invalidateQueries({ queryKey: ["admin-trainers"] });
    } finally {
      setBusy(null);
    }
  }

  async function remove(t: TrainerProfile) {
    if (!confirm(`Trainerprofil von ${t.display_name || t.email} endgültig löschen?`)) return;
    setBusy(t.id);
    try {
      await deleteTrainer({ data: { id: t.id } });
      await qc.invalidateQueries({ queryKey: ["admin-trainers"] });
    } finally {
      setBusy(null);
    }
  }

  if (isLoading) return <p className="text-[#888] text-sm">Wird geladen …</p>;

  if (trainers.length === 0) {
    return (
      <div className="border border-[#2A2A2A] rounded-lg p-6 text-center">
        <p className="text-[#888] text-sm">Noch keine Trainerprofile.</p>
        <p className="text-[#666] text-xs mt-2">
          Trainer registrieren sich selbst unter /trainer/registrieren.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[#888] text-xs">
        Profile erscheinen erst auf der Startseite, wenn du sie hier freigibst.
      </p>
      {trainers.map((t) => (
        <div
          key={t.id}
          className="flex gap-4 border border-[#2A2A2A] rounded-lg p-4 bg-[#141414]"
        >
          <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded bg-[#1F1F1F]">
            {t.avatar_url ? (
              <img src={t.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-[#555] text-xs">—</div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-[15px]">{t.display_name || "Ohne Namen"}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${
                  t.is_published
                    ? "bg-[#00D4FF]/15 text-[#00D4FF]"
                    : t.submitted_for_review
                      ? "bg-[#C9A84C]/15 text-[#C9A84C]"
                      : "bg-white/5 text-[#888]"
                }`}
              >
                {t.is_published
                  ? "Öffentlich"
                  : t.submitted_for_review
                    ? "Wartet auf Freigabe"
                    : "Entwurf"}
              </span>
            </div>
            <p className="text-[#888] text-xs mt-1 truncate">{t.email}</p>
            {t.role_title && <p className="text-[#aaa] text-xs mt-1">{t.role_title}</p>}
            {t.disciplines.length > 0 && (
              <p className="text-[#666] text-xs mt-1">{t.disciplines.join(" · ")}</p>
            )}

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                onClick={() => toggle(t)}
                disabled={busy === t.id}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs disabled:opacity-50 ${
                  t.is_published
                    ? "border border-[#2A2A2A] text-[#888] hover:text-white"
                    : "bg-[#00D4FF] text-black font-semibold"
                }`}
              >
                {t.is_published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {t.is_published ? "Verbergen" : "Freigeben"}
              </button>
              <button
                onClick={() => move(t, -1)}
                disabled={busy === t.id}
                className="px-2.5 py-1.5 rounded border border-[#2A2A2A] text-xs text-[#888] hover:text-white disabled:opacity-50"
              >
                ↑
              </button>
              <button
                onClick={() => move(t, 1)}
                disabled={busy === t.id}
                className="px-2.5 py-1.5 rounded border border-[#2A2A2A] text-xs text-[#888] hover:text-white disabled:opacity-50"
              >
                ↓
              </button>
              <button
                onClick={() => remove(t)}
                disabled={busy === t.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#2A2A2A] text-xs text-[#888] hover:text-red-400 hover:border-red-400/40 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Löschen
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
