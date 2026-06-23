const BOXER_BG =
  "https://images.unsplash.com/photo-1681203888755-bd61fe3558eb?w=1200&q=80";

export function Hero() {
  return (
    <section
      id="top"
      className="relative h-svh min-h-svh w-full overflow-hidden bg-black"
    >
      {/* Main full-bleed boxer background */}
      <img
        src={BOXER_BG}
        alt=""
        aria-hidden="true"
        loading="eager"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-[center_top]"
        style={{ filter: "grayscale(60%) contrast(110%)" }}
      />

      {/* Cyan → black gradient overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,180,220,0.35) 0%, rgba(0,0,0,0.75) 40%, rgba(0,0,0,0.90) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-[2] flex h-full w-full items-end">
        <div className="w-full px-6 pb-12 md:px-12 md:pb-16 fc-stagger">
          <div className="flex items-center gap-3">
            <span className="block h-[2px] w-[60px] bg-[#00B4DC]" />
            <span
              className="text-[12px] uppercase tracking-[0.2em] text-[#00B4DC]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
            >
              Hanau · Seit 2014
            </span>
          </div>

          <h1
            className="mt-6 font-display uppercase text-white"
            style={{
              fontSize: "clamp(52px, 10vw, 120px)",
              lineHeight: 0.9,
              fontWeight: 800,
              textShadow: "0 2px 40px rgba(0,0,0,0.5)",
            }}
          >
            <span className="block">Kein Sport.</span>
            <span className="block">Ein Lebensstil.</span>
          </h1>

          <p className="mt-6 max-w-xl text-[16px] text-white/70">
            Muay Thai · MMA · Boxen · Kickboxen · BJJ
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#kontakt"
              className="fc-btn-cyan inline-flex items-center justify-center px-8 py-4 text-[14px] uppercase tracking-[0.15em] text-black"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
            >
              Jetzt einsteigen
            </a>
            <a
              href="#stundenplan"
              className="fc-btn-ghost inline-flex items-center justify-center border-2 px-8 py-4 text-[14px] uppercase tracking-[0.15em] text-white"
              style={{
                borderColor: "rgba(255,255,255,0.5)",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 800,
              }}
            >
              Stundenplan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
