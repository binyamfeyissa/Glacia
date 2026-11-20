// Wave 2 — Separator.
//
// The donor's semantic separator (`role="separator"`, horizontal by default,
// decorative when it carries no label), dressed at the family's hairline.

import type { StyleProp, ViewStyle } from "react-native";

import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  /** Leading inset for a horizontal rule inside a list, dp. */
  inset?: number;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Separator({
  orientation = "horizontal",
  inset = 0,
  isDark: isDarkProp,
  style,
  testID,
}: SeparatorProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View } = primitives();
  const horizontal = orientation === "horizontal";

  return (
    <View
      testID={testID}
      accessibilityRole="none"
      role="separator"
      style={[
        {
          backgroundColor: theme.separator,
          alignSelf: "stretch",
          height: horizontal ? 1 : undefined,
          width: horizontal ? undefined : 1,
          marginLeft: horizontal ? inset : undefined,
          marginVertical: horizontal ? 8 : 0,
        },
        horizontal ? null : { height: "100%" },
        style,
      ]}
    />
  );
}
