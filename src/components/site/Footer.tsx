import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-16 md:grid-cols-3 md:px-10">
        <div>
          <Logo size={52} />
          <p className="mt-6 text-[12px] uppercase tracking-[0.2em] text-white/80">
            © 2026 Fight Club Hanau
          </p>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">
            Navigation
          </div>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li><Link to="/" className="hover:opacity-60">Start</Link></li>
            <li><Link to="/" hash="disziplinen" className="hover:opacity-60">Disziplinen</Link></li>
            <li><Link to="/" hash="stundenplan" className="hover:opacity-60">Stundenplan</Link></li>
            <li><Link to="/" hash="about" className="hover:opacity-60">Über uns</Link></li>
            <li><Link to="/kindertraining" className="hover:opacity-60">Kindertraining</Link></li>
            <li><Link to="/" hash="kontakt" className="hover:opacity-60">Kontakt</Link></li>
            <li><Link to="/faq" className="hover:opacity-60">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/80">
            Folge uns
          </div>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li><a href="https://www.tiktok.com/@fightclub_hanau" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#00B4DC]">TikTok</a></li>
            <li><a href="https://www.instagram.com/fightclubhanau" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#00B4DC]">Instagram</a></li>
            <li><a href="https://www.facebook.com/share/1D1mQLdM8w/" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#00B4DC]">Facebook</a></li>
            <li><a href="https://youtube.com/@fightclubhanau" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#00B4DC]">YouTube</a></li>
          </ul>
        </div>
      </div>

      <div>
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-3 px-5 py-6 text-[11px] uppercase tracking-[0.2em] text-white/80 md:flex-row md:px-10">
          <span>Fight Club Hanau</span>
          <div className="flex flex-wrap gap-6">
            <Link to="/schulordnung" className="hover:text-white">Schulordnung</Link>
            <Link to="/faq" className="hover:text-white">FAQ</Link>
            <Link to="/impressum" className="hover:text-white">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-white">Datenschutzerklärung</Link>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("fc:open-cookie-settings"))}
              className="uppercase tracking-[0.2em] hover:text-white"
            >
              Cookie-Einstellungen
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
