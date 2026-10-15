import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const LINKS = [
  { to: "/", hash: "disziplinen", label: "Disziplinen" },
  { to: "/kindertraining", hash: undefined, label: "Kindertraining" },
  { to: "/", hash: "stundenplan", label: "Stundenplan" },
  { to: "/", hash: "about", label: "Über uns" },
  { to: "/schulordnung", hash: undefined, label: "Schulordnung" },
  { to: "/faq", hash: undefined, label: "FAQ" },
] as const;

const SOCIALS = [
  {
    href: "https://www.instagram.com/fightclubhanau",
    label: "Instagram",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@fightclub_hanau",
    label: "TikTok",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.939 2.939 0 0 1 3.011-4.535c.317.039.63.114.93.227v-3.76a6.676 6.676 0 0 0-1-.05A6.724 6.724 0 0 0 3.5 16.353a6.724 6.724 0 0 0 10.03 5.467 6.73 6.73 0 0 0 2.97-5.692V9.485a8.15 8.15 0 0 0 4.698 1.497V7.618a4.86 4.86 0 0 1-1.609-.932z" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/share/1D1mQLdM8w/",
    label: "Facebook",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z" />
      </svg>
    ),
  },
  {
    href: "https://youtube.com/@fightclubhanau",
    label: "YouTube",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a2.997 2.997 0 0 0-2.111-2.111C19.666 3.5 12 3.5 12 3.5s-7.666 0-9.387.575a2.997 2.997 0 0 0-2.111 2.111C0 7.907 0 12 0 12s0 4.093.502 5.814a2.997 2.997 0 0 0 2.111 2.111C4.334 20.5 12 20.5 12 20.5s7.666 0 9.387-.575a2.997 2.997 0 0 0 2.111-2.111C24 16.093 24 12 24 12s0-4.093-.502-5.814zM9.545 15.5V8.5l6.273 3.5-6.273 3.5z" />
      </svg>
    ),
  },
];

type NavProps = {
  /** Start fully transparent over a dark hero and turn solid on scroll (home page). */
  transparentOnTop?: boolean;
};

export function Nav({ transparentOnTop = false }: NavProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
    const t = setTimeout(() => setMounted(false), 450);
    return () => clearTimeout(t);
  }, [open]);

  const solid = scrolled || !transparentOnTop;
  const compact = scrolled && !open;

  return (
    <>
      <header
        className="fc-nav"
        data-solid={solid && !open ? "true" : "false"}
        data-compact={compact ? "true" : "false"}
      >
        <div className="fc-nav-inner mx-auto flex max-w-[1600px] items-center justify-between px-5 md:px-10">
          <Link
            to="/"
            aria-label="Fight Club Hanau – Startseite"
            className="flex-shrink-0 transition-opacity hover:opacity-80"
            onClick={() => setOpen(false)}
          >
            <Logo size={64} className="fc-nav-logo block" />
          </Link>

          <nav className="hidden items-center gap-8 xl:flex" aria-label="Hauptnavigation">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                hash={l.hash}
                activeOptions={{ exact: true, includeHash: !!l.hash }}
                className="fc-nav-link"
                activeProps={{ "data-active": "true" } as Record<string, string>}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/probetraining" className="fc-nav-cta">
              Probetraining
              <span aria-hidden="true">→</span>
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="fc-burger xl:hidden"
            data-open={open ? "true" : "false"}
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls={open ? "mobile-menu" : undefined}
          >
            <span className="fc-burger-line" />
            <span className="fc-burger-line" />
          </button>
        </div>
      </header>

      {mounted && (
        <div
          id="mobile-menu"
          className="fcm-overlay xl:hidden"
          data-open={open ? "true" : "false"}
          role="dialog"
          aria-modal="true"
          aria-label="Hauptnavigation"
        >
          <nav className="fcm-links">
            {LINKS.map((l, i) => (
              <Link
                key={l.label}
                to={l.to}
                hash={l.hash}
                onClick={() => setOpen(false)}
                className="fcm-link"
                style={{ transitionDelay: open ? `${120 + i * 55}ms` : "0ms" }}
              >
                <span className="fcm-index">{String(i + 1).padStart(2, "0")}</span>
                <span className="fcm-label">{l.label}</span>
                <span className="fcm-arrow" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </nav>

          <div className="fcm-bottom" style={{ transitionDelay: open ? "460ms" : "0ms" }}>
            <Link to="/probetraining" onClick={() => setOpen(false)} className="fcm-cta">
              Kostenloses Probetraining
              <span aria-hidden="true">→</span>
            </Link>
            <div className="fcm-meta">
              <div className="fcm-contact">
                <a href="tel:015563344488">015563344488</a>
                <span>Geleitstraße 66 · 63456 Hanau</span>
              </div>
              <div className="flex items-center gap-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="fcm-social"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
