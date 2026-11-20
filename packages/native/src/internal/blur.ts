// Backdrop blur for the fallback material.
//
// React Native has no backdrop blur of its own. The fallback's biggest missing
// layer is exactly that: without it a surface is a translucent rectangle, not
// glass. Two community backends provide a real native blur view, and the
// package accepts either:
//
// - `expo-blur` (Expo apps; also works on web through backdrop-filter)
// - `@react-native-community/blur` (bare React Native)
//
// They are optional peer dependencies, resolved at runtime like every other
// native module in this package: a project that installs neither still gets a
// working (unblurred) fallback instead of a crash, and the jsdom test run never
// touches a native module.

declare const require: any;

import { loadCommunityBlurView } from "./blur-community";

export type BlurKind = "expo" | "community";

interface ResolvedBlur {
  kind: BlurKind;
  View: any;
}

let resolved: ResolvedBlur | null | undefined;

/**
 * The installed blur backend, or null when neither is available.
 *
 * Memoised: the answer is a property of the installed modules, not of the
 * render, so resolving once keeps every surface on the same backend.
 */
export function resolveBlurView(): ResolvedBlur | null {
  if (resolved !== undefined) return resolved;

  try {
    const expo = require("expo-blur");
    if (expo?.BlurView) {
      resolved = { kind: "expo", View: expo.BlurView };
      return resolved;
    }
  } catch {
    // Not installed: try the bare-React-Native backend below.
  }

  const communityView = loadCommunityBlurView();
  if (communityView) {
    resolved = { kind: "community", View: communityView };
    return resolved;
  }
  // Neither backend is installed; the fallback renders tint, rim and shadow.

  resolved = null;
  return resolved;
}

/** Clears the memoised backend. Only tests call this. */
export function resetBlurResolver() {
  resolved = undefined;
}

/**
 * The props one backend needs to blur a surface.
 *
 * The two libraries name the same idea differently — expo-blur takes a 0–100
 * intensity and a tint, community-blur a 0–100 amount and a blur type — so the
 * mapping lives here rather than in the fallback's render. Android needs an
 * explicit method on expo-blur; Dimezis is its own real-time backdrop blur.
 */
export function blurProps(
  kind: BlurKind,
  intensity: number,
  isDark: boolean,
): Record<string, any> {
  if (kind === "expo") {
    return {
      intensity,
      tint: isDark ? "dark" : "light",
      experimentalBlurMethod: "dimezisBlurView",
    };
  }
  return {
    // Community blur amounts are coarser; the tint carries most of the read.
    blurAmount: Math.max(1, Math.round(intensity / 1.6)),
    blurType: isDark ? "dark" : "light",
  };
}
