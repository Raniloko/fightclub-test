import { useEffect, useState } from "react";

type Variant = "dark" | "light" | "auto";

const SRC = {
  dark: "/logo-dark.png",   // gold on black — use on dark backgrounds
  light: "/logo-light.png", // gold on white — use on light backgrounds
};

export function Logo({
  variant = "dark",
  height,
  className,
}: {
  variant?: Variant;
  height?: number;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (variant !== "auto") return;
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const resolved: "dark" | "light" =
    variant === "auto" ? (scrolled ? "light" : "dark") : variant;

  return (
    <img
      src={SRC[resolved]}
      alt="Fight Club Kampfsport Akademie Hanau"
      className={className}
      style={{
        height: height ? `${height}px` : undefined,
        width: "auto",
      }}
    />
  );
}

export default Logo;
