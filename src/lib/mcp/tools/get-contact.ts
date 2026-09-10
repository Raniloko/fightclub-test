import { defineTool } from "@lovable.dev/mcp-js";

const CONTACT = {
  name: "Fight Club Kampfsport Akademie Hanau",
  address: {
    street: "Geleitstraße 66",
    city: "Hanau",
    postalCode: "63456",
    country: "Deutschland",
  },
  hours: {
    "Mo-Fr": "15:45–21:30",
    "Samstag (Reguläres Training)": "11:00–13:00",
    "Samstag (Freies Training, nach Vereinbarung)": "13:00–22:00",
    "Sonntag (Freies Training, nach Vereinbarung)": "10:00–22:00",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Geleitstra%C3%9Fe+66%2C+63456+Hanau",
};

export default defineTool({
  name: "get_contact",
  title: "Kontakt & Öffnungszeiten",
  description:
    "Liefert Adresse, Öffnungszeiten und Google-Maps-Link der Fight Club Kampfsport Akademie Hanau.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(CONTACT, null, 2) }],
    structuredContent: CONTACT,
  }),
});
