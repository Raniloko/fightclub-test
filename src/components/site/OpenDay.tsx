import { useEffect, useState } from "react";
import flyerAsset from "@/assets/openday-flyer.jpg.asset.json";

// Tag der offenen Tür — Samstag, 15. August 2026
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
  const { diff } = useCountdown();
  if (diff <= 0) return null;

  return (
    <section
      id="tag-der-offenen-tuer"
      className="relative overflow-hidden bg-[#0a0a0a] py-12 md:py-20"
    >
      <div className="mx-auto max-w-[900px] px-4 md:px-8">
        <a
          href={flyerAsset.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/10 transition-transform hover:scale-[1.01]"
        >
          <img
            src={flyerAsset.url}
            alt="Große Neueröffnung — Tag der offenen Tür am Samstag, 15. August 2026, 10–15 Uhr im Fight Club Hanau"
            className="block h-auto w-full"
            loading="lazy"
          />
        </a>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center rounded-md bg-[#c8102e] px-6 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#a80d26]"
          >
            Vorbeikommen
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Geleitstra%C3%9Fe+66,+63456+Hanau"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-white/25 px-6 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/10"
          >
            Route planen
          </a>
        </div>
      </div>
    </section>
  );
}
