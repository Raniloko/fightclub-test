import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MatrixHeadline } from "./MatrixHeadline";
import heroMobileAsset from "@/assets/hero-mobile.jpg.asset.json";
import heroMainAsset from "@/assets/hero-main-v2.png.asset.json";



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
        width={1027}
        height={1531}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[88px] z-0 hidden w-full object-cover object-[center_top] md:block"
        style={{ filter: "grayscale(40%) contrast(115%) brightness(0.85)", willChange: "transform" }}
      />
      <img
        src={heroMainAsset.url}
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        width={1027}
        height={1531}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[76px] z-0 block w-full object-cover object-[center_top] md:hidden"
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
            "linear-gradient(180deg, rgba(0, 0, 0, 0.80) 0%, rgba(0, 0, 0, 0.55) 35%, rgba(0, 0, 0, 0.45) 65%, rgba(0, 0, 0, 0.70) 100%)",
          willChange: "transform",
        }}
      />

      <div ref={textRef} className="relative z-[3] flex h-full w-full items-end" style={{ willChange: "transform" }}>
        <div className="w-full px-6 pb-12 md:px-12 md:pb-16">
          <div className="flex items-center gap-3 fc-late fc-late-1">
            <span className="fc-badge-new">Neu in Hanau!!!</span>
          </div>

          <h1
            className="mt-6 font-display uppercase text-white"
            style={{
              fontSize: "clamp(30px, 5.6vw, 68px)",
              lineHeight: 0.95,
              fontWeight: 800,
              textShadow: "0 2px 40px rgba(0,0,0,0.5)",
            }}
          >
            <span className="sr-only">Fight Club Hanau — MMA & Kampfsport-Akademie. Werde zur besseren Version von dir selbst.</span>
            <MatrixHeadline
              className="block"
              text="WERDE ZUR BESSEREN VERSION VON DIR SELBST."
              startDelay={1.2}
            />
          </h1>

          <p
            className="mt-4 font-display uppercase fc-late fc-late-2"
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "clamp(18px, 3vw, 32px)",
              letterSpacing: "0.02em",
            }}
          >
            Werde ein Teil der Fight Club Familie.
          </p>

          <div className="mt-6 flex max-w-2xl flex-wrap gap-2 fc-late fc-late-3">
            {["MMA", "K1", "Boxen", "Thaiboxen", "Self-Defense", "Wing-Fight", "Kindertraining"].map((d) => (
              <span key={d} className="fc-tag">{d}</span>
            ))}
          </div>


          <div className="mt-8 flex flex-col gap-3 sm:flex-row fc-late fc-late-4">
            <Link
              to="/"
              hash="kontakt"
              className="fc-btn-cyan inline-flex items-center justify-center px-8 py-4 text-[14px] uppercase tracking-[0.15em] text-black"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
            >
              Jetzt einsteigen
            </Link>
            <Link
              to="/"
              hash="stundenplan"
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
