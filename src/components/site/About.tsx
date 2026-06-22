import { Reveal } from "./Reveal";

export function About() {
  return (
    <section className="bg-[#f5f5f5]">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-2">
        <div className="relative min-h-[320px] md:min-h-[640px]">
          <img
            src="https://images.pexels.com/photos/6296001/pexels-photo-6296001.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Training bei Fight Club Hanau"
            loading="lazy"
            className="fc-gray absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <Reveal className="flex items-center px-5 py-12 md:px-16 md:py-20">
          <div>
            <div className="flex items-center gap-3">
              <span className="block h-px w-8 bg-[#0a0a0a]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#555]">
                Unsere Geschichte
              </span>
            </div>
            <h2 className="mt-4 font-display text-5xl md:text-7xl"><span className="fc-headline-underline">Mehr als ein Gym.</span></h2>
            <p className="mt-8 max-w-md text-[15px] text-[#333] md:text-[17px]">
              Fight Club ist 2014 in Hanau entstanden — aus der Überzeugung, dass echter
              Kampfsport mehr ist als Fitness. Wir sind eine Gemeinschaft aus Menschen, die sich
              auf der Matte begegnen. Ehrlich. Hart. Respektvoll.
            </p>
            <p className="mt-5 max-w-md text-[15px] text-[#333] md:text-[17px]">
              Ob du zum ersten Mal trainierst oder schon auf Wettkampfniveau kämpfst — bei uns
              fängst du von vorne an. Gemeinsam.
            </p>
            <a
              href="#trainer"
              className="mt-8 inline-block border-b border-[#0a0a0a] pb-1 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0a0a0a] hover:opacity-60"
            >
              › Lerne uns kennen
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
