import { Link } from "@tanstack/react-router";
import mmaPosterAsset from "@/assets/mma-poster-v8.webp";

export function MmaAnnouncement() {
  return (
    <section id="mma" className="relative overflow-hidden bg-[#0a0a0a] py-14 md:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 30%, rgba(200,16,46,0.18) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(201,168,76,0.12) 0%, transparent 40%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1200px] px-5 md:px-10">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              <span className="block h-px w-8 bg-[#C9A84C]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
                MMA Pro Training
              </span>
              <span className="block h-px w-8 bg-[#C9A84C]" />
            </div>

            <h2 className="mt-5 font-display text-4xl uppercase leading-[0.95] tracking-wide text-white md:text-5xl">
              MMA-Training
              <span className="block text-[#C9A84C]">mit Sunay Abdullah Hamidov</span>
            </h2>

            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/70 md:text-[17px] lg:mx-0">
              Hartes Training. Echte Kämpfer. Echte Ergebnisse. Erlebe professionelles MMA-Training
              auf höchstem Niveau – ab sofort neu im Fight Club Hanau. Standup, Clinch und Boden in
              einer Einheit, geleitet von Sunay Abdullah Hamidov.
            </p>

            <ul
              className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2 lg:mx-0"
              aria-label="MMA-Trainingszeiten"
            >
              {[
                { day: "Dienstag", time: "19:30 – 21:00 Uhr" },
                { day: "Donnerstag", time: "19:30 – 21:00 Uhr" },
              ].map((t) => (
                <li
                  key={t.day}
                  className="border border-[#C9A84C]/30 bg-white/[0.03] px-5 py-4 text-left"
                >
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">
                    {t.day}
                  </span>
                  <span className="mt-1 block font-display text-2xl text-white">{t.time}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/probetraining"
              className="fc-btn-cyan mt-8 inline-flex items-center gap-3 px-7 py-4 font-display text-[14px] font-extrabold uppercase tracking-[0.15em] text-black"
            >
              MMA-Probetraining anfragen <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Poster */}
          <div className="w-full max-w-[420px] flex-shrink-0 lg:max-w-[480px]">
            <div className="relative overflow-hidden rounded-lg border border-[#C9A84C]/30 bg-black shadow-2xl shadow-[#C9A84C]/10">
              <img
                src={mmaPosterAsset}
                alt="MMA-Training im Fight Club Hanau: jeden Dienstag und Donnerstag, 19:30 bis 21:00 Uhr"
                loading="lazy"
                width={874}
                height={1550}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
