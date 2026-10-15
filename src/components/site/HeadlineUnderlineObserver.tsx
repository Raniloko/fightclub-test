import { useEffect } from "react";

export function HeadlineUnderlineObserver() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.8 },
    );
    // Some headlines render later (e.g. News after its data loads), so watch the DOM for new ones
    const observeNew = () => {
      document
        .querySelectorAll(".fc-headline-underline:not(.is-visible)")
        .forEach((el) => obs.observe(el));
    };
    observeNew();
    const mutations = new MutationObserver(observeNew);
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      obs.disconnect();
    };
  }, []);
  return null;
}
