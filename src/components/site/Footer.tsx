import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Ticker } from "./Ticker";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] pb-20 text-white md:pb-0">
      <Ticker />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-16 md:grid-cols-2 md:px-10 lg:grid-cols-4">
        <div>
          <Logo size={52} />
          <p className="mt-6 max-w-xs text-[14px] leading-relaxed text-white/60">
            Kampfsport für Groß und Klein: MMA, K1, Boxen, Thaiboxen, Self-Defense und
            Kindertraining ab 5 Jahren.
          </p>
          <p className="mt-6 text-[12px] uppercase tracking-[0.2em] text-white/80">
            © {new Date().getFullYear()} Fight Club Hanau
          </p>
        </div>

        <address className="not-italic">
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">
            Kontakt
          </div>
          <p className="mt-4 text-[15px] leading-relaxed">
            Fight Club Kampfsport Akademie Hanau
            <br />
            Geleitstraße 66
            <br />
            63456 Hanau
          </p>
          <p className="mt-3 text-[15px]">
            <a href="tel:015563344488" className="transition-colors hover:text-[#00B4DC]">
              015563344488
            </a>
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Geleitstra%C3%9Fe+66%2C+63456+Hanau"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-[12px] font-semibold uppercase tracking-[0.2em] text-[#00B4DC] hover:text-white"
          >
            Route planen →
          </a>
          <dl className="mt-6 space-y-1 text-[13px] text-white/70">
            <div className="flex justify-between gap-4">
              <dt>Mo – Fr</dt>
              <dd>15:45 – 21:30</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Sa</dt>
              <dd>11:00 – 13:00</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Sa / So freies Training</dt>
              <dd>auf Anfrage</dd>
            </div>
          </dl>
        </address>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">
            Navigation
          </div>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li>
              <Link to="/" className="hover:opacity-60">
                Start
              </Link>
            </li>
            <li>
              <Link to="/" hash="disziplinen" className="hover:opacity-60">
                Disziplinen
              </Link>
            </li>
            <li>
              <Link to="/" hash="stundenplan" className="hover:opacity-60">
                Stundenplan
              </Link>
            </li>
            <li>
              <Link to="/" hash="about" className="hover:opacity-60">
                Über uns
              </Link>
            </li>
            <li>
              <Link to="/kindertraining" className="hover:opacity-60">
                Kindertraining
              </Link>
            </li>
            <li>
              <Link to="/" hash="kontakt" className="hover:opacity-60">
                Kontakt
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:opacity-60">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">
            Folge uns
          </div>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li>
              <a
                href="https://www.tiktok.com/@fightclub_hanau"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#00B4DC]"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/fightclubhanau"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#00B4DC]"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/share/1D1mQLdM8w/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#00B4DC]"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com/@fightclubhanau"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-[#00B4DC]"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-3 px-5 py-6 text-[11px] uppercase tracking-[0.2em] text-white/80 md:flex-row md:px-10">
          <span>Fight Club Hanau</span>
          <div className="flex flex-wrap gap-6">
            <Link to="/schulordnung" className="hover:text-white">
              Schulordnung
            </Link>
            <Link to="/faq" className="hover:text-white">
              FAQ
            </Link>
            <Link to="/impressum" className="hover:text-white">
              Impressum
            </Link>
            <Link to="/datenschutz" className="hover:text-white">
              Datenschutzerklärung
            </Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("fc:open-cookie-settings"))}
              className="uppercase tracking-[0.2em] hover:text-white"
            >
              Cookie-Einstellungen
            </button>
            <Link to="/trainer/login" className="text-white/50 hover:text-white">
              Trainerbereich
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
