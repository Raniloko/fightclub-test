import { Reveal } from "./Reveal";

const CARDS = [
  {
    name: "Muay Thai",
    img: "https://images.pexels.com/photos/4761779/pexels-photo-4761779.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Die Kunst der acht Gliedmaßen. Technik, Kondition und mentale Stärke — Muay Thai ist der Kern unserer Akademie.",
  },
  {
    name: "MMA",
    img: "https://images.pexels.com/photos/6296060/pexels-photo-6296060.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Mixed Martial Arts auf Wettkampfniveau. Standup, Clinch und Boden — vollständig integriert.",
  },
  {
    name: "Boxen",
    img: "https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Klassisches Boxen für Einsteiger und Fortgeschrittene. Fußarbeit, Timing, Schlagkraft.",
  },
  {
    name: "Kickboxen",
    img: "https://images.pexels.com/photos/6998858/pexels-photo-6998858.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Explosivität und Präzision. Kickboxen verbindet Boxen und Karate zu einem vollständigen Standup-System.",
  },
  {
    name: "BJJ / Grappling",
    img: "https://images.pexels.com/photos/7045400/pexels-photo-7045400.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Brazilian Jiu-Jitsu und Grappling. Der Kampf am Boden — für Wettkampf und Selbstverteidigung.",
  },
];

export function Disciplines() {
  return (
    <section id="disziplinen" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#0a0a0a]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#555]">
              Was wir trainieren
            </span>
          </div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl">Unsere Disziplinen</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          {CARDS.map((c) => (
            <Reveal key={c.name}>
              <article id="training" className="group bg-white border-l-2 border-transparent hover:border-[#00B4DC] transition-colors">
                <div className="overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    className="fc-gray h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[280px]"
                  />
                </div>
                <div className="bg-[#0a0a0a] p-6 text-white md:p-8">
                  <h3 className="font-display text-3xl md:text-4xl">{c.name}</h3>
                  <p className="mt-3 max-w-md text-sm text-white/75 md:text-[15px]">{c.text}</p>
                  <a
                    href="#kontakt"
                    className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#00B4DC] hover:text-[#00D4FF]"
                  >
                    › Mehr erfahren
                  </a>
                </div>
              </article>
            </Reveal>

          ))}
        </div>
      </div>
    </section>
  );
}
