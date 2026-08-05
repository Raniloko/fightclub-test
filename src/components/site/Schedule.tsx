import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpen, Calendar, Clock } from "lucide-react";
import { Reveal } from "./Reveal";
import { listSchedule, type ScheduleClass, type WeekDay } from "@/lib/schedule.functions";

const DAYS: WeekDay[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const DAY_LABELS_SHORT: Record<WeekDay, string> = {
  MON: "Mo", TUE: "Di", WED: "Mi", THU: "Do", FRI: "Fr", SAT: "Sa", SUN: "So",
};

const DAY_LABELS_LONG: Record<WeekDay, string> = {
  MON: "Montag", TUE: "Dienstag", WED: "Mittwoch", THU: "Donnerstag",
  FRI: "Freitag", SAT: "Samstag", SUN: "Sonntag",
};

const JS_DAY_TO_KEY: WeekDay[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

/* Discipline colour coding — array order controls match priority (specific first) */
const DISCIPLINE_COLORS: { label: string; match: string[]; color: string }[] = [
  { label: "Personal Training", match: ["personal"], color: "#B0B0B0" },
  { label: "Kick-Boxen Frauen", match: ["frauen"], color: "#FF2E9A" },
  { label: "Boxen (Wettkampf)", match: ["wettkampf"], color: "#1E3A8A" },
  { label: "Boxen-Teens", match: ["boxen-teens"], color: "#6EA8FF" },
  { label: "Kickboxen", match: ["mini-kickbox", "kids-kickbox", "teens-kickbox"], color: "#FACC15" },
  { label: "Wing Fight / Selfdefense", match: ["wing", "self"], color: "#8B5CF6" },
  { label: "MMA / Ground and Pound", match: ["mma", "ground"], color: "#FF4444" },
  { label: "Submission Grappling", match: ["grappling", "submission"], color: "#00CFC1" },
  { label: "Thaiboxen", match: ["thai", "muay"], color: "#DC143C" },
  { label: "K1 / Kickboxen", match: ["k1", "kickbox"], color: "#22C55E" },
  { label: "Boxen", match: ["box"], color: "#FF6B00" },
];

/* Legend display order (user-specified) */
const LEGEND_LABELS = [
  "MMA / Ground and Pound",
  "Thaiboxen",
  "Kickboxen",
  "K1 / Kickboxen",
  "Submission Grappling",
  "Wing Fight / Selfdefense",
  "Boxen",
  "Boxen (Wettkampf)",
  "Kick-Boxen Frauen",
  "Personal Training",
];



const FALLBACK_COLOR = "#9CA3AF";

function disciplineColor(name: string) {
  const n = (name || "").toLowerCase();
  for (const d of DISCIPLINE_COLORS) {
    if (d.match.some((m) => n.includes(m))) return d.color;
  }
  return FALLBACK_COLOR;
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function Schedule() {
  const [today, setToday] = useState<WeekDay | null>(null);
  const [nowMin, setNowMin] = useState<number>(0);
  const [day, setDay] = useState<WeekDay>("MON");

  const { data: allClasses = [] } = useQuery<ScheduleClass[]>({
    queryKey: ["public-schedule"],
    queryFn: () => listSchedule(),
    refetchInterval: 60_000,
  });

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setToday(JS_DAY_TO_KEY[d.getDay()]);
      setNowMin(d.getHours() * 60 + d.getMinutes());
    };
    update();
    setDay(JS_DAY_TO_KEY[new Date().getDay()]);
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const byDay: Record<WeekDay, ScheduleClass[]> = {
    MON: [], TUE: [], WED: [], THU: [], FRI: [], SAT: [], SUN: [],
  };
  for (const c of allClasses) byDay[c.day].push(c);
  for (const d of DAYS) {
    byDay[d].sort((a, b) => a.sort_index - b.sort_index || a.start_time.localeCompare(b.start_time));
  }

  const dayColors = (d: WeekDay) => {
    const seen: string[] = [];
    for (const c of byDay[d]) {
      const col = disciplineColor(c.discipline);
      if (!seen.includes(col)) seen.push(col);
    }
    return seen;
  };

  const isLive = (c: ScheduleClass) => {
    const isTodayClass = today === c.day;
    return isTodayClass && !c.cancelled_today && nowMin >= toMinutes(c.start_time) && nowMin < toMinutes(c.end_time);
  };

  const mobileClasses = byDay[day];
  const isTodayMobile = today === day;

  const CARD_BG = "#1A1A1A";
  const CARD_BORDER = "rgba(255,255,255,0.06)";

  return (
    <section id="stundenplan" className="py-16 md:py-24" style={{ backgroundColor: "#0D0D0D" }}>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-white/40" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-white/50">
              Wann trainierst du
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-5xl text-white md:text-7xl">
              <span className="fc-headline-underline">Stundenplan</span>
            </h2>
            <Link
              to="/schulordnung"
              className="group inline-flex w-fit items-center gap-3 border border-white/20 bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-black transition-colors hover:border-[#C9A84C] hover:bg-[#C9A84C]"
            >
              <BookOpen className="h-4 w-4" />
              Schulordnung ansehen
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>

        {/* Colour legend */}
        <div
          className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border p-4"
          style={{ backgroundColor: "#111111", borderColor: CARD_BORDER }}
        >
          {LEGEND_LABELS.map((label) => {
            const d = DISCIPLINE_COLORS.find((c) => c.label === label);
            if (!d) return null;
            return (
              <span key={d.label} className="inline-flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: d.color }}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/70">
                  {d.label}
                </span>
              </span>
            );
          })}
        </div>

        {/* Desktop: all days as columns */}
        <div className="mt-10 hidden xl:block">
          <div className="grid grid-cols-7 gap-3">
            {DAYS.map((d) => {
              const isCurrent = today === d;
              const list = byDay[d];
              return (
                <div
                  key={d}
                  className="flex flex-col border"
                  style={{
                    backgroundColor: "#111111",
                    borderColor: isCurrent ? "rgba(0,180,220,0.5)" : CARD_BORDER,
                  }}
                >
                  <div
                    className="flex items-center justify-between border-b px-4 py-3"
                    style={{ borderColor: isCurrent ? "rgba(0,180,220,0.35)" : CARD_BORDER }}
                  >
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">
                        {DAY_LABELS_SHORT[d]}
                      </div>
                      <div className="mt-0.5 font-display text-lg text-white">
                        {DAY_LABELS_LONG[d]}
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#00B4DC]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#00B4DC]" />
                        Heute
                      </span>
                    )}
                  </div>
                  {d === "SUN" && (
                    <div
                      className="flex items-start gap-2 border-b px-3 py-3"
                      style={{
                        borderColor: "rgba(201,168,76,0.4)",
                        backgroundColor: "rgba(201,168,76,0.12)",
                      }}
                    >
                      <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C9A84C]" />
                      <p className="min-w-0 break-words text-[10px] font-semibold uppercase leading-snug tracking-[0.08em] text-[#C9A84C]">
                        Nur nach Terminvereinbarung
                      </p>
                    </div>
                  )}
                  <div className="flex-1 p-3">
                    {list.length === 0 ? (
                      <p className="py-6 text-center text-[12px] uppercase tracking-[0.15em] text-white/30">
                        Ruhetag
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {list.map((c) => {
                          const live = isLive(c);
                          const cancelled = today === c.day && c.cancelled_today;
                          const color = disciplineColor(c.discipline);
                          return (
                            <li
                              key={c.id}
                              className="relative border p-3 pl-4 transition-colors"
                              style={{
                                backgroundColor: CARD_BG,
                                borderColor: live ? "rgba(0,180,220,0.6)" : CARD_BORDER,
                                borderLeft: `4px solid ${cancelled ? "rgba(255,255,255,0.15)" : color}`,
                              }}
                            >
                              <div
                                className={`text-[14px] font-medium leading-tight tracking-[0.02em] tabular-nums ${
                                  cancelled ? "text-white/35 line-through" : "text-white/90"
                                }`}
                              >
                                {c.start_time}
                                <span className="mx-1 text-white/60">–</span>
                                {c.end_time}
                              </div>
                              <div
                                className={`mt-1 text-[13px] font-semibold ${cancelled ? "line-through" : ""}`}
                                style={{ color: cancelled ? "rgba(255,255,255,0.35)" : color }}
                              >
                                {c.discipline}
                              </div>
                              {c.age && (
                                <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/45">
                                  {c.age}
                                </div>
                              )}
                              {live && (
                                <div className="mt-2 inline-flex items-center gap-1.5 border border-[#00B4DC] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#00B4DC]">
                                  <span className="h-1 w-1 animate-pulse rounded-full bg-[#00B4DC]" />
                                  Läuft
                                </div>
                              )}
                              {cancelled && (
                                <div className="mt-2 inline-block border border-red-500/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-400">
                                  Fällt aus
                                </div>
                              )}
                              {c.note && !cancelled && (
                                <div className="mt-1.5 text-[11px] text-white/50">{c.note}</div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: day switcher */}
        <div className="mt-10 xl:hidden">
          <div className="flex gap-2 overflow-x-auto border-b" style={{ borderColor: CARD_BORDER }}>
            {DAYS.map((d) => {
              const active = day === d;
              const isCurrent = today === d;
              const colors = dayColors(d);
              return (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  className={`relative shrink-0 px-3 pb-4 pt-3 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                    active ? "text-white" : "text-white/45"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {DAY_LABELS_SHORT[d]}
                    {isCurrent && <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00B4DC]" />}
                  </span>
                  {active && colors.length > 0 && (
                    <span className="mt-1.5 flex items-center justify-center gap-1">
                      {colors.map((col) => (
                        <span
                          key={col}
                          className="inline-block h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: col }}
                          aria-hidden="true"
                        />
                      ))}
                    </span>
                  )}
                  {active && <span className="absolute inset-x-0 -bottom-px h-[3px] bg-[#00B4DC]" />}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            {day === "SUN" && (
              <div
                className="mb-5 flex items-center gap-3 border px-5 py-4"
                style={{
                  borderColor: "rgba(201,168,76,0.5)",
                  backgroundColor: "rgba(201,168,76,0.12)",
                }}
              >
                <Clock className="h-5 w-5 shrink-0 text-[#C9A84C]" />
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#C9A84C]">
                  Sonntag nur nach Terminvereinbarung
                </p>
              </div>
            )}
            {mobileClasses.length === 0 ? (
              <p className="py-12 text-center text-[14px] text-white/50">
                Kein Training. Ruhetag.
              </p>
            ) : (
              <ul className="space-y-3">
                {mobileClasses.map((c) => {
                  const live = isLive(c);
                  const cancelled = isTodayMobile && c.cancelled_today;
                  const color = disciplineColor(c.discipline);
                  return (
                    <li
                      key={c.id}
                      className="relative border p-4 pl-5"
                      style={{
                        backgroundColor: CARD_BG,
                        borderColor: live ? "rgba(0,180,220,0.6)" : CARD_BORDER,
                        borderLeft: `4px solid ${cancelled ? "rgba(255,255,255,0.15)" : color}`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`text-[17px] font-medium tracking-[0.02em] tabular-nums ${
                            cancelled ? "text-white/35 line-through" : "text-white/90"
                          }`}
                        >
                          {c.start_time}
                          <span className="mx-1 text-white/60">–</span>
                          {c.end_time}
                        </div>
                        {live && (
                          <span className="inline-flex items-center gap-1.5 border border-[#00B4DC] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00B4DC]">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00B4DC]" />
                            Läuft
                          </span>
                        )}
                        {cancelled && (
                          <span className="border border-red-500/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-400">
                            Fällt aus
                          </span>
                        )}
                      </div>
                      <div
                        className={`mt-1.5 text-[15px] font-semibold ${cancelled ? "line-through" : ""}`}
                        style={{ color: cancelled ? "rgba(255,255,255,0.35)" : color }}
                      >
                        {c.discipline}
                      </div>
                      {c.age && (
                        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/45">
                          {c.age}
                        </div>
                      )}
                      {c.note && !cancelled && (
                        <div className="mt-2 text-xs text-white/50">{c.note}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div
          className="mt-10 flex flex-col gap-3 border-t pt-6 md:flex-row md:items-center md:justify-between"
          style={{ borderColor: CARD_BORDER }}
        >
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/50">
            <Calendar className="h-3.5 w-3.5" />
            Personal Training nur nach Terminvereinbarung
          </p>
          <Link
            to="/schulordnung"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white underline-offset-4 hover:underline"
          >
            Regeln der Akademie – Schulordnung
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
