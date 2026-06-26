interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 52, className = "" }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="Fight Club Kampfsport Akademie"
      style={{
        height: `${size}px`,
        width: "auto",
        objectFit: "contain",
      }}
      className={className}
    />
  );
}

export default Logo;
