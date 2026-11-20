// Wave 2 — Progress.
//
// The donor's semantics: `role="progressbar"` with the value, minimum and
// maximum exposed, indeterminate when there is no value. The track is one of the
// family's glass surfaces, and it floors like every other surface.

import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, radii, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export type ProgressVariant = "bar" | "linear" | "track" | "ring" | "indeterminate";

export interface ProgressProps {
  /** 0–100. Omit for an indeterminate bar. */
  value: number;
  variant?: ProgressVariant;
  tint?: string;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

export function Progress({
  value,
  variant = "linear",
  tint,
  accessibilityLabel = "Progress",
  style,
  isDark: isDarkProp,
  testID,
}: ProgressProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText } = primitives();
  const indeterminate = variant === "indeterminate";
  const labelled = variant === "track" || variant === "ring";
  const percent = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={indeterminate ? undefined : { min: 0, max: 100, now: Math.round(percent) }}
    >
      <Glass
        effect="regular"
        surface="control"
        isDark={isDark}
        style={flattenStyle([
          { height: 8, borderRadius: radii.pill, overflow: "hidden", justifyContent: "center" },
          style,
        ])}
      >
        <View
          style={{
            height: "100%",
            width: indeterminate ? "40%" : `${percent}%`,
            borderRadius: radii.pill,
            backgroundColor: tint ?? theme.fill,
          }}
        />
      </Glass>
      {labelled ? (
        <RNText style={{ ...typeScale.caption, color: theme.muted, marginTop: 4 }}>
          {Math.round(percent)}%
        </RNText>
      ) : null}
    </View>
  );
}

/** Flattens a style prop into one object, so a plain view surface can take it. */
function flattenStyle(style: any): any {
  if (style == null) return undefined;
  const list = Array.isArray(style) ? style : [style];
  return Object.assign({}, ...list.filter(Boolean));
}
