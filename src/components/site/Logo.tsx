import logoAsset from "@/assets/logo-hanau.png.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Fight Club MMA Akademie Hanau"
      className={className}
    />
  );
}
