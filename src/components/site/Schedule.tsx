import { useState } from "react";
import { Reveal } from "./Reveal";

type Cls = { time: string; disc: string; level: string; trainer: string };

const SCHEDULE: Record<string, Cls[]> = {
  MON: [
    { time: "07:00", disc: "Boxen", level: "Alle Level", trainer: "[Trainer]" },
    { time: "16:30", disc: "Kindertraining", level: "Kids", trainer: "[Trainer]" },
    { time: "18:00", disc: "Thaiboxen", level: "Einsteiger", trainer: "[Trainer]" },
    { time: "19:30", disc: "MMA", level: "Fortgeschritten", trainer: "[Trainer]" },
  ],
  TUE: [
    { time: "18:00", disc: "K1", level: "Alle Level", trainer: "[Trainer]" },
    { time: "19:30", disc: "Self-Defense", level: "Alle Level", trainer: "[Trainer]" },
  ],
  WED: [
    { time: "07:00", disc: "K1", level: "Alle Level", trainer: "[Trainer]" },
    { time: "16:30", disc: "Kindertraining", level: "Kids", trainer: "[Trainer]" },
    { time: "18:00", disc: "Boxen", level: "Einsteiger", trainer: "[Trainer]" },
    { time: "19:30", disc: "Thaiboxen", level: "Fortgeschritten", trainer: "[Trainer]" },
  ],
  THU: [
    { time: "18:00", disc: "MMA", level: "Einsteiger", trainer: "[Trainer]" },
    { time: "19:30", disc: "Wing-Fight", level: "Alle Level", trainer: "[Trainer]" },
  ],
  FRI: [
    { time: "07:00", disc: "MMA", level: "Alle Level", trainer: "[Trainer]" },
    { time: "16:30", disc: "Kindertraining", level: "Kids", trainer: "[Trainer]" },
    { time: "18:00", disc: "Self-Defense", level: "Einsteiger", trainer: "[Trainer]" },
    { time: "19:30", disc: "K1", level: "Fortgeschritten", trainer: "[Trainer]" },
    { time: "21:00", disc: "Freies Sparring", level: "Fortgeschritten", trainer: "[Trainer]" },
  ],
  SAT: [
    { time: "10:00", disc: "Thaiboxen", level: "Alle Level", trainer: "[Trainer]" },
    { time: "11:30", disc: "Boxen", level: "Einsteiger", trainer: "[Trainer]" },
    { time: "13:00", disc: "MMA / Sparring", level: "Fortgeschritten", trainer: "[Trainer]" },
  ],
  SUN: [],
};


const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;
const DAY_LABELS: Record<(typeof DAYS)[number], string> = {
  MON: "Mo",
  TUE: "Di",
  WED: "Mi",
  THU: "Do",
  FRI: "Fr",
  SAT: "Sa",
  SUN: "So",
};

export function Schedule() {
  const [day, setDay] = useState<(typeof DAYS)[number]>("MON");
  const classes = SCHEDULE[day];

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
          <h2 className="mt-4 font-display text-5xl md:text-7xl"><span className="fc-headline-underline">Stundenplan</span></h2>
        </Reveal>

        <div className="mt-10 flex gap-2 overflow-x-auto border-b border-[#e0e0e0] md:gap-8">
          {DAYS.map((d) => (
            <button
              key={d}
              onClick={() => setDay(d)}
              className={`relative shrink-0 px-3 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors md:px-2 ${
                day === d ? "text-[#0a0a0a]" : "text-[#999] hover:text-[#0a0a0a]"
              }`}
            >
              {DAY_LABELS[d]}
              {day === d && (
                <span className="absolute inset-x-0 -bottom-px h-[3px] bg-[#00B4DC]" />
              )}
            </button>
          ))}

        </div>

        <div className="mt-10">
          {classes.length === 0 ? (
            <p className="py-12 text-center text-[15px] text-[#555]">
              Heute kein Training. Ruhetag.
            </p>
          ) : (
            <>
              <div className="hidden md:block">
                <div className="grid grid-cols-12 border-b border-[#e0e0e0] pb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#777]">
                  <div className="col-span-2">Zeit</div>
                  <div className="col-span-4">Disziplin</div>
                  <div className="col-span-3">Level</div>
                  <div className="col-span-3">Trainer</div>
                </div>
                {classes.map((c, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-12 items-center border-b border-[#e0e0e0] py-5 transition-colors hover:bg-white"
                  >
                    <div className="col-span-2 font-display text-2xl">{c.time}</div>
                    <div className="col-span-4 text-[15px] font-medium">{c.disc}</div>
                    <div className="col-span-3 text-[13px] uppercase tracking-[0.1em] text-[#555]">
                      {c.level}
                    </div>
                    <div className="col-span-3 text-[13px] text-[#555]">{c.trainer}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 md:hidden">
                {classes.map((c, i) => (
                  <div key={i} className="border border-[#e0e0e0] bg-white p-5">
                    <div className="font-display text-2xl">{c.time}</div>
                    <div className="mt-2 text-[15px] font-semibold">{c.disc}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#777]">
                        {c.level}
                      </span>
                      <span className="text-[10px] text-[#bbb]">·</span>
                      <span className="text-[12px] text-[#555]">{c.trainer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
