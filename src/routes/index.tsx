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
import { News } from "@/components/site/News";
import { MmaAnnouncement } from "@/components/site/MmaAnnouncement";
import { Trainers } from "@/components/site/Trainers";

const SITE_URL = "https://www.fightclub-hanau.de";
const TITLE = "Kampfsport in Hanau: MMA, Boxen, K1 & Kinder | Fight Club";
const DESCRIPTION =
  "Kampfsport in Hanau: MMA, K1, Boxen, Thaiboxen, Self-Defense und Kindertraining ab 5 Jahren. Geleitstraße 66, 63456 Hanau. Erstes Probetraining kostenlos.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}/kids-hero.jpg` },
      { property: "og:image:alt", content: "Kampfsporttraining bei Fight Club Hanau" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/kids-hero.jpg` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Fight Club Kampfsport Akademie Hanau",
          alternateName: "Fight Club Hanau",
          url: SITE_URL,
          logo: `${SITE_URL}/logo.png`,
          image: `${SITE_URL}/kids-hero.jpg`,
          telephone: "+4915563344488",
          email: "info@fightclub-hanau.de",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Geleitstraße 66",
            postalCode: "63456",
            addressLocality: "Hanau",
            addressCountry: "DE",
          },
          description: DESCRIPTION,
          audience: { "@type": "PeopleAudience", suggestedMinAge: 5, audienceType: "Kinder, Jugendliche und Erwachsene" },
          areaServed: "Hanau",
          sameAs: [
            "https://www.instagram.com/fightclubhanau",
            "https://www.tiktok.com/@fightclub_hanau",
            "https://www.facebook.com/share/1D1mQLdM8w/",
            "https://youtube.com/@fightclubhanau",
          ],
          openingHoursSpecification: [
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "15:45", closes: "21:30" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "11:00", closes: "13:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "13:00", closes: "22:00" },
            { "@type": "OpeningHoursSpecification", dayOfWeek: ["Sunday"], opens: "10:00", closes: "22:00" },
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
      <Nav transparentOnTop />
      <Hero />
      <Stats />
      <MmaAnnouncement />
      <Disciplines />
      <Trainers />
      <Schedule />
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
