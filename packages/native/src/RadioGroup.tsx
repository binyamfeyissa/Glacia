// Wave 2 — RadioGroup.
//
// The donor's radio semantics: the group is a `radiogroup`, every option is a
// `radio` with `selected`, disabled options are skipped, and the value can be
// controlled or internal. Dressed in the Wave 1 family's rows and type steps.

import { useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radii, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: RadioOption[];
  horizontal?: boolean;
  disabled?: boolean;
  /** Announced as the group's name. */
  accessibilityLabel?: string;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function RadioGroup({
  value: valueProp,
  defaultValue,
  onValueChange,
  options,
  horizontal = false,
  disabled = false,
  accessibilityLabel = "Options",
  isDark: isDarkProp,
  style,
  testID,
}: RadioGroupProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText } = primitives();

  const [internal, setInternal] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internal;

  const choose = (next: string) => {
    if (valueProp === undefined) setInternal(next);
    hapticSelection();
    onValueChange?.(next);
  };

  return (
    <View
      testID={testID}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={[{ gap: 6, flexDirection: horizontal ? "row" : "column", flexWrap: "wrap" }, style]}
    >
      {options.map((option) => {
        const selected = value === option.value;
        const off = disabled || option.disabled;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: selected, disabled: off }}
            disabled={off}
            onPress={() => choose(option.value)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingVertical: 8,
              opacity: off ? 0.38 : 1,
            }}
          >
            <View
              style={{
                width: 22,
                height: 22,
                borderRadius: radii.pill,
                borderWidth: 1.5,
                borderColor: selected ? theme.fill : theme.separator,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selected ? (
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: radii.pill,
                    backgroundColor: theme.fill,
                  }}
                />
              ) : null}
            </View>
            <View style={{ flex: 1 }}>
              <RNText style={{ ...typeScale.body, color: theme.foreground }}>{option.label}</RNText>
              {option.description ? (
                <RNText style={{ ...typeScale.caption, color: theme.muted }}>
                  {option.description}
                </RNText>
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
