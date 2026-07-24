import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { OpenDayBar } from "@/components/site/OpenDay";
import { PageHeader } from "@/components/site/PageHeader";
import { Schedule } from "@/components/site/Schedule";
import { Schulordnung } from "@/components/site/Schulordnung";
import { CtaProbetraining } from "@/components/site/CtaProbetraining";
import { HeadlineUnderlineObserver } from "@/components/site/HeadlineUnderlineObserver";

export const Route = createFileRoute("/stundenplan")({
  head: () => ({
    meta: [
      { title: "Stundenplan — Fight Club Hanau" },
      { name: "description", content: "Wöchentlicher Stundenplan der Fight Club Akademie Hanau. Alle Kurse für MMA, K1, Boxen, Thaiboxen, Kindertraining und mehr." },
      { property: "og:title", content: "Stundenplan — Fight Club Hanau" },
      { property: "og:description", content: "Wöchentlicher Stundenplan der Fight Club Akademie Hanau." },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/stundenplan" }],
  }),
  component: StundenplanPage,
});

function StundenplanPage() {
  return (
    <main className="bg-white text-[#0a0a0a]">
      <OpenDayBar />
      <Nav />
      <PageHeader eyebrow="Wann trainierst du" title="Stundenplan" />
      <Schedule />
      <Schulordnung />
      <CtaProbetraining />
      <Footer />
      <HeadlineUnderlineObserver />
    </main>
  );
}
