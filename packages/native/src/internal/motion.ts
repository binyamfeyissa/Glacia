// Shared component plumbing: dark-mode defaulting and spring motion.
//
// Two rules apply to every Glacia component, so they live here instead of
// being repeated (and forgotten) in each file:
// - `useIsDark` falls back to the phone's own colour scheme when the caller
//   does not pass `isDark`, so a theme-aware app needs no extra prop threading.
// - `useSpring` animates a number towards its target with the package's spring
//   tokens through React Native's Animated API. No CSS, no timers of our own.
// - Motion respects the system's Reduce Motion preference: when it is on, the
//   value settles at its target instead of animating. Doing it here means every
//   animation built on `useSpring` complies without repeating the check.

import { useEffect, useRef } from "react";

import { useReducedMotion } from "./a11y";
import { primitives } from "./primitives";
import { springs } from "./tokens";

/**
 * Resolves the theme. An explicit `isDark` always wins; otherwise the phone's
 * colour scheme decides, defaulting to light when it is unknown.
 */
export function useIsDark(isDark?: boolean): boolean {
  const { useColorScheme } = primitives();
  const scheme = typeof useColorScheme === "function" ? useColorScheme() : null;
  return isDark ?? scheme === "dark";
}

export type SpringName = keyof typeof springs;

/**
 * A value that springs towards `target` whenever it changes.
 *
 * Returns the `Animated.Value` to put in a style, plus whether motion is real
 * on this platform. A caller that gets `animated === false` renders the target
 * directly, so the DOM preview and tests show the settled state rather than an
 * animation the environment cannot advance.
 *
 * Reduce Motion turns this into the same case: `animated` is false and the
 * value is already at its target, so the component jumps to its end state
 * rather than playing a transition the user asked not to see.
 */
export function useSpring(target: number, spring: SpringName = "snappy") {
  const { Animated, isNative } = primitives();
  const reducedMotion = useReducedMotion();
  const animated = Boolean(isNative && Animated?.Value && Animated?.spring) && !reducedMotion;

  // Off-device there is no Animated; a plain ref keeps the call sites identical.
  const value = useRef<any>(null);
  if (value.current === null) {
    value.current = animated ? new Animated.Value(target) : { value: target };
  }

  useEffect(() => {
    if (!animated) {
      value.current.value = target;
      return;
    }
    const animation = Animated.spring(value.current, {
      toValue: target,
      ...springs[spring],
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop?.();
  }, [animated, spring, target]);

  return { value: value.current, animated };
}
