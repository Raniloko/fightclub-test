import mmaPosterAsset from "@/assets/mma-poster-sunay-v3.png.asset.json";

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

            <h2 className="mt-5 font-display text-4xl uppercase tracking-wide text-white md:text-5xl">
              Sunay Abdullah Hamidov
            </h2>

            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-white/70 lg:mx-0 md:text-[17px]">
              Hartes Training. Echte Kämpfer. Echte Ergebnisse. Erlebe professionelles MMA-Training
              auf höchstem Niveau — ab September neu im Fight Club Hanau.
            </p>
          </div>

          {/* Poster */}
          <div className="w-full max-w-[420px] flex-shrink-0 lg:max-w-[480px]">
            <div className="relative overflow-hidden rounded-lg border border-[#C9A84C]/30 bg-black shadow-2xl shadow-[#C9A84C]/10">
              <img
                src={mmaPosterAsset.url}
                alt="MMA Fight Club Poster: Sunay Abdullah Hamidov — Jetzt neu ab September"
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
