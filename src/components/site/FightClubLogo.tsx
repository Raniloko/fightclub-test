type Variant = "full" | "mark" | "wordmark";

interface Props {
  variant?: Variant;
  color?: string;
  size?: number;
  className?: string;
}

export function FightClubLogo({
  variant = "full",
  color = "#0A0A0A",
  size = 200,
  className = "",
}: Props) {
  const showSymbol = variant === "full" || variant === "mark";
  const showWord = variant === "full" || variant === "wordmark";

  // viewBox tuned per variant for equal padding
  let viewBox = "0 0 400 310";
  let width = size;
  let height = (size * 310) / 400;

  if (variant === "mark") {
    // Symbol roughly spans x: 88–312 (224w), y: 15–160 (145h). Square it with padding.
    viewBox = "70 0 260 175";
    width = size;
    height = size; // we'll render in a square; preserveAspectRatio centers it
  } else if (variant === "wordmark") {
    viewBox = "0 170 400 90";
    width = size;
    height = (size * 90) / 400;
  }

  const fontStackBold = "'Barlow Condensed', 'Arial Narrow', Impact, sans-serif";
  const fontStackThin = "'Barlow Condensed', 'Arial Narrow', sans-serif";

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Fight Club MMA Akademie Hanau"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      {showSymbol && (
        <g>
          {/* Left arm */}
          <path d="M100,20 L135,20 L148,160 L88,160 Z" fill={color} />
          {/* Right arm (mirrored) */}
          <path d="M265,20 L300,20 L312,160 L252,160 Z" fill={color} />
          {/* Top connector bar */}
          <rect x="135" y="15" width="130" height="16" fill={color} />
        </g>
      )}

      {showWord && (
        <g>
          <text
            x="200"
            y="200"
            fontFamily={fontStackBold}
            fontWeight="900"
            fontSize="72"
            letterSpacing="-1"
            textAnchor="middle"
            fill={color}
          >
            FIGHT CLUB
          </text>
          <line
            x1="60"
            y1="215"
            x2="340"
            y2="215"
            stroke={color}
            strokeWidth="1.5"
          />
          <text
            x="200"
            y="242"
            fontFamily={fontStackThin}
            fontWeight="600"
            fontSize="18"
            letterSpacing="4"
            textAnchor="middle"
            fill={color}
          >
            MMA AKADEMIE HANAU
          </text>
        </g>
      )}
    </svg>
  );
}

export default FightClubLogo;
