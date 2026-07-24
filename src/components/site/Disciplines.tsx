import { useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";
import { X, Shield, Flame, Brain, Zap, Target, Users, Heart, Award, Smile } from "lucide-react";

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
    img: "https://images.pexels.com/photos/4754146/pexels-photo-4754146.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Kampfsport für Kinder — spielerisch, respektvoll, mit klaren Werten. Disziplin, Selbstvertrauen und Spaß.",
    what: "Kampfsport für Kinder — spielerisch, respektvoll, mit echten Werten.",
    learn: ["Grundlegende Kampfsporttechniken", "Respekt und Disziplin", "Selbstvertrauen aufbauen", "Konzentration und Koordination"],
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
    img: "https://images.pexels.com/photos/6296060/pexels-photo-6296060.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Mixed Martial Arts auf Wettkampfniveau. Standup, Clinch und Boden — vollständig integriert.",
    what: "Mixed Martial Arts kombiniert alle Kampfkünste — Standup, Clinch und Boden. Die vollständigste Kampfsportart der Welt.",
    learn: ["Schlagen und Treten", "Ringen und Werfen", "Bodenkampf und Submissions", "Wettkampfvorbereitung"],
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
    img: "https://images.pexels.com/photos/6998858/pexels-photo-6998858.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
    img: "https://images.pexels.com/photos/4761671/pexels-photo-4761671.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Klassisches Boxen für Einsteiger und Fortgeschrittene. Fußarbeit, Timing, Schlagkraft.",
    what: "Das Fundament aller Kampfsportarten. Fußarbeit, Timing und Schlagkraft auf höchstem Niveau.",
    learn: ["Grundtechniken und Kombis", "Defensive", "Fußarbeit und Bewegung", "Sparring und Wettkampf"],
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
    img: "https://images.pexels.com/photos/4761779/pexels-photo-4761779.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Die Kunst der acht Gliedmaßen. Technik, Kondition und mentale Stärke — Muay Thai ist der Kern unserer Akademie.",
    what: "Die Kunst der acht Gliedmaßen. Fäuste, Ellbogen, Knie und Kicks — vollständig integriert.",
    learn: ["Muay Thai Techniken", "Clinch und Sweeps", "Ellbogen- und Knietechniken", "Kondition und Charakter"],
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
    img: "https://images.pexels.com/photos/598631/pexels-photo-598631.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Realistische Selbstverteidigung für Alltag und Ernstfall. Klare Prinzipien, kein Showtraining.",
    what: "Realistische Selbstverteidigung für den Alltag. Keine Show — nur was wirklich funktioniert.",
    learn: ["Situationsbewusstsein", "Distanzmanagement", "Effektive Abwehrtechniken", "Ruhig bleiben unter Druck"],
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
    img: "https://images.pexels.com/photos/7045400/pexels-photo-7045400.jpeg?auto=compress&cs=tinysrgb&w=1200",
    text: "Effektive Nahkampftechnik aus dem Wing Tsun. Reflexe, Mitte und entspannte Kraft.",
    what: "Effektive Nahkampftechnik aus dem Wing Tsun. Reflexe, Mitte, entspannte Kraft.",
    learn: ["Zentrumlinie-Prinzip", "Chi Sao (Fühlübungen)", "Schnelle Reaktionen", "Effizienz über Kraft"],
    values: [
      { icon: Zap, label: "Sensibilität" },
      { icon: Target, label: "Effizienz" },
      { icon: Brain, label: "Kontrolle" },
    ],
    who: "Alle Altersgruppen",
    videoSrc: "https://videos.pexels.com/video-files/7045242/7045242-hd_1080_1920_30fps.mp4",
  },
];

function DisciplineCard({ c, open, onToggle }: { c: Discipline; open: boolean; onToggle: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (open) {
      videoRef.current?.play().catch(() => {});
      if (panelRef.current) setHeight(panelRef.current.scrollHeight);
    } else {
      videoRef.current?.pause();
      setHeight(0);
    }
  }, [open]);

  return (
    <article
      className={`group bg-white border-l-2 transition-colors ${open ? "border-[#C9A84C]" : "border-transparent hover:border-[#C9A84C]"}`}
    >
      <button type="button" onClick={onToggle} className="block w-full text-left" aria-expanded={open}>
        <div className="overflow-hidden">
          <img
            src={c.img}
            alt={c.name}
            loading="lazy"
            className="fc-gray h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-[280px]"
          />
        </div>
        <div className="bg-[#0a0a0a] p-6 text-white md:p-8">
          <div className="flex items-center justify-between gap-3">
            <span className="fc-tag fc-tag-solid">{c.name}</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C9A84C]">
              {open ? "× Schließen" : "› Mehr erfahren"}
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-white/75 md:text-[15px]">{c.text}</p>
        </div>
      </button>

      <div
        style={{ height, transition: "height 0.45s cubic-bezier(0.4,0,0.2,1)", overflow: "hidden" }}
        aria-hidden={!open}
      >
        <div ref={panelRef} className="bg-[#0a0a0a] text-white border-t border-white/10">
          <div className="relative p-6 md:p-8">
            <button
              type="button"
              onClick={onToggle}
              aria-label="Schließen"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center bg-white/5 hover:bg-[#C9A84C] hover:text-black transition-colors"
            >
              <X size={18} />
            </button>

            {/* Video placeholder */}
            <div className="relative w-full overflow-hidden bg-[#111111]" style={{ aspectRatio: "16/9" }}>
              <video
                ref={videoRef}
                src={c.videoSrc || ""}
                poster=""
                loop
                muted
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-display text-xl uppercase tracking-wide text-[#C9A84C]">
                  Was ist {c.name}?
                </h3>
                <p className="mt-3 text-sm text-white/80 md:text-[15px]">{c.what}</p>
              </div>
              <div>
                <h3 className="font-display text-xl uppercase tracking-wide text-[#C9A84C]">
                  Was lernst du?
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-white/85 md:text-[15px]">
                  {c.learn.map((l) => (
                    <li key={l} className="flex gap-2">
                      <span className="text-[#C9A84C]">›</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-display text-xl uppercase tracking-wide text-[#C9A84C]">
                Was vermitteln wir?
              </h3>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {c.values.map((v) => {
                  const Icon = v.icon;
                  return (
                    <div
                      key={v.label}
                      className="flex flex-col items-center gap-2 bg-white/5 p-4 text-center"
                    >
                      <Icon size={22} />
                      <span className="text-xs uppercase tracking-[0.15em] text-white/85 md:text-sm">
                        {v.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="font-display text-xl uppercase tracking-wide text-[#C9A84C]">Für wen?</h3>
              <p className="mt-2 text-sm text-white/80 md:text-[15px]">{c.who}</p>
            </div>

            <a
              href="/kontakt"
              className="mt-8 inline-block bg-[#C9A84C] px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white hover:bg-[#E8C96A] transition-colors"
            >
              Probetraining anfragen
            </a>

          </div>
        </div>
      </div>
    </article>
  );
}

export function Disciplines() {
  const [openName, setOpenName] = useState<string | null>(null);

  return (
    <section id="disziplinen" className="bg-white pt-12 md:pt-20 pb-0">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
              Was wir trainieren
            </span>
          </div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl">
            <span className="fc-headline-underline">Unsere Disziplinen</span>
          </h2>
        </Reveal>

        <div id="training" className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
          {CARDS.map((c) => (
            <Reveal key={c.name}>
              <DisciplineCard
                c={c}
                open={openName === c.name}
                onToggle={() => setOpenName(openName === c.name ? null : c.name)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
