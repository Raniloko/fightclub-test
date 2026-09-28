import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "./Reveal";
import { listPublicTrainers, type TrainerProfile } from "@/lib/trainers.functions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Instagram } from "lucide-react";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function TrainerCard({ t, onClick }: { t: TrainerProfile; onClick: () => void }) {
  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="group relative flex cursor-pointer flex-col overflow-hidden border border-white/10 bg-[#111] transition-all duration-300 hover:border-[#C9A84C] focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#1a1a1a]">
        {t.avatar_url ? (
          <img
            src={t.avatar_url}
            alt={t.display_name}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-6xl text-white/15">
            {initials(t.display_name)}
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display text-2xl leading-tight text-white">{t.display_name}</h3>
          {t.role_title && (
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[#C9A84C]">
              {t.role_title}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        {t.disciplines.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {t.disciplines.slice(0, 4).map((d) => (
              <span
                key={d}
                className="border border-[#00B4DC]/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#00B4DC]"
              >
                {d}
              </span>
            ))}
          </div>
        )}
        {t.short_bio && (
          <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-white/70">
            {t.short_bio}
          </p>
        )}
        <span className="mt-auto pt-4 text-[11px] font-semibold uppercase tracking-wider text-[#C9A84C]">
          Profil ansehen ›
        </span>
      </div>
    </article>
  );
}

export function Trainers() {
  const { data } = useQuery({ queryKey: ["public-trainers"], queryFn: () => listPublicTrainers() });
  const trainers = (data ?? []) as TrainerProfile[];
  const [active, setActive] = useState<TrainerProfile | null>(null);

  if (trainers.length === 0) return null;

  return (
    <section id="trainer" className="bg-[#0a0a0a] py-20 text-white md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="block h-px w-8 bg-[#C9A84C]" />
            <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-[#C9A84C]">
              Unser Team
            </span>
          </div>
          <h2 className="mt-4 max-w-2xl font-display text-5xl md:text-7xl">
            <span className="fc-headline-underline">DEINE TRAINER.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/70 md:text-[17px]">
            Erfahrene Coaches mit Wettkampf&shy;hintergrund, Trainerlizenzen und viel Geduld — für
            Kinder, Jugendliche und Erwachsene.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trainers.map((t) => (
            <Reveal key={t.id}>
              <TrainerCard t={t} onClick={() => setActive(t)} />
            </Reveal>
          ))}
        </div>
      </div>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-l border-white/10 bg-[#0a0a0a] text-white sm:max-w-lg"
        >
          {active && (
            <>
              <SheetHeader className="text-left">
                {active.avatar_url && (
                  <img
                    src={active.avatar_url}
                    alt={active.display_name}
                    className="mb-5 aspect-[4/3] w-full object-cover"
                  />
                )}
                <SheetTitle className="font-display text-4xl text-white">
                  {active.display_name}
                </SheetTitle>
                <SheetDescription className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#C9A84C]">
                  {active.role_title || "Trainer"}
                </SheetDescription>
              </SheetHeader>

              {active.disciplines.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {active.disciplines.map((d) => (
                    <span
                      key={d}
                      className="border border-[#00B4DC]/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#00B4DC]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}

              {active.bio && (
                <p className="mt-6 whitespace-pre-line text-[15px] leading-relaxed text-white/80">
                  {active.bio}
                </p>
              )}

              {active.achievements.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#C9A84C]">
                    Erfolge &amp; Lizenzen
                  </h4>
                  <ul className="mt-4 space-y-2">
                    {active.achievements.map((a, i) => (
                      <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-white/80">
                        <span className="mt-2 block h-1 w-3 flex-shrink-0 bg-[#C9A84C]" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {active.instagram_url && (
                <a
                  href={active.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 border-b border-white/40 pb-1 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors hover:border-[#C9A84C] hover:text-[#C9A84C]"
                >
                  <Instagram className="h-4 w-4" /> Instagram
                </a>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}
