import { fitBackdropLens, type LensOptions } from "./lens";
import { paintRim, refractsBackdrop } from "./refraction";
import { isHydrating, onceHydrated } from "./hydration";

/**
 * Gives every piece of glass on the page the live backdrop lens.
 *
 * Components mark themselves with `.gl-glass` in CSS, but a class alone only
 * buys a blur. This watches the document and fits the real displacement map
 * to each element that carries the class, so any glass — ours, or a surface a
 * user composes themselves — bends what is behind it rather than sitting flat.
 *
 * Attribute ownership: this engine writes data-rim, data-refracting and the
 * --gl-rim / --gl-filter custom properties onto those elements directly. They
 * describe measured pixel geometry, so no server render can know them, and
 * React therefore cannot own them. Two consequences:
 *
 *   - writes wait for `onceHydrated` (see ./hydration) so they never land
 *     mid-hydration;
 *   - React's dev overlay still reports a mismatch for these attributes when it
 *     re-renders a node the engine has written to. That report is expected here
 *     and does not appear in a production build.
 *
 * If you need a glass element React fully owns, render the attributes yourself
 * and do not let the sweep touch it.
 *
 * Each element's own classes choose its physics (see SURFACES below), so a
 * tooltip stays a thin pane and a dialog reads as a thick slab without the
 * component having to pass anything.
 */

type Surface = "panel" | "control" | "field" | "overlay" | "hint" | "rail";

const base: LensOptions = {
  strength: 0.45,
  strengthProperty: "--gl-glass-bend",
  dispersion: 0.4,
  dispersionProperty: "--gl-glass-dispersion",
  depth: 0.25,
  dome: 0.5,
  splay: 1,
  relative: true,
  paintsLight: true,
};

const SURFACES: Record<Surface, LensOptions> = {
  panel: base,
  control: { ...base, strength: 0.55, dispersion: 0.5, depth: 0.3, dome: 0.6, splay: 0.9 },
  field: { ...base, strength: 0.35, dispersion: 0.22, depth: 0.2, dome: 0.34 },
  overlay: { ...base, strength: 0.5, dispersion: 0.45, depth: 0.34, dome: 0.66 },
  hint: { ...base, strength: 0.28, dispersion: 0.15, depth: 0.22, dome: 0.3 },
  rail: { ...base, strength: 0.4, dispersion: 0.34, depth: 0.22, dome: 0.4, splay: 0.8 },
};

// Most specific first: a dialog that is also a panel is an overlay.
const RULES: Array<[RegExp, Surface]> = [
  [/gl-(tooltip|badge|kbd|marker)\b/, "hint"],
  [/gl-(dialog|alert-dialog|popover|menu|dropdown|context-menu|menubar|drawer|sheet|hover-card|command|toast|sonner)\b/, "overlay"],
  [/gl-(tab-bar|segmented|tabs-list|pagination|breadcrumb|navigation-menu|menubar-list)\b/, "rail"],
  [/gl-(input|textarea|select|search|combobox|otp|native-select|input-group|field|form)\b/, "field"],
  [/gl-(button|switch|slider|toggle|checkbox|radio|chip|segmented-item)\b/, "control"],
  [/gl-(card|table|sidebar|scroll|panel|item|empty|chart|calendar|carousel|message|bubble|attachment|questionnaire|trace|resizable|aspect|code-block|list|container)\b/, "panel"],
];

function surfaceFor(element: Element): Surface {
  const classes = typeof element.className === "string" ? element.className : "";
  const explicit = (element as HTMLElement).dataset.surface as Surface | undefined;
  if (explicit && explicit in SURFACES) return explicit;
  for (const [pattern, surface] of RULES) if (pattern.test(classes)) return surface;
  return "panel";
}

let observer: MutationObserver | null = null;
let frame = 0;
let fitted = new WeakMap<HTMLElement, string>();

function signature(element: HTMLElement): string {
  const style = getComputedStyle(element);
  return [
    element.offsetWidth,
    element.offsetHeight,
    style.borderTopLeftRadius,
    style.borderBottomRightRadius,
    style.getPropertyValue("--gl-glass-bend"),
    style.getPropertyValue("--gl-glass-dispersion"),
    style.getPropertyValue("--gl-glass-frost"),
    style.getPropertyValue("--gl-rim-shine"),
    style.getPropertyValue("--gl-blur"),
  ].join("|");
}

function sweep(): void {
  if (typeof document === "undefined") return;
  document.querySelectorAll<HTMLElement>(".gl-glass").forEach((element) => {
    // Opted out: `flat`, or explicitly not refracting.
    if (element.dataset.flat === "" || element.dataset.refracting === "off") {
      element.removeAttribute("data-refracting");
      element.removeAttribute("data-rim");
      element.style.removeProperty("--gl-filter");
      element.style.removeProperty("--gl-rim");
      return;
    }
    const next = signature(element);
    if (
      fitted.get(element) === next &&
      element.hasAttribute("data-rim") &&
      (!refractsBackdrop() || element.hasAttribute("data-refracting"))
    ) {
      return;
    }
    if (!element.offsetWidth || !element.offsetHeight) return;
    paintRim(element);
    if (refractsBackdrop()) {
      fitBackdropLens(element, SURFACES[surfaceFor(element)]);
    }
    fitted.set(element, next);
  });
}

export function resweepGlass(): void {
  if (isHydrating()) return; // the queued sweep will do this work
  fitted = new WeakMap();
  sweep();
}

function schedule(): void {
  if (isHydrating()) {
    // Coalesced: everything queued here runs in one sweep once we are hydrated.
    onceHydrated(sweep);
    return;
  }
  if (frame) return;
  if (typeof window === "undefined" || typeof requestAnimationFrame === "undefined") {
    sweep();
    return;
  }
  frame = requestAnimationFrame(() => {
    frame = 0;
    sweep();
  });
}

/**
 * Starts refracting every `.gl-glass` on the page. Safe to call repeatedly;
 * it installs one observer and returns a function that stops it.
 */
export function watchGlass(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") return () => {};

  schedule();

  observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style", "data-surface"],
  });

  const onResize = () => schedule();
  window.addEventListener("resize", onResize, { passive: true });

  // Custom event dispatched when global dials (bend, dispersion, frost, rim) change.
  const onGlassUpdate = () => resweepGlass();
  window.addEventListener("glacia:glass-update", onGlassUpdate);

  // Transitions change radius and size without a DOM mutation landing first.
  const timer = window.setInterval(schedule, 500);

  return () => {
    observer?.disconnect();
    observer = null;
    window.removeEventListener("resize", onResize);
    window.removeEventListener("glacia:glass-update", onGlassUpdate);
    window.clearInterval(timer);
    cancelAnimationFrame(frame);
    frame = 0;
  };
}
