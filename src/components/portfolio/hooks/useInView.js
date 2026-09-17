import { useEffect, useRef, useState } from "react";

/**
 * Fires once when the element enters (or nears) the viewport.
 * Used to defer video src assignment until the user can actually see the clip.
 */
export function useInView({ rootMargin = "300px", once = true, disabled = false } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(disabled);

  useEffect(() => {
    if (disabled) {
      setInView(true);
      return undefined;
    }

    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [disabled, once, rootMargin]);

  return [ref, inView];
}
