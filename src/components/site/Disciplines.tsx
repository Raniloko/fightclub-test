import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Shield, Flame, Brain, Zap, Target, Users, Heart, Award, Smile } from "lucide-react";

type Discipline = {
  name: string;
  img: string;
  text: string;
  what: string;
  learn: string[];
  values: { icon: React.ComponentType<{ size?: number }>; label: string }[];
  who: string;
  videoSrc?: string;
};

const CARDS: Discipline[] = [
  {
    name: "Kindertraining",
    img: "https://images.pexels.com/photos/7045594/pexels-photo-7045594.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Kampfsport für Kinder — spielerisch, respektvoll, mit klaren Werten. Disziplin, Selbstvertrauen und Spaß.",
    what: "Kampfsport für Kinder — spielerisch, respektvoll, mit echten Werten.",
    learn: [
      "Grundlegende Kampfsporttechniken",
      "Respekt und Disziplin",
      "Selbstvertrauen aufbauen",
      "Konzentration und Koordination",
    ],
    values: [
      { icon: Heart, label: "Respekt" },
      { icon: Smile, label: "Spaß" },
      { icon: Users, label: "Selbstbewusstsein" },
    ],
    who: "Kinder ab 5 Jahren",
    videoSrc: "https://videos.pexels.com/video-files/7045247/7045247-hd_1080_1920_30fps.mp4",
  },
  {
    name: "MMA",
    img: "https://images.pexels.com/photos/5485439/pexels-photo-5485439.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Mixed Martial Arts auf Wettkampfniveau. Standup, Clinch und Boden — vollständig integriert.",
    what: "Mixed Martial Arts kombiniert alle Kampfkünste — Standup, Clinch und Boden. Die vollständigste Kampfsportart der Welt.",
    learn: [
      "Schlagen und Treten",
      "Ringen und Werfen",
      "Bodenkampf und Submissions",
      "Wettkampfvorbereitung",
    ],
    values: [
      { icon: Shield, label: "Disziplin" },
      { icon: Flame, label: "Mut" },
      { icon: Award, label: "Ausdauer" },
    ],
    who: "Fortgeschrittene und Wettkämpfer",
    videoSrc: "https://videos.pexels.com/video-files/6296580/6296580-uhd_2560_1080_25fps.mp4",
  },
  {
    name: "K1",
    img: "https://images.pexels.com/photos/6295992/pexels-photo-6295992.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Explosivität und Präzision. K1 verbindet Boxen, Kicks und Knietechniken zu einem kompletten Standup-System.",
    what: "K1 ist explosiver Standup-Kampfsport — Fäuste, Kicks und Knie. Schnell, kraftvoll, präzise.",
    learn: ["Schlagtechnik", "Beintechniken", "Clinch-Arbeit", "Kondition und Timing"],
    values: [
      { icon: Flame, label: "Kraft" },
      { icon: Zap, label: "Schnelligkeit" },
      { icon: Target, label: "Fokus" },
    ],
    who: "Alle Level willkommen",
    videoSrc: "https://videos.pexels.com/video-files/4804855/4804855-hd_1920_1080_25fps.mp4",
  },
  {
    name: "Boxen",
    img: "https://images.pexels.com/photos/9944908/pexels-photo-9944908.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Klassisches Boxen für Einsteiger und Fortgeschrittene. Fußarbeit, Timing, Schlagkraft.",
    what: "Das Fundament aller Kampfsportarten. Fußarbeit, Timing und Schlagkraft auf höchstem Niveau.",
    learn: [
      "Grundtechniken und Kombis",
      "Defensive",
      "Fußarbeit und Bewegung",
      "Sparring und Wettkampf",
    ],
    values: [
      { icon: Brain, label: "Geduld" },
      { icon: Target, label: "Präzision" },
      { icon: Heart, label: "Respekt" },
    ],
    who: "Einsteiger bis Wettkämpfer",
    videoSrc: "https://videos.pexels.com/video-files/6684960/6684960-hd_1920_1080_30fps.mp4",
  },
  {
    name: "Thaiboxen",
    img: "https://images.pexels.com/photos/5750947/pexels-photo-5750947.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Die Kunst der acht Gliedmaßen. Technik, Kondition und mentale Stärke — Muay Thai ist der Kern unserer Akademie.",
    what: "Die Kunst der acht Gliedmaßen. Fäuste, Ellbogen, Knie und Kicks — vollständig integriert.",
    learn: [
      "Muay Thai Techniken",
      "Clinch und Sweeps",
      "Ellbogen- und Knietechniken",
      "Kondition und Charakter",
    ],
    values: [
      { icon: Shield, label: "Disziplin" },
      { icon: Flame, label: "Härte" },
      { icon: Heart, label: "Respekt" },
    ],
    who: "Alle Level",
    videoSrc: "https://videos.pexels.com/video-files/15527457/15527457-hd_1920_1080_24fps.mp4",
  },
  {
    name: "Self-Defense",
    img: "https://images.pexels.com/photos/6455245/pexels-photo-6455245.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Realistische Selbstverteidigung für Alltag und Ernstfall. Klare Prinzipien, kein Showtraining.",
    what: "Realistische Selbstverteidigung für den Alltag. Keine Show — nur was wirklich funktioniert.",
    learn: [
      "Situationsbewusstsein",
      "Distanzmanagement",
      "Effektive Abwehrtechniken",
      "Ruhig bleiben unter Druck",
    ],
    values: [
      { icon: Award, label: "Selbstvertrauen" },
      { icon: Shield, label: "Sicherheit" },
      { icon: Brain, label: "Klarheit" },
    ],
    who: "Absolute Einsteiger, Frauen und Männer",
    videoSrc: "https://videos.pexels.com/video-files/7988988/7988988-uhd_4096_2160_25fps.mp4",
  },
  {
    name: "Wing-Fight",
    img: "https://images.pexels.com/photos/29817841/pexels-photo-29817841.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Effektive Nahkampftechnik aus dem Wing Tsun. Reflexe, Mitte und entspannte Kraft.",
    what: "Effektive Nahkampftechnik aus dem Wing Tsun. Reflexe, Mitte, entspannte Kraft.",
    learn: [
      "Zentrumlinie-Prinzip",
      "Chi Sao (Fühlübungen)",
      "Schnelle Reaktionen",
      "Effizienz über Kraft",
    ],
    values: [
      { icon: Zap, label: "Sensibilität" },
      { icon: Target, label: "Effizienz" },
      { icon: Brain, label: "Kontrolle" },
    ],
    who: "Alle Altersgruppen",
    videoSrc: "https://videos.pexels.com/video-files/7045242/7045242-hd_1080_1920_30fps.mp4",
  },
  {
    name: "Submission Grappling",
    img: "https://images.pexels.com/photos/8612462/pexels-photo-8612462.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Bodenkampf ohne Schläge. Kontrolle, Hebel und Würgetechniken — Technik schlägt Kraft.",
    what: "Bodenkampf ohne Schläge — Positionen, Kontrolle und Submissions. Technik schlägt Kraft.",
    learn: [
      "Positionskontrolle",
      "Hebel- und Würgetechniken",
      "Takedowns und Sweeps",
      "Rollen und Sparring",
    ],
    values: [
      { icon: Brain, label: "Taktik" },
      { icon: Target, label: "Technik" },
      { icon: Award, label: "Ausdauer" },
    ],
    who: "Alle Level",
    videoSrc: "https://videos.pexels.com/video-files/8611969/8611969-hd_1920_1080_25fps.mp4",
  },
  {
    name: "Wettkampf-Boxen",
    img: "https://images.pexels.com/photos/12860553/pexels-photo-12860553.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Gezielte Wettkampfvorbereitung im Boxen — Sparring, Taktik und Kampfhärte.",
    what: "Leistungstraining für Athletinnen und Athleten, die in den Ring wollen.",
    learn: [
      "Sparring auf Wettkampfniveau",
      "Kampftaktik und Ringgefühl",
      "Athletik und Gewichtsmanagement",
      "Mentale Vorbereitung",
    ],
    values: [
      { icon: Flame, label: "Kampfgeist" },
      { icon: Shield, label: "Disziplin" },
      { icon: Target, label: "Präzision" },
    ],
    who: "Fortgeschrittene mit Wettkampfziel",
  },
  {
    name: "Kickboxen & Boxen für Frauen",
    img: "https://images.pexels.com/photos/6296049/pexels-photo-6296049.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Training in geschütztem Rahmen — Fitness, Technik und Selbstvertrauen.",
    what: "Kickboxen und Boxen speziell für Frauen — technisch sauber, fordernd und ohne Druck.",
    learn: [
      "Schlag- und Tritttechniken",
      "Pratzentraining",
      "Kondition und Kraft",
      "Selbstbewusstsein im Alltag",
    ],
    values: [
      { icon: Heart, label: "Gemeinschaft" },
      { icon: Award, label: "Selbstvertrauen" },
      { icon: Zap, label: "Power" },
    ],
    who: "Frauen, alle Level",
  },
  {
    name: "Personal Training",
    img: "https://images.pexels.com/photos/6551189/pexels-photo-6551189.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Einzeltraining nach Termin — individuell auf dein Ziel abgestimmt.",
    what: "1-zu-1 Training mit deinem Coach — maximaler Fortschritt in kurzer Zeit.",
    learn: [
      "Individueller Trainingsplan",
      "Technikkorrektur im Detail",
      "Athletik und Kondition",
      "Zielgerichtete Wettkampfvorbereitung",
    ],
    values: [
      { icon: Target, label: "Fokus" },
      { icon: Brain, label: "Analyse" },
      { icon: Flame, label: "Intensität" },
    ],
    who: "Alle Level, nach Terminvereinbarung",
  },
];

