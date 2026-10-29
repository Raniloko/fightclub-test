import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Ban,
  CalendarDays,
  Camera,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  UserRound,
  Users,
  X,
  type LucideIcon,
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
import { getMyRoles, listTeam, inviteTeamMember, removeTeamMember } from "@/lib/admin.functions";
import { listAllPosts, createPost, updatePost, deletePost, type Post } from "@/lib/posts.functions";
import {
  listAllTrainers,
  updateTrainerStatus,
  deleteTrainer,
  type TrainerProfile,
} from "@/lib/trainers.functions";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin — Fight Club Hanau" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminDashboard,
});

const DAYS: WeekDay[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const DAY_LABELS: Record<WeekDay, string> = {
  MON: "Montag",
  TUE: "Dienstag",
  WED: "Mittwoch",
  THU: "Donnerstag",
  FRI: "Freitag",
  SAT: "Samstag",
  SUN: "Sonntag",
};
const DAY_SHORT: Record<WeekDay, string> = {
  MON: "Mo",
  TUE: "Di",
  WED: "Mi",
  THU: "Do",
  FRI: "Fr",
  SAT: "Sa",
  SUN: "So",
};
const JS_DAY_TO_KEY: WeekDay[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

type Section = "overview" | "schedule" | "posts" | "trainers" | "team" | "account";

const hhmm = (t: string) => t.slice(0, 5);
const byTime = (a: ScheduleClass, b: ScheduleClass) =>
  a.sort_index - b.sort_index || a.start_time.localeCompare(b.start_time);

/* ------------------------------------------------------------------ */
/* Small UI kit                                                        */
/* ------------------------------------------------------------------ */

type BtnVariant = "primary" | "secondary" | "ghost" | "danger";
const BTN: Record<BtnVariant, string> = {
  primary: "bg-[#0891B2] text-white hover:bg-[#0E7490] shadow-sm",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
  ghost: "text-slate-600 hover:bg-slate-100",
  danger: "bg-white text-red-600 border border-red-200 hover:bg-red-50",
};

function Btn({
  variant = "secondary",
  icon: Icon,
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      {...props}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-3.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0891B2]/40 disabled:cursor-not-allowed disabled:opacity-50 ${BTN[variant]} ${className}`}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {children}
    </button>
  );
}

function IconBtn({
  icon: Icon,
  label,
  tone = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  label: string;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={`grid h-9 w-9 place-items-center rounded-[8px] transition-colors disabled:opacity-40 ${
        tone === "danger"
          ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      }`}
    >
      <Icon className="h-[18px] w-[18px]" />
    </button>
  );
}

type BadgeTone = "green" | "amber" | "red" | "slate" | "cyan";
const BADGE: Record<BadgeTone, string> = {
  green: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  amber: "bg-amber-50 text-amber-700 ring-amber-600/20",
  red: "bg-red-50 text-red-700 ring-red-600/20",
  slate: "bg-slate-100 text-slate-600 ring-slate-500/20",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
};
function Badge({ tone, children }: { tone: BadgeTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${BADGE[tone]}`}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[12px] border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center px-6 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-4 font-medium text-slate-900">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

const inputCls =
  "w-full h-10 rounded-[8px] border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#0891B2] focus:outline-none focus:ring-2 focus:ring-[#0891B2]/20";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </label>
  );
}

function ErrorNote({ children }: { children: ReactNode }) {
  return <div className="rounded-[8px] bg-red-50 px-3 py-2 text-sm text-red-700">{children}</div>;
}

/** Dialog: bottom sheet on phones, centered card on larger screens. */
function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeRef.current();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-[2px] sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full flex-col rounded-t-[16px] bg-white shadow-2xl sm:max-w-lg sm:rounded-[16px]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <IconBtn icon={X} label="Schließen" onClick={onClose} />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

