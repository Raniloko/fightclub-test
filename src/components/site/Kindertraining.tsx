import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { Shield, Smile, Users, Heart, Award, Brain, Zap, CheckCircle } from "lucide-react";

const BENEFITS = [
  {
    icon: Shield,
    title: "Selbstbewusstsein",
    text: "Kinder lernen, sich selbst und andere respektvoll einzuschätzen — auf und neben der Matte.",
  },
  {
    icon: Smile,
    title: "Spaß & Bewegung",
    text: "Spielerisches Training, das Koordination, Kondition und Teamgeist stärkt — ohne Druck.",
  },
  {
    icon: Heart,
    title: "Respekt & Disziplin",
    text: "Werte wie Höflichkeit, Geduld und Durchhaltevermögen sind fester Bestandteil jeder Einheit.",
  },
];

const LEARN = [
  "Grundtechniken aus Boxen, Thaiboxen und Ringen",
  "Körperbeherrschung, Balance und Koordination",
  "Selbstbehauptung und situationsgerechte Reaktion",
  "Respektvoller Umgang mit Trainern und Trainingspartnern",
  "Konfliktvermeidung statt Eskalation",
];

const GROUPS = [
  {
    name: "Minis",
    ages: "5 – 7 Jahre",
    desc: "Spielerische Einstiegseinheiten mit viel Bewegung, einfachen Techniken und viel Positivem Feedback.",
  },
  {
    name: "Kids",
    ages: "8 – 12 Jahre",
    desc: "Technik, Koordination und erste Partnerübungen im respektvollen Gruppenklima.",
  },
  {
    name: "Teens",
    ages: "13+ Jahre",
    desc: "Intensiveres Training mit Fokus auf Selbstverteidigung, Kondition und mentaler Stärke.",
  },
];

export function Kindertraining() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0a0a0a] py-28 text-white md:py-40">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt="Kinder beim Kampfsporttraining"
            loading="eager"
            className="h-full w-full object-cover object-center opacity-40"
            style={{ filter: "grayscale(30%) contrast(110%)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/40 to-[#0a0a0a]" />
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-10">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="block h-px w-8 bg-[#C9A84C]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
                Für die nächste Generation
              </span>
            </div>
            <h1 className="mt-4 font-display text-5xl uppercase leading-[0.9] md:text-7xl">
              <span className="fc-headline-underline">Kampfsport für Kinder</span>
              <br />
              <span className="text-[#C9A84C]">in Hanau</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80 md:text-[19px]">
              Bei der Fight Club Kampfsport Akademie in Hanau trainieren Kinder und Jugendliche ab 5 Jahren
              respektvoll, diszipliniert und altersgerecht. Auf dem Programm stehen Techniken aus Boxen,
              Thaiboxen und Ringen — verbunden mit Werten, die im Alltag weiterhelfen.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/probetraining"
                className="fc-btn-cyan inline-flex items-center justify-center px-8 py-4 text-[14px] uppercase tracking-[0.15em] text-black"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
              >
                Probetraining anfragen
              </Link>
              <Link
                to="/"
                hash="stundenplan"
                className="fc-btn-ghost inline-flex items-center justify-center border-2 px-8 py-4 text-[14px] uppercase tracking-[0.15em] text-white"
                style={{
                  borderColor: "rgba(255,255,255,0.5)",
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 800,
                }}
              >
                Stundenplan ansehen
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="block h-px w-8 bg-[#C9A84C]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
                Warum Kampfsport für Kinder?
              </span>
            </div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              <span className="fc-headline-underline">Mehr als nur Sport</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <Reveal key={b.title}>
                  <div className="h-full border-l-2 border-[#C9A84C] bg-[#0a0a0a] p-8 text-white">
                    <div className="flex h-12 w-12 items-center justify-center bg-[#C9A84C] text-black">
                      <Icon size={24} />
                    </div>
                    <h3 className="mt-6 font-display text-xl uppercase tracking-wide text-[#C9A84C]">
                      {b.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/75">{b.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learn */}
      <section className="bg-[#f5f5f5] py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <Reveal>
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=1200"
                  alt="Kinder beim Techniktraining"
                  loading="lazy"
                  className="h-full w-full object-cover"
                  style={{ filter: "grayscale(20%) contrast(105%)" }}
                />
              </div>
            </Reveal>

            <Reveal>
              <div className="flex items-center gap-3">
                <span className="block h-px w-8 bg-[#C9A84C]" />
                <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
                  Was Kinder lernen
                </span>
              </div>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">
                <span className="fc-headline-underline">Technik trifft Charakter</span>
              </h2>
              <ul className="mt-8 space-y-4">
                {LEARN.map((l) => (
                  <li key={l} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#0a0a0a]/80">
                    <CheckCircle size={20} className="mt-0.5 shrink-0 text-[#C9A84C]" />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Age groups */}
      <section className="bg-white py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="block h-px w-8 bg-[#C9A84C]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
                Altersgerechte Gruppen
              </span>
            </div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">
              <span className="fc-headline-underline">Der richtige Einstieg</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {GROUPS.map((g) => (
              <Reveal key={g.name}>
                <div className="h-full border border-black/10 p-8 transition-shadow hover:shadow-lg">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00B4DC]">
                    {g.ages}
                  </div>
                  <h3 className="mt-2 font-display text-3xl uppercase tracking-wide">{g.name}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#0a0a0a]/75">{g.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values / Safety */}
      <section className="bg-[#0a0a0a] py-20 text-white md:py-28">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="block h-px w-8 bg-[#C9A84C]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
                Sicherheit & Werte
              </span>
            </div>
            <h2 className="mt-4 font-display text-4xl text-white md:text-5xl">
              <span className="fc-headline-underline">Auf Augenhöhe mit Kindern</span>
            </h2>
            <p className="mt-6 max-w-3xl text-[17px] leading-relaxed text-white/75">
              Unsere Trainer achten penibel auf altersgerechte Belastung, partnerschaftliches Training und
              klare Regeln. Gewalt hat bei uns keinen Platz — weder in der Haltung noch im Umgang miteinander.
              Kinder lernen, Konflikte zu vermeiden und sich nur dann zu verteidigen, wenn es wirklich nötig ist.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, label: "Kleine Gruppen" },
              { icon: Award, label: "Lizenzierte Trainer" },
              { icon: Brain, label: "Altersgerecht" },
              { icon: Zap, label: "Kein Kompromiss bei Sicherheit" },
            ].map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.label} className="flex items-center gap-4 border border-white/10 p-5">
                  <Icon size={22} className="text-[#C9A84C]" />
                  <span className="text-[14px] font-medium uppercase tracking-[0.15em]">{v.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#C9A84C] py-20 md:py-28">
        <div className="mx-auto max-w-[1000px] px-5 text-center md:px-10">
          <h2 className="font-display text-4xl uppercase text-black md:text-5xl">
            Kostenloses Probetraining
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-black/80">
            Lass dein Kind unverbindlich reinschnuppern. Das erste Training ist kostenlos — inklusive
            Einweisung, Kennenlernen und einem persönlichen Gespräch mit unseren Trainern.
          </p>
            <Link
              to="/probetraining"
              className="mt-10 inline-block bg-black px-10 py-5 text-[12px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#0a0a0a]"
            >
              Termin vereinbaren
            </Link>
        </div>
      </section>
    </>
  );
}
