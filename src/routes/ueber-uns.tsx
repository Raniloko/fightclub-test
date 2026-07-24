import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { OpenDayBar } from "@/components/site/OpenDay";
import { PageHeader } from "@/components/site/PageHeader";
import { About } from "@/components/site/About";
import { Faq } from "@/components/site/Faq";
import { CtaProbetraining } from "@/components/site/CtaProbetraining";
import { HeadlineUnderlineObserver } from "@/components/site/HeadlineUnderlineObserver";

export const Route = createFileRoute("/ueber-uns")({
  head: () => ({
    meta: [
      { title: "Über uns — Fight Club Hanau" },
      { name: "description", content: "Die Fight Club Kampfsport Akademie Hanau — unsere Geschichte, Werte und Antworten auf häufige Fragen." },
      { property: "og:title", content: "Über uns — Fight Club Hanau" },
      { property: "og:description", content: "Unsere Geschichte, Werte und häufige Fragen." },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/ueber-uns" }],
  }),
  component: UeberUnsPage,
});

function UeberUnsPage() {
  return (
    <main className="bg-white text-[#0a0a0a]">
      <OpenDayBar />
      <Nav />
      <PageHeader eyebrow="Unsere Geschichte" title="Über uns" />
      <About />
      <Faq />
      <section className="bg-[#0a0a0a] py-16 text-center text-white md:py-24">
        <div className="mx-auto max-w-[900px] px-5 md:px-10">
          <div className="flex items-center justify-center gap-3">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
              Trainer
            </span>
            <span className="block h-px w-8 bg-[#C9A84C]" />
          </div>
          <h2 className="mt-4 font-display text-4xl uppercase text-white md:text-5xl">
            Unser Trainerteam
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 md:text-[17px]">
            Unsere Trainer stellen sich bald vor.
          </p>
        </div>
      </section>
      <CtaProbetraining />
      <Footer />
      <HeadlineUnderlineObserver />
    </main>
  );
}
