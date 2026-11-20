import { forwardRef, useState } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { hapticSelection } from "./internal/haptics";
import { useIsDark } from "./internal/motion";

export interface MorphGroupItem {
  key: string;
  /** Wrapped in a styled `Text`. */
  label?: string;
  /** Rendered before the label. */
  icon?: any;
  onPress?: () => void;
}

export interface MorphGroupProps {
  /** The capsules, laid out in a row. Two or more make the morph reachable. */
  items: MorphGroupItem[];
  /**
   * A capsule was dragged onto a neighbour and released there. What that *means*
   * — combining actions, stacking items, a folder — is the app's; the group only
   * springs everything home.
   */
  onMerge?: (fromKey: string, toKey: string) => void;
  /** A plain tap, forwarded alongside the item's own `onPress`. */
  onItemPress?: (key: string) => void;
  /** The distance at which two capsules begin to fuse, dp. Defaults to 28. */
  spacing?: number;
  /** Gap between capsules at rest, dp. Defaults to 12. */
  gap?: number;
  /** Capsule height; the corner radius follows it. Defaults to 48. */
  height?: number;
  /** Surface wash over every capsule's glass. */
  tint?: string;
  variant?: "regular" | "clear";
  metal?: unknown;
  providerId?: string;
  style?: StyleProp<ViewStyle>;
  /** Applied to item labels. */
  textStyle?: StyleProp<TextStyle>;
}

/**
 * A morphing group of capsules — ported from the engine's
 * `LiquidGlassMorphGroup`, the design Binyam approved on real devices this week
 * (capsules fuse when dragged together, spring home on release).
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved morph behaviour. Without one — Expo Go, below every tier, or Reduce
 * Transparency — the fallback floor renders the same capsules with solid
 * surfaces, so the group is never invisible.
 */
export const MorphGroup = forwardRef<any, MorphGroupProps>(function MorphGroup(
  {
    items,
    onMerge,
    onItemPress,
    spacing = 28,
    gap = 12,
    height = 48,
    tint,
    variant = "regular",
    metal,
    providerId,
    style,
    textStyle,
    ...props
  },
  ref,
) {
  const isDark = useIsDark();
  const themeColors = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText } = primitives();
  const capabilities = glassCapabilities();
  const EngineMorphGroup = loadEngineControl("MorphGroup");

  const capsules = items.map((item) => (
    <Pressable
      key={item.key}
      accessibilityRole="button"
      accessibilityLabel={item.label ?? item.key}
      disabled={!item.onPress}
      onPress={() => {
        hapticSelection();
        item.onPress?.();
        onItemPress?.(item.key);
      }}
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: themeColors.fill,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        ...(style as ViewStyle),
      }}
    >
      {item.icon}
      {item.label ? <RNText style={[textStyle, { fontSize: 15, fontWeight: "600" }]}>{item.label}</RNText> : null}
    </Pressable>
  ));

  if (EngineMorphGroup && capabilities.supported) {
    const EngineMorphGroupComponent = EngineMorphGroup;
    return (
      <EngineMorphGroupComponent
        items={items}
        onMerge={onMerge}
        onItemPress={onItemPress}
        spacing={spacing}
        gap={gap}
        height={height}
        tint={tint}
        variant={variant}
        metal={metal}
        providerId={providerId}
        style={style}
        textStyle={textStyle}
      />
    );
  }

  // Fallback floor: the same capsules, solid, in the same row.
  return (
    <View style={{ flexDirection: "row", gap, ...(style as ViewStyle) }} testID={undefined} {...(props as any)}>
      {capsules}
    </View>
  );
});
