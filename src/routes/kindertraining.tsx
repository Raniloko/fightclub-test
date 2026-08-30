import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Kindertraining } from "@/components/site/Kindertraining";
import { HeadlineUnderlineObserver } from "@/components/site/HeadlineUnderlineObserver";

const BASE_URL = "https://www.fightclub-hanau.de";

export const Route = createFileRoute("/kindertraining")({
  head: () => ({
    meta: [
      { title: "Kampfsport für Kinder in Hanau — Fight Club MMA Akademie" },
      { name: "description", content: "Kampfsport für Kinder ab 5 Jahren in Hanau. Disziplin, Selbstvertrauen, Respekt. Jetzt kostenloses Probetraining vereinbaren." },
      { property: "og:title", content: "Kampfsport für Kinder in Hanau — Fight Club MMA Akademie" },
      { property: "og:description", content: "Kampfsport für Kinder ab 5 Jahren in Hanau. Disziplin, Selbstvertrauen, Respekt. Jetzt kostenloses Probetraining vereinbaren." },
      { property: "og:url", content: `${BASE_URL}/kindertraining` },
    ],
    links: [{ rel: "canonical", href: `${BASE_URL}/kindertraining` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "LocalBusiness",
              name: "Fight Club Kampfsport Akademie Hanau",
              url: BASE_URL,
              image: `${BASE_URL}/kids-hero.jpg`,
              address: {
                "@type": "PostalAddress",
                streetAddress: "Geleitstraße 66",
                postalCode: "63456",
                addressLocality: "Hanau",
                addressCountry: "DE",
              },
              telephone: "015563344488",
              email: "info@fightclub-hanau.de",
              areaServed: "Hanau",
            },
            {
              "@type": "Course",
              name: "Kampfsport für Kinder",
              description: "Kampfsporttraining für Kinder und Jugendliche ab 5 Jahren in Hanau.",
              provider: { "@type": "LocalBusiness", name: "Fight Club Kampfsport Akademie Hanau" },
              educationalLevel: "Kinder ab 5 Jahren, Jugendliche",
              teaches: ["Boxen", "Thaiboxen", "Ringen", "Selbstbehauptung", "Respekt", "Disziplin"],
            },
          ],
        }),
      },
    ],
  }),
  component: KindertrainingPage,
});

function KindertrainingPage() {
  return (
    <main className="bg-white text-[#0a0a0a]">
      <Nav />
      <div className="h-24 bg-[#0a0a0a]" />
      <Kindertraining />
      <Footer />
      <HeadlineUnderlineObserver />
    </main>
  );
}
