import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="bg-[#0a0a0a] text-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-2">
        <div className="relative min-h-[320px] md:min-h-[640px]">
          <img
            src="/kids-training.jpg"
            alt="Training bei Fight Club Hanau"
            loading="lazy"
            width={1024}
            height={1280}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <Reveal className="flex items-center px-5 py-16 md:px-16 md:py-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="block h-px w-8 bg-[#C9A84C]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
                Unsere Geschichte
              </span>
            </div>
            <h2 className="mt-4 font-display text-5xl md:text-7xl">
              <span className="fc-headline-underline">MEHR ALS EIN GYM.</span>
            </h2>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/85 md:text-[17px]">
              Unsere Schule existiert seit 2021 — damals noch unter dem Namen Combat Style. Im August 2026 haben wir ein neues Kapitel aufgeschlagen: als Fight Club Kampfsport Akademie Hanau, mit neuem Namen, neuer Energie und einem klaren Ziel.
            </p>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/85 md:text-[17px]">
              Wir sind eine Gemeinschaft aus Menschen, die sich auf der Matte begegnen — ehrlich, hart, respektvoll. Egal woher du kommst, welche Sprache du sprichst oder welchen Weg du hinter dir hast: bei uns bist du herzlich willkommen. Auf der Matte sind wir alle gleich.
            </p>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/85 md:text-[17px]">
              Ob du zum ersten Mal trainierst oder schon auf Wettkampfniveau kämpfst — bei uns fängst du von vorne an. Gemeinsam.
            </p>

            <div className="relative mt-7 border-l-4 border-[#00B4DC] bg-[rgba(0,180,220,0.06)] p-5 px-6">
              <span className="absolute left-6 top-5 text-[48px] leading-[0] text-[#00B4DC]">
                &ldquo;
              </span>
              <p className="pl-12 text-lg italic leading-relaxed text-white/85">
                Jeder ist willkommen — unabhängig von Herkunft, Sprache oder Hintergrund. Kampfsport verbindet.
              </p>
            </div>

            <Link
              to="/"
              hash="kontakt"
              className="mt-8 inline-block border-b border-white/60 pb-1 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:border-[#00B4DC] hover:text-[#00B4DC]"
            >
              › Kontakt aufnehmen
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
