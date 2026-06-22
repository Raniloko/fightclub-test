import { useEffect, useRef, useState } from "react";

const IMG_A =
  "https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg?auto=compress&cs=tinysrgb&w=800";
const IMG_B =
  "https://images.pexels.com/photos/4761779/pexels-photo-4761779.jpeg?auto=compress&cs=tinysrgb&w=800";
const IMG_C =
  "https://images.pexels.com/photos/6998855/pexels-photo-6998855.jpeg?auto=compress&cs=tinysrgb&w=800";

const WORDS = ["BLOCK.", "WARTE.", "TRIFF."];

export function BoxerScroll() {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0); // 0..1 across the pinned region

  useEffect(() => {
    const onScroll = () => {
      const el = outerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Pinned travel distance = outer height - vh
      const travel = el.offsetHeight - vh;
      const scrolled = Math.min(Math.max(-rect.top, 0), travel);
      setProgress(travel > 0 ? scrolled / travel : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Opacity per image based on progress
  const opA = progress < 0.33 ? 1 : progress < 0.5 ? 1 - (progress - 0.33) / 0.17 : 0;
  const opB =
    progress < 0.33
      ? Math.max(0, (progress - 0.16) / 0.17)
      : progress < 0.66
        ? 1
        : Math.max(0, 1 - (progress - 0.66) / 0.17);
  const opC = progress > 0.66 ? Math.min(1, (progress - 0.66) / 0.17) : 0;

  const phase = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2;

  const imgStyle: React.CSSProperties = {
    position: "absolute",
    bottom: 0,
    height: "90%",
    objectFit: "cover",
    objectPosition: "top center",
    filter: "grayscale(100%) contrast(115%)",
    transition: "opacity 0.4s ease",
    pointerEvents: "none",
  };

  return (
    <section
      ref={outerRef}
      className="relative bg-[#0A0A0A] text-white"
      style={{ height: "300vh" }}
    >
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100vh" }}
      >
        {/* Image stack — desktop right, mobile centered */}
        <div className="absolute inset-0">
          {[
            { src: IMG_A, op: opA, alt: "Boxer Verteidigung" },
            { src: IMG_B, op: opB, alt: "Boxer wartend" },
            { src: IMG_C, op: opC, alt: "Boxer Angriff" },
          ].map((im, i) => (
            <img
              key={i}
              src={im.src}
              alt={im.alt}
              loading="lazy"
              className="left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-0"
              style={{ ...imgStyle, opacity: im.op }}
            />
          ))}
          {/* Dark gradient overlay for text legibility */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.1) 70%, rgba(10,10,10,0) 100%)",
            }}
          />
        </div>

        {/* Text */}
        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
          <div className="w-full md:w-1/2">
            <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#00B4DC]">
              Dein Training
            </div>
            <div className="relative h-[110px] md:h-[140px]">
              {WORDS.map((w, i) => (
                <h2
                  key={w}
                  className="absolute inset-0 font-[Barlow_Condensed,Impact,sans-serif] font-extrabold uppercase leading-none text-white"
                  style={{
                    fontSize: "clamp(64px, 12vw, 120px)",
                    opacity: phase === i ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  <span className="fc-headline-underline is-visible">{w}</span>
                </h2>
              ))}
            </div>
            <p className="mt-10 max-w-md text-base leading-relaxed text-white/60">
              Kampfsport ist mehr als Kraft.
              <br />
              Es ist Timing. Geduld. Präzision.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
