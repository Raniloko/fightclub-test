import logoAsset from "@/assets/fightclub-logo.png.asset.json";

type Variant = "dark" | "light";

export function Logo({ variant = "dark", height, className }: { variant?: Variant; height?: number; className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Fight Club MMA Akademie Hanau"
      className={className}
      style={{
        height: height ? `${height}px` : undefined,
        width: "auto",
        filter: variant === "light" ? "brightness(0) invert(1)" : "brightness(0)",
      }}
    />
  );
}

export default Logo;
