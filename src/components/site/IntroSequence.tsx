import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function IntroSequence() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [split, setSplit] = useState(false);
  const [flash, setFlash] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("introSeen")) return;
    setMounted(true);

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 50));    // logo
    timers.push(setTimeout(() => setPhase(2), 800));   // FIGHT CLUB text
    timers.push(setTimeout(() => setPhase(3), 1400));  // small text
    timers.push(setTimeout(() => setPhase(4), 1700));  // underline
    timers.push(setTimeout(() => {                       // split + flash
      setSplit(true);
      setFlash(true);
      setTimeout(() => setFlash(false), 200);
    }, 2000));
    timers.push(setTimeout(() => {
      sessionStorage.setItem("introSeen", "true");
      setGone(true);
    }, 2550));

    return () => timers.forEach(clearTimeout);
  }, []);

  if (!mounted || gone) return null;

  return (
    <div className="fc-intro-root" aria-hidden="true">
      <div
        className="fc-intro-half fc-intro-half-left"
        style={split ? { transform: "translateX(-100%)" } : undefined}
      >
        <div className="fc-intro-inner">
          <IntroContent phase={phase} side="left" />
        </div>
      </div>
      <div
        className="fc-intro-half fc-intro-half-right"
        style={split ? { transform: "translateX(100%)" } : undefined}
      >
        <div className="fc-intro-inner">
          <IntroContent phase={phase} side="right" />
        </div>
      </div>
      {flash && <div className="fc-intro-flash" />}
    </div>
  );
}

function IntroContent({ phase, side }: { phase: number; side: "left" | "right" }) {
  // Each half renders the same content but offset so together they look like one centered block.
  const offset = side === "left" ? "translateX(50%)" : "translateX(-50%)";
  return (
    <div className="fc-intro-content" style={{ transform: offset }}>
      {/* Logo mark (triangle) */}
      <div
        className="fc-intro-logo"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: `scale(${phase >= 1 ? 1 : 0.6})`,
        }}
      >
        <Logo size={120} />
      </div>

      {/* FIGHT CLUB */}
      <div
        className="fc-intro-title"
        style={{
          clipPath: phase >= 2 ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        }}
      >
        FIGHT CLUB
      </div>

      {/* Underline */}
      <div
        className="fc-intro-underline"
        style={{ transform: `scaleX(${phase >= 4 ? 1 : 0})` }}
      />

      {/* Small text */}
      <div
        className="fc-intro-subtitle"
        style={{ opacity: phase >= 3 ? 1 : 0 }}
      >
        MMA AKADEMIE HANAU
      </div>
    </div>
  );
}
