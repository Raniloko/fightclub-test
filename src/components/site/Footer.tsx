import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 py-16 md:grid-cols-3 md:px-10">
        <div>
          <Logo size={52} />
          <p className="mt-6 text-[12px] uppercase tracking-[0.2em] text-white/50">
            © 2026 Fight Club Hanau
          </p>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
            Navigation
          </div>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li><a href="#training" className="hover:opacity-60">Training</a></li>
            <li><a href="#disziplinen" className="hover:opacity-60">Disziplinen</a></li>
            <li><a href="#trainer" className="hover:opacity-60">Trainer</a></li>
            <li><a href="#stundenplan" className="hover:opacity-60">Stundenplan</a></li>
            <li><a href="#kontakt" className="hover:opacity-60">Kontakt</a></li>
          </ul>
        </div>

        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
            Folge uns
          </div>
          <ul className="mt-4 space-y-2 text-[15px]">
            <li><a href="#" className="transition-colors hover:text-[#C9A84C]">Instagram</a></li>
            <li><a href="#" className="transition-colors hover:text-[#C9A84C]">Facebook</a></li>
          </ul>

        </div>
      </div>

      <div>
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-3 px-5 py-6 text-[11px] uppercase tracking-[0.2em] text-white/50 md:flex-row md:px-10">
          <span>Fight Club Hanau</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Impressum</a>
            <a href="#" className="hover:text-white">Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
