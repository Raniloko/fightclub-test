import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

type Cls = { time: string; disc: string; level: string; trainer: string };

const SCHEDULE: Record<string, Cls[]> = {
  MON: [
    { time: "07:00", disc: "Boxen", level: "Alle Level", trainer: "[Trainer]" },
    { time: "16:30", disc: "Kindertraining", level: "Kids", trainer: "[Trainer]" },
    { time: "18:00", disc: "Thaiboxen", level: "Einsteiger", trainer: "[Trainer]" },
    { time: "19:30", disc: "MMA", level: "Fortgeschritten", trainer: "[Trainer]" },
  ],
  TUE: [
    { time: "18:00", disc: "K1", level: "Alle Level", trainer: "[Trainer]" },
    { time: "19:30", disc: "Self-Defense", level: "Alle Level", trainer: "[Trainer]" },
  ],
  WED: [
    { time: "07:00", disc: "K1", level: "Alle Level", trainer: "[Trainer]" },
    { time: "16:30", disc: "Kindertraining", level: "Kids", trainer: "[Trainer]" },
    { time: "18:00", disc: "Boxen", level: "Einsteiger", trainer: "[Trainer]" },
    { time: "19:30", disc: "Thaiboxen", level: "Fortgeschritten", trainer: "[Trainer]" },
  ],
  THU: [
    { time: "18:00", disc: "MMA", level: "Einsteiger", trainer: "[Trainer]" },
    { time: "19:30", disc: "Wing-Fight", level: "Alle Level", trainer: "[Trainer]" },
  ],
  FRI: [
    { time: "07:00", disc: "MMA", level: "Alle Level", trainer: "[Trainer]" },
    { time: "16:30", disc: "Kindertraining", level: "Kids", trainer: "[Trainer]" },
    { time: "18:00", disc: "Self-Defense", level: "Einsteiger", trainer: "[Trainer]" },
    { time: "19:30", disc: "K1", level: "Fortgeschritten", trainer: "[Trainer]" },
    { time: "21:00", disc: "Freies Sparring", level: "Fortgeschritten", trainer: "[Trainer]" },
  ],
  SAT: [
    { time: "10:00", disc: "Thaiboxen", level: "Alle Level", trainer: "[Trainer]" },
    { time: "11:30", disc: "Boxen", level: "Einsteiger", trainer: "[Trainer]" },
    { time: "13:00", disc: "MMA / Sparring", level: "Fortgeschritten", trainer: "[Trainer]" },
  ],
  SUN: [],
};

const DAY = z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]);

export default defineTool({
  name: "get_schedule",
  title: "Trainingsplan abrufen",
  description:
    "Liefert den Trainingsplan der Fight Club Kampfsport Akademie Hanau. Ohne Argument wird die ganze Woche zurückgegeben, mit `day` nur der ausgewählte Wochentag (MON–SUN).",
  inputSchema: {
    day: DAY.optional().describe("Optionaler Wochentag (MON, TUE, WED, THU, FRI, SAT, SUN)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ day }) => {
    const data = day ? { [day]: SCHEDULE[day] } : SCHEDULE;
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { schedule: data },
    };
  },
});
