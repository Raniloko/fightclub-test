import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getScheduleTool from "./tools/get-schedule";
import listDisciplinesTool from "./tools/list-disciplines";
import getContactTool from "./tools/get-contact";

// Direct Supabase host — the .lovable.cloud proxy fails RFC 8414 issuer match.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "fightclub-hanau-mcp",
  title: "Fight Club Kampfsport Akademie Hanau",
  version: "0.1.0",
  instructions:
    "Tools der Fight Club Kampfsport Akademie Hanau. `list_disciplines` gibt alle Kampfsport-Angebote zurück, `get_schedule` den Trainingsplan (optional pro Wochentag), `get_contact` Adresse und Öffnungszeiten. Nur für angemeldete Nutzer.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listDisciplinesTool, getScheduleTool, getContactTool],
});
