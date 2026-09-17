import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll the window (and any inner scroll containers marked with
 * `data-scroll-root`) back to the top when navigating to a different page.
 *
 * Query-string updates (e.g. industry/country filters on the same page) are
 * intentionally ignored so in-page filters do not jump the user to the top.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Honor browser back/forward scroll restoration when the user explicitly
    // goes back — but for forward (PUSH) navigations we always reset.
    const navEntry = window.performance?.getEntriesByType?.("navigation")?.[0];
    if (navEntry?.type === "back_forward") return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Reset any inner scrollable containers (e.g. layouts with their own
    // overflow). Opt-in via `data-scroll-root` on the element.
    document
      .querySelectorAll("[data-scroll-root]")
      .forEach((el) => el.scrollTo({ top: 0, left: 0 }));
  }, [pathname]);

  return null;
}