type Group = "erwachsene" | "kinder" | "frauen";

const FILTERS: { key: "alle" | Group; label: string }[] = [
  { key: "alle", label: "Alle" },
  { key: "erwachsene", label: "Erwachsene" },
  { key: "kinder", label: "Kinder & Jugend" },
  { key: "frauen", label: "Frauen" },
];

const GROUPS: Record<string, Group[]> = {
  Kindertraining: ["kinder"],
  MMA: ["erwachsene"],
  K1: ["erwachsene"],
  Boxen: ["erwachsene"],
  Thaiboxen: ["erwachsene"],
  "Self-Defense": ["erwachsene", "frauen"],
  "Wing-Fight": ["erwachsene"],
  "Submission Grappling": ["erwachsene"],
  "Wettkampf-Boxen": ["erwachsene"],
  "Kickboxen & Boxen für Frauen": ["frauen"],
  "Personal Training": ["erwachsene", "frauen"],
};

function DisciplineTile({ c, onOpen }: { c: Discipline; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative block aspect-[3/4] w-full overflow-hidden bg-[#0a0a0a] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4DC] focus-visible:ring-offset-2"
      aria-haspopup="dialog"
    >
      <img
        src={c.img}
        alt={`${c.name} – Training bei Fight Club Hanau`}
        loading="lazy"
        className="fc-gray absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/0" />
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C] md:text-[11px]">
          {c.who}
        </span>
        <h3 className="mt-1.5 font-display text-[22px] uppercase leading-[0.95] text-white md:text-3xl">
          {c.name}
        </h3>
        <p className="mt-2 hidden text-[13px] leading-snug text-white/70 md:line-clamp-2">
          {c.text}
        </p>
        <span className="mt-3 hidden items-center gap-2 text-[11px] md:inline-flex font-semibold uppercase tracking-[0.2em] text-[#00B4DC]">
          Mehr erfahren
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </button>
  );
}

