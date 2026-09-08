import { useEffect, useRef, useState } from "react";

/**
 * MaTool Probetraining-Formular (iframe-Einbettung).
 * Übernimmt die Original-Logik von MaTool zur automatischen Höhenanpassung
 * (postMessage vom iframe) und zum sanften Scrollen bei 99999999.
 */
export function MaToolForm() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (!consented) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    let reported = 0;

    const onMessage = (e: MessageEvent) => {
      if (!Number.isInteger(e.data)) return;
      if (e.data === 99999999) {
        // Sanft zur Formularmitte scrollen
        const target =
          iframe.getBoundingClientRect().top +
          (document.scrollingElement || document.documentElement).scrollTop -
          Math.max(document.documentElement.clientHeight, window.innerHeight || 0) / 2;
        const scroller = document.scrollingElement || document.documentElement;
        const start = scroller.scrollTop;
        const dist = target - start;
        const duration = 500;
        const t0 = performance.now();
        const ease = (v: number, u: number, x: number, w: number) => {
          v /= w / 2;
          if (v < 1) return (x / 2) * v * v + u;
          v--;
          return (-x / 2) * (v * (v - 2) - 1) + u;
        };
        const step = (now: number) => {
          const t = now - t0;
          scroller.scrollTop = Math.round(ease(t, start, dist, duration));
          if (t < duration) requestAnimationFrame(step);
          else scroller.scrollTop = target;
        };
        requestAnimationFrame(step);
      } else {
        reported = e.data as number;
      }
    };
    window.addEventListener("message", onMessage);

    // Höhe sanft an den gemeldeten Wert angleichen
    const interval = window.setInterval(() => {
      const current = iframe.offsetHeight;
      let delta = Math.round((reported - current) / 10);
      delta = Math.abs(delta);
      if (delta < 1) delta = 0;
      if (reported > 0 && reported !== current && delta > 0) {
        iframe.style.height =
          reported > current ? `${current + delta}px` : `${current - delta}px`;
      }
    }, 25);

    return () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(interval);
    };
  }, [consented]);

  if (!consented) {
    return (
      <div className="overflow-hidden border border-[#e0e0e0] bg-[#f5f5f5] p-6 text-center">
        <p className="text-[13px] leading-relaxed text-[#333]">
          Das Probetraining-Formular wird von MATOOL bereitgestellt. Beim Laden werden Daten an
          matool.de übertragen. Details siehe{" "}
          <a href="/datenschutz" className="underline">
            Datenschutzerklärung
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setConsented(true)}
          className="mt-4 bg-[#0a0a0a] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white hover:bg-[#222]"
        >
          Formular laden
        </button>
      </div>
    );
  }

  return (
    <div>
      <iframe
        ref={iframeRef}
        src="https://ext.matool.de/ptformdyn/?hash=1e769cc33873fa3e"
        id="probeForm"
        title="Probetraining anmelden"
        scrolling="no"
        frameBorder={0}
        style={{ width: "100%", border: 0, minHeight: 400 }}
      />
      <div
        style={{
          borderTop: "1px solid #e0e0e0",
          paddingTop: 5,
          paddingBottom: 20,
          paddingRight: 5,
          width: "100%",
          textAlign: "right",
        }}
      >
        <a
          href="https://www.matool.de"
          style={{
            textDecoration: "none",
            color: "grey",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "x-small",
          }}
          target="_blank"
          rel="noopener noreferrer"
        >
          made by MATOOL
        </a>
      </div>
    </div>
  );
}
