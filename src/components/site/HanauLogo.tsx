import logoAsset from "@/assets/logo-hanau-transparent.png.asset.json";

interface HanauLogoProps {
  color?: "white" | "black";
  height?: number;
  className?: string;
}

export function HanauLogo({
  color = "black",
  height = 64,
  className = "",
}: HanauLogoProps) {
  return (
    <img
      src={logoAsset.url}
      alt="Fight Club MMA Akademie Hanau"
      width={height}
      height={height}
      className={`w-auto object-contain transition-[filter,opacity] duration-300 ${className}`}
      style={{
        height,
        filter: color === "white" ? "brightness(0) invert(1)" : "none",
      }}
    />
  );
}

export default HanauLogo;
