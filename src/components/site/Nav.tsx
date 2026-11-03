import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

type NavLink = { to: string; hash?: string; label: string };

const LINKS: NavLink[] = [
  { to: "/", hash: "disziplinen", label: "Disziplinen" },
  { to: "/kindertraining", label: "Kindertraining" },
  { to: "/", hash: "stundenplan", label: "Stundenplan" },
  { to: "/", hash: "about", label: "Über uns" },
  { to: "/", hash: "kontakt", label: "Kontakt" },
  { to: "/faq", label: "FAQ" },
];

// Section links on "/" only count as active when their hash matches, not on every visit to the home page.
const ACTIVE_OPTIONS = { exact: true, includeHash: true };

const SECONDARY_LINKS: NavLink[] = [{ to: "/schulordnung", label: "Schulordnung" }];

const SOCIALS = [
  {
    href: "https://www.instagram.com/fightclubhanau",
    label: "Instagram",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@fightclub_hanau",
    label: "TikTok",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.939 2.939 0 0 1 3.011-4.535c.317.039.63.114.93.227v-3.76a6.676 6.676 0 0 0-1-.05A6.724 6.724 0 0 0 3.5 16.353a6.724 6.724 0 0 0 10.03 5.467 6.73 6.73 0 0 0 2.97-5.692V9.485a8.15 8.15 0 0 0 4.698 1.497V7.618a4.86 4.86 0 0 1-1.609-.932z" /></svg>
    ),
  },
  {
    href: "https://www.facebook.com/share/1D1mQLdM8w/",
    label: "Facebook",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z" /></svg>
    ),
  },
  {
    href: "https://youtube.com/@fightclubhanau",
    label: "YouTube",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a2.997 2.997 0 0 0-2.111-2.111C19.666 3.5 12 3.5 12 3.5s-7.666 0-9.387.575a2.997 2.997 0 0 0-2.111 2.111C0 7.907 0 12 0 12s0 4.093.502 5.814a2.997 2.997 0 0 0 2.111 2.111C4.334 20.5 12 20.5 12 20.5s7.666 0 9.387-.575a2.997 2.997 0 0 0 2.111-2.111C24 16.093 24 12 24 12s0-4.093-.502-5.814zM9.545 15.5V8.5l6.273 3.5-6.273 3.5z" /></svg>
    ),
  },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    document.body.style.overflow = "";
    const t = setTimeout(() => setMounted(false), 350);
    return () => clearTimeout(t);
  }, [open]);

  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <>
      <header className="fc-nav">
        <div className="mx-auto flex h-[var(--nav-h)] max-w-[1400px] items-center justify-between gap-6 px-4 md:px-8">
          <Link to="/" aria-label="Fight Club Hanau – Startseite" className="flex-shrink-0 hover:opacity-80">
            <Logo size={48} className="block lg:!h-[60px]" />
          </Link>

          <nav aria-label="Hauptnavigation" className="hidden items-center gap-5 lg:flex xl:gap-8">
            {LINKS.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                hash={l.hash}
                activeOptions={ACTIVE_OPTIONS}
                className="fc-nav-link text-[14px] font-semibold uppercase tracking-[0.08em]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/probetraining"
              className="fc-btn-cyan ml-2 px-5 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-black"
            >
              Probetraining
            </Link>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="fc-burger lg:hidden"
            aria-label="Menü öffnen"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {mounted && (
        <div
          id="mobile-menu"
          className="fcm-overlay lg:hidden"
          data-open={open ? "true" : "false"}
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
        >
          <div className="flex h-[var(--nav-h)] flex-shrink-0 items-center justify-between border-b border-white/10 px-4 md:px-8">
            <Link to="/" onClick={close} aria-label="Fight Club Hanau – Startseite">
              <Logo size={48} className="block" />
            </Link>
            <button type="button" onClick={close} aria-label="Menü schließen" className="fc-burger" data-open="true">
              <span />
              <span />
              <span />
            </button>
          </div>

          <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-6 pt-4 md:px-10">
            <nav aria-label="Hauptnavigation" className="flex flex-col">
              {LINKS.map((l, i) => (
                <Link
                  key={l.label}
                  to={l.to}
                  hash={l.hash}
                  onClick={close}
                  activeOptions={ACTIVE_OPTIONS}
                  className="fcm-link"
                  style={{ transitionDelay: open ? `${80 + i * 40}ms` : "0ms" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {SECONDARY_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={close}
                  activeOptions={ACTIVE_OPTIONS}
                  className="fcm-sublink"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto pt-8">
              <Link to="/probetraining" onClick={close} className="fcm-cta fc-btn-cyan">
                Probetraining sichern
              </Link>
              <div className="mt-6 flex items-center justify-between gap-4">
                <a href="tel:015563344488" className="fcm-sublink">
                  015563344488
                </a>
                <div className="flex items-center gap-1">
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
        </div>
      )}
    </>
  );
}
