import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum — Fight Club Hanau" },
      { name: "description", content: "Impressum und Anbieterkennzeichnung nach § 5 DDG (ehemals TMG) der Fight Club MMA Akademie Hanau." },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.fightclub-hanau.de/impressum" }],
  }),
  component: ImpressumPage,
});

function ImpressumPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555] hover:text-black">← Zurück zur Startseite</Link>
        <h1 className="mt-6 font-display text-5xl md:text-6xl">Impressum</h1>

        <section className="mt-10 space-y-2 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Angaben gemäß § 5 DDG</h2>
          <p>
            Fight Club MMA Akademie Hanau<br />
            Geleitstraße 66<br />
            63456 Hanau<br />
            Deutschland
          </p>
        </section>

        <section className="mt-8 space-y-2 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Vertreten durch</h2>
          <p>[Vor- und Nachname der/des Inhaber:in einsetzen]</p>
        </section>

        <section className="mt-8 space-y-2 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Kontakt</h2>
          <p>
            Telefon: [Telefonnummer einsetzen]<br />
            E-Mail: <a className="underline" href="mailto:info@fightclub-hanau.de">info@fightclub-hanau.de</a>
          </p>
        </section>

        <section className="mt-8 space-y-2 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Umsatzsteuer-ID</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27 a UStG: [USt-IdNr. einsetzen oder Zeile entfernen]</p>
        </section>

        <section className="mt-8 space-y-2 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Redaktionell verantwortlich (§ 18 Abs. 2 MStV)</h2>
          <p>[Name, Anschrift einsetzen]</p>
        </section>

        <section className="mt-8 space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="underline">
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse finden Sie oben.
          </p>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen
            zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
            diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Vervielfältigung,
            Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
            des jeweiligen Autors bzw. Erstellers.
          </p>
        </section>

        <p className="mt-10 text-[12px] text-[#777]">
          Hinweis: Mit „[…]" gekennzeichnete Felder müssen vor Livegang durch die Inhaber:in ergänzt werden.
        </p>
      </div>
    </main>
  );
}
