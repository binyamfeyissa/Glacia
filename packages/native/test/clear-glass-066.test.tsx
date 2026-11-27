// Clear glass (0.6.6).
//
// The owner, after verifying the TabBar float fix on his phone: "reduce the
// blur. Make the glass more clear and reduce the frosting? Almost next to
// clear. Like 1 px." Scope: ALL the glass everywhere. So every engine metal
// blurs at 1dp and the fallback blurs at intensity 1 on every surface — the
// tint, rim and highlight still mark the glass, only the frosting is gone.
// The pressed/dragged metals were already 0 and stay 0; the Scrim's
// progressive blur is untouched (its blur IS the effect — the scroll-edge
// melt — not frosting).
// Each test fails on the old code.

vi.mock("react-native", () => ({
  Platform: { OS: "ios" },
  useColorScheme: () => "dark",
}));
vi.mock("react-native-svg", () => ({}));

import { describe, expect, it, vi } from "vitest";

import {
  GLASS_BAR_CLEAR_METAL,
  GLASS_BAR_METAL,
  GLASS_BUTTON_METAL,
  GLASS_PANEL_METAL,
  GLASS_PILL_DRAGGED_METAL,
  GLASS_PILL_METAL,
  GLASS_SLIDER_THUMB_METAL,
  GLASS_SLIDER_THUMB_PRESSED_METAL,
  GLASS_THUMB_METAL,
  GLASS_THUMB_PRESSED_METAL,
  GLASS_TOAST_METAL,
} from "../src/engine/src/constants/metal.constants";
import { materialFor, type SurfaceProfile } from "../src/internal/material";
import { GLASS_UI_PALETTE } from "../src/engine/src/theme/glass-ui-theme";

const PROFILES: SurfaceProfile[] = ["panel", "control", "field", "overlay", "hint", "rail"];

describe("clear glass 0.6.6 — every engine metal blurs at 1dp", () => {
  it("the bar, button, clear bar, pill and thumbs all blur at 1", () => {
    expect(GLASS_BAR_METAL.blurRadius).toBe(1);
    expect(GLASS_BUTTON_METAL.blurRadius).toBe(1);
    expect(GLASS_BAR_CLEAR_METAL.blurRadius).toBe(1);
    expect(GLASS_PILL_METAL.blurRadius).toBe(1);
    expect(GLASS_THUMB_METAL.blurRadius).toBe(1);
    expect(GLASS_SLIDER_THUMB_METAL.blurRadius).toBe(1);
  });

  it("the panel and toast inherit the 1dp blur from the bar and button", () => {
    expect(GLASS_PANEL_METAL.blurRadius).toBe(1);
    expect(GLASS_TOAST_METAL.blurRadius).toBe(1);
  });

  it("the pressed/dragged metals stay at 0 — they never blurred", () => {
    expect(GLASS_PILL_DRAGGED_METAL.blurRadius).toBe(0);
    expect(GLASS_THUMB_PRESSED_METAL.blurRadius).toBe(0);
    expect(GLASS_SLIDER_THUMB_PRESSED_METAL.blurRadius).toBe(0);
  });

  it("the clear bar carries no frost at all", () => {
    expect(GLASS_BAR_CLEAR_METAL.frost).toBe(0);
  });
});

describe("clear glass 0.6.6 — the fallback blurs at 1 on every surface", () => {
  it("every profile blurs at 1, regular and clear alike", () => {
    for (const profile of PROFILES) {
      expect(materialFor(profile, "regular", false).blur).toBe(1);
      expect(materialFor(profile, "clear", false).blur).toBe(1);
      expect(materialFor(profile, "regular", true).blur).toBe(1);
    }
  });

  it("the rim still separates the profiles, so the layer table is not decorative", () => {
    const rims = new Set(PROFILES.map((p) => materialFor(p, "regular", false).rim));
    expect(rims.size).toBeGreaterThan(1);
  });
});

describe("Revolut target glass 0.6.6 — glossy highlight, visible rest lens, lighter pill", () => {
  it("the bar and clear bar carry a bright glossy highlight", () => {
    expect(GLASS_BAR_METAL.highlight?.intensity).toBe(0.6);
    expect(GLASS_BAR_METAL.highlight?.width).toBe(0.75);
    expect(GLASS_BAR_CLEAR_METAL.highlight?.intensity).toBe(0.5);
  });

  it("the resting pill bends the background visibly and carries a sheen", () => {
    expect(GLASS_PILL_METAL.refraction?.amount).toBe(8);
    expect(GLASS_PILL_METAL.refraction?.width).toBe(18);
    expect(GLASS_PILL_METAL.refraction?.height).toBe(18);
    expect(GLASS_PILL_METAL.dispersion?.amount).toBe(5);
    expect(GLASS_PILL_METAL.dispersion?.reach).toBe(18);
    expect(GLASS_PILL_METAL.highlight?.intensity).toBe(0.4);
  });

  it("the dark pill wash is 0.12, so the pill is glass, not a solid grey oval", () => {
    expect(GLASS_UI_PALETTE.dark.tabIndicatorSurface).toBe("rgba(255,255,255,0.12)");
    expect(GLASS_UI_PALETTE.light.tabIndicatorSurface).toBe("rgba(255,255,255,0.55)");
  });
});
