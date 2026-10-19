import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { MaToolForm } from "@/components/site/MaToolForm";

export const Route = createFileRoute("/probetraining")({
  head: () => ({
    meta: [
      { title: "Kostenloses Probetraining — Fight Club Kampfsport Akademie Hanau" },
      { name: "description", content: "Sichere dir dein kostenloses Probetraining bei der Fight Club Kampfsport Akademie Hanau. MMA, K1, Boxen, Thaiboxen, Self-Defense und Kindertraining — für Groß und Klein." },
      { property: "og:title", content: "Kostenloses Probetraining — Fight Club Kampfsport Akademie Hanau" },
      { property: "og:description", content: "Sichere dir dein kostenloses Probetraining bei der Fight Club Kampfsport Akademie Hanau." },
      { property: "og:url", content: "https://www.fightclub-hanau.de/probetraining" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/probetraining" }],
  }),
  component: ProbetrainingPage,
});

function ProbetrainingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <Nav />

      <section className="pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="mx-auto max-w-[760px] px-5 md:px-10">
          <div className="mb-8 text-center">
            <span className="text-[11px] font-medium uppercase text-quiet">
              Probetraining
            </span>
            <h1 className="mt-3 font-display text-4xl uppercase md:text-5xl">
              Jetzt kostenlos <span className="fc-headline-underline">Probetraining</span> sichern
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-quiet">
              Dein erstes Training ist kostenlos und unverbindlich.
              Wähle Standort, Sportart und Termin. Danach gibst du deine Kontaktdaten ein
              und sendest deine Anfrage mit „reservieren“ ab.
            </p>
          </div>

          <div className="border-y border-rule bg-paper">
            <div className="border-b border-rule bg-mist px-4 py-4 md:px-6">
              <h2 className="font-display text-xl leading-tight">
                Standort, Sportart und Termin auswählen
              </h2>
              <p id="trial-location-help" className="mt-2 text-sm leading-relaxed text-quiet">
                Standort: Wähle im ersten Auswahlfeld „Fight Club Hanau“
                (Geleitstraße 66, Hanau). Anschließend erscheinen die Sportarten und Termine.
              </p>
            </div>
            <div className="px-2 py-3 md:px-6 md:py-4">
              <MaToolForm />
            </div>
            <div className="border-t border-rule px-4 py-4 md:px-6">
              <p className="text-[12px] leading-relaxed text-quiet">
                Hinweis: Das Probetraining-Formular wird von MATOOL (matool.de) bereitgestellt und
                automatisch geladen. Dabei werden technisch notwendige Daten (u. a. IP-Adresse) an
                MATOOL übertragen. Details siehe{" "}
                <Link to="/datenschutz" className="underline">
                  Datenschutzerklärung
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
