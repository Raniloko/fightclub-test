import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/impressum")({
  head: () => ({
    meta: [
      { title: "Impressum — Fight Club Hanau" },
      { name: "description", content: "Impressum und Anbieterkennzeichnung nach § 5 DDG (ehemals TMG) der Fight Club Kampfsport Akademie Hanau." },
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
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Angaben gemäß § 5 DDG (ehemals TMG)</h2>
          <p>
            Fight Club Kampfsport Akademie Hanau<br />
            Geleitstraße 66<br />
            63456 Hanau<br />
            Deutschland
          </p>
        </section>

        <section className="mt-8 space-y-2 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Inhaber</h2>
          <p>Andreas Porth</p>
        </section>

        <section className="mt-8 space-y-2 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Kontakt</h2>
          <p>
            Telefon: <a className="underline" href="tel:015563344488">015563344488</a><br />
            Telefax: -<br />
            E-Mail: <a className="underline" href="mailto:info@fightclub-hanau.de">info@fightclub-hanau.de</a>
          </p>
        </section>

        <section className="mt-8 space-y-2 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Steuernummer</h2>
          <p>Steuernummer: i.A. Finanzamt Hanau</p>
          <p className="text-[13px] text-[#777]">(in Antragstellung beim Finanzamt Hanau)</p>
        </section>


        <section className="mt-8 space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="underline">
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Verbraucher­streit­beilegung/Universal­schlichtungs­stelle</h2>
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
          <p>
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
            Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
            Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
            diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder
            Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
          </p>
          <p>
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
            Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>
        </section>

        <section className="mt-8 space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
            Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung
            des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
          <p>
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden
            Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen
            entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </section>



      </div>
    </main>
  );
}
