import { forwardRef } from "react";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface ToolbarProps {
  /** The title. A string is set in a glass capsule of its own between the two ends; a node is rendered as given. */
  title?: ReactNode;
  /** Controls at the leading end — a back button, a menu. They merge when pressed. */
  leading?: ReactNode;
  /** Controls at the trailing end — actions. They merge when pressed. */
  trailing?: ReactNode;
  /** The merge distance for each end's group, dp. Defaults to 28. */
  spacing?: number;
  /** Gap between controls at either end, dp. Defaults to 12. */
  gap?: number;
  /** Bar height, dp. Defaults to 48. */
  height?: number;
  /** The title capsule's wash. */
  tint?: string;
  variant?: "regular" | "clear";
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  isDark?: boolean;
  /** Passed to the control so it is testable. */
  testID?: string;
}

/**
 * A toolbar — ported from the engine's `LiquidGlassToolbar`, the design Binyam
 * approved on real devices this week (48dp row, title capsule between the ends,
 * leading and trailing groups that merge when pressed).
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved material and merge behaviour. Without one — Expo Go, below every
 * tier, or Reduce Transparency — the fallback floor renders the same row with a
 * solid surface, so the toolbar is never invisible.
 */
export const Toolbar = forwardRef<any, ToolbarProps>(function Toolbar(
  {
    title,
    leading,
    trailing,
    spacing = 28,
    gap = 12,
    height = 48,
    tint,
    variant = "regular",
    style,
    titleStyle,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { View, Text: RNText } = primitives();
  const capabilities = glassCapabilities();
  const EngineToolbar = loadEngineControl("Toolbar");

  if (EngineToolbar && capabilities.supported) {
    const EngineToolbarComponent = EngineToolbar;
    return (
      <EngineToolbarComponent
        title={title}
        leading={leading}
        trailing={trailing}
        spacing={spacing}
        gap={gap}
        height={height}
        tint={tint}
        variant={variant}
        style={style}
        titleStyle={titleStyle}
      />
    );
  }

  // Fallback floor: solid row with the title between the ends.
  const leadingBox = (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>{leading}</View>
  );
  const titleNode = typeof title === "string" ? (
    <RNText style={[titleStyle ?? { fontSize: 17, fontWeight: "600" }, { color: themeColors.foreground }]}>
      {title}
    </RNText>
  ) : (
    title
  );
  const trailingBox = (
    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>{trailing}</View>
  );

  return (
    <View style={[{ height, flexDirection: "row", alignItems: "center" }, style]} testID={testID}>
      {leadingBox}
      <Glass effect={variant} surface="rail" tintColor={tint} isDark={isDark} style={{ flex: 1, height: height - 8, borderRadius: (height - 8) / 2, overflow: "hidden" } as ViewStyle}>
        {titleNode}
      </Glass>
      {trailingBox}
    </View>
  );
});
