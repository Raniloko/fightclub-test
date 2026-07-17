import { useEffect, useState } from "react";

// Tag der offenen Tür — Samstag, 15. August 2026, 10:00–15:00 Uhr
const EVENT_END = new Date("2026-08-15T23:59:59+02:00").getTime();

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const diff = Math.max(0, EVENT_END - now);
  const days = Math.floor(diff / 86_400_000);
  return { diff, days };
}

export function OpenDayBar() {
  const { diff, days } = useCountdown();

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (diff <= 0) {
      document.documentElement.classList.remove("fc-has-openday-bar");
      return;
    }
    document.documentElement.classList.add("fc-has-openday-bar");
    return () => document.documentElement.classList.remove("fc-has-openday-bar");
  }, [diff]);

  if (diff <= 0) return null;
  return (
    <a
      href="#tag-der-offenen-tuer"
      className="fc-openday-bar fixed inset-x-0 top-0 z-[55] block w-full bg-[#c8102e] text-white transition-colors hover:bg-[#a80d26]"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] sm:gap-4 sm:text-[12px]">
        <span className="hidden sm:inline">🥊</span>
        <span>
          Große Neueröffnung · Tag der offenen Tür · Sa. 15. August 2026
        </span>
        <span className="hidden rounded-full bg-black/25 px-2 py-0.5 text-[10px] tracking-[0.2em] sm:inline">
          {days === 0 ? "HEUTE" : `Noch ${days} ${days === 1 ? "Tag" : "Tage"}`}
        </span>
        <span className="hidden text-[10px] tracking-[0.2em] underline underline-offset-4 md:inline">
          Mehr erfahren →
        </span>
      </div>
    </a>
  );
}

export function OpenDaySection() {
  const { diff, days } = useCountdown();
  if (diff <= 0) return null;

  const highlights = [
    { icon: "🥋", text: "Kostenloses Kindertraining zum Mitmachen" },
    { icon: "👊", text: "Vorführungen unserer Kindergruppen" },
    { icon: "🎁", text: "Viele Überraschungen für Groß & Klein" },
    { icon: "🎉", text: "Spiel, Spaß & Action für die ganze Familie" },
    { icon: "💬", text: "Eltern können sich informieren & Fragen stellen" },
    { icon: "⭐", text: "Spezielle Preise für neue Anmeldungen – nur an diesem Tag" },
  ];

  const disciplines = [
    "MMA",
    "Boxen",
    "Thaiboxen",
    "K1",
    "Kickboxen",
    "Wing Fight",
    "Self Defense",
    "Frauen Kurse",
    "Fighter Fitness",
  ];

  return (
    <section
      id="tag-der-offenen-tuer"
      className="relative overflow-hidden bg-[#0a0a0a] text-white"
    >
      {/* dramatic red diagonal */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 500px at 15% 0%, rgba(200,16,46,0.35), transparent 60%), radial-gradient(900px 500px at 90% 100%, rgba(200,16,46,0.25), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-10 top-10 h-3 w-[60%] -rotate-3 bg-[#c8102e]/80"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-10 h-2 w-[45%] rotate-2 bg-[#c8102e]/60"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="flex flex-col items-start gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c8102e]/60 bg-[#c8102e]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#ff5b70]">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#ff5b70]" />
            {days === 0 ? "Heute!" : `Noch ${days} ${days === 1 ? "Tag" : "Tage"}`}
          </span>
          <h2 className="font-display text-[44px] leading-[0.9] uppercase tracking-tight sm:text-6xl md:text-[88px]">
            Große <span className="text-[#c8102e]">Neueröffnung</span>
            <br />
            Tag der offenen Tür
          </h2>
          <p className="mt-2 max-w-2xl text-[13px] uppercase tracking-[0.3em] text-white/70">
            Samstag · 15. August 2026 · 10:00 – 15:00 Uhr · Eintritt kostenlos
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
          {/* Highlights */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff5b70]">
              Was dich erwartet
            </div>
            <ul className="mt-5 space-y-3">
              {highlights.map((h) => (
                <li
                  key={h.text}
                  className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white/90 transition-colors hover:border-[#c8102e]/60 hover:bg-[#c8102e]/10"
                >
                  <span aria-hidden className="text-lg leading-none">{h.icon}</span>
                  <span>{h.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disciplines & CTA */}
          <div className="flex flex-col gap-8">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
              <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#ff5b70]">
                Neu im Fight Club Hanau
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {disciplines.map((d) => (
                  <span
                    key={d}
                    className="rounded-full border border-white/15 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.15em] text-white/90"
                  >
                    {d}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-xl bg-[#c8102e] px-5 py-4 text-center">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
                  Nur am 15.08.2026
                </div>
                <div className="mt-1 font-display text-2xl uppercase leading-tight md:text-3xl">
                  Spezielle Preise für neue Anmeldungen
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="#kontakt"
                className="inline-flex flex-1 items-center justify-center rounded-md bg-[#c8102e] px-6 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#a80d26]"
              >
                Vorbeikommen
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Geleitstra%C3%9Fe+66,+63456+Hanau"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center rounded-md border border-white/25 px-6 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/10"
              >
                Route planen
              </a>
            </div>

            <div className="text-[11px] uppercase tracking-[0.2em] text-white/60">
              Geleitstraße 66 · 63456 Hanau
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
