import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/datenschutz")({
  head: () => ({
    meta: [
      { title: "Datenschutzerklärung — Fight Club Hanau" },
      { name: "description", content: "Datenschutzerklärung der Fight Club MMA Akademie Hanau nach DSGVO und TDDDG/DDG." },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/datenschutz" }],
  }),
  component: DatenschutzPage,
});

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 font-display text-2xl md:text-3xl">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#333]">{children}</h3>;
}

function DatenschutzPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-3xl text-[15px] leading-relaxed text-[#111]">
        <Link to="/" className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555] hover:text-black">← Zurück zur Startseite</Link>
        <h1 className="mt-6 font-display text-5xl md:text-6xl">Datenschutz&shy;erklärung</h1>
        <p className="mt-4 text-[13px] text-[#666]">Stand: {new Date().toLocaleDateString("de-DE", { month: "long", year: "numeric" })}</p>

        <H2>1. Verantwortlicher</H2>
        <p>
          Verantwortlich im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:<br />
          Fight Club MMA Akademie Hanau<br />
          Geleitstraße 66, 63456 Hanau, Deutschland<br />
          E-Mail: <a className="underline" href="mailto:info@fightclub-hanau.de">info@fightclub-hanau.de</a>
        </p>

        <H2>2. Allgemeines zur Datenverarbeitung</H2>
        <p>
          Wir verarbeiten personenbezogene Daten unserer Nutzer:innen nur, soweit dies zur Bereitstellung einer funktionsfähigen Website
          sowie unserer Inhalte und Leistungen erforderlich ist. Rechtsgrundlagen sind insbesondere Art. 6 Abs. 1 lit. a, b, c und f DSGVO
          sowie § 25 TDDDG für den Einsatz von Cookies und ähnlichen Technologien.
        </p>

        <H2>3. Hosting</H2>
        <p>
          Diese Website wird bei Lovable / Cloudflare (Cloudflare, Inc., USA, mit europäischer Edge-Infrastruktur) betrieben. Beim Aufruf
          werden technisch notwendige Verbindungsdaten (IP-Adresse, Zeitpunkt, angeforderte Ressource, User-Agent, Referrer) verarbeitet.
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem stabilen und sicheren Betrieb). Übermittlungen in
          die USA erfolgen auf Grundlage des EU-US Data Privacy Framework bzw. der EU-Standardvertragsklauseln.
        </p>

        <H2>4. Server-Logfiles</H2>
        <p>
          Der Provider erhebt automatisch Informationen in Server-Logfiles (IP-Adresse, Datum/Uhrzeit, Browsertyp, Betriebssystem, Referrer,
          angeforderte Datei). Die Daten werden nach kurzer Zeit gelöscht, sofern sie nicht zur Missbrauchsabwehr erforderlich sind.
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
        </p>

        <H2>5. Cookies und ähnliche Technologien</H2>
        <p>
          Wir setzen technisch notwendige Cookies und lokale Speichereinträge ein, damit die Website funktioniert (z. B. Speicherung der
          Cookie-Einwilligung im Local Storage unter dem Schlüssel <code>fc-consent-v1</code>). Diese sind nach § 25 Abs. 2 Nr. 2 TDDDG
          einwilligungsfrei.
        </p>
        <p>
          Nicht notwendige Cookies und Dienste (Statistik, Karten, Videos) werden ausschließlich nach Ihrer Einwilligung geladen
          (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Die Einwilligung kann jederzeit über den Link
          „Cookie-Einstellungen" im Footer widerrufen werden.
        </p>

        <H3>Verwendete Cookies / Speichereinträge</H3>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li><strong>fc-consent-v1</strong> (Local Storage, notwendig) — speichert Ihre Cookie-Entscheidung. Speicherdauer: bis zum Widerruf.</li>
          <li><strong>_ga, _ga_*</strong> (Google Analytics, nur nach Einwilligung) — pseudonyme Reichweitenmessung. Speicherdauer bis 2 Jahre.</li>
        </ul>

        <H2>6. Google Analytics 4 (nur mit Einwilligung)</H2>
        <p>
          Nach Ihrer Einwilligung setzen wir Google Analytics 4 der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland,
          ein (Messungs-ID G-42WPB0Q120). Google Analytics verwendet Cookies und ähnliche Technologien zur pseudonymen Reichweitenmessung.
          Die IP-Adresse wird anonymisiert verarbeitet (<code>anonymize_ip: true</code>). Wir nutzen den Google Consent Mode v2; ohne Ihre
          Einwilligung werden keine Analyse-Cookies gesetzt und keine personenbezogenen Analyse-Daten übertragen.
        </p>
        <p>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO, § 25 Abs. 1 TDDDG. Eine Übermittlung in die USA (Google LLC) ist möglich; Google
          ist unter dem EU-US Data Privacy Framework zertifiziert. Weitere Informationen:{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
            policies.google.com/privacy
          </a>.
        </p>

        <H2>7. Google Maps (Zwei-Klick-Lösung)</H2>
        <p>
          Die Standortkarte wird erst geladen, nachdem Sie aktiv darauf klicken. Beim Laden werden Daten (u. a. IP-Adresse, Zeitstempel,
          Browserinformationen) an Google Ireland Limited und ggf. Google LLC (USA) übermittelt. Rechtsgrundlage: Art. 6 Abs. 1 lit. a
          DSGVO. Weitere Informationen: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">policies.google.com/privacy</a>.
        </p>

        <H2>8. Google Fonts</H2>
        <p>
          Zur einheitlichen Darstellung binden wir Schriftarten (Inter, Barlow Condensed) über Google Fonts (Google Ireland Limited) ein.
          Beim Aufruf der Website wird eine Verbindung zu Google-Servern (ggf. USA) hergestellt, wobei die IP-Adresse übertragen wird.
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer einheitlichen Darstellung). Auf Wunsch stellen wir
          auf ein lokales Hosting um.
        </p>

        <H2>9. Kontaktformular / Kontakt per E-Mail</H2>
        <p>
          Wenn Sie uns über das Kontaktformular oder per E-Mail (info@fightclub-hanau.de) kontaktieren, verarbeiten wir Ihre Angaben
          (Name, E-Mail, ggf. Telefonnummer, gewähltes Interesse, Nachricht) zur Bearbeitung Ihrer Anfrage. Rechtsgrundlage:
          Art. 6 Abs. 1 lit. b DSGVO (Vertragsanbahnung) bzw. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
        </p>
        <p>
          Die Nachricht wird über den Dienstleister Resend (Resend, Inc., USA) versandt. Übermittlungen in die USA erfolgen auf Grundlage
          der EU-Standardvertragsklauseln bzw. des EU-US Data Privacy Framework. Wir löschen Ihre Angaben, sobald die Anfrage abschließend
          bearbeitet ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>

        <H2>10. Empfänger / Auftragsverarbeiter</H2>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Cloudflare, Inc. (USA) — Hosting/CDN</li>
          <li>Google Ireland Limited (Irland) / Google LLC (USA) — Analytics, Maps, Fonts (nur wo einwilligungspflichtig, mit Consent)</li>
          <li>Resend, Inc. (USA) — Versand transaktionaler E-Mails aus dem Kontaktformular</li>
          <li>Supabase, Inc. (USA) / EU-Region — Auth & Datenbank für den Admin-Bereich</li>
        </ul>

        <H2>11. Ihre Rechte</H2>
        <p>Sie haben nach der DSGVO folgende Rechte:</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit (Art. 20)</li>
          <li>Widerspruch gegen Verarbeitungen auf Basis berechtigter Interessen (Art. 21)</li>
          <li>Widerruf erteilter Einwilligungen mit Wirkung für die Zukunft (Art. 7 Abs. 3)</li>
          <li>Beschwerde bei einer Aufsichtsbehörde (Art. 77), z. B. Hessischer Beauftragter für Datenschutz und Informationsfreiheit</li>
        </ul>
        <p className="mt-3">Zur Ausübung genügt eine formlose Nachricht an <a className="underline" href="mailto:info@fightclub-hanau.de">info@fightclub-hanau.de</a>.</p>

        <H2>12. Datensicherheit</H2>
        <p>
          Die Übertragung erfolgt SSL/TLS-verschlüsselt (HTTPS). Wir setzen zusätzlich Sicherheits-Header (u. a. HSTS, X-Content-Type-Options,
          Referrer-Policy, Permissions-Policy, X-Frame-Options) ein, um Ihre Daten während der Übertragung zu schützen.
        </p>

        <H2>13. Änderungen dieser Datenschutzerklärung</H2>
        <p>
          Wir passen diese Datenschutzerklärung an, wenn sich die Rechtslage oder unsere Dienste ändern. Die jeweils aktuelle Fassung ist
          unter <Link to="/datenschutz" className="underline">/datenschutz</Link> abrufbar.
        </p>
      </div>
    </main>
  );
}
