import logoAsset from "@/assets/logo.png.asset.json";

export function Logo({ className = "", color = "#0a0a0a" }: { className?: string; color?: string }) {
  const isWhite = color.toLowerCase() === "#ffffff" || color.toLowerCase() === "white";
  return (
    <img
      src={logoAsset.url}
      alt=""
      className={className}
      aria-hidden="true"
      style={isWhite ? { filter: "brightness(0) invert(1)" } : undefined}
    />
  );
}
