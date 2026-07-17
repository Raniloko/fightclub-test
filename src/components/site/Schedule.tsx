import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "./Reveal";
import { listSchedule, type ScheduleClass, type WeekDay } from "@/lib/schedule.functions";

const DAYS: WeekDay[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const DAY_LABELS: Record<WeekDay, string> = {
  MON: "Mo", TUE: "Di", WED: "Mi", THU: "Do", FRI: "Fr", SAT: "Sa", SUN: "So",
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

  const classes = allClasses
    .filter((c) => c.day === day)
    .sort((a, b) => a.sort_index - b.sort_index || a.start_time.localeCompare(b.start_time));
  const isToday = today === day;

  const isLive = (c: ScheduleClass) =>
    isToday && !c.cancelled_today && nowMin >= toMinutes(c.start_time) && nowMin < toMinutes(c.end_time);

  return (
    <section id="stundenplan" className="bg-[#f5f5f5] py-12 md:py-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#0a0a0a]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#555]">
              Wann trainierst du
            </span>
          </div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl">
            <span className="fc-headline-underline">Stundenplan</span>
          </h2>
        </Reveal>

        <div className="mt-10 flex gap-2 overflow-x-auto border-b border-[#e0e0e0] md:gap-8">
          {DAYS.map((d) => {
            const active = day === d;
            const isCurrent = today === d;
            return (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`relative shrink-0 px-3 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors md:px-2 ${
                  active ? "text-[#0a0a0a]" : "text-[#999] hover:text-[#0a0a0a]"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  {DAY_LABELS[d]}
                  {isCurrent && (
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00B4DC]" title="Heute" />
                  )}
                </span>
                {active && <span className="absolute inset-x-0 -bottom-px h-[3px] bg-[#00B4DC]" />}
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          {classes.length === 0 ? (
            <p className="py-12 text-center text-[15px] text-[#555]">Heute kein Training. Ruhetag.</p>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block">
                <div className="grid grid-cols-12 border-b border-[#e0e0e0] pb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#777]">
                  <div className="col-span-3">Zeit</div>
                  <div className="col-span-6">Disziplin</div>
                  <div className="col-span-3">Alter</div>
                </div>
                {classes.map((c) => {
                  const live = isLive(c);
                  const cancelled = isToday && c.cancelled_today;
                  return (
                    <div
                      key={c.id}
                      className={`relative grid grid-cols-12 items-center border-b border-[#e0e0e0] py-5 transition-colors ${
                        live ? "bg-[#00B4DC]/10 pl-3" : cancelled ? "bg-red-100/50" : "hover:bg-white"
                      }`}
                    >
                      {live && <span className="absolute inset-y-2 left-0 w-[3px] bg-[#00B4DC]" />}
                      <div className={`col-span-3 font-display text-2xl ${cancelled ? "line-through text-[#999]" : ""}`}>
                        {c.start_time}<span className="text-[#999]">–</span>{c.end_time}
                      </div>
                      <div className="col-span-6 text-[15px] font-medium">
                        <span className="inline-flex items-center gap-3 flex-wrap">
                          <span className={cancelled ? "line-through text-[#999]" : ""}>{c.discipline}</span>
                          {live && (
                            <span className="inline-flex items-center gap-1.5 border border-[#00B4DC] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00B4DC]">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00B4DC]" />
                              Läuft jetzt
                            </span>
                          )}
                          {cancelled && (
                            <span className="border border-red-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-600">
                              Fällt heute aus
                            </span>
                          )}
                          {c.note && !cancelled && (
                            <span className="text-xs text-[#555]">{c.note}</span>
                          )}
                        </span>
                      </div>
                      <div className="col-span-3 text-[13px] uppercase tracking-[0.1em] text-[#555]">
                        {c.age}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile */}
              <div className="space-y-3 md:hidden">
                {classes.map((c) => {
                  const live = isLive(c);
                  const cancelled = isToday && c.cancelled_today;
                  return (
                    <div
                      key={c.id}
                      className={`relative border p-5 ${
                        live ? "border-[#00B4DC] bg-[#00B4DC]/10" : cancelled ? "border-red-300 bg-red-100/50" : "border-[#e0e0e0] bg-white"
                      }`}
                    >
                      {live && <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00B4DC]" />}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className={`font-display text-2xl ${cancelled ? "line-through text-[#999]" : ""}`}>
                          {c.start_time}<span className="text-[#999]">–</span>{c.end_time}
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
                      <div className={`mt-2 text-[15px] font-semibold ${cancelled ? "line-through text-[#999]" : ""}`}>
                        {c.discipline}
                      </div>
                      {c.age && (
                        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#777]">{c.age}</div>
                      )}
                      {c.note && !cancelled && (
                        <div className="mt-2 text-xs text-[#555]">{c.note}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#777]">
          * Personal Training nur nach Terminvereinbarung
        </p>
      </div>
    </section>
  );
}
