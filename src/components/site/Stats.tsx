const STATS = [
  { n: "300+", l: "Mitglieder" },
  { n: "8", l: "Trainer" },
  { n: "40+", l: "Einheiten / Woche" },
];

export function Stats() {
  return (
    <section className="bg-[#0a0a0a] text-white">
      <div className="mx-auto grid max-w-[1400px] grid-cols-3 divide-x divide-white/30 px-5 py-12 md:px-10 md:py-16">
        {STATS.map((s) => (
          <div key={s.l} className="flex flex-col items-center justify-center px-2 text-center">
            <div className="font-display text-5xl leading-none md:text-7xl">{s.n}</div>
            <div className="mt-3 text-[10px] font-medium uppercase tracking-[0.25em] text-white/70 md:text-xs">
              {s.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
