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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fight Club Berlin — Muay Thai · MMA · Boxen · Kickboxen · BJJ" },
      {
        name: "description",
        content:
          "Fight Club Berlin — Kampfsport-Akademie seit 2014. Muay Thai, MMA, Boxen, Kickboxen und BJJ in Berlin. Erstes Training kostenlos.",
      },
      { property: "og:title", content: "Fight Club Berlin" },
      {
        property: "og:description",
        content: "Kein Sport. Ein Lebensstil. Kampfsport-Akademie in Berlin seit 2014.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-white text-[#0a0a0a]">
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
    </main>
  );
}
