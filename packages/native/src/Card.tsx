import { forwardRef, type ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface CardProps {
  effect?: "clear" | "regular" | "none";
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  isDark?: boolean;
  /** Passed through to the card's glass so it is testable. */
  testID?: string;
}

/**
 * A content panel on Glacia's glass: Apple's material on iOS 26+, Glacia's
 * tint elsewhere. The padding, radius and stacking are ours on every platform.
 */
export const Card = forwardRef<any, CardProps>(function Card(
  { effect = "regular", style, children, isDark: isDarkProp, testID, ...props },
  ref,
) {
  const isDark = useIsDark(isDarkProp);

  const cardStyle: ViewStyle = {
    padding: 20,
    borderRadius: radii.lg,
    flexDirection: "column",
    gap: 12,
    ...(style as ViewStyle),
  };

  return (
    <Glass ref={ref} effect={effect} isDark={isDark} style={cardStyle} testID={testID} {...props}>
      {children}
    </Glass>
  );
});

/** The block holding a card's title and description. */
export function CardHeader({ style, children, ...props }: { style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const { View } = primitives();
  return (
    <View style={{ flexDirection: "column", gap: 4, ...(style as ViewStyle) }} {...props}>
      {children}
    </View>
  );
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
      style={{
        fontSize: 18,
        fontWeight: "600",
        color: themeColors.foreground,
        ...(style as TextStyle),
      }}
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
    <Text
      style={{
        fontSize: 13,
        color: themeColors.muted,
        ...(style as TextStyle),
      }}
      {...props}
    >
      {children}
    </Text>
  );
}

/** The card's body. */
export function CardContent({ style, children, ...props }: { style?: StyleProp<ViewStyle>; children?: ReactNode }) {
  const { View } = primitives();
  return (
    <View style={{ flexDirection: "column", gap: 8, ...(style as ViewStyle) }} {...props}>
      {children}
    </View>
  );
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
