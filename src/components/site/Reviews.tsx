import { Reveal } from "./Reveal";

export const GOOGLE_REVIEWS_URL = "https://share.google/kEtyMCXvq2CPVsN09";

type Review = { quote: string; name: string; context?: string };

// Only real quotes, with the person's consent. Cards appear automatically once entries exist.
const REVIEWS: Review[] = [];

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}

export function Reviews() {
  return (
    <section id="bewertungen" className="bg-white py-16 text-[#0a0a0a] md:py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
              Bewertungen
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-5xl md:text-7xl">
                <span className="fc-headline-underline">Überzeug dich selbst</span>
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-black/70 md:text-[17px]">
                Lies, was Mitglieder und Eltern über das Training bei uns sagen – und erzähl uns
                nach deinem Probetraining gern selbst, wie es war.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 border border-[#0a0a0a] bg-[#0a0a0a] px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-[#0a0a0a]"
              >
                <span className="flex h-7 w-7 items-center justify-center bg-white">
                  <GoogleIcon />
                </span>
                Bewertungen auf Google
              </a>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-black/20 px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-black transition-colors hover:border-[#0a0a0a]"
              >
                Bewertung schreiben
              </a>
            </div>
          </div>
        </Reveal>

        {REVIEWS.length > 0 && (
          <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <li key={r.name} className="flex flex-col border border-black/10 p-6">
                <span
                  className="font-display text-5xl leading-none text-[#00B4DC]"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-black/80">
                  {r.quote}
                </blockquote>
                <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.15em]">
                  {r.name}
                </p>
                {r.context && <p className="mt-1 text-[13px] text-black/55">{r.context}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
