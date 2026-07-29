import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { OpenDayBar } from "@/components/site/OpenDay";
import { Faq, FAQS } from "@/components/site/Faq";
import { CtaProbetraining } from "@/components/site/CtaProbetraining";
import { HeadlineUnderlineObserver } from "@/components/site/HeadlineUnderlineObserver";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Fight Club Hanau" },
      { name: "description", content: "Antworten auf häufig gestellte Fragen rund um Training, Anmeldung und Ablauf bei Fight Club Hanau." },
      { property: "og:title", content: "FAQ — Fight Club Hanau" },
      { property: "og:description", content: "Antworten auf häufig gestellte Fragen." },
      { property: "og:url", content: "https://www.fightclub-hanau.de/faq" },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/faq" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),

  component: FaqPage,
});

function FaqPage() {
  return (
    <main className="bg-white text-[#0a0a0a]">
      <OpenDayBar />
      <Nav />
      <div className="h-24 bg-[#0a0a0a]" />
      <Faq />
      <CtaProbetraining />
      <Footer />
      <HeadlineUnderlineObserver />
    </main>
  );
}
