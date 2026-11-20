// Wave 2 — the label and type primitives.
//
// The label's behaviour is the donor's: it names a control through
// `nativeID`, marks required and disabled states for screen readers, and does
// not intercept touches. The dress is the Wave 1 family's type scale.

import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";

import { colors, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface LabelProps {
  children?: ReactNode;
  /** Adds the required marker and reports it to screen readers. */
  required?: boolean;
  disabled?: boolean;
  /** Matched by a control's `aria-labelledby`/`nativeID`. */
  nativeID?: string;
  isDark?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

export function Label({
  children,
  required = false,
  disabled = false,
  nativeID,
  isDark: isDarkProp,
  style,
  testID,
}: LabelProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { Text: RNText } = primitives();

  return (
    <RNText
      testID={testID}
      nativeID={nativeID}
      accessibilityRole="text"
      accessibilityState={{ disabled }}
      style={[
        typeScale.label,
        { color: disabled ? theme.muted : theme.foreground },
        style,
      ]}
      {...({ "aria-required": required } as any)}
    >
      {children}
      {required ? <RNText style={{ color: theme.destructive }}> *</RNText> : null}
    </RNText>
  );
}
