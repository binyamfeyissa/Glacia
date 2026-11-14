import { forwardRef, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { FallbackGlassView } from "./fallback";
import { defaultRouter } from "./glass-routing";
import { useIsDark } from "./motion";

export interface NativeGlassProps {
  effect?: "clear" | "regular" | "none";
  tintColor?: string;
  interactive?: boolean;
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
 * The installed `@callstack/liquid-glass` module's routing decision.
 *
 * Resolved lazily and memoised on first use, rather than at module load, so the
 * decision is taken when a surface first renders. On a device that is the same
 * answer either way — `isLiquidGlassSupported` is a constant of the installed
 * build — but it keeps the choice a property of the module rather than of
 * import order, which is what makes both branches reachable in tests.
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
 * - iOS 26+: Real UIGlassEffect via @callstack/liquid-glass
 * - iOS < 26 / Android / Expo Go: translucent tint View with identical layout
 */
export const GlassView = forwardRef<any, NativeGlassProps>(function GlassView(
  {
    effect = "regular",
    tintColor,
    interactive = false,
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
  if (decision.supported && decision.LiquidGlassView) {
    const LiquidGlassView = decision.LiquidGlassView;
    return (
      <LiquidGlassView
        ref={ref}
        effect={effect}
        tintColor={tintColor}
        interactive={interactive}
        testID={testID}
        style={style}
        {...props}
      >
        {children}
      </LiquidGlassView>
    );
  }

  return (
    <FallbackGlassView
      ref={ref}
      effect={effect}
      tintColor={tintColor}
      testID={testID}
      isDark={isDark}
      style={style}
      {...props}
    >
      {children}
    </FallbackGlassView>
  );
});
