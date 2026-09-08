import { useEffect, useRef, useState } from "react";

const MATOOL_ORIGIN = "https://ext.matool.de";
const INITIAL_FORM_HEIGHT = 1400;

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
        scrolling="yes"
        frameBorder={0}
        style={{
          width: "100%",
          maxWidth: "700px",
          height: `${formHeight}px`,
          minHeight: `${INITIAL_FORM_HEIGHT}px`,
          display: "block",
          border: 0,
        }}
      />
      <div
        style={{
          borderTop: "1px solid grey",
          borderColor: "currentColor",
          color: "grey",
          mixBlendMode: "difference",
          paddingTop: "5px",
          paddingBottom: "20px",
          paddingRight: "5px",
          width: "100%",
          maxWidth: "700px",
          textAlign: "right",
        }}
      >
        <a
          href="https://www.matool.de"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: "none",
            color: "grey",
            mixBlendMode: "difference",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontSize: "x-small",
          }}
        >
          made by MATOOL
        </a>
      </div>
    </>
  );
}
