import { forwardRef, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { FallbackGlassView } from "./fallback";
import { defaultRouter, type GlassRouter, type GlassCapabilities } from "./glass-routing";
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

/**
 * The memoised routing decision — the package's single source of truth for
 * which glass surface a component may mount. Read through the same router the
 * surface itself uses, so a component and its surface can never disagree about
 * the mount tier.
 */
export function glassDecision(): GlassRouter {
  return router();
}

/**
 * The capability verdicts the package switches on, read through the same
 * memoised decision as the surface — the one place a component's engine branch
 * and its fallback floor are chosen from.
 */
export function glassCapabilities(): GlassCapabilities {
  const decision = router();
  return { supported: decision.supported, native: decision.native === true };
}

/** Whether this build renders Apple's glass. */
export const isGlassSupported = defaultRouter().supported;

/** Merges a style prop into one object; a function style is not resolvable here. */
function flattenStyle(style: any): ViewStyle {
  if (!style) return {};
  if (Array.isArray(style)) {
    return style.reduce<ViewStyle>((acc, entry) => ({ ...acc, ...flattenStyle(entry) }), {});
  }
  if (typeof style === "function") return {};
  return style as ViewStyle;
}

/**
 * The corner radius the engine's shader should refract with, read from the
 * style the container already paints with — the one shape source for the
 * engine branch. The native view defaults `cornerRadius` to 0 (a rectangle),
 * so without this a pill container would refract as a rectangle while its
 * outline is a pill. A raw pill radius (9999) is safe to pass: the native
 * side clamps it to half the shorter side, the same clamp the container
 * uses. Per-corner radii pass through as an object; an explicit `cornerRadius`
 * prop from the caller is read by the caller of this helper, not here.
 */
function resolveCornerRadius(
  style: StyleProp<ViewStyle>,
): number | { topLeft: number; topRight: number; bottomRight: number; bottomLeft: number } | undefined {
  const flat = flattenStyle(style);
  const tl = (flat as any).borderTopLeftRadius;
  const tr = (flat as any).borderTopRightRadius;
  const br = (flat as any).borderBottomRightRadius;
  const bl = (flat as any).borderBottomLeftRadius;
  const base = typeof flat.borderRadius === "number" ? flat.borderRadius : 0;
  if (
    typeof tl === "number" ||
    typeof tr === "number" ||
    typeof br === "number" ||
    typeof bl === "number"
  ) {
    return {
      topLeft: typeof tl === "number" ? tl : base,
      topRight: typeof tr === "number" ? tr : base,
      bottomRight: typeof br === "number" ? br : base,
      bottomLeft: typeof bl === "number" ? bl : base,
    };
  }
  if (typeof flat.borderRadius === "number") return flat.borderRadius;
  return undefined;
}

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
    // The engine's shader, content clip and border all refract with the
    // `cornerRadius` prop (default 0 = rectangle). Pass the radius the style
    // already paints, so the glass and the container share one shape. An
    // explicit `cornerRadius` prop from the caller wins.
    const cornerRadius = (props as any).cornerRadius ?? resolveCornerRadius(style);

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
        cornerRadius={cornerRadius}
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
