import { useEffect, useState } from "react";

export function MatrixHeadline({
  text,
  startDelay = 0,
  className,
  style,
}: {
  text: string;
  startDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const chars = Array.from(text);
  const [started, setStarted] = useState(false);
  const [landed, setLanded] = useState<boolean[]>(() => chars.map(() => false));

  const delays = chars.map((_, i) => i * 0.055);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const kick = setTimeout(() => {
      setStarted(true);
      chars.forEach((c, i) => {
        if (c === " ") return;
        timers.push(
          setTimeout(
            () =>
              setLanded((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              }),
            i * 55 + 620,
          ),
        );
      });
    }, startDelay * 1000);

    return () => {
      clearTimeout(kick);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, startDelay]);

  return (
    <span className={className} style={style} aria-hidden="true">
      {chars.map((c, i) => {
        if (c === " ") return <span key={i}> </span>;
        const d = delays[i]!;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: started ? "translateY(0)" : "translateY(-110px)",
              opacity: started ? 1 : 0,
              color: "#fff",
              textShadow: landed[i]
                ? "0 2px 40px rgba(0,0,0,0.5)"
                : "0 0 12px rgba(0,180,220,0.9), 0 0 26px rgba(0,180,220,0.6)",
              transition: [
                `transform 0.62s cubic-bezier(0.2, 0.9, 0.25, 1) ${d}s`,
                `opacity 0.25s ease ${d}s`,
                "text-shadow 0.45s ease",
              ].join(", "),
              willChange: "transform",
            }}
          >
            {c}
          </span>
        );
      })}
    </span>
  );
}
