/**
 * The Glacia Native glass engine — vendored, not depended upon.
 *
 * This directory is a verbatim copy of the engine source from
 * `https://github.com/capthndsme/expo-liquid-glass-ui` (MIT, maintained by
 * capthndsme and contributors; the `NOTICE` and `LICENSE` files here carry its
 * copyright and attribution, including the AndroidLiquidGlass derivation noted
 * there).
 *
 * The engine is the design core of the rebuild: the glass surface
 * (`LiquidGlassView`), the backdrop provider (`LiquidGlassProvider`), the merge
 * container (`LiquidGlassContainer`) and the stacked-glass primitive
 * (`LiquidGlassStack`), the renderer tier machinery (iOS native / iOS Metal /
 * Android AGSL / fallback) and the capability helpers
 * (`supportsGlass`, `supportsNativeGlass`, `useAdaptiveGlass`, the luminance and
 * adaptive system).
 *
 * It is vendored *into* `glacia-native` because the rebuild patches the iOS
 * backdrop capture path (§6 of the rebuild brief); a GitHub dependency could not
 * receive those patches through the npm package. Nothing in this directory is
 * authored by Glacia.
 */

export * from "./src/index";
