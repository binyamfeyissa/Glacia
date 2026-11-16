// Haptic feedback for controls.
//
// Native iOS controls tick as you move them — a switch toggling, a segment
// being chosen. Glacia's controls are drawn by the library, so they have to
// ask for that tick themselves.
//
// There is no single React Native API for it, and Glacia does not take a
// dependency for one. Instead this tries, in order, the APIs that ship with
// common Expo and React Native projects, and does nothing where none is
// present. A missing tick must never break a control, so every call is
// wrapped: these helpers cannot throw.

import { primitives } from "./primitives";

declare const require: any;

/** The selection-tick implementation, resolved once. */
type Tick = () => void;

function resolveTick(): Tick | null {
  // Expo's haptics module, when the app has it installed.
  try {
    const expo = require("expo-haptics");
    if (expo?.selectionAsync) {
      return () => {
        expo.selectionAsync().catch?.(() => {});
      };
    }
  } catch {
    // Not an Expo project, or expo-haptics is not installed: try the next one.
  }

  // React Native's own Vibration API: a 10 ms buzz is the closest thing to a
  // selection tick that ships with core. It is a coarser feel, but it is real
  // feedback on a device that has no better module.
  const { Vibration } = primitives();
  if (Vibration?.vibrate) {
    return () => {
      Vibration.vibrate(10);
    };
  }

  return null;
}

/**
 * One selection tick, for a control whose value just changed by one step.
 *
 * Silent where no haptics API is available (the DOM preview, a test run, a
 * device without a vibration motor). Never throws.
 */
export function hapticSelection(): void {
  try {
    const tick = resolveTick();
    tick?.();
  } catch {
    // Haptics are a nicety; a failure here must not surface to the user.
  }
}
