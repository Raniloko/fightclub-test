import { useEffect, useMemo, useState } from "react";
import opendayFlyerNewAsset from "@/assets/openday-flyer-2026.jpg.asset.json";

const TARGET = new Date("2026-08-29T10:00:00+02:00").getTime();

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function getParts(): Parts {
  const diff = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function FlipCell({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        key={padded}
        className="fc-flip min-w-[62px] border border-[#C9A84C]/40 bg-[#141414] px-3 py-3 font-display text-3xl tabular-nums text-[#C9A84C] md:min-w-[86px] md:px-5 md:py-4 md:text-5xl"
        style={{ transformOrigin: "center top" }}
      >
        {padded}
      </div>
      <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/60 md:text-[11px]">
        {label}
      </span>
    </div>
  );
}

function Countdown() {
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    setParts(getParts());
    const id = setInterval(() => setParts(getParts()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!parts) return null;

  return (
    <div className="mt-9 flex items-end justify-center gap-3 md:gap-5">
      <FlipCell value={parts.days} label="Tage" />
      <FlipCell value={parts.hours} label="Stunden" />
      <FlipCell value={parts.minutes} label="Minuten" />
      <FlipCell value={parts.seconds} label="Sekunden" />
    </div>
  );
}

function Sparkles({ count = 10 }: { count?: number }) {
  const sparkles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 1.8,
        duration: 1.5 + Math.random() * 0.5,
        size: 10 + Math.random() * 12,
      })),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="fc-sparkle"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            fontSize: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}

export function OpenDayBar() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.add("fc-has-openday-bar");
    const el = document.querySelector<HTMLElement>(".fc-openday-bar");
    const sync = () => {
      if (el) {
        document.documentElement.style.setProperty(
          "--fc-openday-h",
          `${el.offsetHeight}px`,
        );
      }
    };
    sync();
    window.addEventListener("resize", sync);
    return () => {
      document.documentElement.classList.remove("fc-has-openday-bar");
      document.documentElement.style.removeProperty("--fc-openday-h");
      window.removeEventListener("resize", sync);
    };
  }, []);

  return (
    <a
      href="#tag-der-offenen-tuer"
      className="fc-openday-bar fixed inset-x-0 top-0 z-[55] flex h-[36px] w-full items-center justify-center overflow-hidden text-white"
      style={{ background: "linear-gradient(90deg, #8B0A1A, #C8102E, #8B0A1A)" }}
    >
      <span className="hidden whitespace-nowrap px-4 text-center text-[12px] font-semibold uppercase tracking-[0.2em] md:block">
        Große Neueröffnung · 29. August 2026 · 10–18 Uhr
      </span>
      <span className="whitespace-nowrap px-4 text-center text-[12px] font-semibold uppercase tracking-[0.2em] md:hidden">
        Große Neueröffnung · 29. August
      </span>
    </a>
  );
}

export function OpenDaySection() {
  return (
    <section
      id="tag-der-offenen-tuer"
      className="fc-shimmer-border relative scroll-mt-36 overflow-hidden bg-[#0a0a0a] py-14 md:py-24"
    >
      <Sparkles />
      <div className="relative z-[1] mx-auto max-w-[900px] px-4 text-center md:px-8">
        <div className="flex items-center justify-center gap-3">
          <span className="block h-px w-8 bg-[#C9A84C]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
            Tag der offenen Tür
          </span>
          <span className="block h-px w-8 bg-[#C9A84C]" />
        </div>
        <h2 className="mt-5 font-display text-4xl text-white normal-case md:text-6xl">
          Große Neueröffnung
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] text-white/70 md:text-[17px]">
          Samstag, 29. August 2026 · 10:00 – 18:00 Uhr. Komm vorbei, lerne unsere Akademie kennen
          und probiere die Kampfsportarten direkt vor Ort aus.
        </p>

        <Countdown />

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center rounded-md bg-[#c8102e] px-6 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#a80d26]"
          >
            Kontakt aufnehmen
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

        <div className="mt-12 flex justify-center">
          <img
            src={opendayFlyerNewAsset.url}
            alt="Flyer für die große Neueröffnung und den Tag der offenen Tür im Fight Club Hanau am 29.08.2026"
            loading="lazy"
            className="fc-gold-glow w-full max-w-[650px] rounded-md"
            width={874}
            height={1295}
          />
        </div>
      </div>
    </section>
  );
}
