import { useState } from "react";
import { Reveal } from "./Reveal";

type QA = { q: string; a: string };

export const FAQS: QA[] = [
  {
    q: "Kann ich ohne Vorerfahrung mit dem Training in Hanau starten?",
    a: "Ja, du brauchst keine Vorerfahrung. Wir holen dich auf deinem Level ab und führen dich Schritt für Schritt ins Training ein — egal ob MMA, Boxen, K1 oder Thaiboxen.",
  },
  {
    q: "Ist Mixed Martial Arts (MMA) gefährlich?",
    a: "MMA ist im Wettkampf ein intensiver Vollkontaktsport. Im Training achten wir sorgfältig auf deine Sicherheit und führen dich kontrolliert an Technik und Intensität heran.",
  },
  {
    q: "Gibt es ein kostenloses Probetraining?",
    a: "Ja, du kannst bei uns ein kostenloses und unverbindliches Probetraining absolvieren. Danach schauen wir gemeinsam, wie es für dich weitergeht.",
  },
  {
    q: "Ab wann darf mein Kind zum Training kommen?",
    a: "Unser Kinder- und Jugendtraining bieten wir für Teilnehmer ab 5 Jahren an. Spielerisch, respektvoll und mit klaren Werten.",
  },
  {
    q: "Was muss ich für das Probetraining mitbringen?",
    a: "Für dein Probetraining brauchst du nur Sportkleidung und gute Laune. Das passende Equipment haben wir vor Ort.",
  },
  {
    q: "Wo findet das Training statt?",
    a: "Unsere Akademie befindet sich in der Geleitstraße 66, 63456 Hanau. Parkplätze sind in der Umgebung vorhanden.",
  },
  {
    q: "Welche Kampfsportarten bietet ihr an?",
    a: "MMA, K1, Boxen, Thaiboxen, Self-Defense, Wing-Fight sowie ein spezielles Kindertraining. Für jedes Level und jedes Ziel das passende Angebot.",
  },
];

function Item({ item, open, onToggle }: { item: QA; open: boolean; onToggle: () => void }) {
  return (
    <div className={`border border-[#C9A84C]/40 ${open ? "bg-[#C9A84C]" : "bg-white"}`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-5 py-4 text-left md:px-6 md:py-5"
      >
        <span
          aria-hidden
          className={`flex h-7 w-7 shrink-0 items-center justify-center text-2xl font-bold leading-none ${
            open ? "text-white" : "text-[#C9A84C]"
          }`}
        >
          {open ? "−" : "+"}
        </span>
        <span
          className={`text-[15px] font-medium md:text-[17px] ${
            open ? "text-black" : "text-[#0a0a0a]"
          }`}
        >
          {item.q}
        </span>
      </button>
      {open && (
        <div className="border-t border-[#C9A84C]/40 bg-white px-5 py-5 md:px-6 md:py-6">
          <p className="text-[14px] leading-relaxed text-[#0a0a0a]/80 md:text-[15px]">{item.a}</p>
        </div>
      )}
    </div>
  );
}

export function Faq() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1000px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center justify-center gap-3">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
              FAQ
            </span>
            <span className="block h-px w-8 bg-[#C9A84C]" />
          </div>
          <h1 className="mt-4 text-center font-display text-5xl md:text-6xl">
            Häufig gestellte<br />Fragen
          </h1>
          <div className="mx-auto mt-4 h-[3px] w-14 bg-[#C9A84C]" />
        </Reveal>

        <div className="mt-10 space-y-3 md:mt-14">
          {FAQS.map((item, i) => (
            <Item
              key={item.q}
              item={item}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
