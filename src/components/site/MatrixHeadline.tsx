import { useEffect, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%&*+=<>/";

type CharState = { resolved: boolean; display: string };

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
  const [states, setStates] = useState<CharState[]>(() =>
    chars.map((c) => ({ resolved: c === " ", display: c })),
  );
  const [started, setStarted] = useState(false);
  const [delays] = useState<number[]>(() =>
    chars.map((_, i) => Math.min(i * 0.05, 1.4) + Math.random() * 0.3),
  );

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    const kick = setTimeout(() => {
      setStarted(true);
      chars.forEach((c, i) => {
        if (c === " ") return;
        const landMs = delays[i]! * 1000 + 600;
        const iv = setInterval(() => {
          setStates((prev) => {
            const next = [...prev];
            if (next[i]!.resolved) return prev;
            next[i] = {
              resolved: false,
              display: GLYPHS[Math.floor(Math.random() * GLYPHS.length)]!,
            };
            return next;
          });
        }, 10);
        intervals.push(iv);
        timers.push(
          setTimeout(() => {
            clearInterval(iv);
            setStates((prev) => {
              const next = [...prev];
              next[i] = { resolved: true, display: c };
              return next;
            });
          }, landMs),
        );
      });
    }, startDelay * 1000);

    return () => {
      clearTimeout(kick);
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, startDelay]);

  return (
    <span className={className} style={style} aria-hidden="true">
      {chars.map((c, i) => {
        if (c === " ") return <span key={i}> </span>;
        const s = states[i]!;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontFamily: s.resolved
                ? "'Barlow Condensed', sans-serif"
                : "ui-monospace, SFMono-Regular, Menlo, monospace",
              transform: started
                ? "translateY(0)"
                : "translateY(-100px)",
              opacity: started ? 1 : 0,
              transition: `transform 0.5s cubic-bezier(0.16,1,0.3,1) ${delays[i]}s, opacity 0.3s ease ${delays[i]}s`,
              willChange: "transform",
            }}
          >
            {s.display}
          </span>
        );
      })}
    </span>
  );
}
