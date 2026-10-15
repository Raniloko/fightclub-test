import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

// Pages where a "book a trial" bar would be redundant or out of place
const HIDDEN_PREFIXES = ["/probetraining", "/admin", "/trainer", "/unlock", "/.lovable"];

export function StickyCta() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#080808]/95 px-4 pt-3 backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="flex items-center gap-3">
        <a
          href="tel:015563344488"
          aria-label="Anrufen"
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-white/20 text-white"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
        <Link
          to="/probetraining"
          className="flex h-12 flex-1 items-center justify-between bg-[#00B4DC] px-5 font-display text-[16px] font-extrabold uppercase tracking-[0.12em] text-black"
        >
          Kostenloses Probetraining
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
