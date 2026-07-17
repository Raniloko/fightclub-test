import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

  // Decide whether to run BEFORE first paint so we never render an empty
  // component (which would let the pre-cover be swapped for nothing).
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    if (sessionStorage.getItem("introSeen")) {
      root.classList.remove("fc-intro-pending");
      return;
    }
    if (introStarted || didRunRef.current) return;
    didRunRef.current = true;
    introStarted = true;
    setMounted(true);
  }, []);

  // Only swap the pre-cover class AFTER the curtain component has painted,
  // so there is no frame where neither is visible.
  useLayoutEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.add("fc-intro-active");
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;

    const audio = new Audio("/intro-music.mp3");
    audio.volume = 0;
    audioRef.current = audio;
    audio.play().then(() => {
      let v = 0;
      const fadeIn = setInterval(() => {
        v = Math.min(0.7, v + 0.05);
        audio.volume = v;
        if (v >= 0.7) clearInterval(fadeIn);
      }, 50);
    }).catch(() => {});

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 100));
    timers.push(setTimeout(() => setPhase(2), 900));
    timers.push(setTimeout(() => setPhase(3), 1700));
    timers.push(setTimeout(() => setPhase(4), 2050));
    timers.push(setTimeout(() => {
      const a = audioRef.current;
      if (a && !a.paused) {
        const fadeOut = setInterval(() => {
          a.volume = Math.max(0, a.volume - 0.08);
          if (a.volume <= 0.01) {
            a.pause();
            clearInterval(fadeOut);
          }
        }, 60);
      }
    }, 3000));
    timers.push(setTimeout(() => {
      setSplit(true);
      setFlash(true);
      setTimeout(() => setFlash(false), 200);
    }, 3600));
    timers.push(setTimeout(() => {
      sessionStorage.setItem("introSeen", "true");
      const root = document.documentElement;
      root.classList.remove("fc-intro-pending");
      root.classList.remove("fc-intro-active");
      setGone(true);
    }, 4100));

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [mounted]);

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
        <Logo size={380} />
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
