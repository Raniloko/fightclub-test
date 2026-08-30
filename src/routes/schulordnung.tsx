import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Schulordnung } from "@/components/site/Schulordnung";
import { HeadlineUnderlineObserver } from "@/components/site/HeadlineUnderlineObserver";

export const Route = createFileRoute("/schulordnung")({
  head: () => ({
    meta: [
      { title: "Schulordnung — Fight Club Hanau" },
      { name: "description", content: "Die Schulordnung der Fight Club Kampfsport Akademie Hanau. Regeln, Werte und Hinweise für Mitglieder und Gäste." },
      { property: "og:title", content: "Schulordnung — Fight Club Hanau" },
      { property: "og:description", content: "Regeln, Werte und Hinweise der Fight Club Kampfsport Akademie Hanau." },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/schulordnung" }],
  }),
  component: SchulordnungPage,
});

function SchulordnungPage() {
  return (
    <main className="bg-white text-[#0a0a0a]">
      <Nav />
      <div className="h-24 bg-[#0a0a0a]" />
      <Schulordnung />
      <Footer />
      <HeadlineUnderlineObserver />
    </main>
  );
}
