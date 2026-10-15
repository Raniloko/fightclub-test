import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroMobile from "@/assets/hero-mobile-v8.jpg";
import heroDesktop from "@/assets/hero-desktop-v8.jpg";

const DISCIPLINES = [
  "MMA",
  "K1 / Kickboxen",
  "Boxen",
  "Thaiboxen",
  "Wing Fight",
  "Self-Defense",
  "Kindertraining",
  "Frauenkurse",
];

const DISPLAY_FONT = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 } as const;

export function Hero() {
  const imgRef = useRef<HTMLImageElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);
  const gradRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const check = () => setEnabled(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!enabled) {
      [imgRef, smokeRef, gradRef, textRef].forEach((r) => {
        if (r.current) r.current.style.transform = "";
      });
      return;
    }
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (imgRef.current) imgRef.current.style.transform = `translate3d(0, ${y * 0.4}px, 0)`;
        if (smokeRef.current) smokeRef.current.style.transform = `translate3d(0, ${y * 0.6}px, 0)`;
        if (gradRef.current) gradRef.current.style.transform = `translate3d(0, ${y * 0.7}px, 0)`;
        if (textRef.current) textRef.current.style.transform = `translate3d(0, ${y * -0.15}px, 0)`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [enabled]);

  return (
    <section id="top" className="relative h-svh min-h-svh w-full overflow-hidden bg-black">
      {/* Only the image for the current breakpoint is downloaded */}
      <picture className="pointer-events-none absolute inset-0 z-0">
        <source media="(min-width: 1024px)" srcSet={heroDesktop} width={1376} height={768} />
        <img
          ref={imgRef}
          src={heroMobile}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          width={840}
          height={1184}
          className="h-full w-full object-cover object-[center_20%] lg:object-[center_45%]"
          style={{
            filter: "contrast(102%) brightness(1.1) saturate(1.05)",
            willChange: "transform",
          }}
        />
      </picture>

      {/* Smoke/fog layer */}
      <div
        ref={smokeRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 30% 70%, rgba(255,255,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.04) 0%, transparent 55%)",
          willChange: "transform",
        }}
      />

      <div
        ref={gradRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.05) 30%, rgba(10,10,10,0.35) 60%, rgba(10,10,10,0.8) 100%)",
          willChange: "transform",
        }}
      />

      <div className="absolute left-0 right-0 top-[112px] z-[3] flex justify-center px-6 md:top-[136px] md:px-12">
        <div className="fc-late fc-late-1 inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/60 bg-[#0a0a0a]/70 px-4 py-2 backdrop-blur-sm md:justify-center">
          <span className="fc-dot-cyan" aria-hidden="true" />
          <span
            className="text-[12px] uppercase tracking-[0.25em]"
            style={{
              color: "#C9A84C",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 700,
            }}
          >
            Seit 2021 · Jetzt als Fight Club Hanau
          </span>
        </div>
      </div>

      <div
        ref={textRef}
        className="relative z-[3] flex h-full w-full items-end"
        style={{ willChange: "transform" }}
      >
        <div className="mx-auto w-full max-w-[1200px] px-6 pb-[60px] md:px-12 md:text-center">
          <h1 className="sr-only">
            Fight Club Hanau – Kampfsport in Hanau: MMA, K1, Boxen, Thaiboxen, Self-Defense und
            Kindertraining ab 5 Jahren
          </h1>

          <div
            className="fc-late fc-late-3 flex flex-wrap gap-2 md:justify-center"
            aria-label="Disziplinen"
          >
            {DISCIPLINES.map((d) => (
              <span key={d} className="fc-tag" style={{ fontSize: "12px", padding: "6px 14px" }}>
                {d}
              </span>
            ))}
          </div>

          <div className="fc-late fc-late-4 mt-7 flex flex-col gap-3 sm:flex-row md:justify-center">
            <Link
              to="/probetraining"
              className="fc-btn-cyan inline-flex w-full items-center justify-center px-8 py-4 text-[14px] uppercase tracking-[0.15em] text-black sm:w-auto"
              style={DISPLAY_FONT}
            >
              Kostenlos probetrainieren
            </Link>
            <Link
              to="/"
              hash="stundenplan"
              className="inline-flex w-full items-center justify-center border border-white/70 bg-transparent px-8 py-4 text-[14px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white/10 sm:w-auto"
              style={DISPLAY_FONT}
            >
              Stundenplan ansehen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
