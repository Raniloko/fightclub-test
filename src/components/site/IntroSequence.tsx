import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

let introStarted = false;

export function IntroSequence() {
  const [mounted, setMounted] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [split, setSplit] = useState(false);
  const [gone, setGone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const didRunRef = useRef(false);

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

  useLayoutEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.add("fc-intro-active");
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
    // Show logo shortly after mount
    timers.push(setTimeout(() => setLogoVisible(true), 100));
    // Fade logo out just before panels split
    timers.push(setTimeout(() => setLogoVisible(false), 1500));
    // Fade out audio
    timers.push(setTimeout(() => {
      const a = audioRef.current;
      if (a && !a.paused) {
        const fadeOut = setInterval(() => {
          a.volume = Math.max(0, a.volume - 0.1);
          if (a.volume <= 0.01) {
            a.pause();
            clearInterval(fadeOut);
          }
        }, 50);
      }
    }, 1700));
    // Split panels
    timers.push(setTimeout(() => setSplit(true), 1800));
    // Cleanup after animation
    timers.push(setTimeout(() => {
      sessionStorage.setItem("introSeen", "true");
      const root = document.documentElement;
      root.classList.remove("fc-intro-pending");
      root.classList.remove("fc-intro-active");
      setGone(true);
    }, 2500));

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [mounted]);

  if (!mounted || gone) return null;

  return (
    <div className="fc-intro-root" aria-hidden="true">
      <div className={`fc-intro-half fc-intro-half-left${split ? " is-open" : ""}`} />
      <div className={`fc-intro-half fc-intro-half-right${split ? " is-open" : ""}`} />
      <div
        className="fc-intro-logo-center"
        style={{ opacity: logoVisible ? 1 : 0 }}
      >
        <Logo className="fc-intro-logo-img" />
      </div>
    </div>
  );
}
