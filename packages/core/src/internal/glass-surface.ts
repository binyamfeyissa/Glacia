import { useEffect, useRef, type RefObject } from "react";

import { refractsBackdrop } from "./refraction";
import { fitBackdropLens, type LensOptions } from "./lens";
import { onceHydrated } from "./hydration";

/**
 * How each kind of glass behaves physically.
 *
 * A tooltip is a thin, small pane: it bends hard over a short rim and throws
 * little light. A dialog is a thick slab: a wide, shallow rim and a heavy
 * edge. A bar is a long rail with a lens that stays near its ends. These are
 * not decorative presets — each one changes the actual displacement map the
 * SVG filter draws, so two surfaces genuinely refract differently.
 */
export type GlassSurface =
  | "panel" // cards, tables, sheets, sidebars: large, broad bend
  | "control" // buttons, switches, chips: tight, bright, quick
  | "field" // inputs, search, selects: shallow, low dispersion
  | "overlay" // dialogs, popovers, menus: thick, deep, heavy rim
  | "hint" // tooltips, badges, kbd: thin, small, dry
  | "rail"; // tab bars, segmented controls: long and shallow

const SURFACES: Record<GlassSurface, LensOptions> = {
  // The long-established profile from the reference implementation.
  panel: {
    strength: 0.45,
    strengthProperty: "--gl-glass-bend",
    dispersion: 0.4,
    dispersionProperty: "--gl-glass-dispersion",
    depth: 0.25,
    dome: 0.5,
    splay: 1,
    relative: true,
    paintsLight: true,
  },
  // Small and bright: a tight band, a steeper dome, more colour split.
  control: {
    strength: 0.55,
    strengthProperty: "--gl-glass-bend",
    dispersion: 0.5,
    dispersionProperty: "--gl-glass-dispersion",
    depth: 0.3,
    dome: 0.6,
    splay: 0.9,
    relative: true,
    paintsLight: true,
  },
  // Flatter than a button: an input is pressed into the page, not sitting on it.
  field: {
    strength: 0.35,
    strengthProperty: "--gl-glass-bend",
    dispersion: 0.22,
    dispersionProperty: "--gl-glass-dispersion",
    depth: 0.2,
    dome: 0.34,
    splay: 1,
    relative: true,
    paintsLight: true,
  },
  // Thick glass: wide band, deep sag, the strongest read of depth.
  overlay: {
    strength: 0.5,
    strengthProperty: "--gl-glass-bend",
    dispersion: 0.45,
    dispersionProperty: "--gl-glass-dispersion",
    depth: 0.34,
    dome: 0.66,
    splay: 1,
    relative: true,
    paintsLight: true,
  },
  // A thin pane: little to bend, so keep it dry.
  hint: {
    strength: 0.28,
    strengthProperty: "--gl-glass-bend",
    dispersion: 0.15,
    dispersionProperty: "--gl-glass-dispersion",
    depth: 0.22,
    dome: 0.3,
    splay: 1,
    relative: true,
    paintsLight: true,
  },
  // Long and low, so a single dome would read as a bulge: flatten it.
  rail: {
    strength: 0.4,
    strengthProperty: "--gl-glass-bend",
    dispersion: 0.34,
    dispersionProperty: "--gl-glass-dispersion",
    depth: 0.22,
    dome: 0.4,
    splay: 0.8,
    relative: true,
    paintsLight: true,
  },
};

export interface UseGlassOptions {
  /** Which physical surface this element is. */
  surface?: GlassSurface;
  /** Set to false to leave the element as flat frosted glass. */
  enabled?: boolean;
}

/**
 * Gives any glass element the same live backdrop refraction the reference
 * implementation uses on its own components: an SVG displacement map drawn
 * for the element's exact size and corner radius, applied as its
 * `backdrop-filter`, with the chromatic split and the lit rim on top.
 *
 * Browsers without `backdrop-filter: url()` support (Safari, Firefox) keep
 * the plain frosted layer the stylesheet already gives `.gl-glass`; this hook
 * simply does nothing there.
 */
export function useGlass(ref: RefObject<HTMLElement | null>, options: UseGlassOptions = {}): void {
  const { surface = "panel", enabled = true } = options;
  const fit = useRef<(() => void) | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const apply = () => {
      if (!enabled) {
        element.removeAttribute("data-refracting");
        element.style.removeProperty("--gl-filter");
        return;
      }
      if (refractsBackdrop()) fitBackdropLens(element, SURFACES[surface]);
    };

    // Deferred: the first fit writes data-refracting, which React owns.
    onceHydrated(apply);

    // Re-fit when the element changes size or its corner radius changes with
    // a state (a button that rounds up when held, say).
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(apply);
    };
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    observer?.observe(element);
    const mutations =
      typeof MutationObserver === "undefined"
        ? null
        : new MutationObserver(schedule);
    mutations?.observe(element, { attributes: true, attributeFilter: ["class", "style"] });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      mutations?.disconnect();
      element.removeAttribute("data-refracting");
    };
  }, [ref, surface, enabled]);
}

/** The lens profile for a surface, for callers that need the raw numbers. */
export const glassSurface = (surface: GlassSurface): LensOptions => SURFACES[surface];
