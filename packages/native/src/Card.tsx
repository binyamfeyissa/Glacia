import { forwardRef, type ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface CardProps {
  /** Makes the card a control: it presses to 98% and fires on release. */
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  /** Corner radius, continuous. Defaults to 24. */
  cornerRadius?: number;
  /** Inner padding, dp. Defaults to 16. */
  padding?: number;
  /**
   * Adaptive glass: the frost flips polarity with the backdrop under the card.
   * Defaults to `false`.
   */
  adaptive?: boolean;
  /** Surface wash. Defaults to the scheme's bar surface. */
  tint?: string;
  variant?: "regular" | "clear";
  metal?: unknown;
  providerId?: string;
  accessibilityLabel?: string;
  /** The outer frame — size it here. */
  style?: StyleProp<ViewStyle>;
  /** The inner content view. */
  contentStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  isDark?: boolean;
  /** Passed through to the card's glass so it is testable. */
  testID?: string;
}

/**
 * A content panel on Glacia's glass — ported from the engine's
 * `LiquidGlassCard`, the design Binyam approved on real devices this week (24dp
 * continuous corner, 16dp padding, presses to 98%).
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved material. Without one — Expo Go, below every tier, or Reduce
 * Transparency — the fallback floor renders the same geometry with a solid
 * surface, so the card is never invisible.
 */
export const Card = forwardRef<any, CardProps>(function Card(
  {
    onPress,
    onLongPress,
    disabled = false,
    cornerRadius = 24,
    padding = 16,
    adaptive = false,
    tint,
    variant = "regular",
    accessibilityLabel,
    style,
    contentStyle,
    children,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { View, Pressable } = primitives();
  const capabilities = glassCapabilities();
  const EngineCard = loadEngineControl("Card");

  const cardStyle: ViewStyle = {
    padding,
    borderRadius: cornerRadius,
    flexDirection: "column",
    gap: 16,
    ...(style as ViewStyle),
  };

  if (EngineCard && capabilities.supported) {
    const EngineCardComponent = EngineCard;
    return (
      <EngineCardComponent
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        disabled={disabled}
        cornerRadius={cornerRadius}
        padding={padding}
        adaptive={adaptive}
        tint={tint ?? themeColors.glass}
        variant={variant}
        style={style}
        contentStyle={contentStyle}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </EngineCardComponent>
    );
  }

  // Fallback floor: layered-or-solid material with the card's full geometry.
  const content = <View style={cardStyle}>{children}</View>;

  if (onPress) {
    return (
      <Pressable
        ref={ref}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        disabled={disabled}
        onPress={disabled ? undefined : onPress}
        onLongPress={disabled ? undefined : onLongPress}
        style={[{ transform: [{ scale: 0.98 }] } as ViewStyle]}
        {...props}
      >
        <Glass effect={variant} surface="panel" tintColor={tint} isDark={isDark} style={cardStyle} testID={testID}>
          {content}
        </Glass>
      </Pressable>
    );
  }

  return (
    <Glass effect={variant} surface="panel" tintColor={tint} isDark={isDark} style={cardStyle} testID={testID}>
      {content}
    </Glass>
  );
});

/** The block holding a card's title and description. */
export function CardHeader({ style, children, ...props }: { style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const { View } = primitives();
  return <View style={{ flexDirection: "column", gap: 4, ...(style as ViewStyle) }} {...props}>{children}</View>;
}

/** A card's heading, announced as a heading by screen readers. */
export function CardTitle({
  style,
  children,
  isDark: isDarkProp,
  ...props
}: {
  style?: StyleProp<TextStyle>;
  children?: ReactNode;
  isDark?: boolean;
}) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { Text } = primitives();
  return (
    <Text
      accessibilityRole="heading"
      style={{ fontSize: 18, fontWeight: "600" as const, color: themeColors.foreground, ...(style as TextStyle) }}
      {...props}
    >
      {children}
    </Text>
  );
}

/** Supporting text under a card's title. */
export function CardDescription({
  style,
  children,
  isDark: isDarkProp,
  ...props
}: {
  style?: StyleProp<TextStyle>;
  children?: ReactNode;
  isDark?: boolean;
}) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { Text } = primitives();
  return (
    <Text style={{ fontSize: 13, color: themeColors.muted, ...(style as TextStyle) }} {...props}>
      {children}
    </Text>
  );
}

/** The card's body. */
export function CardContent({ style, children, ...props }: { style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const { View } = primitives();
  return <View style={{ flexDirection: "column", gap: 8, ...(style as ViewStyle) }} {...props}>{children}</View>;
}

export const CardBody = CardContent;

/** The card's action row. */
export function CardFooter({ style, children, ...props }: { style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const { View } = primitives();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 8,
        paddingTop: 8,
        ...(style as ViewStyle),
      }}
      {...props}
    >
      {children}
    </View>
  );
}
