import { useEffect, useState } from "react";

const STORAGE_KEY = "fc-consent-v1";
const CONSENT_VERSION = 1;

type Consent = {
  version: number;
  necessary: true;
  analytics: boolean;
  timestamp: string;
};

function readConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsent(consent: Consent) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    /* ignore */
  }
}

function updateGtagConsent(analytics: boolean) {
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  };
  const push = (args: unknown[]) => {
    if (typeof w.gtag === "function") {
      w.gtag(...args);
    } else {
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push(args);
    }
  };
  push([
    "consent",
    "update",
    {
      analytics_storage: analytics ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    },
  ]);
}

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      updateGtagConsent(existing.analytics);
    } else {
      const introSeen =
        typeof window !== "undefined" &&
        window.sessionStorage.getItem("introSeen");
      const delay = introSeen ? 800 : 4200;
      const t = setTimeout(() => setOpen(true), delay);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const reopen = () => {
      const c = readConsent();
      setAnalytics(c?.analytics ?? false);
      setShowSettings(true);
      setOpen(true);
    };
    window.addEventListener("fc:open-cookie-settings", reopen);
    return () => window.removeEventListener("fc:open-cookie-settings", reopen);
  }, []);

  const save = (analyticsChoice: boolean) => {
    const consent: Consent = {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: analyticsChoice,
      timestamp: new Date().toISOString(),
    };
    writeConsent(consent);
    updateGtagConsent(analyticsChoice);
    setOpen(false);
    setShowSettings(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-[100] px-3 pb-3 sm:px-5 sm:pb-5"
    >
      <div className="mx-auto max-w-[720px] rounded-2xl border border-white/10 bg-[#0a0a0a]/95 p-5 text-white shadow-2xl backdrop-blur-md sm:p-6">
        <h2
          id="cookie-banner-title"
          className="text-[13px] font-semibold uppercase tracking-[0.2em] text-white"
        >
          Cookies & Datenschutz
        </h2>
        <p className="mt-3 text-[13px] leading-relaxed text-white/80">
          Wir verwenden Cookies, um unsere Website betreiben zu können (technisch
          notwendig) und – nur mit deiner Einwilligung – die Nutzung mit Google
          Analytics anonymisiert auszuwerten. Du kannst deine Einwilligung
          jederzeit im Footer unter „Cookie-Einstellungen" widerrufen. Details
          findest du in unserer{" "}
          <a href="/datenschutz" className="underline hover:text-white">
            Datenschutzerklärung
          </a>
          .
        </p>

        {showSettings && (
          <div className="mt-5 space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
            <label className="flex items-start gap-3 text-[13px] text-white/80">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-1 h-4 w-4 accent-[#00B4DC]"
              />
              <span>
                <span className="block font-semibold text-white">
                  Notwendig
                </span>
                Erforderlich für den Betrieb der Website, inkl. des automatisch
                geladenen Probetraining-Formulars von MATOOL (matool.de). Kann
                nicht deaktiviert werden.
              </span>
            </label>
            <label className="flex items-start gap-3 text-[13px] text-white/80">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#00B4DC]"
              />
              <span>
                <span className="block font-semibold text-white">
                  Statistik (Google Analytics)
                </span>
                Anonymisierte Auswertung, damit wir die Website verbessern
                können.
              </span>
            </label>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {!showSettings && (
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="rounded-md border border-white/20 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
            >
              Einstellungen
            </button>
          )}
          <button
            type="button"
            onClick={() => save(false)}
            className="rounded-md border border-white/20 px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10"
          >
            Nur notwendige
          </button>
          {showSettings ? (
            <button
              type="button"
              onClick={() => save(analytics)}
              className="rounded-md bg-[#00B4DC] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#00c8f5]"
            >
              Auswahl speichern
            </button>
          ) : (
            <button
              type="button"
              onClick={() => save(true)}
              className="rounded-md bg-[#00B4DC] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-black transition-colors hover:bg-[#00c8f5]"
            >
              Alle akzeptieren
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
