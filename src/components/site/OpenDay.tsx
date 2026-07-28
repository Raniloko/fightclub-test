import { useEffect } from "react";

export function OpenDayBar() {
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.add("fc-has-openday-bar");
    return () => document.documentElement.classList.remove("fc-has-openday-bar");
  }, []);

  return (
    <a
      href="#tag-der-offenen-tuer"
      className="fc-openday-bar fixed inset-x-0 top-0 z-[55] block w-full bg-[#c8102e] text-white transition-colors hover:bg-[#a80d26]"
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] sm:gap-4 sm:text-[12px]">
        <span className="hidden sm:inline">🥊</span>
        <span>Große Neueröffnung · Termin folgt</span>
        <span className="hidden text-[10px] tracking-[0.2em] underline underline-offset-4 md:inline">
          Mehr erfahren →
        </span>
      </div>
    </a>
  );
}

export function OpenDaySection() {
  return (
    <section
      id="tag-der-offenen-tuer"
      className="relative scroll-mt-36 overflow-hidden bg-[#0a0a0a] py-14 md:py-24"
    >
      <div className="mx-auto max-w-[900px] px-4 text-center md:px-8">
        <div className="flex items-center justify-center gap-3">
          <span className="block h-px w-8 bg-[#C9A84C]" />
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
            Bald ist es soweit
          </span>
          <span className="block h-px w-8 bg-[#C9A84C]" />
        </div>
        <h2 className="mt-5 font-display text-4xl uppercase text-white md:text-6xl">
          Große Neueröffnung folgt
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] text-white/70 md:text-[17px]">
          Der Termin für unsere Neueröffnung und den Tag der offenen Tür steht noch nicht fest.
          Sobald es losgeht, erfährst du es hier und auf unseren Social-Media-Kanälen.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <a
            href="#kontakt"
            className="inline-flex items-center justify-center rounded-md bg-[#c8102e] px-6 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-[#a80d26]"
          >
            Kontakt aufnehmen
          </a>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Geleitstra%C3%9Fe+66,+63456+Hanau"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md border border-white/25 px-6 py-4 text-[12px] font-bold uppercase tracking-[0.22em] text-white transition-colors hover:bg-white/10"
          >
            Route planen
          </a>
        </div>
      </div>
    </section>
  );
}
