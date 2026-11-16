// Accessibility preferences, as the platform reports them.
//
// Apple's HIG makes two of these part of wearing Liquid Glass faithfully:
// - Reduce Transparency: glass is replaced by a solid colour, because a
//   translucent surface is exactly what the user asked the system to remove.
// - Reduce Motion: animation jumps to its end state instead of playing.
//
// React Native exposes both through AccessibilityInfo, but it is resolved at
// runtime like every other primitive, so the package stays importable where
// React Native is absent (jsdom tests, web preview). Where the API is missing
// the hooks answer `false`: the preference is treated as off, which is the
// behaviour those environments already had.

import { useEffect, useState } from "react";

import { primitives } from "./primitives";

/** Reads a boolean preference once, guarding against a missing or throwing API. */
function readPreference(
  info: any,
  method: "isReduceTransparencyEnabled" | "isReduceMotionEnabled",
): Promise<boolean> {
  try {
    const result = info?.[method]?.();
    // React Native returns a promise; anything unexpected is treated as "off".
    if (result && typeof result.then === "function") {
      return result.then(
        (value: unknown) => Boolean(value),
        () => false,
      );
    }
    return Promise.resolve(Boolean(result));
  } catch {
    return Promise.resolve(false);
  }
}

/**
 * Subscribes to one AccessibilityInfo preference and keeps it in state.
 *
 * The initial read is async, so the hook starts `false` and corrects itself
 * when the platform answers. The subscription is removed on unmount; a
 * listener that outlives the component would leak on every navigation.
 */
function useAccessibilityPreference(
  method: "isReduceTransparencyEnabled" | "isReduceMotionEnabled",
  event: "reduceTransparencyChanged" | "reduceMotionChanged",
): boolean {
  const { AccessibilityInfo } = primitives();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!AccessibilityInfo) return;
    let cancelled = false;

    readPreference(AccessibilityInfo, method).then((value) => {
      if (!cancelled) setEnabled(value);
    });

    let subscription: any = null;
    try {
      subscription = AccessibilityInfo.addEventListener?.(event, (next: boolean) => {
        setEnabled(Boolean(next));
      });
    } catch {
      // An environment without the event still gets the initial read.
    }

    return () => {
      cancelled = true;
      try {
        subscription?.remove?.();
      } catch {
        // Nothing to clean up if subscribing failed.
      }
    };
  }, [AccessibilityInfo, method, event]);

  return enabled;
}

/**
 * Whether the user has asked the system to reduce transparency.
 *
 * When true, a glass surface must render a solid colour rather than a
 * translucent one. `GlassView` honours this on the fallback branch; on iOS 26
 * the system applies its own treatment to `UIGlassEffect` and is not
 * second-guessed here.
 *
 * The change event is iOS-only in React Native, so on Android the initial
 * read is the answer.
 */
export function useReducedTransparency(): boolean {
  return useAccessibilityPreference("isReduceTransparencyEnabled", "reduceTransparencyChanged");
}

/**
 * Whether the user has asked the system to reduce motion.
 *
 * Glacia's own animations settle at their end state instead of playing when
 * this is true.
 */
export function useReducedMotion(): boolean {
  return useAccessibilityPreference("isReduceMotionEnabled", "reduceMotionChanged");
}
