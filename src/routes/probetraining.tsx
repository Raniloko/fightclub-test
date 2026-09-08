import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { MaToolForm } from "@/components/site/MaToolForm";
import heroWideAsset from "@/assets/hero-v7-desktop.jpg.asset.json";

export const Route = createFileRoute("/probetraining")({
  head: () => ({
    meta: [
      { title: "Kostenloses Probetraining — Fight Club Kampfsport Akademie Hanau" },
      {
        name: "description",
        content:
          "Dein erstes Training geht aufs Haus: MMA, K1, Boxen, Thaiboxen, Self-Defense und Kindertraining in Hanau. Termin in 60 Sekunden online reservieren — kostenlos und unverbindlich.",
      },
      { property: "og:title", content: "Kostenloses Probetraining — Fight Club Kampfsport Akademie Hanau" },
      {
        property: "og:description",
        content:
          "Dein erstes Training geht aufs Haus. Termin online reservieren — kostenlos, unverbindlich, für Groß und Klein.",
      },
      { property: "og:url", content: "https://www.fightclub-hanau.de/probetraining" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/probetraining" }],
  }),
  component: ProbetrainingPage,
});

const CONDENSED = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 } as const;

const TRUST = [
  { k: "100 %", v: "kostenlos & unverbindlich" },
  { k: "Ab 5", v: "Jahren — Kinder & Erwachsene" },
  { k: "Alle", v: "Level — auch blutige Anfänger" },
  { k: "Hanau", v: "Geleitstraße 66" },
];

const STEPS = [
  { n: "01", t: "Standort wählen", d: "Fight Club Hanau auswählen." },
  { n: "02", t: "Sportart wählen", d: "MMA, K1, Boxen, Thaiboxen, Kids …" },
  { n: "03", t: "Termin picken", d: "Freien Tag & Uhrzeit anklicken." },
  { n: "04", t: "Reservieren", d: "Daten eintragen, fertig." },
];

const EXPECT = [
  {
    t: "Ankommen",
    d: "Komm 10 Minuten früher. Wir zeigen dir die Halle, die Umkleide und beantworten alles, was du wissen willst.",
  },
  {
    t: "Mitmachen",
    d: "Du trainierst ganz normal mit — angepasst an dein Level. Sportsachen und Trinkflasche reichen völlig.",
  },
  {
    t: "Quatschen",
    d: "Danach reden wir in Ruhe: Was hat dir gefallen, wie geht's weiter. Kein Druck, keine Verkaufsshow.",
  },
];

function ProbetrainingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white">
      <Nav />

      {/* Cinematic header */}
      <section className="fc-pt-grain relative overflow-hidden pt-32 pb-14 md:pt-44 md:pb-20">
        <img
          src={heroWideAsset.url}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover object-[center_35%]"
          style={{ filter: "grayscale(55%) contrast(112%) brightness(0.5)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.62) 35%, rgba(10,10,10,0.9) 80%, #0A0A0A 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 85%, rgba(0,180,220,0.22) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-[2] mx-auto max-w-[1100px] px-5 text-center md:px-10">
          <div className="fc-pt-reveal fc-pt-d1 inline-flex items-center gap-2 rounded-full border border-[#00B4DC]/60 bg-black/60 px-4 py-2 backdrop-blur-sm">
            <span className="fc-dot-cyan" aria-hidden="true" />
            <span
              className="text-[11px] uppercase tracking-[0.28em] text-[#00B4DC]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
            >
              Kostenlos · Unverbindlich · Für Groß und Klein
            </span>
          </div>

          <h1
            className="fc-pt-reveal fc-pt-d2 mx-auto mt-6 max-w-[15ch] text-[38px] leading-[0.95] uppercase md:max-w-[20ch] md:text-[76px]"
            style={CONDENSED}
          >
            Dein erstes Training
            <br />
            <span className="text-[#00B4DC]">geht aufs Haus</span>
          </h1>

          <p className="fc-pt-reveal fc-pt-d3 mx-auto mt-5 max-w-[52ch] text-[15px] leading-relaxed text-white/70 md:text-[17px]">
            Handschuhe an, Kopf aus, alles rauslassen. Such dir unten einfach deinen Termin aus —
            in unter einer Minute reserviert, ohne Vertrag, ohne Haken.
          </p>

          <div className="fc-pt-reveal fc-pt-d4 mt-8 flex flex-wrap justify-center gap-2">
            {["MMA", "K1 / Kickboxen", "Boxen", "Thaiboxen", "Wing Fight", "Self Defense", "Kindertraining", "Frauenkurse"].map(
              (d) => (
                <span key={d} className="fc-tag" style={{ fontSize: "12px", padding: "6px 14px" }}>
                  {d}
                </span>
              ),
            )}
          </div>

          <a
            href="#formular"
            className="fc-btn-cyan fc-pt-reveal fc-pt-d5 mt-9 inline-flex items-center justify-center px-9 py-4 text-[14px] uppercase tracking-[0.15em] text-black"
            style={CONDENSED}
          >
            Termin aussuchen ↓
          </a>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-white/10 bg-[#0D0D0D]">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-px px-5 py-8 md:grid-cols-4 md:px-10">
          {TRUST.map((t) => (
            <div key={t.k} className="px-2 py-3 text-center">
              <div className="text-[26px] uppercase leading-none text-[#C9A84C] md:text-[32px]" style={CONDENSED}>
                {t.k}
              </div>
              <div className="mt-2 text-[12px] leading-snug text-white/55">{t.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Form */}
      <section id="formular" className="scroll-mt-24 py-14 md:py-24">
        <div className="mx-auto max-w-[820px] px-3 md:px-10">
          <div className="mb-8 text-center">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C]">Anmeldung</span>
            <h2 className="mt-3 text-[30px] uppercase leading-none md:text-[44px]" style={CONDENSED}>
              In 4 Schritten zum Probetraining
            </h2>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-[#00B4DC]/50"
              >
                <div className="text-[13px] tracking-[0.2em] text-[#00B4DC]" style={CONDENSED}>
                  {s.n}
                </div>
                <div className="mt-2 text-[14px] uppercase leading-tight" style={CONDENSED}>
                  {s.t}
                </div>
                <div className="mt-1 text-[12px] leading-snug text-white/50">{s.d}</div>
              </div>
            ))}
          </div>

          <div className="fc-pt-frame">
            <div className="fc-pt-frame-inner">
              <div className="flex items-center justify-between border-b border-black/10 bg-[#f6f6f6] px-4 py-3 md:px-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">
                  Probetraining reservieren
                </p>
                <span className="hidden text-[11px] uppercase tracking-[0.2em] text-[#00A2C6] sm:inline">
                  Kostenlos
                </span>
              </div>
              <div className="bg-white px-1 py-2 md:px-6 md:py-6">
                <MaToolForm />
              </div>
            </div>
          </div>

          <p className="mx-auto mt-5 max-w-[60ch] text-center text-[12px] leading-relaxed text-white/45">
            Hinweis: Das Formular wird von MATOOL (matool.de) bereitgestellt und automatisch geladen.
            Dabei werden technisch notwendige Daten (u. a. IP-Adresse) an MATOOL übertragen. Details in
            der{" "}
            <Link to="/datenschutz" className="underline hover:text-white/70">
              Datenschutzerklärung
            </Link>
            .
          </p>
        </div>
      </section>

      {/* What to expect */}
      <section className="border-t border-white/10 bg-[#0D0D0D] py-14 md:py-20">
        <div className="mx-auto max-w-[1100px] px-5 md:px-10">
          <h2 className="text-center text-[28px] uppercase leading-none md:text-[40px]" style={CONDENSED}>
            Was dich <span className="text-[#C9A84C]">erwartet</span>
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {EXPECT.map((e, i) => (
              <div key={e.t} className="relative rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <span
                  className="absolute right-4 top-3 text-[44px] leading-none text-white/[0.06]"
                  style={CONDENSED}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="text-[20px] uppercase" style={CONDENSED}>
                  {e.t}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-white/60">{e.d}</p>
              </div>
            ))}
          </div>

          {/* Fallback contact */}
          <div className="mt-10 rounded-xl border border-[#C9A84C]/40 bg-[#C9A84C]/[0.06] p-6 text-center">
            <p className="text-[14px] text-white/70">
              Lieber persönlich? Ruf uns einfach an oder komm vorbei — Geleitstraße 66, 63456 Hanau.
            </p>
            <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="tel:015563344488"
                className="inline-flex items-center justify-center border border-white/70 px-7 py-3 text-[13px] uppercase tracking-[0.15em] text-white transition-colors hover:bg-white/10"
                style={CONDENSED}
              >
                Anrufen
              </a>
              <a
                href="https://wa.me/4915563344488"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-[#C9A84C] px-7 py-3 text-[13px] uppercase tracking-[0.15em] text-[#C9A84C] transition-colors hover:bg-[#C9A84C] hover:text-black"
                style={CONDENSED}
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
