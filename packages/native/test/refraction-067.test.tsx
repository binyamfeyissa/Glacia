// Small-glass refraction (0.6.7).
//
// On the owner's iPhone the Switch thumb, Slider thumb and active TabBar pill showed NO
// visible refraction — just a dark blurry blob — while the target, iOS Settings' Wi-Fi switch
// thumb, is a clear glass lens with the green track refracted through it and a bright highlight.
// The 0.6.5 rest lens (switch 4/10dp, slider 5/12dp) did not make it visible. Root cause, three
// breaks, one symptom:
//  1. The thumbs wore an opaque white fill at rest (`opacity: 1 - pressProgress`, `#FFFFFF`,
//     full face) that covered the lens — the refraction was behind a solid lozenge.
//  2. The Switch thumb read a copy of the track squashed to zero height at rest
//     (`SWITCH_TRACK_COPY_SCALE_Y = [0, 0.75]`), so the lens saw only the screen — a uniform
//     dark field, whose refraction is invisible. The target refracts the green track.
//  3. The rest lens itself was too weak to read as a lens: amount 4–5, `depth: 0` (no radial
//     term, so the bend is edge-only, not a lens ball), a linear curve, and no highlight.
//  The TabBar pill had the same shape of break: the soft cutout painted the bar's surface tint
//  and the resting wash over the pill's glass at full opacity at rest, hiding its 0.6.6 lens.
// The fixes: the fill is gone (the thumb is glass alone), the track copy holds 0.75 height at
// rest, the rest lenses are real lenses (amount 8, depth 1, cubic, 0.4 highlight), and the
// cutout fills sit at 30% at rest so the pill's lens shows through.
// Each test fails on the old code.

// The metal constants import `Platform` from `react-native`; this package deliberately never
// imports `react-native` statically anywhere else. So this file stubs the two bindings the
// constants actually read, as the other metal tests do.
vi.mock("react-native", () => ({
  Platform: { OS: "ios" },
  useColorScheme: () => "dark",
}));
vi.mock("react-native-svg", () => ({}));

import { describe, expect, it, vi } from "vitest";

import {
  GLASS_SLIDER_THUMB_METAL,
  GLASS_SLIDER_THUMB_PRESSED_METAL,
  GLASS_THUMB_METAL,
  GLASS_THUMB_PRESSED_METAL,
} from "../src/engine/src/constants/metal.constants";
import { SWITCH_TRACK_COPY_SCALE_Y } from "../src/engine/src/constants/metrics.constants";

describe("0.6.7 — the rest thumb is a real lens, not an edge bend", () => {
  it("the switch thumb refracts hard enough to see at rest", () => {
    expect(GLASS_THUMB_METAL.refraction?.amount).toBe(8);
    expect(GLASS_THUMB_METAL.refraction?.width).toBe(12);
    expect(GLASS_THUMB_METAL.refraction?.height).toBe(12);
  });

  it("the slider thumb refracts hard enough to see at rest", () => {
    expect(GLASS_SLIDER_THUMB_METAL.refraction?.amount).toBe(8);
    expect(GLASS_SLIDER_THUMB_METAL.refraction?.width).toBe(14);
    expect(GLASS_SLIDER_THUMB_METAL.refraction?.height).toBe(14);
  });

  it("both rest lenses carry the radial term, so they read as a lens ball", () => {
    expect(GLASS_THUMB_METAL.refraction?.depth).toBe(1);
    expect(GLASS_SLIDER_THUMB_METAL.refraction?.depth).toBe(1);
  });

  it("both rest lenses use the cubic profile, like the pill", () => {
    expect(GLASS_THUMB_METAL.refraction?.curve?.power).toBe(3);
    expect(GLASS_SLIDER_THUMB_METAL.refraction?.curve?.power).toBe(3);
  });

  it("both rest lenses carry the bright glossy highlight", () => {
    expect(GLASS_THUMB_METAL.highlight?.intensity).toBe(0.4);
    expect(GLASS_SLIDER_THUMB_METAL.highlight?.intensity).toBe(0.4);
  });

  it("both rest lenses carry dispersion riding the band", () => {
    expect(GLASS_THUMB_METAL.dispersion?.amount).toBe(4);
    expect(GLASS_THUMB_METAL.dispersion?.reach).toBe(
      GLASS_THUMB_METAL.refraction?.width,
    );
    expect(GLASS_SLIDER_THUMB_METAL.dispersion?.amount).toBe(4);
    expect(GLASS_SLIDER_THUMB_METAL.dispersion?.reach).toBe(
      GLASS_SLIDER_THUMB_METAL.refraction?.width,
    );
  });

  it("the held lenses share the rest lens depth and curve, so the blend stays smooth", () => {
    expect(GLASS_THUMB_PRESSED_METAL.refraction?.depth).toBe(1);
    expect(GLASS_THUMB_PRESSED_METAL.refraction?.curve?.power).toBe(3);
    expect(GLASS_SLIDER_THUMB_PRESSED_METAL.refraction?.depth).toBe(1);
    expect(GLASS_SLIDER_THUMB_PRESSED_METAL.refraction?.curve?.power).toBe(3);
  });

  it("the held lenses stay wider and stronger than rest", () => {
    expect(GLASS_THUMB_PRESSED_METAL.refraction?.width).toBeGreaterThan(
      GLASS_THUMB_METAL.refraction?.width ?? 0,
    );
    expect(GLASS_THUMB_PRESSED_METAL.refraction?.amount).toBeGreaterThan(
      GLASS_THUMB_METAL.refraction?.amount ?? 0,
    );
    expect(GLASS_SLIDER_THUMB_PRESSED_METAL.refraction?.width).toBeGreaterThan(
      GLASS_SLIDER_THUMB_METAL.refraction?.width ?? 0,
    );
    expect(GLASS_SLIDER_THUMB_PRESSED_METAL.refraction?.amount).toBeGreaterThan(
      GLASS_SLIDER_THUMB_METAL.refraction?.amount ?? 0,
    );
  });
});

describe("0.6.7 — the switch thumb sees its track at rest", () => {
  it("the track copy is never flattened to zero height", () => {
    // Was [0, 0.75]: at rest the thumb read a track squashed to no height, so it saw only the
    // screen and the lens had nothing to refract. The target refracts the green track at rest.
    expect(SWITCH_TRACK_COPY_SCALE_Y[0]).toBe(0.75);
    expect(SWITCH_TRACK_COPY_SCALE_Y[1]).toBe(0.75);
  });
});
