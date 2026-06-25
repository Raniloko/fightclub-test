import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "#training", label: "Training" },
  { href: "#disziplinen", label: "Disziplinen" },
  { href: "#trainer", label: "Trainer" },
  { href: "#stundenplan", label: "Stundenplan" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-sm transition-[background-color,border-color] duration-500 ease-out ${
          scrolled ? "bg-white/95 border-[#e0e0e0]" : "bg-white/0 border-transparent"
        }`}
      >
        <div className="relative mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3 md:px-10">
          <a
            href="#top"
            aria-label="Fight Club Hanau"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:opacity-70"
          >
            <Logo variant={scrolled ? "dark" : "light"} height={64} />
          </a>

          <div className="hidden lg:block" aria-hidden="true" />

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-[13px] font-medium uppercase tracking-[0.15em] transition-opacity duration-300 hover:opacity-60 ${
                  scrolled ? "text-[#0a0a0a]" : "text-white"
                }`}
              >
                {l.label}
              </a>
            ))}
            <a
              href="#kontakt"
              className={`px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.15em] transition-all duration-300 hover:-translate-y-0.5 ${
                scrolled
                  ? "bg-[#0a0a0a] text-white hover:bg-[#222]"
                  : "bg-white text-[#0a0a0a] hover:bg-[#e5e5e5]"
              }`}
            >
              Probetraining
            </a>
          </nav>
          <div className="lg:hidden" aria-hidden="true" />

          <button
            onClick={() => setOpen((s) => !s)}
            className="relative h-7 w-7 lg:hidden"
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span
              className={`absolute left-0 block h-[2px] w-7 transition-all duration-300 ease-out ${
                scrolled ? "bg-[#0a0a0a]" : "bg-white"
              } ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1.5"}`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-[2px] w-7 -translate-y-1/2 transition-opacity duration-200 ${
                scrolled ? "bg-[#0a0a0a]" : "bg-white"
              } ${open ? "opacity-0" : "opacity-100"}`}
            />
            <span
              className={`absolute left-0 block h-[2px] w-7 transition-all duration-300 ease-out ${
                scrolled ? "bg-[#0a0a0a]" : "bg-white"
              } ${open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-1.5"}`}
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
          <div className="relative flex items-center justify-between px-5 py-4">
            <Logo variant="light" height={40} />
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
                <a href="#" aria-label="Instagram" className="fcm-social">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="#" aria-label="Facebook" className="fcm-social">
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
