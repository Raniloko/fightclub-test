import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const [tab, setTab] = useState<"schedule" | "team">("schedule");
  const [day, setDay] = useState<WeekDay>("MON");

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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#00B4DC]">Fight Club Hanau</div>
            <h1 className="font-display text-2xl">Admin-Bereich</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-[11px] uppercase tracking-[0.2em] text-[#999] hover:text-white">
              Website
            </Link>
            <button
              onClick={signOut}
              className="border border-white/20 px-3 py-2 text-[11px] uppercase tracking-[0.2em] hover:bg-white/5"
            >
              Abmelden
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-5 flex gap-6 border-t border-white/5">
          <TabBtn active={tab === "schedule"} onClick={() => setTab("schedule")}>Stundenplan</TabBtn>
          {isAdmin && (
            <TabBtn active={tab === "team"} onClick={() => setTab("team")}>Team</TabBtn>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-8">
        {tab === "schedule" && (
          <ScheduleAdmin
            day={day}
            setDay={setDay}
            classes={classesForDay}
            onChanged={() => qc.invalidateQueries({ queryKey: ["admin-schedule"] })}
          />
        )}
        {tab === "team" && isAdmin && <TeamAdmin />}
      </main>
    </div>
  );
}

function TabBtn({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-1 py-4 text-[11px] font-semibold uppercase tracking-[0.2em] ${
        active ? "text-white" : "text-[#777] hover:text-white"
      }`}
    >
      {children}
      {active && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-[#00B4DC]" />}
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
