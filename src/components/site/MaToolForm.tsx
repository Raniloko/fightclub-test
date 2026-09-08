import { useEffect, useRef, useState } from "react";

/**
 * MaTool Probetraining-Formular (iframe-Einbettung).
 * Die Höhe wird über postMessage vom iframe gemeldet und direkt gesetzt,
 * damit beim Ausfüllen (Fehlermeldungen, aufklappende Felder) nichts
 * abgeschnitten wird oder "verschwindet".
 */
export function MaToolForm() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(720);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onMessage = (e: MessageEvent) => {
      if (!Number.isInteger(e.data)) return;
      const value = e.data as number;

      if (value === 99999999) {
        // MaTool bittet um Scroll (z. B. bei Validierungsfehlern):
        // sanft an den Formularanfang, nicht in die Mitte.
        const top =
          iframe.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }

      if (value > 200 && value < 20000) {
        // Kleiner Puffer, damit der letzte Button nie abgeschnitten wird.
        setHeight(value + 24);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="border border-[#e2e2e2] bg-white">
      <div className="border-b border-[#e2e2e2] bg-[#fafafa] px-4 py-3 md:px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">
          Anmeldung Probetraining
        </p>
      </div>

      <div className="px-2 py-2 md:px-6 md:py-6">
        <iframe
          ref={iframeRef}
          src="https://ext.matool.de/ptformdyn/?hash=1e769cc33873fa3e"
          id="probeForm"
          title="Probetraining anmelden"
          scrolling="no"
          frameBorder={0}
          style={{
            width: "100%",
            border: 0,
            height: `${height}px`,
            transition: "height 0.25s ease",
            display: "block",
          }}
        />
      </div>

      <div className="flex flex-col gap-2 border-t border-[#e2e2e2] px-4 py-4 md:px-6">
        <p className="text-[12px] leading-relaxed text-[#555]">
          Hinweis: Das Probetraining-Formular wird von MATOOL (matool.de) bereitgestellt und
          automatisch geladen. Dabei werden technisch notwendige Daten (u. a. IP-Adresse) an MATOOL
          übertragen. Details siehe{" "}
          <a href="/datenschutz" className="underline">
            Datenschutzerklärung
          </a>
          .
        </p>
        <a
          href="https://www.matool.de"
          target="_blank"
          rel="noopener noreferrer"
          className="text-right text-[11px] text-[#999] no-underline"
        >
          made by MATOOL
        </a>
      </div>
    </div>
  );
}
