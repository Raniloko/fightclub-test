import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { MaToolForm } from "@/components/site/MaToolForm";

export const Route = createFileRoute("/probetraining")({
  head: () => ({
    meta: [
      { title: "Kostenloses Probetraining — Fight Club Kampfsport Akademie Hanau" },
      {
        name: "description",
        content:
          "Sichere dir dein kostenloses Probetraining bei der Fight Club Kampfsport Akademie Hanau. MMA, K1, Boxen, Thaiboxen, Self-Defense und Kindertraining — für Groß und Klein.",
      },
      {
        property: "og:title",
        content: "Kostenloses Probetraining — Fight Club Kampfsport Akademie Hanau",
      },
      {
        property: "og:description",
        content:
          "Sichere dir dein kostenloses Probetraining bei der Fight Club Kampfsport Akademie Hanau.",
      },
      { property: "og:url", content: "https://www.fightclub-hanau.de/probetraining" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/probetraining" }],
  }),
  component: ProbetrainingPage,
});

const FACTS = [
  "Kostenlos & unverbindlich",
  "Keine Vorerfahrung nötig",
  "Kinder, Jugendliche & Erwachsene",
];

const STEPS = [
  {
    title: "Standort wählen",
    text: "Im ersten Auswahlfeld „Fight Club Hanau“ (Geleitstraße 66) auswählen.",
  },
  {
    title: "Sportart & Termin",
    text: "Danach erscheinen Sportarten und freie Termine – such dir deinen Wunschtermin aus.",
  },
  {
    title: "Daten eingeben & reservieren",
    text: "Kontaktdaten eintragen und mit „reservieren“ absenden. Wir melden uns bei dir.",
  },
];

const BRING = ["Bequeme Sportkleidung", "Gute Laune – das Equipment haben wir vor Ort"];

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ProbetrainingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <Nav />

      {/* Header */}
      <section className="relative overflow-hidden bg-[#0a0a0a] pb-12 pt-32 text-white md:pb-16 md:pt-40">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 85% 0%, rgba(0,180,220,0.16), transparent 55%), radial-gradient(ellipse at 0% 100%, rgba(201,168,76,0.12), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-5 md:px-10">
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
              Kostenloses Probetraining
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-5xl uppercase leading-[0.92] md:text-7xl">
            Dein erstes Training.
            <span className="block text-[#00B4DC]">Kostenlos.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-[17px]">
            Dein erstes Training ist kostenlos und unverbindlich. Wähle Standort, Sportart und
            Termin – wir melden uns bei dir.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {FACTS.map((f) => (
              <li
                key={f}
                className="inline-flex items-center gap-2 border border-white/15 bg-white/[0.04] px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-white/90"
              >
                <span className="text-[#00B4DC]">
                  <CheckIcon />
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-16">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 md:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,700px)] lg:gap-14">
          {/* Steps – shown first on mobile, sticky sidebar on desktop */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-3xl uppercase leading-none md:text-4xl">
              So einfach geht's
            </h2>
            <ol className="mt-6 space-y-5">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center bg-[#0a0a0a] font-display text-lg text-[#00B4DC]">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-xl uppercase leading-tight">{step.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-quiet">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 hidden lg:block">
              <InfoBlocks />
            </div>
          </aside>

          {/* Form card */}
          <div>
            <div className="overflow-hidden border border-rule bg-paper shadow-[0_20px_60px_-30px_rgba(0,0,0,0.35)]">
              <div className="flex items-start gap-3 border-b border-rule bg-[#0a0a0a] px-5 py-4 text-white md:px-6">
                <span
                  className="mt-1 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-[#00B4DC]"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-display text-xl uppercase leading-tight tracking-wide">
                    Probetraining reservieren
                  </h2>
                  <p
                    id="trial-location-help"
                    className="mt-1 text-[13px] leading-relaxed text-white/70"
                  >
                    Standort: Wähle im ersten Auswahlfeld „Fight Club Hanau“ (Geleitstraße 66,
                    Hanau). Anschließend erscheinen die Sportarten und Termine.
                  </p>
                </div>
              </div>
              <div className="px-2 py-3 md:px-6 md:py-5">
                <MaToolForm />
              </div>
            </div>
            <p className="mt-4 text-[12px] leading-relaxed text-quiet">
              Hinweis: Das Probetraining-Formular wird von MATOOL (matool.de) bereitgestellt und
              automatisch geladen. Dabei werden technisch notwendige Daten (u. a. IP-Adresse) an
              MATOOL übertragen. Details siehe{" "}
              <Link to="/datenschutz" className="underline">
                Datenschutzerklärung
              </Link>
              .
            </p>

            <div className="mt-10 lg:hidden">
              <InfoBlocks />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function InfoBlocks() {
  return (
    <div className="space-y-6">
      <div className="border border-rule p-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-quiet">
          Was du mitbringst
        </h3>
        <ul className="mt-3 space-y-2 text-[15px]">
          {BRING.map((b) => (
            <li key={b} className="flex items-start gap-2">
              <span className="mt-1 text-[#00B4DC]">
                <CheckIcon />
              </span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-mist p-5">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-quiet">
          Lieber persönlich?
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed">
          Ruf uns an oder komm vorbei:
          <br />
          Geleitstraße 66, 63456 Hanau
        </p>
        <a
          href="tel:015563344488"
          className="mt-4 inline-flex items-center gap-2 bg-[#0a0a0a] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#00B4DC] hover:text-black"
        >
          015563344488 anrufen
        </a>
      </div>
    </div>
  );
}
