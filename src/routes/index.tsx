import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Disciplines } from "@/components/site/Disciplines";
import { About } from "@/components/site/About";
import { Trainers } from "@/components/site/Trainers";
import { Schedule } from "@/components/site/Schedule";
import { CtaProbetraining } from "@/components/site/CtaProbetraining";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { HeadlineUnderlineObserver } from "@/components/site/HeadlineUnderlineObserver";
import { IntroSequence } from "@/components/site/IntroSequence";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fight Club Hanau — MMA · K1 · Boxen · Thaiboxen · Self-Defense" },
      {
        name: "description",
        content:
          "Neu in Hanau: Fight Club MMA Akademie. MMA, K1, Boxen, Thaiboxen, Self-Defense, Wing-Fight und Kindertraining. Erstes Training kostenlos.",
      },
      { property: "og:title", content: "Fight Club Hanau" },
      {
        property: "og:description",
        content: "Kein Sport. Ein Lebensstil. Kampfsport-Akademie in Hanau seit 2014.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-white text-[#0a0a0a]">
      <IntroSequence />
      <Nav />
      <Hero />
      <Stats />
      <Disciplines />
      <About />
      <Trainers />
      <Schedule />
      <CtaProbetraining />
      <Contact />
      <Footer />
      <Toaster position="bottom-right" />
      <HeadlineUnderlineObserver />
    </main>
  );
}
