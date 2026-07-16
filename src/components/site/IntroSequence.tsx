import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

let introStarted = false;

export function IntroSequence() {
  const [mounted, setMounted] = useState(true);
  const [phase, setPhase] = useState(0);
  const [split, setSplit] = useState(false);
  const [flash, setFlash] = useState(false);
  const [gone, setGone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const didRunRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("introSeen")) {
      setGone(true);
      setMounted(false);
      return;
    }
    if (introStarted) return;
    if (didRunRef.current) return;
    didRunRef.current = true;
    introStarted = true;

    // Try to play intro music (place file at public/intro-music.mp3)
    const audio = new Audio("/intro-music.mp3");
    audio.volume = 0;
    audioRef.current = audio;
    audio.play().then(() => {
      // fade in
      let v = 0;
      const fadeIn = setInterval(() => {
        v = Math.min(0.7, v + 0.05);
        audio.volume = v;
        if (v >= 0.7) clearInterval(fadeIn);
      }, 60);
    }).catch(() => {
      // autoplay blocked or no file — silent intro
    });

    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setPhase(1), 200));   // logo
    timers.push(setTimeout(() => setPhase(2), 1600));  // FIGHT CLUB text
    timers.push(setTimeout(() => setPhase(3), 2800));  // small text
    timers.push(setTimeout(() => setPhase(4), 3300));  // underline
    timers.push(setTimeout(() => {                     // hold on screen
      // start fading music
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
    timers.push(setTimeout(() => {                     // split + flash
      setSplit(true);
      setFlash(true);
      setTimeout(() => setFlash(false), 200);
    }, 6200));
    timers.push(setTimeout(() => {
      sessionStorage.setItem("introSeen", "true");
      setGone(true);
    }, 6800));

    return () => {
      // Keep timers running across StrictMode remounts so the intro completes.
      // Only stop audio if the component fully unmounts after the intro is gone.
    };
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
