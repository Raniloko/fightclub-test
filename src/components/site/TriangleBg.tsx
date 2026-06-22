export function TriangleBg({
  className = "",
  stroke = "#E8E8E8",
  opacity = 0.4,
}: {
  className?: string;
  stroke?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      aria-hidden="true"
      style={{ opacity }}
      preserveAspectRatio="xMidYMid meet"
    >
      <polygon
        points="50,50 550,300 50,550"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
      />
    </svg>
  );
}
