import { Reveal } from "./Reveal";

const TRAINERS = [
  {
    name: "[Trainer Name]",
    disc: "Muay Thai / MMA",
    quote: "Auf der Matte gibt es keine Ausreden.",
    img: "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "[Trainer Name]",
    disc: "Boxen / Kickboxen",
    quote: "Technik schlägt Kraft. Immer.",
    img: "https://images.pexels.com/photos/6296003/pexels-photo-6296003.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    name: "[Trainer Name]",
    disc: "BJJ / Grappling",
    quote: "Der Boden ist nur der Anfang.",
    img: "https://images.pexels.com/photos/4761792/pexels-photo-4761792.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export function Trainers() {
  return (
    <section id="trainer" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#0a0a0a]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#555]">
              Unser Team
            </span>
          </div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl">Die Trainer</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-3">
          {TRAINERS.map((t, i) => (
            <Reveal key={i}>
              <article className="border-b-2 border-[#0a0a0a] pb-6">
                <div className="aspect-square w-full overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.name}
                    loading="lazy"
                    className="fc-gray h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-6 font-display text-3xl">{t.name}</h3>
                <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.25em] text-[#555]">
                  {t.disc}
                </div>
                <p className="mt-4 text-[15px] italic text-[#333]">"{t.quote}"</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
