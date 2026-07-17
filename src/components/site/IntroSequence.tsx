import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

let introStarted = false;

export function IntroSequence() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState(0);
  const [split, setSplit] = useState(false);
  const [flash, setFlash] = useState(false);
  const [gone, setGone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const didRunRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    if (sessionStorage.getItem("introSeen")) {
      // No intro this session — reveal the site immediately.
      root.classList.remove("fc-intro-pending");
      return;
    }
    if (introStarted || didRunRef.current) return;
    didRunRef.current = true;
    introStarted = true;

    // Hand off from the pre-hydration cover to the animated curtain in the
    // same paint frame so there's no gap.
    root.classList.add("fc-intro-active");
    setMounted(true);

    const audio = new Audio("/intro-music.mp3");
    audio.volume = 0;
    audioRef.current = audio;
    audio.play().then(() => {
      let v = 0;
      const fadeIn = setInterval(() => {
        v = Math.min(0.7, v + 0.05);
        audio.volume = v;
        if (v >= 0.7) clearInterval(fadeIn);
      }, 60);
    }).catch(() => {});

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 200));
    timers.push(setTimeout(() => setPhase(2), 1600));
    timers.push(setTimeout(() => setPhase(3), 2800));
    timers.push(setTimeout(() => setPhase(4), 3300));
    timers.push(setTimeout(() => {
      const a = audioRef.current;
      if (a && !a.paused) {
        const fadeOut = setInterval(() => {
          a.volume = Math.max(0, a.volume - 0.05);
          if (a.volume <= 0.01) {
            a.pause();
            clearInterval(fadeOut);
          }
        }, 80);
      }
    }, 4800));
    timers.push(setTimeout(() => {
      setSplit(true);
      setFlash(true);
      setTimeout(() => setFlash(false), 200);
    }, 6200));
    timers.push(setTimeout(() => {
      sessionStorage.setItem("introSeen", "true");
      setGone(true);
      root.classList.remove("fc-intro-pending");
      root.classList.remove("fc-intro-active");
    }, 6800));

    return () => {};
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
  const offset = side === "left" ? "translateX(50%)" : "translateX(-50%)";
  return (
    <div className="fc-intro-content" style={{ transform: offset }}>
      <div
        className="fc-intro-logo"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transform: `scale(${phase >= 1 ? 1 : 0.6})`,
        }}
      >
        <Logo size={260} />
      </div>

      <div
        className="fc-intro-title"
        style={{
          clipPath: phase >= 2 ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
        }}
      >
        FIGHT CLUB
      </div>

      <div
        className="fc-intro-underline"
        style={{ transform: `scaleX(${phase >= 4 ? 1 : 0})` }}
      />

      <div
        className="fc-intro-subtitle"
        style={{ opacity: phase >= 3 ? 1 : 0 }}
      >
        MMA AKADEMIE HANAU
      </div>
    </div>
  );
}
