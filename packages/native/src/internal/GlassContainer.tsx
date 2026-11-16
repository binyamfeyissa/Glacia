import { forwardRef, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { defaultRouter } from "./glass-routing";
import { primitives } from "./primitives";
import { useIsDark } from "./motion";

export interface NativeGlassContainerProps {
  /**
   * How close two glass surfaces must be before iOS 26 blends them into one
   * connected liquid surface, in points. 0 merges only what touches.
   */
  spacing?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  isDark?: boolean;
  testID?: string;
  [prop: string]: any;
}

/**
 * The installed module's routing decision, memoised so a container and the
 * surfaces inside it always agree about which branch is rendering.
 */
let cachedRouter: ReturnType<typeof defaultRouter> | null = null;

function router(): ReturnType<typeof defaultRouter> {
  if (cachedRouter === null) cachedRouter = defaultRouter();
  return cachedRouter;
}

/** Clears the memoised decision. Only tests call this, to drive both branches. */
export function resetGlassContainerRouter() {
  cachedRouter = null;
}

/**
 * Groups glass surfaces so iOS 26 can merge them into one surface.
 *
 * On iOS 26, Apple's Liquid Glass is a connected material: two glass elements
 * placed close enough run together into a single shape with one shared edge,
 * rather than reading as two separate panes. `GlassContainer` is the component
 * that opts into that — a bar and the floating button above it, or a pair of
 * adjacent buttons, become one piece of glass.
 *
 * **Merging is an iOS 26+ visual effect and a no-op everywhere else.** On
 * older iOS, Android, Expo Go and the web preview this renders a plain wrapper
 * with identical layout: the children are the same components, drawn at the
 * same positions, they simply keep their own separate edges. Nothing changes
 * shape or shifts, so a container costs nothing on the platforms that cannot
 * blend.
 *
 * Use it only around surfaces that should read as one; glass inside glass is
 * still forbidden, so a container's children are `Glass` surfaces placed side
 * by side, not a panel wrapping another panel.
 */
export const GlassContainer = forwardRef<any, NativeGlassContainerProps>(
  function GlassContainer(
    { spacing = 0, style, children, isDark: isDarkProp, testID, ...props },
    ref,
  ) {
    const isDark = useIsDark(isDarkProp);
    const decision = router();
    const { View } = primitives();

    if (decision.supported && decision.LiquidGlassContainerView) {
      const ContentContainer = decision.LiquidGlassContainerView;
      return (
        <ContentContainer ref={ref} spacing={spacing} testID={testID} style={style} {...props}>
          {children}
        </ContentContainer>
      );
    }

    // Unsupported: a wrapper with the same layout, so nothing shifts.
    return (
      <View ref={ref} testID={testID} style={style} {...props}>
        {children}
      </View>
    );
  },
);
