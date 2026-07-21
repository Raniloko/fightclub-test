import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import heroMobileAsset from "@/assets/hero-mobile.jpg.asset.json";

const EVENT_DATE = new Date("2026-08-15T00:00:00+02:00").getTime();

function useDaysUntilEvent() {
  const [days, setDays] = useState(() =>
    Math.max(0, Math.ceil((EVENT_DATE - Date.now()) / 86_400_000))
  );
  useEffect(() => {
    const id = window.setInterval(
      () => setDays(Math.max(0, Math.ceil((EVENT_DATE - Date.now()) / 86_400_000))),
      60_000
    );
    return () => window.clearInterval(id);
  }, []);
  return days;
}

const DISCIPLINES = ["MMA", "K1", "BOXEN", "THAIBOXEN", "SELF-DEFENSE", "WING-FIGHT"];
const TICKER = [
  { n: "300+", l: "Mitglieder" },
  { n: "8", l: "Trainer" },
  { n: "40+", l: "Einheiten / Woche" },
  { n: "2025", l: "Gegründet" },
];

export function Hero() {
  const days = useDaysUntilEvent();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 800], [0, 240]);
  const smokeY = useTransform(scrollY, [0, 800], [0, 360]);
  const textY = useTransform(scrollY, [0, 800], [0, -80]);

  const fadeUp = (delay = 0) =>
    reduce
      ? { initial: false, animate: {} }
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section
      id="top"
      className="relative h-svh min-h-svh w-full overflow-hidden bg-black"
    >
      <motion.img
        src="/kids-hero.jpg"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        width={1920}
        height={1080}
        style={{ y: reduce ? 0 : imgY, filter: "grayscale(40%) contrast(115%) brightness(0.75)" }}
        className="pointer-events-none absolute inset-0 z-0 hidden h-[115%] w-full object-cover object-[center_top] md:block"
      />
      <motion.img
        src={heroMobileAsset.url}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        width={800}
        height={1200}
        style={{ y: reduce ? 0 : imgY, filter: "contrast(110%) brightness(0.8)" }}
        className="pointer-events-none absolute inset-0 z-0 block h-[115%] w-full object-cover object-center md:hidden"
      />

      {/* Dark overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.75) 80%, rgba(0,0,0,0.92) 100%)",
        }}
      />

      {/* Smoke */}
      <motion.div
        aria-hidden="true"
        style={{ y: reduce ? 0 : smokeY }}
        className="pointer-events-none absolute inset-0 z-[2]"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 25% 70%, rgba(255,255,255,0.07) 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, rgba(255,255,255,0.05) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: reduce ? 0 : textY }}
        className="relative z-[3] flex h-full w-full flex-col"
      >
        <div className="flex flex-1 items-center">
          <div className="w-full px-6 pt-24 md:px-12 md:pt-28">
            <motion.a
              {...fadeUp(0.05)}
              href="#tag-der-offenen-tuer"
              className="group inline-flex items-center gap-2 rounded-full bg-[#c8102e] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_10px_30px_-10px_rgba(200,16,46,0.7)] transition-colors hover:bg-[#a80d26] sm:text-[12px]"
            >
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white" />
              <span>
                Tag der offenen Tür · Sa. 15. August 2026 ·{" "}
                <span className="font-bold">
                  {days === 0 ? "Heute" : `Noch ${days} ${days === 1 ? "Tag" : "Tage"}`}
                </span>
              </span>
            </motion.a>

            <motion.h1
              {...fadeUp(0.15)}
              className="mt-6 font-display uppercase text-white"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(60px, 12vw, 168px)",
                lineHeight: 0.88,
                letterSpacing: "0.01em",
                textShadow: "0 4px 40px rgba(0,0,0,0.6)",
              }}
            >
              Fight Club<br />Hanau
            </motion.h1>

            <motion.p
              {...fadeUp(0.3)}
              className="mt-6 max-w-3xl text-[12px] font-medium uppercase tracking-[0.22em] text-white/80 sm:text-[14px]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {DISCIPLINES.join("  ·  ")}
            </motion.p>

            <motion.div {...fadeUp(0.45)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#kontakt"
                className="inline-flex items-center justify-center rounded-md bg-[#c8102e] px-8 py-4 text-[13px] uppercase tracking-[0.18em] text-white shadow-[0_16px_40px_-12px_rgba(200,16,46,0.75)] transition-all hover:-translate-y-0.5 hover:bg-[#a80d26]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
              >
                Erstes Training kostenlos
              </a>
              <a
                href="#stundenplan"
                className="inline-flex items-center justify-center rounded-md border-2 px-8 py-4 text-[13px] uppercase tracking-[0.18em] text-white transition-all hover:-translate-y-0.5 hover:bg-white/10"
                style={{
                  borderColor: "rgba(255,255,255,0.55)",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                }}
              >
                Stundenplan ansehen
              </a>
            </motion.div>
          </div>
        </div>

        {/* Stats ticker */}
        <motion.div
          {...fadeUp(0.6)}
          className="relative z-[3] border-t border-white/15 bg-black/45 backdrop-blur-sm"
        >
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-center gap-x-6 gap-y-2 px-6 py-4 text-white md:px-12">
            {TICKER.map((s, i) => (
              <div key={s.l} className="flex items-center gap-3">
                <span
                  className="text-[18px] font-bold text-[#00B4DC] md:text-[22px]"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}
                >
                  {s.n}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/80 md:text-[11px]">
                  {s.l}
                </span>
                {i < TICKER.length - 1 && (
                  <span aria-hidden="true" className="ml-3 hidden h-4 w-px bg-white/25 md:inline-block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <a
        href="#disziplinen"
        aria-label="Nach unten scrollen"
        className="group absolute bottom-24 right-5 z-[4] hidden flex-col items-center gap-3 text-white/70 transition-colors hover:text-white md:flex"
      >
        <span
          className="rotate-90 text-[10px] uppercase tracking-[0.35em]"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Scroll
        </span>
        <span className="relative block h-14 w-px bg-white/40">
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-white"
            animate={reduce ? {} : { y: [0, 44, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </a>
    </section>
  );
}
