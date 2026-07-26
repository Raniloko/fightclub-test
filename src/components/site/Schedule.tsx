import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpen, Calendar } from "lucide-react";
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

  const isLive = (c: ScheduleClass) => {
    const isTodayClass = today === c.day;
    return isTodayClass && !c.cancelled_today && nowMin >= toMinutes(c.start_time) && nowMin < toMinutes(c.end_time);
  };

  const mobileClasses = byDay[day];
  const isTodayMobile = today === day;

  return (
    <section id="stundenplan" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#0a0a0a]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#555]">
              Wann trainierst du
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="font-display text-5xl md:text-7xl">
              <span className="fc-headline-underline">Stundenplan</span>
            </h2>
            <Link
              to="/schulordnung"
              className="group inline-flex w-fit items-center gap-3 border border-[#0a0a0a] bg-[#0a0a0a] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#C9A84C] hover:border-[#C9A84C]"
            >
              <BookOpen className="h-4 w-4" />
              Schulordnung ansehen
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Reveal>

        {/* Desktop: all days as columns */}
        <div className="mt-12 hidden md:block">
          <div className="grid grid-cols-7 gap-3">
            {DAYS.map((d) => {
              const isCurrent = today === d;
              const list = byDay[d];
              return (
                <div
                  key={d}
                  className={`flex flex-col border ${
                    isCurrent ? "border-[#00B4DC] bg-[#00B4DC]/[0.04]" : "border-[#e5e5e5] bg-[#fafafa]"
                  }`}
                >
                  <div
                    className={`flex items-center justify-between border-b px-4 py-3 ${
                      isCurrent ? "border-[#00B4DC]/40" : "border-[#e5e5e5]"
                    }`}
                  >
                    <div>
                      <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#777]">
                        {DAY_LABELS_SHORT[d]}
                      </div>
                      <div className="mt-0.5 font-display text-lg text-[#0a0a0a]">
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
                  <div className="flex-1 p-3">
                    {list.length === 0 ? (
                      <p className="py-6 text-center text-[12px] uppercase tracking-[0.15em] text-[#aaa]">
                        Ruhetag
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {list.map((c) => {
                          const live = isLive(c);
                          const cancelled = today === c.day && c.cancelled_today;
                          return (
                            <li
                              key={c.id}
                              className={`relative border p-3 transition-colors ${
                                live
                                  ? "border-[#00B4DC] bg-white"
                                  : cancelled
                                  ? "border-red-200 bg-red-50/60"
                                  : "border-[#eee] bg-white hover:border-[#0a0a0a]"
                              }`}
                            >
                              {live && (
                                <span className="absolute inset-y-2 left-0 w-[3px] bg-[#00B4DC]" />
                              )}
                              <div
                                className={`font-display text-base leading-tight ${
                                  cancelled ? "text-[#999] line-through" : "text-[#0a0a0a]"
                                }`}
                              >
                                {c.start_time}
                                <span className="text-[#bbb]">–</span>
                                {c.end_time}
                              </div>
                              <div
                                className={`mt-1 text-[13px] font-medium ${
                                  cancelled ? "text-[#999] line-through" : "text-[#0a0a0a]"
                                }`}
                              >
                                {c.discipline}
                              </div>
                              {c.age && (
                                <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-[#777]">
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
                                <div className="mt-2 inline-block border border-red-500 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-600">
                                  Fällt aus
                                </div>
                              )}
                              {c.note && !cancelled && (
                                <div className="mt-1.5 text-[11px] text-[#666]">{c.note}</div>
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
        <div className="mt-10 md:hidden">
          <div className="flex gap-2 overflow-x-auto border-b border-[#e5e5e5]">
            {DAYS.map((d) => {
              const active = day === d;
              const isCurrent = today === d;
              return (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  className={`relative shrink-0 px-3 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                    active ? "text-[#0a0a0a]" : "text-[#999]"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {DAY_LABELS_SHORT[d]}
                    {isCurrent && <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00B4DC]" />}
                  </span>
                  {active && <span className="absolute inset-x-0 -bottom-px h-[3px] bg-[#00B4DC]" />}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            {mobileClasses.length === 0 ? (
              <p className="py-12 text-center text-[14px] text-[#777]">
                Kein Training. Ruhetag.
              </p>
            ) : (
              <ul className="space-y-3">
                {mobileClasses.map((c) => {
                  const live = isLive(c);
                  const cancelled = isTodayMobile && c.cancelled_today;
                  return (
                    <li
                      key={c.id}
                      className={`relative border p-4 ${
                        live
                          ? "border-[#00B4DC] bg-[#00B4DC]/[0.06]"
                          : cancelled
                          ? "border-red-200 bg-red-50/60"
                          : "border-[#e5e5e5] bg-[#fafafa]"
                      }`}
                    >
                      {live && <span className="absolute inset-y-3 left-0 w-[3px] bg-[#00B4DC]" />}
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`font-display text-xl ${
                            cancelled ? "text-[#999] line-through" : "text-[#0a0a0a]"
                          }`}
                        >
                          {c.start_time}
                          <span className="text-[#bbb]">–</span>
                          {c.end_time}
                        </div>
                        {live && (
                          <span className="inline-flex items-center gap-1.5 border border-[#00B4DC] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00B4DC]">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00B4DC]" />
                            Läuft
                          </span>
                        )}
                        {cancelled && (
                          <span className="border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                            Fällt aus
                          </span>
                        )}
                      </div>
                      <div
                        className={`mt-1.5 text-[15px] font-semibold ${
                          cancelled ? "text-[#999] line-through" : "text-[#0a0a0a]"
                        }`}
                      >
                        {c.discipline}
                      </div>
                      {c.age && (
                        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#777]">
                          {c.age}
                        </div>
                      )}
                      {c.note && !cancelled && (
                        <div className="mt-2 text-xs text-[#555]">{c.note}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#e5e5e5] pt-6 md:flex-row md:items-center md:justify-between">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#777]">
            <Calendar className="h-3.5 w-3.5" />
            Personal Training nur nach Terminvereinbarung
          </p>
          <Link
            to="/schulordnung"
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#0a0a0a] underline-offset-4 hover:underline"
          >
            Regeln der Akademie – Schulordnung
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
