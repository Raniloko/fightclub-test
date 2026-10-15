import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "./Logo";
import { FireAura } from "./FireAura";
import sloganAsset from "@/assets/slogan-banner.png";

let introStarted = false;

// Zeitplan des Intros (ms). Gesamt ca. 3,7 s – die Hero-Elemente (.fc-late) sind in styles.css darauf abgestimmt.
const BURN_AT = 900;
const SHUTTER_UP_AT = 1700;
const SHUTTER_GONE_AT = 2600;
const LOGO_IN_AT = 1900;
const LOGO_OUT_AT = 2900;
const SPLIT_AT = 3000;
const DONE_AT = 3700;

export function IntroSequence() {
  const [mounted, setMounted] = useState(false);
  const [shutterUp, setShutterUp] = useState(false);
  const [burning, setBurning] = useState(false);
  const [shutterGone, setShutterGone] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [split, setSplit] = useState(false);
  const [gone, setGone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const didRunRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const fadeOutAudio = () => {
    const a = audioRef.current;
    if (!a || a.paused) return;
    const fadeOut = setInterval(() => {
      a.volume = Math.max(0, a.volume - 0.1);
      if (a.volume <= 0.01) {
        a.pause();
        clearInterval(fadeOut);
      }
    }, 50);
  };

  const finish = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    try {
      sessionStorage.setItem("introSeen", "true");
    } catch {
      /* ignore */
    }
    const root = document.documentElement;
    root.classList.remove("fc-intro-pending");
    root.classList.remove("fc-intro-active");
    setGone(true);
  };

  const skip = () => {
    fadeOutAudio();
    finish();
  };

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
    audio
      .play()
      .then(() => {
        let v = 0;
        const fadeIn = setInterval(() => {
          v = Math.min(0.7, v + 0.05);
          audio.volume = v;
          if (v >= 0.7) clearInterval(fadeIn);
        }, 50);
      })
      .catch(() => {});

    const timers = timersRef.current;
    timers.push(setTimeout(() => setBurning(true), BURN_AT));
    timers.push(setTimeout(() => setShutterUp(true), SHUTTER_UP_AT));
    timers.push(setTimeout(() => setShutterGone(true), SHUTTER_GONE_AT));
    timers.push(setTimeout(() => setLogoVisible(true), LOGO_IN_AT));
    timers.push(setTimeout(() => setLogoVisible(false), LOGO_OUT_AT));
    timers.push(setTimeout(fadeOutAudio, LOGO_OUT_AT));
    timers.push(setTimeout(() => setSplit(true), SPLIT_AT));
    timers.push(setTimeout(finish, DONE_AT));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  if (!mounted || gone) return null;

  return createPortal(
    <>
      {!shutterGone && (
        <div
          className={`fc-shutter${burning ? " is-burning" : ""}${shutterUp ? " is-up" : ""}`}
          aria-hidden="true"
        >
          <div className="fc-shutter-slats" />
          <div className="fc-shutter-embers" />
          <div className="fc-shutter-inner">
            <div className="fc-shutter-banner">
              <FireAura mode="orbit" intense={burning} />
              <img src={sloganAsset} alt="" />
            </div>
          </div>
        </div>
      )}

      <div className="fc-intro-root" aria-hidden="true">
        <div className={`fc-intro-half fc-intro-half-left${split ? " is-open" : ""}`} />
        <div className={`fc-intro-half fc-intro-half-right${split ? " is-open" : ""}`} />
        <div className="fc-intro-logo-center" style={{ opacity: logoVisible ? 1 : 0 }}>
          <div className="fc-intro-logo-wrap">
            <Logo className="fc-intro-logo-img" />
          </div>
          <div className="fc-intro-text">
            <span>Fight</span>
            <span>Club</span>
            <span>Kampfsport</span>
            <span>Akademie</span>
          </div>
        </div>
      </div>

      <button type="button" className="fc-intro-skip" onClick={skip}>
        Intro überspringen
      </button>
    </>,
    document.body,
  );
}
