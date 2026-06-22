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
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out ${
          scrolled ? "bg-white border-b border-[#e0e0e0]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-4 md:px-10">
          <a href="#top" aria-label="Fight Club Hanau" className="hover:opacity-70">
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
              className="bg-[#0a0a0a] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.15em] text-white hover:bg-[#222] hover:-translate-y-0.5"
            >
              Probetraining
            </a>
          </nav>

          <button
            onClick={() => set the user setOpen(true)}
            className="relative h-7 w-7 lg:hidden"
            aria-label="Menü öffnen"
          >
            <span
              className={`absolute left-0 block h-[2px] w-7 bg-[#0a0a0a] transition-all duration-300 ease-out ${
                open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-1.5"
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 block h-[2px] w-7 -translate-y-1/2 bg-[#0a0a0a] transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-[2px] w-7 bg-white/40 transition-opacity duration-300 ${
                open ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          </div>

          {/* Drawer – slides from top to bottom */}
          <div
            className="absolute inset-0 z-10 flex h-screen w-full flex-col bg-white shadow-2xl"
            style={{
              transition: open
                ? "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
                : "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: open ? "translateY(0)" : "translateY(-100%)",
              opacity: open ? 1 : 0,
            }}
          >
            <div className="flex items-center justify-between border-b border-[#e0e0e0] px-5 py-4">
              <a href="#top" onClick={() => setOpen(false)} className="hover:opacity-70">
                <Logo className="h-10 w-auto" />
              </a>
              <button
                onClick={() => setOpen(false)}
                aria-label="Schließen"
                className="hover:rotate-90 transition-transform duration-300"
              >
                <svg width="28" height="28" viewBox="0 0 28 28">
                  <path d="M5 5l18 18M23 5L5 23" stroke="#0a0a0a" strokeWidth="2" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-6 px-8">
              {LINKS.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    transitionDelay: open ? `${120 + i * 60}ms` : "0ms",
                  }}
                  className={`font-display text-5xl uppercase tracking-wide text-[#0a0a0a] transition-all duration-500 ease-out hover:translate-x-2 hover:opacity-70 ${
                    open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
                  }`}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#kontakt"
                onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${120 + LINKS.length * 60}ms` : "0ms" }}
                className={`mt-6 inline-block bg-[#0a0a0a] px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.15em] text-white transition-all duration-500 ease-out hover:bg-[#222] ${
                  open ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
                }`}
              >
                Probetraining
              </a>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
