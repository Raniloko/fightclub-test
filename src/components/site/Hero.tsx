import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MatrixHeadline } from "./MatrixHeadline";
import heroMobileAsset from "@/assets/hero-mobile.jpg.asset.json";
import heroMainAsset from "@/assets/hero-main-v2.png.asset.json";
import heroWideAsset from "@/assets/hero-desktop-v2.jpg.asset.json";



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
        width={1600}
        height={1100}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[112px] z-0 hidden h-[calc(100%-112px)] w-full object-cover object-[center_35%] md:block"
        style={{ filter: "grayscale(10%) contrast(104%) brightness(1.32) saturate(1.05)", willChange: "transform" }}
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
            "linear-gradient(180deg, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.25) 35%, rgba(0, 0, 0, 0.20) 65%, rgba(0, 0, 0, 0.50) 100%)",
          willChange: "transform",
        }}
      />

      <div ref={textRef} className="relative z-[3] flex h-full w-full items-end" style={{ willChange: "transform" }}>
        <div className="mx-auto w-full max-w-[1200px] px-6 pb-12 md:px-12 md:pb-20 md:text-center">
          <div className="flex items-center gap-3 fc-late fc-late-1 md:justify-center">
            <span className="fc-badge-new">Neu in Hanau!!!</span>
          </div>

          <h1
            className="mt-6 max-w-full uppercase text-white [overflow-wrap:anywhere]"
            style={{
              fontFamily: '"Permanent Marker", "Barlow Condensed", system-ui, sans-serif',
              fontSize: "clamp(24px, 5.2vw, 74px)",
              lineHeight: 1.05,
              fontWeight: 400,
              letterSpacing: "0.005em",
              textShadow: "0 2px 40px rgba(0,0,0,0.5)",
            }}
          >
            <span className="sr-only">Fight Club Hanau — MMA & Kampfsport-Akademie. Werde zur besseren Version von dir selbst.</span>
            <MatrixHeadline
              className="block"
              text="WERDE ZUR BESSEREN VERSION VON DIR SELBST"
              startDelay={2.7}
            />
            <span className="fc-slogan-underline fc-late fc-late-1 mt-3 block md:mx-auto" />
          </h1>

          <div className="mt-6 flex max-w-2xl flex-wrap gap-2 fc-late fc-late-3 md:mx-auto md:justify-center">
            {["MMA", "K1 / Kickboxen", "Boxen", "Thaiboxen", "Wing Fight / Selfdefense", "Kindertraining", "Submission Grappling", "Wettkampf-Boxen", "Kickboxen & Boxen für Frauen", "Personal Training"].map((d) => (
              <span key={d} className="fc-tag fc-tag-red">{d}</span>
            ))}
          </div>


          <div className="mt-8 flex flex-col gap-3 sm:flex-row fc-late fc-late-4 md:justify-center">

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
