import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

// Mobile-only Probetraining bar: shows once the hero is scrolled past and
// hides again when the closing CTA section (and the footer below it) is reached.
export function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [beforeEnd, setBeforeEnd] = useState(true);

  useEffect(() => {
    const hero = document.getElementById("top");
    const end = document.getElementById("probetraining-cta");
    const observers: IntersectionObserver[] = [];

    if (hero) {
      const o = new IntersectionObserver(([e]) => setPastHero(!e.isIntersecting));
      o.observe(hero);
      observers.push(o);
    }
    if (end) {
      const o = new IntersectionObserver(([e]) =>
        setBeforeEnd(!e.isIntersecting && e.boundingClientRect.top > 0),
      );
      o.observe(end);
      observers.push(o);
    }
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const visible = pastHero && beforeEnd;

  return (
    <div
      className="fc-sticky-cta fixed inset-x-0 bottom-0 z-[90] border-t border-white/10 bg-black px-4 pt-3 md:hidden"
      data-visible={visible}
      aria-hidden={!visible}
      style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}
    >
      <div className="flex items-center gap-4">
        <p className="flex-1 text-[14px] leading-snug text-white/80">
          Erstes Training kostenlos
        </p>
        <Link
          to="/probetraining"
          tabIndex={visible ? 0 : -1}
          className="fc-btn-cyan inline-flex items-center justify-center px-5 py-3 text-[15px] uppercase tracking-[0.1em] text-black"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
        >
          Probetraining sichern
        </Link>
      </div>
    </div>
  );
}
