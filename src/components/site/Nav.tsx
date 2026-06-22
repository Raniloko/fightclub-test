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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-white border-b border-[#e0e0e0]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10">
          <a href="#top" aria-label="Fight Club Hanau">
            <Logo className="h-10 w-auto" />
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] font-medium uppercase tracking-[0.15em] text-[#0a0a0a] hover:opacity-60"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#kontakt"
              className="bg-[#0a0a0a] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#222]"
            >
              Probetraining
            </a>
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden"
            aria-label="Menü öffnen"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 8h20M4 14h20M4 20h20" stroke="#0a0a0a" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#e0e0e0]">
            <a href="#top" onClick={() => setOpen(false)}>
              <Logo className="h-10 w-auto" />
            </a>
            <button onClick={() => setOpen(false)} aria-label="Schließen">
              <svg width="28" height="28" viewBox="0 0 28 28">
                <path d="M5 5l18 18M23 5L5 23" stroke="#0a0a0a" strokeWidth="2" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-6 px-8">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-5xl uppercase tracking-wide text-[#0a0a0a]"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#kontakt"
              onClick={() => setOpen(false)}
              className="mt-6 inline-block bg-[#0a0a0a] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.15em] text-white"
            >
              Probetraining
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
