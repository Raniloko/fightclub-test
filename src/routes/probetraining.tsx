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
    <main className="min-h-screen bg-white text-[#0a0a0a]">
      <Nav />

      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-[760px] px-5 md:px-10">
          <div className="mb-10 text-center">
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#555]">
              Probetraining
            </span>
            <h1 className="mt-3 font-display text-4xl uppercase md:text-5xl">
              Jetzt kostenlos <span className="fc-headline-underline">Probetraining</span> sichern
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[#333]">
              Fülle einfach das Formular aus – wir melden uns bei dir mit deinem Wunschtermin.
            </p>
          </div>

          <div className="border border-[#e2e2e2] bg-white">
            <div className="border-b border-[#e2e2e2] bg-[#fafafa] px-4 py-3 md:px-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">
                Anmeldung Probetraining
              </p>
            </div>
            <div className="px-2 py-2 md:px-6 md:py-6">
              <MaToolForm />
            </div>
            <div className="border-t border-[#e2e2e2] px-4 py-4 md:px-6">
              <p className="text-[12px] leading-relaxed text-[#555]">
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
