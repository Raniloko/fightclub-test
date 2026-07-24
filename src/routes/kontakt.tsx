import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { OpenDayBar } from "@/components/site/OpenDay";
import { PageHeader } from "@/components/site/PageHeader";
import { Contact } from "@/components/site/Contact";
import { HeadlineUnderlineObserver } from "@/components/site/HeadlineUnderlineObserver";

export const Route = createFileRoute("/kontakt")({
  head: () => ({
    meta: [
      { title: "Kontakt — Fight Club Hanau" },
      { name: "description", content: "Fight Club Hanau — Geleitstraße 66, 63456 Hanau. Tel. 015563344488. Kontaktformular für dein kostenloses Probetraining." },
      { property: "og:title", content: "Kontakt — Fight Club Hanau" },
      { property: "og:description", content: "Geleitstraße 66, 63456 Hanau. Kontaktformular für dein Probetraining." },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/kontakt" }],
  }),
  component: KontaktPage,
});

function KontaktPage() {
  return (
    <main className="bg-white text-[#0a0a0a]">
      <OpenDayBar />
      <Nav />
      <PageHeader eyebrow="Sag Hallo" title="Kontakt" />
      <Contact />
      <Footer />
      <Toaster position="bottom-right" />
      <HeadlineUnderlineObserver />
    </main>
  );
}
