import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Disciplines } from "@/components/site/Disciplines";
import { Schedule } from "@/components/site/Schedule";
import { About } from "@/components/site/About";
import { Contact } from "@/components/site/Contact";
import { CtaProbetraining } from "@/components/site/CtaProbetraining";
import { Footer } from "@/components/site/Footer";
import { HeadlineUnderlineObserver } from "@/components/site/HeadlineUnderlineObserver";
import { IntroSequence } from "@/components/site/IntroSequence";
import { OpenDayBar, OpenDaySection } from "@/components/site/OpenDay";
import { News } from "@/components/site/News";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fight Club Hanau — Kampfsport für Groß und Klein" },
      { name: "description", content: "Kampfsport für Groß und Klein in Hanau: MMA, K1, Boxen, Thaiboxen, Self-Defense & Kindertraining ab 4 Jahren. Geleitstraße 66. Erstes Probetraining kostenlos." },
      { property: "og:title", content: "Fight Club Kampfsport Akademie Hanau — für Groß und Klein" },
      { name: "keywords", content: "Kampfsport Hanau, Kampfsport für Kinder, Kampfsport für Erwachsene, MMA Hanau, Kindertraining, Boxen, K1, Thaiboxen, Self-Defense" },
      { property: "og:description", content: "Kampfsport für Groß und Klein in Hanau: MMA, K1, Boxen, Thaiboxen, Self-Defense & Kindertraining ab 4 Jahren. Geleitstraße 66. Erstes Probetraining kostenlos." },
      { property: "og:url", content: "https://www.fightclub-hanau.de/" },
      { property: "og:image", content: "https://www.fightclub-hanau.de/kids-hero.jpg" },
      { name: "twitter:image", content: "https://www.fightclub-hanau.de/kids-hero.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Fight Club Kampfsport Akademie Hanau",
          url: "https://www.fightclub-hanau.de",
          image: "https://www.fightclub-hanau.de/kids-hero.jpg",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Geleitstraße 66",
            postalCode: "63456",
            addressLocality: "Hanau",
            addressCountry: "DE",
          },
          description: "Kampfsport für Groß und Klein in Hanau — Training für Kinder ab 4 Jahren, Jugendliche und Erwachsene.",
          audience: { "@type": "PeopleAudience", suggestedMinAge: 4, audienceType: "Kinder, Jugendliche und Erwachsene" },
          areaServed: "Hanau",
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "15:45", closes: "21:30" },
          ],
        }),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-white text-[#0a0a0a]">
      <IntroSequence />
      <OpenDayBar />
      <Nav />
      <Hero />
      <OpenDaySection />
      <Disciplines />
      <Schedule />
      <Stats />
      <About />
      <News />
      <Contact />
      <CtaProbetraining />
      <Footer />
      <Toaster position="bottom-right" />
      <HeadlineUnderlineObserver />
    </main>
  );
}
