import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FireAura } from "./FireAura";

// Same file the pre-hydration curtain shows (see __root.tsx / styles.css), so the hand-off is seamless.
const SLOGAN_SRC = "/slogan.webp";
const SEEN_KEY = "fcIntroSeenAt";

// Timeline in ms, counted from the moment the slogan image is ready.
// The hero elements (.fc-late in styles.css) are tuned to this.
const BURN_AT = 650; // letters flare up
const SHUTTER_UP_AT = 1100; // shutter rolls up, flames die down
const DONE_AT = 1900;
const MAX_IMAGE_WAIT = 1000;

export type FirePhase = "ignite" | "burn" | "fade";

export function IntroSequence() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<FirePhase>("ignite");
  const [shutterUp, setShutterUp] = useState(false);
  const [gone, setGone] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const finish = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
    try {
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {
      /* private mode: intro may show again next time, that's fine */
    }
    const root = document.documentElement;
    root.classList.remove("fc-intro-pending", "fc-intro-active");
    setGone(true);
  };

  // The inline bootstrap script already decided whether the intro plays.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("fc-intro-pending")) return;
    root.classList.add("fc-intro-active");
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timers = timersRef.current;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      timers.push(setTimeout(() => setPhase("burn"), BURN_AT));
      timers.push(
        setTimeout(() => {
          setPhase("fade");
          setShutterUp(true);
        }, SHUTTER_UP_AT),
      );
      timers.push(setTimeout(finish, DONE_AT));
    };

    // Don't burn through the intro while the slogan is still loading
    const img = new Image();
    img.src = SLOGAN_SRC;
    img.decode().then(start, start);
    timers.push(setTimeout(start, MAX_IMAGE_WAIT));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted]);

  if (!mounted || gone) return null;

  return createPortal(
    <>
      <div
        className={`fc-shutter${phase === "burn" ? " is-burning" : ""}${shutterUp ? " is-up" : ""}`}
        aria-hidden="true"
      >
        <div className="fc-shutter-slats" />
        <div className="fc-shutter-banner">
          <FireAura phase={phase} />
          <img src={SLOGAN_SRC} alt="" width={1536} height={250} decoding="sync" />
        </div>
      </div>

      <button type="button" className="fc-intro-skip" onClick={finish}>
        Intro überspringen
      </button>
    </>,
    document.body,
  );
}
