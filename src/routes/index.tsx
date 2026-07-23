import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Disciplines } from "@/components/site/Disciplines";
import { About } from "@/components/site/About";

import { Schedule } from "@/components/site/Schedule";
import { CtaProbetraining } from "@/components/site/CtaProbetraining";
import { Faq } from "@/components/site/Faq";
import { Schulordnung } from "@/components/site/Schulordnung";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { HeadlineUnderlineObserver } from "@/components/site/HeadlineUnderlineObserver";
import { IntroSequence } from "@/components/site/IntroSequence";
import { OpenDayBar, OpenDaySection } from "@/components/site/OpenDay";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fight Club Hanau — MMA & Kampfsport-Akademie" },
      {
        name: "description",
        content:
          "MMA, K1, Boxen, Thaiboxen, Self-Defense und Kindertraining in Hanau. Geleitstraße 66. Erstes Probetraining kostenlos.",
      },
      { property: "og:title", content: "Fight Club MMA Akademie Hanau" },
      {
        property: "og:description",
        content:
          "MMA, K1, Boxen, Thaiboxen, Self-Defense und Kindertraining in Hanau. Geleitstraße 66. Erstes Probetraining kostenlos.",
      },
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
          name: "Fight Club MMA Akademie Hanau",
          url: "https://www.fightclub-hanau.de",
          image: "https://www.fightclub-hanau.de/kids-hero.jpg",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Geleitstraße 66",
            postalCode: "63456",
            addressLocality: "Hanau",
            addressCountry: "DE",
          },
          areaServed: "Hanau",
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "07:00",
              closes: "22:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "09:00",
              closes: "15:00",
            },
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
      <Stats />
      <Disciplines />
      <About />
      <Schedule />
      <CtaProbetraining />
      <Faq />
      <Schulordnung />
      <Contact />
      <Footer />
      <Toaster position="bottom-right" />
      <HeadlineUnderlineObserver />
    </main>
  );
}
