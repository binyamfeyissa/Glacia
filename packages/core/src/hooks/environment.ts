"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useDirection } from "../direction";

/**
 * A multiplier for directional offsets: +1 in LTR, -1 in RTL.
 *
 * Charts, carousels and sliders all need to flip an x-offset for right-to-left
 * layouts. Multiplying by this sign is less error-prone than branching on the
 * direction at every call site.
 */
export function useDirectionSign(): 1 | -1 {
  const { isRTL } = useDirection();
  return isRTL ? -1 : 1;
}

export type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl";

const BREAKPOINT_MIN: Record<Exclude<Breakpoint, "xs">, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/**
 * The current responsive breakpoint.
 *
 * Reports `xs` during server rendering and the first client render, then the
 * real value after mount. That keeps hydration markup identical on both sides
 * instead of rendering a desktop layout into mobile HTML.
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xs");

  useEffect(() => {
    const measure = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINT_MIN.xl) setBreakpoint("xl");
      else if (width >= BREAKPOINT_MIN.lg) setBreakpoint("lg");
      else if (width >= BREAKPOINT_MIN.md) setBreakpoint("md");
      else if (width >= BREAKPOINT_MIN.sm) setBreakpoint("sm");
      else setBreakpoint("xs");
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return breakpoint;
}

/**
 * Whether a media query currently matches.
 *
 * Returns `false` until mounted so server and first client render agree.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const list = window.matchMedia(query);
    const update = () => setMatches(list.matches);
    update();
    list.addEventListener("change", update);
    return () => list.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export type ThemeMode = "light" | "dark" | "system";

/**
 * Theme preference with an explicit "system" option.
 *
 * Stores the choice and, in system mode, tracks the OS setting live. The
 * resolved value is what components should actually paint with.
 */
export function useThemeMode(storageKey = "glacia-theme") {
  const [mode, setMode] = useState<ThemeMode>("system");
  const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === "light" || stored === "dark" || stored === "system") setMode(stored);
    } catch {
      // Storage can throw in private modes; the default is a fine fallback.
    }
  }, [storageKey]);

  const update = useCallback(
    (next: ThemeMode) => {
      setMode(next);
      try {
        window.localStorage.setItem(storageKey, next);
      } catch {
        // Persisting is a convenience, not a requirement.
      }
      if (typeof document !== "undefined") {
        document.documentElement.dataset.glaciaTheme = next;
      }
    },
    [storageKey],
  );

  const resolved: "light" | "dark" = mode === "system" ? (prefersDark ? "dark" : "light") : mode;

  return { mode, setMode: update, resolved } as const;
}

/** Kept for callers that want the theme without the mode plumbing. */
export function useTheme() {
  const { resolved, mode, setMode } = useThemeMode();
  return { theme: resolved, mode, setMode } as const;
}

/**
 * Insets that appear when the on-screen keyboard opens.
 *
 * Uses the visual viewport, which is the only reliable signal for keyboard
 * height in a browser. Returns zero inset when the API is unavailable so
 * layouts degrade rather than break.
 */
export function useKeyboardAvoidance() {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const measure = () => {
      // The gap between the layout viewport and the visual viewport is the
      // keyboard's footprint on screen.
      const overlap = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setInset(Math.round(overlap));
    };

    measure();
    viewport.addEventListener("resize", measure);
    viewport.addEventListener("scroll", measure);
    return () => {
      viewport.removeEventListener("resize", measure);
      viewport.removeEventListener("scroll", measure);
    };
  }, []);

  return inset;
}

/**
 * Registers a back-navigation handler.
 *
 * The browser's back gesture cannot be intercepted from a page, so this pushes
 * a history entry when armed and consumes it on back. `onBack` returning false
 * lets the navigation proceed; returning true keeps the page. Only the topmost
 * armed handler runs, so nested overlays close in order.
 */
export function useBackHandler(onBack: () => boolean, enabled = true) {
  const handler = useRef(onBack);
  handler.current = onBack;
  const pushed = useRef(false);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    window.history.pushState({ glaciaBack: true }, "");
    pushed.current = true;

    const onPopState = () => {
      pushed.current = false;
      const handled = handler.current();
      // Re-arm unless the handler let the navigation through.
      if (handled) window.history.pushState({ glaciaBack: true }, "");
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
      // Leaving with an unspent entry would strand the user one back-press
      // away from where they expect to be.
      if (pushed.current) {
        pushed.current = false;
        window.history.back();
      }
    };
  }, [enabled]);
}

export interface ScrollSection {
  id: string;
  /** Fraction of the section scrolled past, 0–1. */
  progress: number;
}

/**
 * Tracks which sections of a page are in view and how far through them the
 * reader is.
 *
 * Uses a single IntersectionObserver plus a scroll listener for progress,
 * rather than one observer per section, so a long document stays cheap.
 */
export function useScrollSections(ids: string[]) {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);
  const [sections, setSections] = useState<ScrollSection[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || ids.length === 0) return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const measure = () => {
      const viewportHeight = window.innerHeight;
      const next: ScrollSection[] = elements.map((el) => {
        const rect = el.getBoundingClientRect();
        const total = rect.height || 1;
        const scrolled = Math.min(total, Math.max(0, -rect.top + viewportHeight * 0.35));
        return { id: el.id, progress: scrolled / total };
      });
      setSections(next);

      // The active section is the last one whose top has passed the upper third.
      const threshold = viewportHeight * 0.34;
      let current = elements[0]!.id;
      for (const el of elements) {
        if (el.getBoundingClientRect().top <= threshold) current = el.id;
      }
      setActiveId(current);
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [ids.join("|")]);

  return { activeId, sections } as const;
}

/**
 * The reveal progress of a single element, from 0 to 1.
 *
 * Uses IntersectionObserver for the coarse "is it visible" signal and a
 * throttled scroll read for the precise value, which avoids running layout
 * reads on every scroll event.
 */
export function useRevealProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      const height = window.innerHeight;
      // 0 when the element's top reaches the bottom of the viewport, 1 when
      // its bottom reaches the top.
      const span = rect.height + height;
      const travelled = height - rect.top;
      const next = Math.min(1, Math.max(0, travelled / (span || 1)));
      setProgress(next);
      setVisible(rect.top < height && rect.bottom > 0);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress, visible } as const;
}

/**
 * Swaps a skeleton for real content once the content is ready and painted.
 *
 * The point of the two-frame delay is to avoid the flash of real content
 * appearing before the browser has painted it, which looks worse than a
 * skeleton that lasts one frame longer.
 */
export function useSkeletonHandoff(loading: boolean, minimumMs = 0) {
  const [showSkeleton, setShowSkeleton] = useState(loading);
  const startedAt = useRef(typeof performance !== "undefined" ? performance.now() : 0);

  useEffect(() => {
    if (loading) {
      startedAt.current = typeof performance !== "undefined" ? performance.now() : 0;
      setShowSkeleton(true);
      return;
    }

    const elapsed = (typeof performance !== "undefined" ? performance.now() : 0) - startedAt.current;
    const wait = Math.max(0, minimumMs - elapsed);

    let inner = 0;
    const outer = setTimeout(() => {
      inner = requestAnimationFrame(() => setShowSkeleton(false));
    }, wait);

    return () => {
      clearTimeout(outer);
      if (inner) cancelAnimationFrame(inner);
    };
  }, [loading, minimumMs]);

  return showSkeleton;
}
