import { useEffect, useRef, useState } from "react";

const MATOOL_ORIGIN = "https://ext.matool.de";
// Compact fallback for preview origins; MATOOL sends live heights to the public domain.
const INITIAL_FORM_HEIGHT = 420;

export function MaToolForm() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [formHeight, setFormHeight] = useState(INITIAL_FORM_HEIGHT);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const iframe = iframeRef.current;

      if (
        !iframe ||
        event.origin !== MATOOL_ORIGIN ||
        event.source !== iframe.contentWindow
      ) {
        return;
      }

      const nextHeight =
        typeof event.data === "number"
          ? event.data
          : typeof event.data === "string"
            ? Number(event.data)
            : Number.NaN;

      if (!Number.isFinite(nextHeight)) return;

      if (nextHeight === 99999999) {
        const top = iframe.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: Math.max(0, top - window.innerHeight / 2),
          behavior: "smooth",
        });
        return;
      }

      if (nextHeight > 0) {
        setFormHeight(Math.ceil(nextHeight) + 48);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <>
      <iframe
        ref={iframeRef}
        src="https://ext.matool.de/ptformdyn/?hash=1e769cc33873fa3e"
        id="probeForm"
        title="Probetraining reservieren"
        aria-describedby="trial-location-help"
        scrolling="yes"
        frameBorder={0}
        style={{
          width: "100%",
          maxWidth: "700px",
          height: `${Math.max(240, formHeight)}px`,
          display: "block",
          border: 0,
        }}
      />
      <div className="mx-auto max-w-[700px] border-t border-rule py-2 text-right text-xs text-quiet">
        <a
          href="https://www.matool.de"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          made by MATOOL
        </a>
      </div>
    </>
  );
}
