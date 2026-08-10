import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroMainAsset from "@/assets/hero-v4-mobile.png.asset.json";
import heroWideAsset from "@/assets/hero-v4-desktop.jpg.asset.json";



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
        src={heroWideAsset.url}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        width={1920}
        height={1152}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[112px] z-0 hidden h-[calc(100%-112px)] w-full object-cover object-[center_45%] md:block"
        style={{ filter: "grayscale(10%) contrast(104%) brightness(1.32) saturate(1.05)", willChange: "transform" }}
      />


      <img
        src={heroMainAsset.url}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        width={1209}
        height={1471}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[76px] z-0 block h-[calc(100%-76px)] w-full object-cover object-[center_top] md:hidden"
        style={{ filter: "contrast(102%) brightness(1.3) saturate(1.05)" }}
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
            "linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.2) 30%, rgba(10,10,10,0.65) 75%, rgba(10,10,10,0.9) 100%)",
          willChange: "transform",
        }}
      />

      <div className="absolute left-0 right-0 top-[32%] z-[3] flex justify-center px-6 md:top-[160px] md:px-12">
        <div className="fc-late fc-late-1 inline-flex items-center gap-2 rounded-full border border-[#C9A84C]/60 bg-[#0a0a0a]/70 px-4 py-2 backdrop-blur-sm md:justify-center">
          <span className="fc-dot-cyan" aria-hidden="true" />
          <span
            className="text-[12px] uppercase tracking-[0.25em]"
            style={{ color: "#C9A84C", fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
          >
            Neu in Hanau · Kampfsport Akademie
          </span>
        </div>
      </div>

      <div ref={textRef} className="relative z-[3] flex h-full w-full items-end" style={{ willChange: "transform" }}>
        <div className="mx-auto w-full max-w-[1200px] px-6 pb-[60px] md:px-12 md:text-center">
          <h1 className="sr-only">
            Fight Club Hanau — MMA &amp; Kampfsport-Akademie. Werde zur besseren Version von dir selbst.
          </h1>

          <div className="fc-late fc-late-3 flex flex-wrap gap-2 md:justify-center">
            {["MMA", "K1 / Kickboxen", "Boxen", "Thaiboxen", "Wing Fight", "Self Defense", "Kindertraining", "Frauenkurse"].map((d) => (
              <span key={d} className="fc-tag" style={{ fontSize: "12px", padding: "6px 14px" }}>
                {d}
              </span>
            ))}
          </div>

          <div className="fc-late fc-late-4 mt-6 flex flex-col gap-3 sm:flex-row md:justify-center">
            <Link
              to="/"
              hash="kontakt"
              className="fc-btn-cyan inline-flex w-full items-center justify-center px-8 py-4 text-[14px] uppercase tracking-[0.15em] text-black sm:w-auto"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
            >
              Jetzt einsteigen
            </Link>
            <Link
              to="/"
              hash="stundenplan"
              className="inline-flex w-full items-center justify-center border border-white/70 bg-transparent px-8 py-4 text-[14px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white/10 sm:w-auto"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
            >
              Stundenplan
            </Link>
          </div>
        </div>
      </div>


    </section>
  );
}
