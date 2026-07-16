import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";

type Cls = {
  start: string; // "HH:MM"
  end: string;   // "HH:MM"
  disc: string;
  age: string;
};

const SCHEDULE: Record<string, Cls[]> = {
  MON: [
    { start: "16:00", end: "16:40", disc: "Mini-Thaiboxen", age: "3–6 Jahre" },
    { start: "16:50", end: "17:50", disc: "Kids-Thaiboxen", age: "7–10 Jahre" },
    { start: "18:00", end: "19:00", disc: "Teens-Thaiboxen", age: "11–15 Jahre" },
    { start: "19:00", end: "20:30", disc: "K1 / Kickboxen", age: "ab 16 Jahre" },
    { start: "19:00", end: "20:30", disc: "Thaiboxen", age: "ab 16 Jahre" },
  ],
  TUE: [
    { start: "16:00", end: "16:40", disc: "Mini-Wing-Fight", age: "3–6 Jahre" },
    { start: "16:50", end: "17:50", disc: "Kids-Wing-Fight", age: "7–10 Jahre" },
    { start: "18:00", end: "19:00", disc: "Teens-Wing-Fight", age: "11–15 Jahre" },
    { start: "18:00", end: "19:00", disc: "Boxen-Teens", age: "11–15 Jahre" },
    { start: "19:00", end: "20:30", disc: "Self-Defense / Wing-Fight", age: "ab 16 Jahre" },
    { start: "19:30", end: "21:00", disc: "MMA-Grappling", age: "ab 16 Jahre" },
    { start: "19:45", end: "21:15", disc: "Boxen", age: "ab 16 Jahre" },
  ],
  WED: [
    { start: "16:00", end: "16:40", disc: "Mini-Kickboxen", age: "3–6 Jahre" },
    { start: "16:50", end: "17:50", disc: "Kids-Kickboxen", age: "7–10 Jahre" },
    { start: "18:00", end: "19:00", disc: "Teens-Kickboxen", age: "11–15 Jahre" },
    { start: "19:00", end: "20:30", disc: "K1 / Kickboxen", age: "ab 16 Jahre" },
    { start: "19:00", end: "20:30", disc: "Fighter-Fitness", age: "ab 16 Jahre" },
  ],
  THU: [
    { start: "16:00", end: "16:40", disc: "Mini-Wing-Fight", age: "3–6 Jahre" },
    { start: "16:50", end: "17:50", disc: "Kids-Wing-Fight", age: "7–10 Jahre" },
    { start: "18:00", end: "19:00", disc: "Teens-Wing-Fight", age: "11–15 Jahre" },
    { start: "19:00", end: "20:30", disc: "Self-Defense / Wing-Fight", age: "ab 16 Jahre" },
    { start: "19:00", end: "20:30", disc: "Thaiboxen", age: "ab 16 Jahre" },
    { start: "19:30", end: "21:00", disc: "MMA-Grappling", age: "ab 16 Jahre" },
  ],
  FRI: [
    { start: "16:00", end: "16:40", disc: "Mini-Kickboxen", age: "3–6 Jahre" },
    { start: "16:50", end: "17:50", disc: "Kids-Kickboxen", age: "7–10 Jahre" },
    { start: "18:00", end: "19:00", disc: "Teens-Kickboxen", age: "11–15 Jahre" },
    { start: "19:00", end: "20:30", disc: "K1 / Kickboxen", age: "ab 16 Jahre" },
    { start: "19:45", end: "21:15", disc: "Boxen (Wettkampf)", age: "ab 16 Jahre" },
  ],
  SAT: [
    { start: "11:00", end: "12:30", disc: "Kick-Boxen Frauen", age: "ab 14 Jahre" },
    { start: "11:00", end: "13:00", disc: "Boxen", age: "ab 16 Jahre" },
    { start: "13:00", end: "22:00", disc: "Personal Training (Termin*)", age: "ab 16 Jahre" },
  ],
  SUN: [
    { start: "11:00", end: "12:30", disc: "Personal Training (Termin*)", age: "ab 14 Jahre" },
    { start: "11:00", end: "13:00", disc: "Personal Training (Termin*)", age: "ab 16 Jahre" },
    { start: "13:00", end: "22:00", disc: "Personal Training (Termin*)", age: "" },
  ],
};

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
type Day = (typeof DAYS)[number];

