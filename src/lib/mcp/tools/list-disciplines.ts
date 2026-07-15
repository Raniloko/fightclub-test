import { defineTool } from "@lovable.dev/mcp-js";

type Discipline = {
  name: string;
  short: string;
  description: string;
  learn: string[];
  who: string;
};

const DISCIPLINES: Discipline[] = [
  {
    name: "Kindertraining",
    short: "Kampfsport für Kinder — spielerisch, respektvoll, mit klaren Werten.",
    description:
      "Kampfsport für Kinder — spielerisch, respektvoll, mit echten Werten. Disziplin, Selbstvertrauen und Spaß.",
    learn: [
      "Grundlegende Kampfsporttechniken",
      "Respekt und Disziplin",
      "Selbstvertrauen aufbauen",
      "Konzentration und Koordination",
    ],
    who: "Kinder ab 5 Jahren",
  },
  {
    name: "MMA",
    short: "Mixed Martial Arts auf Wettkampfniveau — Standup, Clinch und Boden.",
    description:
      "Mixed Martial Arts kombiniert alle Kampfkünste — Standup, Clinch und Boden. Die vollständigste Kampfsportart der Welt.",
    learn: [
      "Schlagen und Treten",
      "Ringen und Werfen",
      "Bodenkampf und Submissions",
      "Wettkampfvorbereitung",
    ],
    who: "Fortgeschrittene und Wettkämpfer",
  },
  {
    name: "K1",
    short: "Explosiver Standup-Kampfsport — Fäuste, Kicks und Knie.",
    description:
      "K1 ist explosiver Standup-Kampfsport — Fäuste, Kicks und Knie. Schnell, kraftvoll, präzise.",
    learn: ["Schlagtechnik", "Beintechniken", "Clinch-Arbeit", "Kondition und Timing"],
    who: "Alle Level willkommen",
  },
  {
    name: "Boxen",
    short: "Klassisches Boxen — Fußarbeit, Timing, Schlagkraft.",
    description:
      "Das Fundament aller Kampfsportarten. Fußarbeit, Timing und Schlagkraft auf höchstem Niveau.",
    learn: [
      "Grundtechniken und Kombis",
      "Defensive",
      "Fußarbeit und Bewegung",
      "Sparring und Wettkampf",
    ],
    who: "Einsteiger bis Wettkämpfer",
  },
  {
    name: "Thaiboxen",
    short: "Die Kunst der acht Gliedmaßen — Muay Thai.",
    description:
      "Die Kunst der acht Gliedmaßen. Fäuste, Ellbogen, Knie und Kicks — vollständig integriert.",
    learn: [
      "Muay Thai Techniken",
      "Clinch und Sweeps",
      "Ellbogen- und Knietechniken",
      "Kondition und Charakter",
    ],
    who: "Einsteiger bis Fortgeschrittene",
  },
  {
    name: "Self-Defense",
    short: "Praxisnahe Selbstverteidigung für den Alltag.",
    description:
      "Realistische Selbstverteidigung: Situationen erkennen, deeskalieren und wenn nötig effektiv handeln.",
    learn: [
      "Situationsbewusstsein",
      "Deeskalation",
      "Effektive Techniken",
      "Mentale Stärke",
    ],
    who: "Alle Level willkommen",
  },
  {
    name: "Wing-Fight",
    short: "Direkte, funktionale Nahdistanz-Techniken.",
    description: "Funktionales Wing-Chun-basiertes Training für schnelle Nahkampf-Situationen.",
    learn: ["Nahdistanz-Techniken", "Reaktionsfähigkeit", "Struktur und Timing", "Sensitivität"],
    who: "Alle Level willkommen",
  },
];

export default defineTool({
  name: "list_disciplines",
  title: "Disziplinen auflisten",
  description:
    "Listet alle Kampfsport-Disziplinen der Fight Club MMA Akademie Hanau (Kindertraining, MMA, K1, Boxen, Thaiboxen, Self-Defense, Wing-Fight) mit Beschreibung, Lerninhalten und Zielgruppe.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(DISCIPLINES, null, 2) }],
    structuredContent: { disciplines: DISCIPLINES },
  }),
});
