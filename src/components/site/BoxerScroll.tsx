import { useEffect, useRef, useState } from "react";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function BoxerScroll() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when section's top hits the bottom of viewport, 1 when bottom hits the top
      const total = rect.height + vh;
      const passed = vh - rect.top;
      const prog = Math.max(0, Math.min(1, passed / total));
      setP(prog);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Shoulder pivots
  const lShoulder = { x: 160, y: 175 };
  const rShoulder = { x: 240, y: 175 };

  // Angles: defensive (0) -> open (1)
  // Upper arms
  const lUpperAngle = lerp(55, -30, p); // rotation around left shoulder (positive = inward/right)
  const rUpperAngle = lerp(-55, 30, p);
  // Forearm relative bend at elbow
  const lForeAngle = lerp(-10, -10, p);
  const rForeAngle = lerp(10, 10, p);

  // Elbow positions computed from upper arm rotation
  const upperLen = 55;
  const toRad = (d: number) => (d * Math.PI) / 180;

  // Left upper arm hangs down by default; rotation around shoulder
  const lElbow = {
    x: lShoulder.x + Math.sin(toRad(lUpperAngle)) * upperLen,
    y: lShoulder.y + Math.cos(toRad(lUpperAngle)) * upperLen,
  };
  const rElbow = {
    x: rShoulder.x + Math.sin(toRad(rUpperAngle)) * upperLen,
    y: rShoulder.y + Math.cos(toRad(rUpperAngle)) * upperLen,
  };

  // Forearm: in defensive, forearm goes UP toward face; in open, hangs DOWN
  // We'll interpolate forearm absolute angle
  const lForeAbs = lerp(180 + 10, 10, p); // 190deg = pointing up-ish, 10deg = down
  const rForeAbs = lerp(180 - 10, -10, p);

  const foreLen = 50;
  const lGlove = {
    x: lElbow.x + Math.sin(toRad(lForeAbs)) * foreLen,
    y: lElbow.y + Math.cos(toRad(lForeAbs)) * foreLen,
  };
  const rGlove = {
    x: rElbow.x + Math.sin(toRad(rForeAbs)) * foreLen,
    y: rElbow.y + Math.cos(toRad(rForeAbs)) * foreLen,
  };

  const armStroke = "#F0F0F0";
  const armWidth = 22;

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#0A0A0A] text-white"
      style={{ minHeight: "100vh" }}
    >
      {/* Particles */}
      <div className="pointer-events-none absolute inset-0">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="fc-particle"
            style={{
              left: `${20 + i * 18}%`,
              bottom: `${10 + (i % 2) * 15}%`,
              animationDelay: `${i * 1.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex h-full min-h-screen max-w-7xl flex-col items-center justify-center gap-10 px-6 py-20 md:flex-row md:justify-between md:gap-8">
        {/* Text */}
        <div className="w-full max-w-xl md:w-1/2">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#00B4DC]">
            Dein Training
          </div>
          <h2
            className="font-[Barlow_Condensed,Impact,sans-serif] text-4xl font-extrabold leading-[0.95] tracking-tight text-white md:text-6xl lg:text-7xl"
            style={{ fontStretch: "condensed" }}
          >
            VERTEIDIGUNG
            <br />
            IST DER
            <br />
            ERSTE SCHRITT.
          </h2>
          <div className="my-6 h-px w-24 bg-[#00B4DC]" />
          <p className="max-w-md text-base leading-relaxed text-neutral-400">
            Lerne, dich zu schützen.
            <br />
            Dann lernst du anzugreifen.
          </p>
        </div>

        {/* Boxer SVG */}
        <div className="w-full md:w-1/2 flex justify-center">
          <svg
            viewBox="0 0 400 500"
            className="h-[40vh] w-auto md:h-[60vh]"
            style={{ filter: "drop-shadow(0 0 8px rgba(0,180,220,0.3))" }}
          >
            {/* Torso (trapezoid) */}
            <path
              d="M140 180 L260 180 L280 360 L120 360 Z"
              fill="#F0F0F0"
            />
            {/* Neck */}
            <rect x="185" y="110" width="30" height="35" fill="#F0F0F0" />
            {/* Head */}
            <ellipse cx="200" cy="85" rx="42" ry="50" fill="#F0F0F0" />

            {/* Left arm upper */}
            <line
              x1={lShoulder.x}
              y1={lShoulder.y}
              x2={lElbow.x}
              y2={lElbow.y}
              stroke={armStroke}
              strokeWidth={armWidth}
              strokeLinecap="round"
            />
            {/* Left elbow joint */}
            <circle cx={lElbow.x} cy={lElbow.y} r={13} fill={armStroke} />
            {/* Left forearm */}
            <line
              x1={lElbow.x}
              y1={lElbow.y}
              x2={lGlove.x}
              y2={lGlove.y}
              stroke={armStroke}
              strokeWidth={armWidth}
              strokeLinecap="round"
            />
            {/* Left glove */}
            <circle cx={lGlove.x} cy={lGlove.y} r={22} fill="#00B4DC" opacity={0.95} />
            <circle cx={lGlove.x} cy={lGlove.y} r={22} fill="none" stroke="#F0F0F0" strokeWidth={3} />

            {/* Right arm upper */}
            <line
              x1={rShoulder.x}
              y1={rShoulder.y}
              x2={rElbow.x}
              y2={rElbow.y}
              stroke={armStroke}
              strokeWidth={armWidth}
              strokeLinecap="round"
            />
            <circle cx={rElbow.x} cy={rElbow.y} r={13} fill={armStroke} />
            <line
              x1={rElbow.x}
              y1={rElbow.y}
              x2={rGlove.x}
              y2={rGlove.y}
              stroke={armStroke}
              strokeWidth={armWidth}
              strokeLinecap="round"
            />
            <circle cx={rGlove.x} cy={rGlove.y} r={22} fill="#00B4DC" opacity={0.95} />
            <circle cx={rGlove.x} cy={rGlove.y} r={22} fill="none" stroke="#F0F0F0" strokeWidth={3} />
          </svg>
        </div>
      </div>
    </section>
  );
}
