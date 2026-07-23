import { Reveal } from "./Reveal";
import {
  Handshake,
  Clock,
  Shirt,
  ShieldCheck,
  Swords,
  Dumbbell,
  Trash2,
  SmartphoneNfc,
  Users,
  Star,
  AlertTriangle,
  Shield,
  UsersRound,
} from "lucide-react";

type Rule = { icon: React.ComponentType<{ className?: string }>; title: string; text: string };

const RULES: Rule[] = [
  { icon: Handshake, title: "Respekt", text: "Respektiere Trainer, Mitglieder und Gäste. Kein Mobbing, keine Beleidigungen, keine Gewalt." },
  { icon: Clock, title: "Pünktlichkeit", text: "Sei 10 Minuten vor Trainingsbeginn da. Zu spät? Melde dich beim Trainer." },
  { icon: Shirt, title: "Hygiene", text: "Saubere Trainingskleidung, saubere Hände und Füße. Kurze Nägel, kein Schmuck." },
  { icon: ShieldCheck, title: "Sicherheit", text: "Anweisungen der Trainer befolgen. Verletzungen sofort melden." },
  { icon: Swords, title: "Verhalten im Training", text: "Fair trainieren, keine unnötige Härte. Technik geht vor Kraft, danke deinem Partner." },
  { icon: Dumbbell, title: "Equipment", text: "Sorgfältig behandeln, reinigen und zurücklegen. Beschädigungen sofort melden." },
  { icon: Trash2, title: "Ordnung & Sauberkeit", text: "Halte die Schule sauber. Müll in die Eimer, Essen nur draußen." },
  { icon: SmartphoneNfc, title: "Handy & Fotos", text: "Handys lautlos. Fotos/Videos nur mit Erlaubnis." },
  { icon: Users, title: "Umgang miteinander", text: "Höflich, hilfsbereit und teamorientiert. Wir sind ein Team!" },
  { icon: Star, title: "Verantwortung", text: "Jeder haftet für seine Sachen. Mit Einrichtung und Inventar sorgsam umgehen." },
];

const NOTES = [
  {
    icon: AlertTriangle,
    title: "Haftungsausschluss",
    text: "Das Training erfolgt auf eigene Verantwortung. Für Wertgegenstände, Kleidung und persönliche Gegenstände übernimmt die Fight Club Kampfsport Akademie keine Haftung. Für selbstverschuldete Unfälle oder Schäden wird keine Haftung übernommen.",
  },
  {
    icon: Shield,
    title: "Schadensersatz",
    text: "Bei mutwilliger Beschädigung oder Zerstörung von Vereinseigentum, Trainingsgeräten oder Räumlichkeiten haftet der verursachende Schüler in voller Höhe für die entstehenden Kosten.",
  },
  {
    icon: UsersRound,
    title: "Minderjährige",
    text: "Bei minderjährigen Schülern geht die Haftung für mutwillig oder fahrlässig verursachte Schäden auf die gesetzlichen Vertreter über.",
  },
];

export function Schulordnung() {
  return (
    <section id="schulordnung" className="bg-[#0a0a0a] py-20 md:py-28 text-white">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center justify-center gap-3">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
              Regeln der Akademie
            </span>
            <span className="block h-px w-8 bg-[#C9A84C]" />
          </div>
          <h2 className="mt-4 text-center font-display text-5xl md:text-6xl text-[#C9A84C]">
            Schulordnung
          </h2>
          <div className="mx-auto mt-4 h-[3px] w-14 bg-[#C9A84C]" />
          <p className="mx-auto mt-6 max-w-2xl text-center text-[14px] leading-relaxed text-white/70 md:text-[15px]">
            Mit Betreten der Trainingsfläche erkennen alle Mitglieder diese Schulordnung an und verpflichten sich, diese einzuhalten.
          </p>
        </Reveal>

        <ol className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-5">
          {RULES.map((r, i) => {
            const Icon = r.icon;
            return (
              <li
                key={r.title}
                className="group flex gap-4 border border-[#C9A84C]/30 bg-[#111] p-5 transition-colors hover:border-[#C9A84C] md:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#C9A84C]/50 bg-[#0a0a0a] text-[#C9A84C] md:h-14 md:w-14">
                  <Icon className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-2xl text-[#C9A84C] md:text-3xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl uppercase text-white md:text-2xl">
                      {r.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-white/75 md:text-[15px]">
                    {r.text}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {NOTES.map((n) => {
            const Icon = n.icon;
            return (
              <div
                key={n.title}
                className="border border-[#C9A84C]/40 bg-gradient-to-b from-[#141414] to-[#0a0a0a] p-5 md:p-6"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-6 w-6 text-[#C9A84C]" />
                  <h4 className="font-display text-lg uppercase text-[#C9A84C] md:text-xl">
                    {n.title}
                  </h4>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-white/70 md:text-[14px]">
                  {n.text}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-[#C9A84C]/30 pt-8 text-center font-display text-lg uppercase tracking-[0.2em] text-[#C9A84C] md:text-2xl">
          <span>Respekt</span>
          <span className="text-[#C9A84C]/50">•</span>
          <span>Disziplin</span>
          <span className="text-[#C9A84C]/50">•</span>
          <span>Fairness</span>
          <span className="text-[#C9A84C]/50">•</span>
          <span>Teamgeist</span>
        </div>
        <p className="mt-3 text-center text-[11px] uppercase tracking-[0.3em] text-white/50">
          Trainieren · Lernen · Wachsen
        </p>
      </div>
    </section>
  );
}
