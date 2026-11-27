// The fallback's material recipe — the web engine's surface profiles, in
// React Native terms.
//
// The web fits a different lens per component family (panel, control, field,
// overlay, hint, rail). The fallback had a single flat surface for all of
// them, which is why a dialog and a badge looked identical. This module turns
// each profile into the numbers the layered fallback needs: how strongly the
// backdrop is blurred, how bright the rim is, how much light sits inside the
// top edge, and whether the surface is lifted by a shadow.
//
// Nothing here renders. It is a table plus one resolver, so the fallback
// component stays a layout and the profiles stay reviewable against the web.

import { material } from "./tokens";

/** The six surfaces the web engine distinguishes. */
export type SurfaceProfile = "panel" | "control" | "field" | "overlay" | "hint" | "rail";

/**
 * The web profile values this mapping is derived from.
 *
 * Kept in the same order and with the same names as the engine's table so the
 * two can be diffed by eye: bend drives the blur strength, depth the inner
 * highlight, and dome the rim brightness (the dome is the part of the lens
 * that catches the light).
 */
const webProfiles: Record<
  SurfaceProfile,
  { bend: number; depth: number; dome: number }
> = {
  panel: { bend: 0.45, depth: 0.25, dome: 0.5 },
  control: { bend: 0.55, depth: 0.3, dome: 0.6 },
  field: { bend: 0.35, depth: 0.2, dome: 0.34 },
  overlay: { bend: 0.5, depth: 0.34, dome: 0.66 },
  hint: { bend: 0.28, depth: 0.22, dome: 0.3 },
  rail: { bend: 0.4, depth: 0.22, dome: 0.4 },
};

/** A resolved material for one surface, in the units React Native accepts. */
export interface ResolvedMaterial {
  /** Backdrop blur intensity on expo-blur's 0–100 scale. */
  blur: number;
  /** Alpha of the rim's brightest (top) stop. */
  rim: number;
  /** Alpha of the highlight inside the top edge. */
  highlight: number;
  /** How far the surface is lifted, from the theme's shadow tokens. */
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffsetY: number;
  /** Android's equivalent of the iOS shadow. */
  elevation: number;
}

/**
 * The reference profile: the panel is the base lens the others scale from.
 *
 * 0.6.6: the owner wants the glass almost clear, "like 1 px" — the fallback's
 * backdrop blur is 1 (expo-blur's 0–100 scale) on every surface, so content
 * behind the glass stays sharp and readable. The tint, rim and highlight
 * still mark the surface; only the frosting is gone.
 */
const BASE_BLUR = 1;
const BASE_DOME = webProfiles.panel.dome;
const BASE_DEPTH = webProfiles.panel.depth;

/**
 * The material for one surface.
 *
 * The `clear` effect is the same stack with a thinner lens — less blur and a
 * fainter rim — which is what the web means by clear. Reduce Transparency is
 * handled before this call: it replaces the whole stack with a solid colour.
 */
export function materialFor(
  profile: SurfaceProfile = "panel",
  effect: "clear" | "regular" | "none" = "regular",
  isDark = false,
): ResolvedMaterial {
  const lens = webProfiles[profile];
  const thin = effect === "clear" ? 0.55 : 1;
  const rimBase = isDark ? material.rim.dark : material.rim.light;

  return {
    // Clamped at 1: without it the faintest profiles would round to 0 (no blur
    // at all) instead of the ~1px the clear glass wants everywhere.
    blur: Math.max(1, Math.round(BASE_BLUR * (lens.bend / webProfiles.panel.bend) * thin)),
    rim: rimBase * (lens.dome / BASE_DOME) * thin,
    highlight: material.highlight * (lens.depth / BASE_DEPTH) * thin,
    // The web drops every surface by 1px; overlays carry their own, deeper
    // shadow from the component's style, which the fallback prefers when set.
    shadowOpacity: isDark ? 0 : material.shadowOpacity.light,
    shadowRadius: 3,
    shadowOffsetY: 1,
    elevation: isDark ? 0 : 1,
  };
}

/** Whether a surface is a shadowed one at all (the hint family sits flat). */
export function isFlatProfile(profile: SurfaceProfile): boolean {
  return profile === "hint";
}
