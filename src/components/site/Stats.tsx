// Only facts that are stated elsewhere on the site (About, Disziplinen, Kindertraining)
const STATS = [
  { n: "460+", l: "Mitglieder" },
  { n: "2021", l: "Gegründet" },
  { n: "11", l: "Disziplinen" },
  { n: "ab 5", l: "Jahren Kindertraining" },
];

export function Stats() {
  return (
    <section
      className="border-y border-white/10 bg-[#0a0a0a] text-white"
      aria-label="Fight Club Hanau in Zahlen"
    >
      <dl className="mx-auto grid max-w-[1400px] grid-cols-2 md:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.l}
            className={`flex flex-col items-center justify-center px-4 py-8 text-center md:py-10 ${
              i % 2 === 1 ? "border-l border-white/10" : ""
            } ${i >= 2 ? "border-t border-white/10 md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""}`}
          >
            <dt className="order-2 mt-2 text-[10px] font-medium uppercase tracking-[0.25em] text-white/70 md:text-xs">
              {s.l}
            </dt>
            <dd className="order-1 font-display text-4xl leading-none text-[#00B4DC] md:text-6xl">
              {s.n}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
