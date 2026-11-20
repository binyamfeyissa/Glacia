import { forwardRef, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface GroupProps {
  /** The distance at which a pressed member begins to fuse with its neighbour, dp. Defaults to 28. */
  spacing?: number;
  /** Resting gap between members, dp. Defaults to 12. */
  gap?: number;
  /** Lay the members out along a row (default) or a column. */
  direction?: "row" | "column";
  /**
   * The canvas glass — the material the merged silhouette is drawn with. Defaults to the kit's
   * button recipe.
   */
  metal?: unknown;
  /** Surface wash over the canvas. */
  tint?: string;
  /** Android only — which `LiquidGlassProvider` supplies the backdrop. */
  providerId?: string;
  style?: StyleProp<ViewStyle>;
  /** The members — the kit's buttons, icon buttons and chips join automatically. */
  children?: ReactNode;
  isDark?: boolean;
  /** Passed to the group so it is testable. */
  testID?: string;
}

/**
 * A group of glass members that merge when pressed together — ported from the
 * engine's `LiquidGlassGroup`.
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved merge behaviour. Without one — Expo Go, below every tier, or Reduce
 * Transparency — the fallback floor renders the same row of members with the
 * fallback material, so the group is never invisible.
 */
export const Group = forwardRef<any, GroupProps>(function Group(
  {
    spacing = 28,
    gap = 12,
    direction = "row",
    metal,
    tint,
    providerId,
    style,
    children,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { View } = primitives();
  const capabilities = glassCapabilities();
  const EngineGroup = loadEngineControl("Group");

  if (EngineGroup && capabilities.supported) {
    const EngineGroupComponent = EngineGroup;
    return (
      <EngineGroupComponent
        spacing={spacing}
        gap={gap}
        direction={direction}
        metal={metal}
        tint={tint}
        providerId={providerId}
        style={style}
        testID={testID}
      >
        {children}
      </EngineGroupComponent>
    );
  }

  // Fallback floor: the members laid out with the group's resting gap.
  return (
    <View
      style={{
        flexDirection: direction === "column" ? "column" : "row",
        gap,
        ...(style as ViewStyle),
      }}
      testID={testID}
      {...(props as any)}
    >
      {children}
    </View>
  );
});
