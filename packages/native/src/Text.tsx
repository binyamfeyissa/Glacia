import { forwardRef, type ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";

import { colors, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export type TextVariant = "title" | "heading" | "body" | "caption" | "label";

export interface TextProps {
  /**
   * The type step. The names come from the package's type scale, so a title in
   * one app reads the same as a title in another.
   */
  variant?: TextVariant;
  /** Secondary text: descriptions, hints, timestamps. */
  muted?: boolean;
  /** Renders the text in the destructive tone (errors, danger). */
  destructive?: boolean;
  /** Number of lines before truncating. */
  numberOfLines?: number;
  children?: ReactNode;
  style?: StyleProp<TextStyle>;
  isDark?: boolean;
  testID?: string;
}

/** The accessibility role each variant announces. */
const roles: Record<TextVariant, "heading" | "text"> = {
  title: "heading",
  heading: "heading",
  body: "text",
  caption: "text",
  label: "text",
};

/**
 * Themed text.
 *
 * Every Glacia component that renders words uses this, so type, colour and
 * contrast come from one place. It wraps the resolver's `Text`, which is React
 * Native's own on a device.
 */
export const Text = forwardRef<any, TextProps>(function Text(
  {
    variant = "body",
    muted = false,
    destructive = false,
    numberOfLines,
    children,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { Text: RNText } = primitives();
  const scale = typeScale[variant];

  const textStyle: TextStyle = {
    fontSize: scale.fontSize,
    lineHeight: scale.lineHeight,
    fontWeight: scale.fontWeight,
    color: destructive ? theme.destructive : muted ? theme.muted : theme.foreground,
    ...(style as TextStyle),
  };

  return (
    <RNText
      ref={ref}
      testID={testID}
      accessibilityRole={roles[variant]}
      numberOfLines={numberOfLines}
      style={textStyle}
      {...props}
    >
      {children}
    </RNText>
  );
});
