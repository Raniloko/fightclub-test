export function Logo({ className = "", color = "#0a0a0a" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <polygon points="2,4 14,16 2,28" fill={color} />
      <polygon points="10,4 22,16 10,28" fill={color} opacity="0.7" />
      <polygon points="18,4 30,16 18,28" fill={color} opacity="0.4" />
    </svg>
  );
}
