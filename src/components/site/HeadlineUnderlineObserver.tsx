import { useEffect } from "react";

export function HeadlineUnderlineObserver() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll(".fc-headline-underline");
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}