function AdminDashboard() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [section, setSection] = useState<Section>("overview");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate({ to: "/admin/login" });
      else {
        setEmail(data.session.user.email ?? "");
        setAuthChecked(true);
      }
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
  const postsQ = useQuery({
    queryKey: ["admin-posts"],
    queryFn: () => listAllPosts(),
    enabled: authChecked,
  });
  const trainersQ = useQuery({
    queryKey: ["admin-trainers"],
    queryFn: () => listAllTrainers(),
    enabled: authChecked,
  });

  const isAdmin = (rolesQ.data ?? []).includes("admin");
  const trainers = (trainersQ.data ?? []) as TrainerProfile[];
  const pendingTrainers = trainers.filter((t) => !t.is_published && t.submitted_for_review).length;

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login" });
  }

  if (!authChecked) return null;

  const nav: { key: Section; label: string; short: string; icon: LucideIcon; count?: number }[] = [
    { key: "overview", label: "Übersicht", short: "Start", icon: LayoutDashboard },
    { key: "schedule", label: "Stundenplan", short: "Plan", icon: CalendarDays },
    { key: "posts", label: "Beiträge", short: "Beiträge", icon: Newspaper },
    {
      key: "trainers",
      label: "Trainer",
      short: "Trainer",
      icon: UserRound,
      count: pendingTrainers || undefined,
    },
    ...(isAdmin ? [{ key: "team" as const, label: "Team", short: "Team", icon: Users }] : []),
    { key: "account", label: "Konto", short: "Konto", icon: KeyRound },
  ];

  return (
    <div className="fc-admin min-h-screen bg-[#F5F6F8] font-sans text-slate-900 antialiased">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
          <div className="grid h-9 w-9 place-items-center rounded-[8px] bg-[#0a0a0a]">
            <img src="/logo.png" alt="" className="h-7 w-auto" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Fight Club Hanau</div>
            <div className="text-xs text-slate-500">Verwaltung</div>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3" aria-label="Admin-Bereiche">
          {nav.map((n) => {
            const active = section === n.key;
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => setSection(n.key)}
                aria-current={active ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-cyan-50 text-[#0E7490]"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <n.icon
                  className={`h-[18px] w-[18px] ${active ? "text-[#0891B2]" : "text-slate-400"}`}
                />
                <span className="flex-1 text-left">{n.label}</span>
                {n.count ? (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    {n.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-slate-100 p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ExternalLink className="h-[18px] w-[18px] text-slate-400" />
            Website öffnen
          </a>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <LogOut className="h-[18px] w-[18px] text-slate-400" />
            Abmelden
          </button>
          <p className="truncate px-3 pt-2 text-xs text-slate-400" title={email}>
            {email}
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur lg:hidden">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-[8px] bg-[#0a0a0a]">
            <img src="/logo.png" alt="" className="h-6 w-auto" />
          </div>
          <span className="text-sm font-semibold">{nav.find((n) => n.key === section)?.label}</span>
        </div>
        <div className="flex items-center">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Website öffnen"
            className="grid h-10 w-10 place-items-center rounded-[8px] text-slate-500 hover:bg-slate-100"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
          <button
            type="button"
            onClick={signOut}
            aria-label="Abmelden"
            className="grid h-10 w-10 place-items-center rounded-[8px] text-slate-500 hover:bg-slate-100"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="px-4 pb-28 pt-6 sm:px-6 lg:ml-64 lg:px-10 lg:pb-12 lg:pt-10">
        <div className="mx-auto max-w-5xl">
          {section === "overview" && (
            <Overview
              classes={scheduleQ.data ?? []}
              posts={postsQ.data ?? []}
              pendingTrainers={pendingTrainers}
              go={setSection}
            />
          )}
          {section === "schedule" && (
            <ScheduleAdmin classes={scheduleQ.data ?? []} loading={scheduleQ.isLoading} />
          )}
          {section === "posts" && (
            <PostsAdmin posts={postsQ.data ?? []} loading={postsQ.isLoading} />
          )}
          {section === "trainers" && (
            <TrainersAdmin trainers={trainers} loading={trainersQ.isLoading} />
          )}
          {section === "team" && isAdmin && <TeamAdmin />}
          {section === "account" && <AccountAdmin email={email} onSignOut={signOut} />}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Admin-Bereiche"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex">
          {nav.map((n) => {
            const active = section === n.key;
            return (
              <button
                key={n.key}
                type="button"
                onClick={() => setSection(n.key)}
                aria-current={active ? "page" : undefined}
                className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  active ? "text-[#0891B2]" : "text-slate-500"
                }`}
              >
                <n.icon className="h-5 w-5" />
                {n.short}
                {n.count ? (
                  <span className="absolute right-[calc(50%-18px)] top-1.5 h-2 w-2 rounded-full bg-amber-500" />
                ) : null}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview                                                            */
/* ------------------------------------------------------------------ */

function Overview({
  classes,
  posts,
  pendingTrainers,
  go,
}: {
  classes: ScheduleClass[];
  posts: Post[];
  pendingTrainers: number;
  go: (s: Section) => void;
}) {
  const qc = useQueryClient();
  const today = JS_DAY_TO_KEY[new Date().getDay()];
  const todays = classes.filter((c) => c.day === today).sort(byTime);
  const cancelled = todays.filter((c) => c.cancelled_today).length;
  const published = posts.filter((p) => p.published).length;

  const toggleCancel = useMutation({
    mutationFn: (c: ScheduleClass) =>
      updateScheduleClass({ data: { id: c.id, cancelled_today: !c.cancelled_today } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-schedule"] }),
  });

  const dateLabel = new Date().toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const kpis: { label: string; value: number; tone?: string; onClick: () => void }[] = [
    { label: "Trainings heute", value: todays.length, onClick: () => go("schedule") },
    {
      label: "Heute abgesagt",
      value: cancelled,
      tone: cancelled ? "text-red-600" : undefined,
      onClick: () => go("schedule"),
    },
    { label: "Beiträge live", value: published, onClick: () => go("posts") },
    {
      label: "Trainer warten auf Freigabe",
      value: pendingTrainers,
      tone: pendingTrainers ? "text-amber-600" : undefined,
      onClick: () => go("trainers"),
    },
  ];

  return (
    <>
      <PageHeader title="Übersicht" subtitle={dateLabel} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <button
            key={k.label}
            type="button"
            onClick={k.onClick}
            className="rounded-[12px] border border-slate-200 bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-slate-300"
          >
            <div className={`text-3xl font-semibold tabular-nums ${k.tone ?? "text-slate-900"}`}>
              {k.value}
            </div>
            <div className="mt-1 text-xs text-slate-500">{k.label}</div>
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <Card>
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold">Heute · {DAY_LABELS[today]}</h2>
            <Btn variant="ghost" onClick={() => go("schedule")}>
              Ganzer Plan
            </Btn>
          </div>
          {todays.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              Heute steht kein Training im Plan.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {todays.map((c) => (
                <li key={c.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="w-24 shrink-0 text-sm font-semibold tabular-nums text-slate-700">
                    {hhmm(c.start_time)}–{hhmm(c.end_time)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`truncate text-sm font-medium ${c.cancelled_today ? "text-slate-400 line-through" : ""}`}
                    >
                      {c.discipline}
                    </div>
                    {c.age && <div className="truncate text-xs text-slate-500">{c.age}</div>}
                  </div>
                  {c.cancelled_today && <Badge tone="red">Fällt aus</Badge>}
                  <IconBtn
                    icon={c.cancelled_today ? RotateCcw : Ban}
                    label={c.cancelled_today ? "Ausfall aufheben" : "Heute absagen"}
                    tone={c.cancelled_today ? "default" : "danger"}
                    disabled={toggleCancel.isPending}
                    onClick={() => toggleCancel.mutate(c)}
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold">Schnellzugriff</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Btn icon={Plus} onClick={() => go("schedule")} className="justify-start">
              Training eintragen
            </Btn>
            <Btn icon={Plus} onClick={() => go("posts")} className="justify-start">
              Beitrag schreiben
            </Btn>
            <Btn icon={UserRound} onClick={() => go("trainers")} className="justify-start">
              Trainer freigeben
            </Btn>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-[8px] border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />
              Website ansehen
            </a>
          </div>
        </Card>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Schedule                                                            */
/* ------------------------------------------------------------------ */

function ScheduleAdmin({ classes, loading }: { classes: ScheduleClass[]; loading: boolean }) {
  const qc = useQueryClient();
  const [day, setDay] = useState<WeekDay>(JS_DAY_TO_KEY[new Date().getDay()]);
  const [editing, setEditing] = useState<ScheduleClass | null>(null);
  const [showNew, setShowNew] = useState(false);
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-schedule"] });

  const toggleCancel = useMutation({
    mutationFn: (c: ScheduleClass) =>
      updateScheduleClass({ data: { id: c.id, cancelled_today: !c.cancelled_today } }),
    onSuccess: refresh,
  });
  const del = useMutation({
    mutationFn: (id: string) => deleteScheduleClass({ data: { id } }),
    onSuccess: refresh,
  });

  const forDay = classes.filter((c) => c.day === day).sort(byTime);
  const today = JS_DAY_TO_KEY[new Date().getDay()];

  return (
    <>
      <PageHeader
        title="Stundenplan"
        subtitle={`${classes.length} Trainings pro Woche`}
        action={
          <Btn variant="primary" icon={Plus} onClick={() => setShowNew(true)}>
            Neues Training
          </Btn>
        }
      />

      <div className="mb-4 grid grid-cols-7 gap-1.5 rounded-[12px] border border-slate-200 bg-white p-1.5">
        {DAYS.map((d) => {
          const count = classes.filter((c) => c.day === d).length;
          const active = d === day;
          return (
            <button
              key={d}
              type="button"
              onClick={() => setDay(d)}
              aria-pressed={active}
              className={`relative rounded-[8px] py-2 text-center transition-colors ${
                active ? "bg-[#0a0a0a] text-white" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <div className="text-sm font-semibold">
                <span className="sm:hidden">{DAY_SHORT[d]}</span>
                <span className="hidden sm:inline">{DAY_LABELS[d]}</span>
              </div>
              <div className={`text-[11px] ${active ? "text-white/60" : "text-slate-400"}`}>
                {count}
              </div>
              {d === today && (
                <span
                  className={`absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${active ? "bg-cyan-300" : "bg-[#0891B2]"}`}
                />
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Wird geladen …</p>
      ) : forDay.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={`Kein Training am ${DAY_LABELS[day]}`}
          action={
            <Btn variant="primary" icon={Plus} onClick={() => setShowNew(true)}>
              Training eintragen
            </Btn>
          }
        />
      ) : (
        <Card>
          <ul className="divide-y divide-slate-100">
            {forDay.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:px-5"
              >
                <div className="w-24 shrink-0 text-sm font-semibold tabular-nums">
                  {hhmm(c.start_time)}–{hhmm(c.end_time)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`font-medium ${c.cancelled_today ? "text-slate-400 line-through" : ""}`}
                    >
                      {c.discipline}
                    </span>
                    {c.cancelled_today && <Badge tone="red">Fällt heute aus</Badge>}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {[c.age, c.note && `Hinweis: ${c.note}`].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Btn
                    variant={c.cancelled_today ? "secondary" : "danger"}
                    icon={c.cancelled_today ? RotateCcw : Ban}
                    disabled={toggleCancel.isPending}
                    onClick={() => toggleCancel.mutate(c)}
                    className="h-9 text-xs"
                  >
                    {c.cancelled_today ? "Ausfall aufheben" : "Heute absagen"}
                  </Btn>
                  <IconBtn icon={Pencil} label="Bearbeiten" onClick={() => setEditing(c)} />
                  <IconBtn
                    icon={Trash2}
                    label="Löschen"
                    tone="danger"
                    onClick={() =>
                      confirm(`„${c.discipline}“ dauerhaft löschen?`) && del.mutate(c.id)
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <p className="mt-3 text-xs text-slate-500">
        „Heute absagen“ zeigt das Training auf der Website als ausgefallen an. Danach wieder
        aufheben.
      </p>

      {(editing || showNew) && (
        <ClassModal
          day={day}
          initial={editing ?? undefined}
          onClose={() => {
            setEditing(null);
            setShowNew(false);
          }}
          onSaved={() => {
            refresh();
            setEditing(null);
            setShowNew(false);
          }}
        />
      )}
    </>
  );
}

function ClassModal({
  day,
  initial,
  onClose,
  onSaved,
}: {
  day: WeekDay;
  initial?: ScheduleClass;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    day: initial?.day ?? day,
    start_time: hhmm(initial?.start_time ?? "18:00"),
    end_time: hhmm(initial?.end_time ?? "19:00"),
    discipline: initial?.discipline ?? "",
    age: initial?.age ?? "",
    note: initial?.note ?? "",
    sort_index: initial?.sort_index ?? 0,
    cancelled_today: initial?.cancelled_today ?? false,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function save() {
    if (!form.discipline.trim()) return setErr("Bitte eine Disziplin angeben.");
    if (form.end_time <= form.start_time) return setErr("Das Ende muss nach dem Beginn liegen.");
    setSaving(true);
    setErr(null);
    try {
      const payload = {
        ...form,
        start_time: hhmm(form.start_time),
        end_time: hhmm(form.end_time),
        note: form.note.trim() || null,
      };
      if (initial) await updateScheduleClass({ data: { id: initial.id, ...payload } });
      else await createScheduleClass({ data: payload });
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title={initial ? "Training bearbeiten" : "Neues Training"}
      onClose={onClose}
      footer={
        <>
          <Btn onClick={onClose}>Abbrechen</Btn>
          <Btn variant="primary" icon={Check} onClick={save} disabled={saving}>
            {saving ? "Speichern …" : "Speichern"}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Disziplin">
          <input
            autoFocus
            value={form.discipline}
            onChange={(e) => setForm({ ...form, discipline: e.target.value })}
            placeholder="z. B. MMA, Kids-Kickboxen"
            className={inputCls}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Wochentag">
            <select
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value as WeekDay })}
              className={inputCls}
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {DAY_LABELS[d]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Altersgruppe">
            <input
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="z. B. 8–12 Jahre"
              className={inputCls}
            />
          </Field>
          <Field label="Beginn">
            <input
              type="time"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Ende">
            <input
              type="time"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
        <Field label="Hinweis" hint="Optional, erscheint unter dem Training.">
          <input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Reihenfolge" hint="Kleinere Zahl = weiter oben bei gleicher Uhrzeit.">
          <input
            type="number"
            min={0}
            value={form.sort_index}
            onChange={(e) =>
              setForm({ ...form, sort_index: Math.max(0, Number(e.target.value) || 0) })
            }
            className={`${inputCls} max-w-[120px]`}
          />
        </Field>
        {err && <ErrorNote>{err}</ErrorNote>}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Posts                                                               */
/* ------------------------------------------------------------------ */

function PostsAdmin({ posts, loading }: { posts: Post[]; loading: boolean }) {
  const qc = useQueryClient();
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

  const publishedCount = posts.filter((p) => p.published).length;

  return (
    <>
      <PageHeader
        title="Beiträge"
        subtitle={`${publishedCount} von ${posts.length} veröffentlicht`}
        action={
          <Btn variant="primary" icon={Plus} onClick={() => setShowNew(true)}>
            Neuer Beitrag
          </Btn>
        }
      />

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Wird geladen …</p>
      ) : posts.length === 0 ? (
        <EmptyState
          icon={Newspaper}
          title="Noch keine Beiträge"
          text="Beiträge erscheinen auf der Startseite unter „Neuigkeiten“."
          action={
            <Btn variant="primary" icon={Plus} onClick={() => setShowNew(true)}>
              Ersten Beitrag schreiben
            </Btn>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {posts.map((p) => (
            <Card key={p.id} className="flex flex-col overflow-hidden">
              <button
                type="button"
                onClick={() => setEditing(p)}
                className="flex flex-1 gap-4 p-4 text-left"
              >
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-[8px] object-cover"
                  />
                ) : (
                  <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[8px] bg-slate-100 text-slate-300">
                    <Newspaper className="h-6 w-6" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={p.published ? "green" : "slate"}>
                      {p.published ? "Live" : "Entwurf"}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {new Date(p.published_at).toLocaleDateString("de-DE")}
                    </span>
                  </div>
                  <h3 className="mt-1.5 line-clamp-2 font-medium leading-snug">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{p.body}</p>
                </div>
              </button>
              <div className="flex items-center justify-end gap-1 border-t border-slate-100 px-2 py-1.5">
                <IconBtn icon={Pencil} label="Bearbeiten" onClick={() => setEditing(p)} />
                <IconBtn
                  icon={p.published ? EyeOff : Eye}
                  label={p.published ? "Verbergen" : "Veröffentlichen"}
                  onClick={() => togglePublish.mutate(p)}
                />
                <IconBtn
                  icon={Trash2}
                  label="Löschen"
                  tone="danger"
                  onClick={() => confirm(`Beitrag „${p.title}“ löschen?`) && del.mutate(p.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {(editing || showNew) && (
        <PostModal
          initial={editing ?? undefined}
          onClose={() => {
            setEditing(null);
            setShowNew(false);
          }}
          onSaved={() => {
            refresh();
            setEditing(null);
            setShowNew(false);
          }}
        />
      )}
    </>
  );
}

function PostModal({
  initial,
  onClose,
  onSaved,
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
    if (!file.type.startsWith("image/")) return setErr("Bitte eine Bilddatei wählen.");
    if (file.size > 8 * 1024 * 1024) return setErr("Bild ist größer als 8 MB.");
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
        await updatePost({
          data: { id: initial.id, title, body, published, image_path: imagePath },
        });
      } else {
        await createPost({ data: { title, body, published, image_path: imagePath } });
      }
      onSaved();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Speichern fehlgeschlagen");
    } finally {
      setSaving(false);
    }
  }

  const canSave = !saving && !uploading && !!title.trim() && !!body.trim();

  return (
    <Modal
      title={initial ? "Beitrag bearbeiten" : "Neuer Beitrag"}
      onClose={onClose}
      footer={
        <>
          <Btn onClick={onClose}>Abbrechen</Btn>
          <Btn variant="primary" icon={Check} onClick={save} disabled={!canSave}>
            {saving ? "Speichern …" : published ? "Veröffentlichen" : "Als Entwurf speichern"}
          </Btn>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Titel">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={160}
            className={inputCls}
          />
        </Field>
        <Field label="Text" hint={`${body.length} / 5000 Zeichen`}>
          <textarea
            rows={7}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={5000}
            className={`${inputCls} h-auto resize-y py-2.5`}
          />
        </Field>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Bild</span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
          {preview ? (
            <div className="flex items-center gap-4">
              <img src={preview} alt="Vorschau" className="h-24 w-24 rounded-[8px] object-cover" />
              <div className="flex flex-col items-start gap-1">
                <Btn variant="ghost" icon={Camera} onClick={() => fileRef.current?.click()}>
                  Bild ändern
                </Btn>
                <Btn
                  variant="ghost"
                  icon={Trash2}
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => {
                    setImagePath(null);
                    setPreview(null);
                  }}
                >
                  Entfernen
                </Btn>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-28 w-full flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-slate-200 text-slate-500 transition-colors hover:border-[#0891B2] hover:text-[#0891B2]"
            >
              <Upload className="h-5 w-5" />
              <span className="text-sm">Bild hochladen (max. 8 MB)</span>
            </button>
          )}
          {uploading && <p className="mt-2 text-xs text-slate-500">Bild wird hochgeladen …</p>}
        </div>

        <label className="flex cursor-pointer items-center justify-between rounded-[8px] border border-slate-200 px-4 py-3">
          <div>
            <div className="text-sm font-medium">Auf der Website anzeigen</div>
            <div className="text-xs text-slate-500">
              {published ? "Der Beitrag ist öffentlich sichtbar." : "Nur als Entwurf gespeichert."}
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={published}
            onClick={() => setPublished((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${published ? "bg-emerald-500" : "bg-slate-300"}`}
          >
            <span
              className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                published ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>

        {err && <ErrorNote>{err}</ErrorNote>}
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Trainers                                                            */
/* ------------------------------------------------------------------ */

function TrainersAdmin({ trainers, loading }: { trainers: TrainerProfile[]; loading: boolean }) {
  const qc = useQueryClient();
  const [busy, setBusy] = useState<string | null>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-trainers"] });

  async function run(t: TrainerProfile, fn: () => Promise<unknown>) {
    setBusy(t.id);
    try {
      await fn();
      await refresh();
    } finally {
      setBusy(null);
    }
  }

  const pending = trainers.filter((t) => !t.is_published && t.submitted_for_review);
  const rest = trainers.filter((t) => !(!t.is_published && t.submitted_for_review));

  const row = (t: TrainerProfile) => (
    <li key={t.id} className="flex flex-wrap items-center gap-4 px-4 py-4 sm:px-5">
      <div className="h-14 w-12 shrink-0 overflow-hidden rounded-[8px] bg-slate-100">
        {t.avatar_url ? (
          <img src={t.avatar_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center text-slate-300">
            <UserRound className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{t.display_name || "Ohne Namen"}</span>
          <Badge tone={t.is_published ? "cyan" : t.submitted_for_review ? "amber" : "slate"}>
            {t.is_published
              ? "Öffentlich"
              : t.submitted_for_review
                ? "Wartet auf Freigabe"
                : "Entwurf"}
          </Badge>
        </div>
        <div className="mt-0.5 truncate text-xs text-slate-500">
          {[t.role_title, t.disciplines.join(" · "), t.email].filter(Boolean).join(" — ")}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Btn
          variant={t.is_published ? "secondary" : "primary"}
          icon={t.is_published ? EyeOff : Check}
          disabled={busy === t.id}
          onClick={() =>
            run(t, () => updateTrainerStatus({ data: { id: t.id, is_published: !t.is_published } }))
          }
          className="h-9 text-xs"
        >
          {t.is_published ? "Verbergen" : "Freigeben"}
        </Btn>
        <IconBtn
          icon={ArrowUp}
          label="Weiter nach vorne"
          disabled={busy === t.id}
          onClick={() =>
            run(t, () =>
              updateTrainerStatus({
                data: { id: t.id, sort_index: Math.max(0, t.sort_index - 1) },
              }),
            )
          }
        />
        <IconBtn
          icon={ArrowDown}
          label="Weiter nach hinten"
          disabled={busy === t.id}
          onClick={() =>
            run(t, () =>
              updateTrainerStatus({
                data: { id: t.id, sort_index: Math.min(999, t.sort_index + 1) },
              }),
            )
          }
        />
        <IconBtn
          icon={Trash2}
          label="Löschen"
          tone="danger"
          disabled={busy === t.id}
          onClick={() =>
            confirm(`Trainerprofil von ${t.display_name || t.email} endgültig löschen?`) &&
            run(t, () => deleteTrainer({ data: { id: t.id } }))
          }
        />
      </div>
    </li>
  );

  return (
    <>
      <PageHeader
        title="Trainer"
        subtitle="Profile erscheinen erst auf der Startseite, wenn du sie freigibst."
      />
      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Wird geladen …</p>
      ) : trainers.length === 0 ? (
        <EmptyState
          icon={UserRound}
          title="Noch keine Trainerprofile"
          text="Trainer registrieren sich selbst unter /trainer/registrieren und erscheinen dann hier."
        />
      ) : (
        <div className="space-y-6">
          {pending.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-amber-700">
                Warten auf Freigabe ({pending.length})
              </h2>
              <Card className="border-amber-200">
                <ul className="divide-y divide-slate-100">{pending.map(row)}</ul>
              </Card>
            </section>
          )}
          {rest.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-slate-700">Alle Profile</h2>
              <Card>
                <ul className="divide-y divide-slate-100">{rest.map(row)}</ul>
              </Card>
            </section>
          )}
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Team                                                                */
/* ------------------------------------------------------------------ */

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
    <>
      <PageHeader title="Team" subtitle="Wer darf Stundenplan, Beiträge und Trainer verwalten?" />

      <Card className="p-5">
        <h2 className="font-semibold">Person einladen</h2>
        <p className="mt-1 text-sm text-slate-500">
          Die Person bekommt eine E-Mail mit einem Link, um ihr Passwort festzulegen.
        </p>
        <form
          className="mt-4 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setErr(null);
            setOk(null);
            invite.mutate({ email, role });
          }}
        >
          <input
            type="email"
            required
            placeholder="E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputCls} flex-1`}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "staff")}
            className={`${inputCls} sm:w-40`}
          >
            <option value="staff">Mitarbeiter</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={invite.isPending || !email}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-4 text-sm font-medium disabled:opacity-50 ${BTN.primary}`}
          >
            <Plus className="h-4 w-4" />
            Einladen
          </button>
        </form>
        {err && (
          <div className="mt-3">
            <ErrorNote>{err}</ErrorNote>
          </div>
        )}
        {ok && <p className="mt-3 text-sm text-emerald-700">{ok}</p>}
      </Card>

      <Card className="mt-6">
        <div className="border-b border-slate-100 px-5 py-3 text-sm font-semibold">Mitglieder</div>
        {teamQ.isLoading ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">Wird geladen …</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {(teamQ.data ?? []).map((u) => (
              <li key={u.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-semibold uppercase text-slate-500">
                  {u.email.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{u.email}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {u.last_sign_in_at
                      ? `Zuletzt angemeldet: ${new Date(u.last_sign_in_at).toLocaleDateString("de-DE")}`
                      : "Noch nie angemeldet"}
                  </div>
                </div>
                {u.roles.map((r) => (
                  <Badge key={r} tone={r === "admin" ? "cyan" : "slate"}>
                    {r === "admin" ? "Admin" : "Mitarbeiter"}
                  </Badge>
                ))}
                <IconBtn
                  icon={Trash2}
                  label="Entfernen"
                  tone="danger"
                  onClick={() => confirm(`${u.email} entfernen?`) && remove.mutate(u.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Account                                                             */
/* ------------------------------------------------------------------ */

function AccountAdmin({ email, onSignOut }: { email: string; onSignOut: () => void }) {
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(false);
    if (password.length < 8) return setErr("Das Passwort muss mindestens 8 Zeichen haben.");
    if (password !== confirmPw) return setErr("Die Passwörter stimmen nicht überein.");
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) return setErr(error.message);
    setPassword("");
    setConfirmPw("");
    setOk(true);
  }

  return (
    <>
      <PageHeader title="Konto" subtitle={email} />

      <Card className="max-w-xl p-5">
        <h2 className="flex items-center gap-2 font-semibold">
          <KeyRound className="h-4 w-4 text-slate-400" />
          Passwort ändern
        </h2>
        <p className="mt-1 text-sm text-slate-500">Gilt ab sofort für die Anmeldung mit {email}.</p>
        <form onSubmit={changePassword} className="mt-5 space-y-4">
          <Field label="Neues Passwort" hint="Mindestens 8 Zeichen.">
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputCls} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Passwort verbergen" : "Passwort anzeigen"}
                className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-[6px] text-slate-400 hover:text-slate-600"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <Field label="Neues Passwort wiederholen">
            <input
              type={show ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className={inputCls}
            />
          </Field>
          {err && <ErrorNote>{err}</ErrorNote>}
          {ok && (
            <div className="flex items-center gap-2 rounded-[8px] bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <Check className="h-4 w-4" /> Passwort geändert.
            </div>
          )}
          <Btn variant="primary" type="submit" disabled={saving || !password || !confirmPw}>
            {saving ? "Wird gespeichert …" : "Passwort speichern"}
          </Btn>
        </form>
      </Card>

      <Card className="mt-6 max-w-xl p-5">
        <h2 className="font-semibold">Abmelden</h2>
        <p className="mt-1 text-sm text-slate-500">Beendet die Sitzung auf diesem Gerät.</p>
        <Btn icon={LogOut} onClick={onSignOut} className="mt-4">
          Abmelden
        </Btn>
      </Card>
    </>
  );
}
