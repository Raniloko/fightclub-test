import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "#disziplinen", label: "Disziplinen" },
  { href: "#trainer", label: "Team" },
  { href: "#stundenplan", label: "Stundenplan" },
  { href: "#kontakt", label: "Kontakt" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      // next frame → trigger enter animation
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      return () => {
        const y = document.body.style.top;
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        window.scrollTo(0, y ? -parseInt(y, 10) : 0);
      };
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLinkClick = (href: string) => {
    setOpen(false);
    // Start scroll in parallel with close animation
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <>
      <header className="fc-nav">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-3 md:px-10 lg:pl-[32px]">
          <a href="#top" aria-label="Fight Club Hanau" className="hover:opacity-80">
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
            className={`fc-burger lg:hidden ${open ? "is-open" : ""}`}
            aria-label={open ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="fc-burger-line fc-burger-l1" />
            <span className="fc-burger-line fc-burger-l2" />
            <span className="fc-burger-line fc-burger-l3" />
          </button>
        </div>
      </header>

      {mounted && (
        <div
          id="mobile-menu"
          className={`fcm-overlay lg:hidden ${visible ? "is-visible" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Hauptnavigation"
        >
          <div className="fcm-noise" aria-hidden="true" />
          <div className="fcm-watermark" aria-hidden="true">FC</div>

          <div className="fcm-scroll">
            <nav className="fcm-nav">
              {LINKS.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleLinkClick(l.href);
                  }}
                  className="fcm-item"
                  style={{ transitionDelay: visible ? `${300 + i * 80}ms` : "0ms" }}
                >
                  <span className="fcm-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="fcm-text">{l.label}</span>
                  <span className="fcm-bar" aria-hidden="true" />
                </a>
              ))}
            </nav>

            <div
              className="fcm-footer"
              style={{ transitionDelay: visible ? "700ms" : "0ms" }}
            >
              <div className="fcm-brand">FIGHT CLUB HANAU</div>
              <div className="fcm-addr">Geleitstraße 66, 63456 Hanau</div>

              <div className="fcm-hours">
                <div><span>Mo–Fr</span><span>07:00–22:00</span></div>
                <div><span>Sa</span><span>09:00–15:00</span></div>
              </div>

              <div className="fcm-social-row">
                <a href="#" aria-label="Instagram" className="fcm-social">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="#" aria-label="Facebook" className="fcm-social">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
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
