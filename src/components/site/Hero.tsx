import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroMainAsset from "@/assets/hero-v7-mobile.png";
import heroWideAsset from "@/assets/hero-v7-desktop.jpg";



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
    <section
      id="top"
      className="relative h-svh min-h-svh w-full overflow-hidden bg-black"
    >
      <img
        ref={imgRef}
        src={heroWideAsset}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        width={1920}
        height={1080}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[160px] z-0 hidden h-[calc(100%-160px)] w-full object-cover object-[center_55%] lg:block"
        style={{ filter: "grayscale(10%) contrast(104%) brightness(1.12) saturate(1.05)", willChange: "transform" }}
      />


      <img
        src={heroMainAsset}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        width={840}
        height={1240}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[120px] z-0 block h-[calc(100%-120px)] w-full object-cover object-[center_top] md:top-[140px] md:h-[calc(100%-140px)] md:object-[center_30%] lg:hidden"
        style={{ filter: "contrast(102%) brightness(1.1) saturate(1.05)" }}
      />



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
            "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.85) 100%)",
          willChange: "transform",
        }}
      />

      <div ref={textRef} className="relative z-[3] flex h-full w-full items-end" style={{ willChange: "transform" }}>
        <div className="mx-auto w-full max-w-[1200px] px-6 pb-[56px] md:px-12 md:pb-[72px] md:text-center">
          <h1
            className="fc-late fc-late-1 text-white md:mx-auto"
            style={{ fontSize: "clamp(44px, 7.5vw, 96px)", lineHeight: 0.9, textWrap: "balance" }}
          >
            Dein erstes Training ist kostenlos
          </h1>

          <p className="fc-late fc-late-2 mt-5 max-w-[34ch] text-[16px] leading-relaxed text-white/85 md:mx-auto md:text-[18px]">
            Kampfsport in Hanau für Kinder ab 5, Jugendliche und Erwachsene. Komm vorbei und
            probier es unverbindlich aus.
          </p>

          <div className="fc-late fc-late-3 mt-8 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center md:justify-center">
            <Link
              to="/probetraining"
              className="fc-btn-cyan fc-hero-cta inline-flex items-center justify-center px-10 py-5 text-[17px] uppercase tracking-[0.12em] text-black md:text-[19px]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
            >
              Probetraining sichern
            </Link>
            <Link
              to="/"
              hash="stundenplan"
              className="text-center text-[15px] text-white/85 underline decoration-white/40 underline-offset-[6px] transition-colors hover:text-white hover:decoration-white"
            >
              Stundenplan ansehen
            </Link>
          </div>
        </div>
      </div>


    </section>
  );
}
