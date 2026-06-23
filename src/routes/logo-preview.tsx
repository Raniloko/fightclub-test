import { createFileRoute } from "@tanstack/react-router";
import { FightClubLogo } from "@/components/site/FightClubLogo";

export const Route = createFileRoute("/logo-preview")({
  head: () => ({
    meta: [
      { title: "Logo Preview — Fight Club Hanau" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LogoPreview,
});

function Row({ color }: { color: string }) {
  return (
    <div className="flex flex-wrap items-end justify-center gap-16 py-12">
      <FightClubLogo variant="full" color={color} size={240} />
      <FightClubLogo variant="mark" color={color} size={160} />
      <FightClubLogo variant="wordmark" color={color} size={240} />
    </div>
  );
}

function LogoPreview() {
  const sizes = [32, 64, 120, 200];
  return (
    <main className="min-h-screen">
      <section className="bg-white text-[#0A0A0A]">
        <h2 className="px-8 pt-8 text-xs font-semibold uppercase tracking-[0.25em] text-black/50">
          Black on white
        </h2>
        <Row color="#0A0A0A" />
      </section>

      <section className="bg-[#0A0A0A] text-white">
        <h2 className="px-8 pt-8 text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
          White on black
        </h2>
        <Row color="#FFFFFF" />
      </section>

      <section className="bg-white py-12">
        <h2 className="px-8 pb-6 text-xs font-semibold uppercase tracking-[0.25em] text-black/50">
          Mark size tests
        </h2>
        <div className="flex flex-wrap items-end justify-center gap-12">
          {sizes.map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <FightClubLogo variant="mark" color="#0A0A0A" size={s} />
              <span className="text-[11px] uppercase tracking-[0.2em] text-black/50">
                {s}px
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <h2 className="px-8 pb-6 text-xs font-semibold uppercase tracking-[0.25em] text-black/50">
          Full size tests
        </h2>
        <div className="flex flex-wrap items-end justify-center gap-12">
          {[120, 200, 320].map((s) => (
            <div key={s} className="flex flex-col items-center gap-3">
              <FightClubLogo variant="full" color="#0A0A0A" size={s} />
              <span className="text-[11px] uppercase tracking-[0.2em] text-black/50">
                {s}px
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