function DisciplineDetail({ c }: { c: Discipline }) {
  return (
    <div className="text-white">
      <div className="relative w-full overflow-hidden bg-[#111111]" style={{ aspectRatio: "16/9" }}>
        {c.videoSrc ? (
          <video
            src={c.videoSrc}
            poster={c.img}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <img
            src={c.img}
            alt={`${c.name} – Training bei Fight Club Hanau`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>

      <div className="p-6 md:p-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">
          {c.who}
        </span>
        <SheetTitle className="mt-2 font-display text-4xl uppercase leading-none text-white md:text-5xl">
          {c.name}
        </SheetTitle>
        <SheetDescription className="mt-4 text-[15px] leading-relaxed text-white/80">
          {c.what}
        </SheetDescription>

        <h4 className="mt-8 font-display text-lg uppercase tracking-wide text-[#C9A84C]">
          Was lernst du?
        </h4>
        <ul className="mt-3 grid gap-2 text-[15px] text-white/85 sm:grid-cols-2">
          {c.learn.map((l) => (
            <li key={l} className="flex gap-2">
              <span className="text-[#00B4DC]">›</span>
              <span>{l}</span>
            </li>
          ))}
        </ul>

        <h4 className="mt-8 font-display text-lg uppercase tracking-wide text-[#C9A84C]">
          Was vermitteln wir?
        </h4>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {c.values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.label}
                className="flex flex-col items-center gap-2 bg-white/5 p-3 text-center"
              >
                <Icon size={20} />
                <span className="text-[11px] uppercase tracking-[0.12em] text-white/85">
                  {v.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <Link
            to="/probetraining"
            className="fc-btn-cyan inline-flex items-center justify-center gap-3 px-6 py-4 font-display text-[14px] font-extrabold uppercase tracking-[0.15em] text-black"
          >
            Probetraining anfragen <span aria-hidden="true">→</span>
          </Link>
          {c.name === "Kindertraining" && (
            <Link
              to="/kindertraining"
              className="text-center text-[12px] font-semibold uppercase tracking-[0.2em] text-[#00B4DC] hover:text-white"
            >
              Mehr zum Kindertraining ›
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function Disciplines() {
  const [filter, setFilter] = useState<"alle" | Group>("alle");
  const [active, setActive] = useState<Discipline | null>(null);
  const isMobile = useIsMobile();

  const visible = filter === "alle" ? CARDS : CARDS.filter((c) => GROUPS[c.name]?.includes(filter));

  return (
    <section id="disziplinen" className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
              Was wir trainieren
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="font-display text-5xl md:text-7xl">
              <span className="fc-headline-underline">Unsere Disziplinen</span>
            </h2>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Disziplinen filtern">
              {FILTERS.map((f) => {
                const on = filter === f.key;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    aria-pressed={on}
                    className={`border px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                      on
                        ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                        : "border-black/15 text-black/70 hover:border-[#0a0a0a] hover:text-black"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div
          id="training"
          className="mt-10 grid grid-cols-2 gap-3 md:mt-12 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
        >
          {visible.map((c) => (
            <DisciplineTile key={c.name} c={c} onOpen={() => setActive(c)} />
          ))}
        </div>
      </div>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className="max-h-[92vh] overflow-y-auto border-white/10 bg-[#0a0a0a] p-0 text-white sm:max-w-xl [&>button]:z-10 [&>button]:bg-black/60 [&>button]:p-1.5 [&>button]:text-white [&>button]:opacity-100"
        >
          {active && <DisciplineDetail c={active} />}
        </SheetContent>
      </Sheet>
    </section>
  );
}
