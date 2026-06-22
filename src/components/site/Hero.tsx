import { TriangleBg } from "./TriangleBg";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden bg-white pt-28 md:pt-32"
    >
      <TriangleBg
        className="pointer-events-none absolute right-[-10%] top-1/2 h-[90%] w-[80%] -translate-y-1/2"
        stroke="#EBEBEB"
        opacity={0.9}
      />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-5 md:grid-cols-5 md:px-10">
        <div className="relative z-10 flex flex-col justify-center md:col-span-3 md:min-h-[80svh] fc-stagger">
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#0a0a0a]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#555]">
              Hanau · Seit 2014
            </span>
          </div>

          <h1 className="mt-6 font-display text-[18vw] leading-[0.9] md:text-[8.5vw]">
            <span className="block">Kein Sport.</span>
            <span className="relative inline-block">
              Ein Lebens
              <span className="relative inline-block">
                styl
                <span
                  aria-hidden
                  className="absolute left-0 right-0 bottom-[0.08em] h-[6px] bg-[#0a0a0a] md:h-[8px]"
                />
              </span>
              .
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-[15px] text-[#555] md:text-[17px]">
            Muay Thai · MMA · Boxen · Kickboxen · BJJ — Hanau
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href="#kontakt"
              className="inline-flex items-center justify-center bg-[#0a0a0a] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#222]"
            >
              Jetzt einsteigen
            </a>
            <a
              href="#stundenplan"
              className="inline-flex items-center justify-center border border-[#0a0a0a] px-8 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-white"
            >
              Stundenplan ansehen
            </a>
          </div>
        </div>

        <div className="relative hidden md:col-span-2 md:block">
          <img
            src="https://images.pexels.com/photos/6998855/pexels-photo-6998855.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Fighter"
            loading="eager"
            className="fc-gray-strong fc-hero-mask absolute right-0 bottom-0 h-[90%] w-full object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
