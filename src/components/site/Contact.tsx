import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { Reveal } from "./Reveal";
import { sendContactMessage } from "@/lib/contact.functions";

function MapEmbed() {
  const [loaded, setLoaded] = useState(false);
  if (!loaded) {
    return (
      <div className="overflow-hidden border border-[#e0e0e0] bg-[#f5f5f5] p-6 text-center">
        <p className="text-[13px] leading-relaxed text-[#333]">
          Beim Laden der Karte werden Daten an Google (Google Ireland Ltd., ggf. Google LLC/USA)
          übertragen. Details siehe{" "}
          <a href="/datenschutz" className="underline">Datenschutzerklärung</a>.
        </p>
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="mt-4 bg-[#0a0a0a] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-white hover:bg-[#222]"
        >
          Karte laden
        </button>
      </div>
    );
  }
  return (
    <div className="overflow-hidden border border-[#e0e0e0]">
      <iframe
        title="Fight Club MMA Akademie Hanau – Standort"
        src="https://www.google.com/maps?q=Geleitstra%C3%9Fe+66%2C+63456+Hanau&output=embed"
        width="100%"
        height="300"
        style={{ border: 0, filter: "grayscale(100%) contrast(1.05)" }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

export function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [privacyOk, setPrivacyOk] = useState(false);
  const send = useServerFn(sendContactMessage);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    if (!privacyOk) {
      toast.error("Bitte bestätige die Datenschutzhinweise.");
      return;
    }
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      discipline: String(fd.get("discipline") ?? ""),
      message: String(fd.get("message") ?? ""),
      website: String(fd.get("website") ?? ""),
    };
    setLoading(true);
    try {
      await send({ data: payload });
      setSent(true);
      toast.success("Nachricht gesendet. Wir melden uns in Kürze.");
      form.reset();
      setPrivacyOk(false);
      setTimeout(() => setSent(false), 2500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Senden fehlgeschlagen.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }


  return (
    <section id="kontakt" className="bg-white py-12 md:py-20">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-12 px-5 md:grid-cols-2 md:gap-20 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#0a0a0a]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#555]">
              Sag Hallo
            </span>
          </div>
          <h2 className="mt-4 font-display text-5xl md:text-7xl"><span className="fc-headline-underline">Kontakt</span></h2>

          <div className="mt-10 space-y-8 text-[15px]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">
                Adresse
              </div>
              <p className="mt-2 leading-relaxed">
                Fight Club MMA Akademie Hanau
                <br />
                Geleitstraße 66
                <br />
                63456 Hanau
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Geleitstra%C3%9Fe+66%2C+63456+Hanau"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-[12px] font-semibold uppercase tracking-[0.2em] underline underline-offset-4 hover:opacity-60"
              >
                Route planen →
              </a>
            </div>

            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">
                Telefon
              </div>
              <p className="mt-2">
                <a href="tel:015563344488" className="hover:opacity-60">
                  015563344488
                </a>
              </p>
            </div>

            <MapEmbed />


            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#555]">
                Öffnungszeiten
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between border-b border-[#e0e0e0] py-1">
                  <span>Mo–Fr</span>
                  <span>07:00–22:00</span>
                </div>
                <div className="flex justify-between border-b border-[#e0e0e0] py-1">
                  <span>Sa</span>
                  <span>09:00–15:00</span>
                </div>
                <div className="flex justify-between border-b border-[#e0e0e0] py-1">
                  <span>So</span>
                  <span>Geschlossen</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href="https://www.tiktok.com/@fightclub_hanau"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="border border-[#0a0a0a] p-3 hover:bg-[#0a0a0a] hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.939 2.939 0 0 1 3.011-4.535c.317.039.63.114.93.227v-3.76a6.676 6.676 0 0 0-1-.05A6.724 6.724 0 0 0 3.5 16.353a6.724 6.724 0 0 0 10.03 5.467 6.73 6.73 0 0 0 2.97-5.692V9.485a8.15 8.15 0 0 0 4.698 1.497V7.618a4.86 4.86 0 0 1-1.609-.932z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/fightclubhanau"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="border border-[#0a0a0a] p-3 hover:bg-[#0a0a0a] hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="0" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="18" cy="6" r="1" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/1D1mQLdM8w/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="border border-[#0a0a0a] p-3 hover:bg-[#0a0a0a] hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@fightclubhanau"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="border border-[#0a0a0a] p-3 hover:bg-[#0a0a0a] hover:text-white"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a2.997 2.997 0 0 0-2.111-2.111C19.666 3.5 12 3.5 12 3.5s-7.666 0-9.387.575a2.997 2.997 0 0 0-2.111 2.111C0 7.907 0 12 0 12s0 4.093.502 5.814a2.997 2.997 0 0 0 2.111 2.111C4.334 20.5 12 20.5 12 20.5s7.666 0 9.387-.575a2.997 2.997 0 0 0 2.111-2.111C24 16.093 24 12 24 12s0-4.093-.502-5.814zM9.545 15.5V8.5l6.273 3.5-6.273 3.5z" />
                </svg>
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {/* Honeypot — hidden from users, bots fill it and get filtered out */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
              <label>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <Field label="Name *">
              <input required name="name" maxLength={100} autoComplete="name" className="fc-input" />
            </Field>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="E-Mail *">
                <input required type="email" name="email" maxLength={200} autoComplete="email" className="fc-input" />
              </Field>
              <Field label="Telefon">
                <input name="phone" maxLength={40} inputMode="tel" autoComplete="tel" pattern="[+0-9 ()\/.\-]*" className="fc-input" />
              </Field>
            </div>
            <Field label="Welche Disziplin interessiert dich?">
              <select name="discipline" className="fc-input" defaultValue="">
                <option value="" disabled>
                  Bitte wählen
                </option>
                <option>MMA</option>
                <option>K1</option>
                <option>Boxen</option>
                <option>Thaiboxen</option>
                <option>Self-Defense</option>
                <option>Wing-Fight</option>
                <option>Kindertraining</option>
                <option>Ich bin noch unentschlossen</option>
              </select>
            </Field>
            <Field label="Nachricht">
              <textarea name="message" rows={5} maxLength={2000} className="fc-input resize-none" />
            </Field>
            <label className="flex items-start gap-3 text-[13px] leading-relaxed text-[#333]">
              <input
                type="checkbox"
                required
                checked={privacyOk}
                onChange={(e) => setPrivacyOk(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#0a0a0a]"
              />
              <span>
                Ich habe die <a href="/datenschutz" target="_blank" rel="noopener" className="underline">Datenschutzerklärung</a>{" "}
                gelesen und willige ein, dass meine Angaben zur Bearbeitung meiner Anfrage verarbeitet werden. Die Einwilligung
                kann ich jederzeit für die Zukunft per E-Mail an info@fightclub-hanau.de widerrufen. *
              </span>
            </label>
            <button
              type="submit"
              disabled={loading || sent || !privacyOk}
              className="w-full bg-[#0a0a0a] px-8 py-5 text-[12px] font-semibold uppercase tracking-[0.25em] text-white transition-colors hover:bg-[#222] disabled:opacity-60"
            >
              {loading ? "Wird gesendet…" : sent ? "Gesendet" : "Nachricht senden"}
            </button>
          </form>
        </Reveal>
      </div>

      <style>{`
        .fc-input {
          width: 100%;
          background: #ffffff;
          border: 1px solid #e0e0e0;
          padding: 14px 16px;
          font-size: 15px;
          font-family: inherit;
          color: #0a0a0a;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .fc-input:focus { border-color: #0a0a0a; }
      `}</style>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#555]">
        {label}
      </span>
      {children}
    </label>
  );
}
