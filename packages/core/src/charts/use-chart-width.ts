"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measures an element's width so SVG charts can lay out in real pixels.
 *
 * Charts that draw text or fixed-width strokes need a true pixel width rather
 * than a viewBox that scales everything (scaled text distorts and strokes
 * change thickness). This returns a ref to attach and the measured width,
 * falling back to `initial` before the first measurement.
 */
export function useChartWidth(initial = 480) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initial);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const next = element.getBoundingClientRect().width;
      if (next > 0) setWidth(Math.round(next));
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width } as const;
}