const DAY_LABELS: Record<Day, string> = {
  MON: "Mo", TUE: "Di", WED: "Mi", THU: "Do", FRI: "Fr", SAT: "Sa", SUN: "So",
};

// JS getDay(): 0=Sun..6=Sat  ->  our keys
const JS_DAY_TO_KEY: Day[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export function Schedule() {
  const [today, setToday] = useState<Day | null>(null);
  const [nowMin, setNowMin] = useState<number>(0);
  const [day, setDay] = useState<Day>("MON");

  useEffect(() => {
    const update = () => {
      const d = new Date();
      const key = JS_DAY_TO_KEY[d.getDay()];
      setToday(key);
      setNowMin(d.getHours() * 60 + d.getMinutes());
    };
    update();
    setDay(JS_DAY_TO_KEY[new Date().getDay()]);
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, []);

  const classes = SCHEDULE[day];
  const isToday = today === day;

  const isLive = (c: Cls) =>
    isToday && nowMin >= toMinutes(c.start) && nowMin < toMinutes(c.end);

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
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full bg-[#00B4DC]"
                      title="Heute"
                    />
                  )}
                </span>
                {active && (
                  <span className="absolute inset-x-0 -bottom-px h-[3px] bg-[#00B4DC]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          {classes.length === 0 ? (
            <p className="py-12 text-center text-[15px] text-[#555]">
              Heute kein Training. Ruhetag.
            </p>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block">
                <div className="grid grid-cols-12 border-b border-[#e0e0e0] pb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#777]">
                  <div className="col-span-3">Zeit</div>
                  <div className="col-span-6">Disziplin</div>
                  <div className="col-span-3">Alter</div>
                </div>
                {classes.map((c, i) => {
                  const live = isLive(c);
                  return (
                    <div
                      key={i}
                      className={`relative grid grid-cols-12 items-center border-b border-[#e0e0e0] py-5 transition-colors ${
                        live
                          ? "bg-[#00B4DC]/10 pl-3"
                          : "hover:bg-white"
                      }`}
                    >
                      {live && (
                        <span className="absolute inset-y-2 left-0 w-[3px] bg-[#00B4DC]" />
                      )}
                      <div className="col-span-3 font-display text-2xl">
                        {c.start}<span className="text-[#999]">–</span>{c.end}
                      </div>
                      <div className="col-span-6 text-[15px] font-medium">
                        <span className="inline-flex items-center gap-3">
                          {c.disc}
                          {live && (
                            <span className="inline-flex items-center gap-1.5 border border-[#00B4DC] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00B4DC]">
                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00B4DC]" />
                              Läuft jetzt
                            </span>
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
                {classes.map((c, i) => {
                  const live = isLive(c);
                  return (
                    <div
                      key={i}
                      className={`relative border p-5 ${
                        live
                          ? "border-[#00B4DC] bg-[#00B4DC]/10"
                          : "border-[#e0e0e0] bg-white"
                      }`}
                    >
                      {live && (
                        <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00B4DC]" />
                      )}
                      <div className="flex items-center justify-between">
                        <div className="font-display text-2xl">
                          {c.start}<span className="text-[#999]">–</span>{c.end}
                        </div>
                        {live && (
                          <span className="inline-flex items-center gap-1.5 border border-[#00B4DC] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00B4DC]">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00B4DC]" />
                            Läuft
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-[15px] font-semibold">{c.disc}</div>
                      {c.age && (
                        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#777]">
                          {c.age}
                        </div>
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
