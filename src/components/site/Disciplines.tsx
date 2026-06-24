import { Reveal } from "./Reveal";

const CARDS = [
  {
    name: "MMA",
    img: "https://images.pexels.com/photos/6296060/pexels-photo-6296060.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Mixed Martial Arts auf Wettkampfniveau. Standup, Clinch und Boden — vollständig integriert.",
  },
  {
    name: "K1",
    img: "https://images.pexels.com/photos/6998858/pexels-photo-6998858.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Explosivität und Präzision. K1 verbindet Boxen, Kicks und Knietechniken zu einem kompletten Standup-System.",
  },
  {
    name: "Boxen",
    img: "https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Klassisches Boxen für Einsteiger und Fortgeschrittene. Fußarbeit, Timing, Schlagkraft.",
  },
  {
    name: "Thaiboxen",
    img: "https://images.pexels.com/photos/4761779/pexels-photo-4761779.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Die Kunst der acht Gliedmaßen. Technik, Kondition und mentale Stärke — Muay Thai ist der Kern unserer Akademie.",
  },
  {
    name: "Self-Defense",
    img: "https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Realistische Selbstverteidigung für Alltag und Ernstfall. Klare Prinzipien, kein Showtraining.",
  },
  {
    name: "Wing-Fight",
    img: "https://images.pexels.com/photos/7045400/pexels-photo-7045400.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Effektive Nahkampftechnik aus dem Wing Tsun. Reflexe, Mitte und entspannte Kraft.",
  },
  {
    name: "Kindertraining",
    img: "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Kampfsport für Kinder — spielerisch, respektvoll, mit klaren Werten. Disziplin, Selbstvertrauen und Spaß.",
  },
];

export function Disciplines() {
  return (
    <section id="disziplinen" className="bg-white pt-12 md:pt-20 pb-0">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#E11D2A]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#E11D2A]">
              Was wir trainieren
            </span>
          </div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl"><span className="fc-headline-underline">Unsere Disziplinen</span></h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          {CARDS.map((c) => (
            <Reveal key={c.name}>
              <article id="training" className="group bg-white border-l-2 border-transparent hover:border-[#E11D2A] transition-colors">
                <div className="overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.name}
                    loading="lazy"
                    className="fc-gray h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[280px]"
                  />
                </div>
                <div className="bg-[#0a0a0a] p-6 text-white md:p-8">
                  <div className="flex items-center gap-3">
                    <span className="fc-tag fc-tag-solid">{c.name}</span>
                  </div>
                  <p className="mt-4 max-w-md text-sm text-white/75 md:text-[15px]">{c.text}</p>
                  <a
                    href="#kontakt"
                    className="mt-5 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E11D2A] hover:text-[#FF2435]"
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

