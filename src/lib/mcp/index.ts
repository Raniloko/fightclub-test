import { defineMcp } from "@lovable.dev/mcp-js";
import getScheduleTool from "./tools/get-schedule";
import listDisciplinesTool from "./tools/list-disciplines";
import getContactTool from "./tools/get-contact";

export default defineMcp({
  name: "fightclub-hanau-mcp",
  title: "Fight Club MMA Akademie Hanau",
  version: "0.1.0",
  instructions:
    "Öffentliche Tools der Fight Club MMA Akademie Hanau. `list_disciplines` gibt alle Kampfsport-Angebote zurück, `get_schedule` den Trainingsplan (optional pro Wochentag), `get_contact` Adresse und Öffnungszeiten.",
  tools: [listDisciplinesTool, getScheduleTool, getContactTool],
});
