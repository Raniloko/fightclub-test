import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import heroMobileAsset from "@/assets/hero-mobile.jpg.asset.json";
import heroMainAsset from "@/assets/hero-main.png.asset.json";



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
        src={heroMainAsset.url}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        width={1920}
        height={1080}
        className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full object-cover object-[center_top] md:block"
        style={{ filter: "grayscale(40%) contrast(115%) brightness(0.85)", willChange: "transform" }}
      />
      <img
        src={heroMobileAsset.url}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        width={800}
        height={1200}
        className="pointer-events-none absolute inset-0 z-0 block h-full w-full object-cover object-center md:hidden"
        style={{ filter: "contrast(110%) brightness(0.9)" }}
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
            "linear-gradient(180deg, rgba(20, 20, 20, 0.85) 0%, rgba(60, 60, 60, 0.60) 30%, rgba(120, 120, 120, 0.40) 60%, rgba(200, 200, 200, 0.20) 85%, rgba(255, 255, 255, 0.05) 100%)",
          willChange: "transform",
        }}
      />

      <div ref={textRef} className="relative z-[3] flex h-full w-full items-end" style={{ willChange: "transform" }}>
        <div className="w-full px-6 pb-12 md:px-12 md:pb-16 fc-stagger">
          <div className="flex items-center gap-3">
            <span className="fc-badge-new">Neu in Hanau!!!</span>
          </div>

          <h1
            className="mt-6 font-display uppercase text-white"
            style={{
              fontSize: "clamp(52px, 10vw, 120px)",
              lineHeight: 0.9,
              fontWeight: 800,
              textShadow: "0 2px 40px rgba(0,0,0,0.5)",
            }}
          >
            <span className="sr-only">Fight Club Hanau — MMA & Kampfsport-Akademie. </span>
            <span aria-hidden="true" className="block">Kein Sport.</span>
            <span aria-hidden="true" className="block">Ein Lebensstil.</span>
          </h1>

          <div className="mt-6 flex max-w-2xl flex-wrap gap-2">
            {["MMA", "K1", "Boxen", "Thaiboxen", "Self-Defense", "Wing-Fight", "Kindertraining"].map((d) => (
              <span key={d} className="fc-tag">{d}</span>
            ))}
          </div>


          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/kontakt"
              className="fc-btn-cyan inline-flex items-center justify-center px-8 py-4 text-[14px] uppercase tracking-[0.15em] text-black"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
            >
              Jetzt einsteigen
            </Link>
            <Link
              to="/stundenplan"
              className="fc-btn-ghost inline-flex items-center justify-center border-2 px-8 py-4 text-[14px] uppercase tracking-[0.15em] text-white"
              style={{
                borderColor: "rgba(255,255,255,0.5)",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
              }}
            >
              Stundenplan
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
