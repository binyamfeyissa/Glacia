import { forwardRef, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { FallbackGlassView } from "./fallback";
import { defaultRouter } from "./glass-routing";
import type { SurfaceProfile } from "./material";
import { useIsDark } from "./motion";

export interface NativeGlassProps {
  effect?: "clear" | "regular" | "none";
  tintColor?: string;
  interactive?: boolean;
  /**
   * Which web surface profile this is (panel, control, field, overlay, hint,
   * rail). The fallback uses it to pick blur, rim brightness and highlight —
   * read by the fallback branch only; Apple's material replaces the stack on
   * iOS 26, so the prop is not forwarded there.
   */
  surface?: SurfaceProfile;
  /**
   * True while the surface is held, so the fallback can fade its specular glow
   * in. Not forwarded to Apple's view, which draws its own press effect.
   */
  pressed?: boolean;
  /** Passed to whichever surface renders, so tests can find the glass itself. */
  testID?: string;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  /**
   * Explicit dark override for the fallback tint. When omitted the phone's
   * colour scheme decides, so developers never thread this prop themselves.
   */
  isDark?: boolean;
  /**
   * Any further React Native view prop (accessibility, onLayout, pointer
   * events, …) is passed straight through to whichever surface renders, so a
   * component can put its own accessibility contract on the glass itself.
   */
  [prop: string]: any;
}

/**
 * The installed engine module's routing decision, memoised on first use, rather
 * than at module load, so the decision is taken when a surface first renders.
 * On a device that is the same answer either way — the engine's capability flag
 * is a constant of the installed build — but it keeps the choice a property of
 * the module rather than of import order, which is what makes both branches
 * reachable in tests.
 */
let cachedRouter: ReturnType<typeof defaultRouter> | null = null;

function router(): ReturnType<typeof defaultRouter> {
  if (cachedRouter === null) cachedRouter = defaultRouter();
  return cachedRouter;
}

/** Clears the memoised decision. Only tests call this, to drive both branches. */
export function resetGlassRouter() {
  cachedRouter = null;
}

/** Whether this build renders Apple's glass. */
export const isGlassSupported = defaultRouter().supported;

/**
 * Platform Glass View — the single place a glass surface is chosen:
 * - iOS 26+: Real `UIGlassEffect` via the vendored engine's native view
 * - iOS 16.4–25: the engine's Metal renderer over a captured backdrop
 * - Android 13+: the engine's AGSL renderer over a recorded backdrop
 * - Everywhere else: Glacia's own glass fallback of identical shape
 *
 * Reduce Transparency is honoured on the fallback branch only: there the
 * translucent tint is replaced by the theme's solid glass colour, with the same
 * radius and the same hairline border, because a translucent surface is what
 * the user asked the system to remove. On iOS 26 the system applies its own
 * treatment to `UIGlassEffect` and this component does not second-guess it —
 * overriding Apple's accessibility treatment would be worse than deferring to
 * it, so the real glass is left exactly as the system renders it.
 */
export const GlassView = forwardRef<any, NativeGlassProps>(function GlassView(
  {
    effect = "regular",
    tintColor,
    interactive = false,
    surface = "panel",
    pressed,
    testID,
    style,
    children,
    isDark: isDarkProp,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const decision = router();

  // A deliberate "no surface here" (a ghost button) never mounts a material:
  // the engine has no none-variant and the fallback paints nothing, so the
  // content renders bare in both.
  const bare = effect === "none";

  if (!bare && decision.supported && decision.LiquidGlassView) {
    const LiquidGlassView = decision.LiquidGlassView;
    const variant = effect === "clear" ? "clear" : "regular";
    const glow = pressed === undefined ? props.glow : { progress: pressed ? 1 : 0, lens: true };

    // The engine owns the material; Glacia's own surface parameters stop at
    // the branch. Everything else (accessibility contract, provider pairing,
    // the adaptive sensor, an externally driven press) rides through.
    return (
      <LiquidGlassView
        {...props}
        ref={ref}
        variant={variant}
        tint={tintColor}
        interactive={interactive}
        glow={glow}
        style={style}
        testID={testID}
        children={children}
      />
    );
  }

  // Unsupported, or a deliberate "no surface": the fallback floor renders —
  // with the same shape, states and materials as the glass would have.
  return (
    <FallbackGlassView
      ref={ref}
      effect={effect}
      tintColor={tintColor}
      surface={surface}
      pressed={pressed}
      testID={testID}
      isDark={isDark}
      style={style}
      {...props}
    >
      {children}
    </FallbackGlassView>
  );
});
