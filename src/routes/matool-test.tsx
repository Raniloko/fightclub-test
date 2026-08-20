import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/matool-test")({
  head: () => ({
    meta: [
      { title: "MaTool Probetraining Test" },
      { name: "description", content: "Testseite für das MaTool Probetraining-Formular" },
    ],
  }),
  component: MatoolTestPage,
});

function MatoolTestPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-3xl px-5 py-20">
        <h1 className="mb-2 font-display text-3xl uppercase tracking-tight text-white">
          MaTool Probetraining – Test
        </h1>
        <p className="mb-8 text-sm text-white/60">
          Das Formular unten wird über iframe von MaTool geladen und passt sich automatisch an die Höhe an.
        </p>

        <div className="rounded-xl border border-white/10 bg-[#111] p-4 md:p-6">
          {/* Resize-Helfer für die iframe-Message, die MaTool zurücksendet */}
          <script
            dangerouslySetInnerHTML={{
              __html: `function resizeIframe(height,id){document.getElementById(id).style.height=height+'px';}`,
            }}
          />
          <iframe
            src="https://www.matool.de/tooldata_demo/probetraining.php?probetrainingid=3e56KT3tzetu74weKTKG&src=https://www.matool.de&formname=Probetraining&font=helvetica&fontsiz"
            id="toolprobetraining44422"
            frameBorder="0"
            scrolling="no"
            style={{ width: "100%", height: "100px", border: "none" }}
            title="MaTool Probetraining Formular"
          />
        </div>
      </div>
    </div>
  );
}
