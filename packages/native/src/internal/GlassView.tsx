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
}

/**
 * The installed `@callstack/liquid-glass` module, resolved once at load.
 * `isLiquidGlassSupported` is true only on iOS 26+; false on older iOS,
 * Android and Expo Go.
 */
const router = defaultRouter();

export const isGlassSupported = router.supported;

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
  if (router.supported && router.LiquidGlassView) {
    const LiquidGlassView = router.LiquidGlassView;
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
