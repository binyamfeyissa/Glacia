// Neutral TabBar tint (0.6.8).
//
// The 0.6.6 light-blue TabBar tint (dark `rgba(140,170,255,0.25)`, light
// `rgba(200,225,255,0.35)`, the Revolut target) was rejected on device — the
// owner reported the bar "just looks blue" on dark and photo backgrounds.
// So the tint reverts to the neutral pre-0.6.6 wash, the engine's own
// `tabBarSurface` from `GLASS_UI_PALETTE`, resolved from the template theme.
// The revert touches ONLY the tint: the blur ~1 clarity (the owner's own
// "almost clear, like 1px" request) and the 0.6.7 refraction fixes stay.
// The render-based pin — the tint the TabBar actually hands the engine —
// lives in tabbar-thumb-metal.test.tsx; this file pins the 0.6.8 contract
// at the constants level: neutral tint + blur 1 + the kept lens and wash.
// Each test fails on the 0.6.6 code.

vi.mock("react-native", () => ({
  Platform: { OS: "ios" },
  useColorScheme: () => "dark",
}));
vi.mock("react-native-svg", () => ({}));

import { describe, expect, it, vi } from "vitest";

import {
  GLASS_BAR_METAL,
  GLASS_BUTTON_METAL,
  GLASS_PILL_METAL,
  GLASS_SLIDER_THUMB_METAL,
  GLASS_THUMB_METAL,
} from "../src/engine/src/constants/metal.constants";
import { GLASS_UI_PALETTE } from "../src/engine/src/theme/glass-ui-theme";
import { materialFor, type SurfaceProfile } from "../src/internal/material";

const PROFILES: SurfaceProfile[] = ["panel", "control", "field", "overlay", "hint", "rail"];

describe("0.6.8 — the TabBar tint is neutral again, not blue", () => {
  it("the engine's tabBarSurface is the neutral wash, not the 0.6.6 blue", () => {
    expect(GLASS_UI_PALETTE.dark.tabBarSurface).toBe("rgba(18,18,18,0.4)");
    expect(GLASS_UI_PALETTE.light.tabBarSurface).toBe("rgba(250,250,250,0.42)");
    expect(GLASS_UI_PALETTE.dark.tabBarSurface).not.toContain("140,170,255");
    expect(GLASS_UI_PALETTE.light.tabBarSurface).not.toContain("200,225,255");
  });
});

describe("0.6.8 — the blur ~1 clarity is kept, not re-frosted", () => {
  it("every engine metal still blurs at 1dp", () => {
    expect(GLASS_BAR_METAL.blurRadius).toBe(1);
    expect(GLASS_BUTTON_METAL.blurRadius).toBe(1);
    expect(GLASS_PILL_METAL.blurRadius).toBe(1);
    expect(GLASS_THUMB_METAL.blurRadius).toBe(1);
    expect(GLASS_SLIDER_THUMB_METAL.blurRadius).toBe(1);
  });

  it("the fallback still blurs at 1 on every surface", () => {
    for (const profile of PROFILES) {
      expect(materialFor(profile, "regular", false).blur).toBe(1);
      expect(materialFor(profile, "clear", false).blur).toBe(1);
    }
  });
});

describe("0.6.8 — the 0.6.7 lens and the light pill wash are kept", () => {
  it("the rest thumb lenses are still real lenses (depth 1, 0.4 highlight)", () => {
    expect(GLASS_THUMB_METAL.refraction?.depth).toBe(1);
    expect(GLASS_THUMB_METAL.highlight?.intensity).toBe(0.4);
    expect(GLASS_SLIDER_THUMB_METAL.refraction?.depth).toBe(1);
    expect(GLASS_SLIDER_THUMB_METAL.highlight?.intensity).toBe(0.4);
  });

  it("the dark pill wash is still 0.12, not a solid grey oval", () => {
    expect(GLASS_UI_PALETTE.dark.tabIndicatorSurface).toBe("rgba(255,255,255,0.12)");
  });
});
