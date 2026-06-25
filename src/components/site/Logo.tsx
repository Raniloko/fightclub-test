import logoAsset from "@/assets/fightclub-logo.png.asset.json";

type Variant = "dark" | "light";

export function Logo({ variant = "dark", height = 48 }: { variant?: Variant; height?: number }) {
  return (
    <img
      src={logoAsset.url}
      alt="Fight Club MMA Akademie Hanau"
      style={{
        height: `${height}px`,
        width: "auto",
        filter: variant === "light" ? "brightness(0) invert(1)" : "brightness(0)",
      }}
    />
  );
}

export default Logo;
