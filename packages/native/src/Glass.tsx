import { forwardRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { GlassView as GlassSurface, type NativeGlassProps } from "./internal/GlassView";
import { useIsDark } from "./internal/motion";

export interface GlassProps extends NativeGlassProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A glass surface.
 *
 * Routes through the package's single switch: Apple's real `UIGlassEffect` on
 * iOS 26+, the engine's Metal renderer on iOS 16.4–25 and its AGSL renderer on
 * Android 13+, Glacia's own glass fallback of identical shape elsewhere — Expo
 * Go and below every tier. `testID` is passed to whichever surface renders.
 */
export const Glass = forwardRef<any, GlassProps>(function Glass(
  {
    effect = "regular",
    tintColor,
    interactive = false,
    surface,
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
  return (
    <GlassSurface
      ref={ref}
      effect={effect}
      tintColor={tintColor}
      interactive={interactive}
      surface={surface}
      pressed={pressed}
      testID={testID}
      isDark={isDark}
      style={style}
      {...props}
    >
      {children}
    </GlassSurface>
  );
});

/**
 * The surface, under the engine's name. The public API uses Glacia names only,
 * so the surface ships as `GlassView` alongside the Glacia `Glass` alias — both
 * are the same component, and both are Glacia names.
 */
export const GlassView = Glass;
export type { NativeGlassProps };
export type { NativeGlassProps as GlassViewProps };
