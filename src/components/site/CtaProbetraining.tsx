import { TriangleBg } from "./TriangleBg";

export function CtaProbetraining() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-20 text-white md:py-32">
      <TriangleBg
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2"
        stroke="#ffffff"
        opacity={0.05}
      />
      <div className="relative mx-auto max-w-[1200px] px-5 text-center md:px-10">
        <h2
          className="font-display leading-[0.9]"
          style={{ fontSize: "clamp(48px, 9vw, 96px)" }}
        >
          Komm. Einfach.
          <br />
          Trainieren.
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-[15px] text-white/70 md:text-[17px]">
          Dein erstes Training ist kostenlos und unverbindlich. Keine Anmeldung nötig.
        </p>
        <a
          href="#kontakt"
          className="fc-btn-cyan mt-10 inline-block px-10 py-5 text-[12px] font-semibold uppercase tracking-[0.25em] text-black"
        >
          Probetraining anfragen
        </a>

      </div>
    </section>
  );
}
