import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

const CARDS = [
  { name: "Kindertraining", img: "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=800", tag: "Ab 5 Jahren" },
  { name: "MMA", img: "https://images.pexels.com/photos/6296060/pexels-photo-6296060.jpeg?auto=compress&cs=tinysrgb&w=800", tag: "Wettkampfniveau" },
  { name: "K1", img: "https://images.pexels.com/photos/6998858/pexels-photo-6998858.jpeg?auto=compress&cs=tinysrgb&w=800", tag: "Standup" },
  { name: "Boxen", img: "https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg?auto=compress&cs=tinysrgb&w=800", tag: "Fundament" },
  { name: "Thaiboxen", img: "https://images.pexels.com/photos/4761779/pexels-photo-4761779.jpeg?auto=compress&cs=tinysrgb&w=800", tag: "8 Gliedmaßen" },
  { name: "Self-Defense", img: "https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=800", tag: "Realistisch" },
  { name: "Wing-Fight", img: "https://images.pexels.com/photos/7045400/pexels-photo-7045400.jpeg?auto=compress&cs=tinysrgb&w=800", tag: "Nahkampf" },
];

export function DisciplinesPreview() {
  return (
    <section id="disziplinen" className="bg-white pt-12 md:pt-20 pb-12 md:pb-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
              Was wir trainieren
            </span>
          </div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl">
            <span className="fc-headline-underline">Unsere Disziplinen</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-4 md:gap-6">
          {CARDS.map((c) => (
            <Link
              key={c.name}
              to="/disziplinen"
              className="group block overflow-hidden bg-[#0a0a0a] text-white transition-transform hover:-translate-y-1"
            >
              <div className="overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  loading="lazy"
                  className="fc-gray h-[140px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[200px]"
                />
              </div>
              <div className="p-4 md:p-5">
                <div className="font-display text-lg uppercase md:text-xl">{c.name}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#C9A84C] md:text-[11px]">
                  {c.tag}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/disziplinen"
            className="fc-btn-cyan inline-block px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-black"
          >
            Alle Disziplinen ansehen
          </Link>
        </div>
      </div>
    </section>
  );
}
