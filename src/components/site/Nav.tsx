import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "#training", label: "Training" },
  { href: "#disziplinen", label: "Disziplinen" },
  { href: "#stundenplan", label: "Stundenplan" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const t = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <>
      <header className="fc-nav">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3 md:px-10 lg:pl-[32px]">
          <a
            href="#top"
            aria-label="Fight Club Hanau"
            className="hover:opacity-80"
          >
            <Logo size={72} />
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="fc-nav-link text-[13px] font-medium uppercase tracking-[0.15em] transition-colors duration-300"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#kontakt"
              className="fc-nav-cta px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.15em] transition-all duration-300"
            >
              Probetraining
            </a>
          </nav>

          <button
            onClick={() => setOpen((s) => !s)}
            className="relative h-7 w-7 lg:hidden"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span
              className={`absolute left-0 block h-[2px] w-7 bg-white transition-all duration-300 ease-out ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1.5"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-[2px] w-7 -translate-y-1/2 bg-white transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-[2px] w-7 bg-white transition-all duration-300 ease-out ${
                open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-1.5"
              }`}
            />
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
          aria-label="Hauptnavigation"
        >
          {/* Top bar */}
          <div className="relative flex items-center justify-end px-5 py-4">
            <button
              onClick={() => setOpen(false)}
              aria-label="Schließen"
              className="text-white transition-transform duration-300 hover:rotate-90"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 6l20 20M26 6L6 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col px-6 pt-6">
            {LINKS.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="fcm-link"
                style={{ transitionDelay: open ? `${200 + i * 60}ms` : "0ms" }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Bottom area */}
          <div className="fcm-bottom">
            <a
              href="#kontakt"
              onClick={() => setOpen(false)}
              className="fcm-cta"
            >
              Probetraining anfragen
            </a>
            <div className="flex items-center justify-between px-8 pb-8 pt-6">
              <span className="fcm-foot">FIGHT CLUB MMA AKADEMIE HANAU</span>
              <div className="flex items-center gap-4">
                <a href="https://www.tiktok.com/@fightclub_hanau" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="fcm-social">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.939 2.939 0 0 1 3.011-4.535c.317.039.63.114.93.227v-3.76a6.676 6.676 0 0 0-1-.05A6.724 6.724 0 0 0 3.5 16.353a6.724 6.724 0 0 0 10.03 5.467 6.73 6.73 0 0 0 2.97-5.692V9.485a8.15 8.15 0 0 0 4.698 1.497V7.618a4.86 4.86 0 0 1-1.609-.932z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/fightclubhanau" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="fcm-social">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/share/1D1mQLdM8w/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="fcm-social">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
