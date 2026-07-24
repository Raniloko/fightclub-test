import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { OpenDayBar } from "@/components/site/OpenDay";
import { PageHeader } from "@/components/site/PageHeader";
import { Disciplines } from "@/components/site/Disciplines";
import { CtaProbetraining } from "@/components/site/CtaProbetraining";
import { HeadlineUnderlineObserver } from "@/components/site/HeadlineUnderlineObserver";

export const Route = createFileRoute("/disziplinen")({
  head: () => ({
    meta: [
      { title: "Disziplinen — Fight Club Hanau" },
      { name: "description", content: "MMA, K1, Boxen, Thaiboxen, Self-Defense, Wing-Fight und Kindertraining in Hanau. Alle Kampfsportarten der Fight Club Akademie im Überblick." },
      { property: "og:title", content: "Disziplinen — Fight Club Hanau" },
      { property: "og:description", content: "Alle Kampfsportarten der Fight Club Akademie Hanau im Überblick." },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/disziplinen" }],
  }),
  component: DisziplinenPage,
});

function DisziplinenPage() {
  return (
    <main className="bg-white text-[#0a0a0a]">
      <OpenDayBar />
      <Nav />
      <PageHeader eyebrow="Was wir trainieren" title="Unsere Disziplinen" />
      <Disciplines />
      <CtaProbetraining />
      <Footer />
      <HeadlineUnderlineObserver />
    </main>
  );
}
