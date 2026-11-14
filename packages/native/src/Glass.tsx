import { forwardRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { GlassView, type NativeGlassProps } from "./internal/GlassView";
import { useIsDark } from "./internal/motion";

export interface GlassProps extends NativeGlassProps {
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * A glass surface.
 *
 * Routes through the package's single switch: Apple's real `UIGlassEffect` on
 * iOS 26+, Glacia's translucent fallback of identical shape on older iOS and
 * Android. `testID` is passed to whichever surface renders.
 */
export const Glass = forwardRef<any, GlassProps>(function Glass(
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
  return (
    <GlassView
      ref={ref}
      effect={effect}
      tintColor={tintColor}
      interactive={interactive}
      testID={testID}
      isDark={isDark}
      style={style}
      {...props}
    >
      {children}
    </GlassView>
  );
});
