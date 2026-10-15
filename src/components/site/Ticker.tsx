const ITEMS = [
  "🥊 KOSTENLOSES PROBETRAINING",
  "PERSONAL TRAINING NACH TERMINVEREINBARUNG",
  "KINDERTRAINING AB 5 JAHREN",
  "KICKBOXEN",
  "THAIBOXEN",
  "MMA",
  "WING FIGHT",
  "K1",
  "BOXEN",
  "WWW.FIGHTCLUB-HANAU.DE 🌐",
];

function Row() {
  return (
    <span className="fc-ticker-row" aria-hidden="true">
      {ITEMS.map((item, i) => (
        <span key={i} className="fc-ticker-item">
          <span>{item}</span>
          <span className="fc-ticker-sep">•</span>
        </span>
      ))}
    </span>
  );
}

export function Ticker() {
  return (
    <div className="fc-ticker" role="marquee" aria-label="Fight Club Hanau Angebote">
      <div className="fc-ticker-track">
        <Row />
        <Row />
      </div>
    </div>
  );
}
