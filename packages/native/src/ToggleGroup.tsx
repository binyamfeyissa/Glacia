// Wave 2 — ToggleGroup.
//
// The donor's grouped toggle: single- or multi-select, each item a toggle button
// reporting `selected`, the group reporting one value (or an array) and
// controlled-or-internal. Dressed in the family's glass controls on a shared
// spacing rhythm.

import { useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, radii, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";

export interface ToggleGroupItem {
  value: string;
  label?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps {
  items: ToggleGroupItem[];
  multiple?: boolean;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

const HEIGHTS = { sm: 28, md: 34, lg: 44 } as const;

export function ToggleGroup({
  items,
  multiple = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  size = "md",
  disabled = false,
  accessibilityLabel = "Toggle group",
  style,
  isDark: isDarkProp,
  testID,
}: ToggleGroupProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText } = primitives();

  const [internal, setInternal] = useState<string | string[] | undefined>(
    defaultValue ?? (multiple ? [] : undefined),
  );
  const value = valueProp !== undefined ? valueProp : internal;

  const isSelected = (item: string): boolean =>
    Array.isArray(value) ? value.includes(item) : value === item;

  const toggle = (key: string) => {
    let next: string | string[];
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      next = current.includes(key) ? current.filter((entry) => entry !== key) : [...current, key];
    } else {
      next = value === key ? "" : key;
    }
    if (valueProp === undefined) setInternal(next);
    hapticSelection();
    onValueChange?.(next);
  };

  return (
    <View
      testID={testID}
      accessibilityRole="toolbar"
      accessibilityLabel={accessibilityLabel}
      style={[{ flexDirection: "row", gap: 8, flexWrap: "wrap" }, style]}
    >
      {items.map((item) => {
        const selected = isSelected(item.value);
        const off = disabled || item.disabled;
        return (
          <Pressable
            key={item.value}
            accessibilityRole="button"
            accessibilityLabel={item.label ?? item.value}
            accessibilityState={{ selected, disabled: off }}
            disabled={off}
            onPress={() => toggle(item.value)}
            style={{ opacity: off ? 0.38 : 1 }}
          >
            <Glass
              effect="regular"
              surface="control"
              isDark={isDark}
              pressed={selected}
              style={{
                height: HEIGHTS[size],
                paddingHorizontal: size === "sm" ? 10 : 14,
                borderRadius: radii.pill,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: selected ? theme.glassActive : undefined,
              }}
            >
              {item.icon ? <View>{item.icon}</View> : null}
              <RNText
                style={{
                  ...typeScale.caption,
                  fontWeight: selected ? "700" : "500",
                  color: theme.foreground,
                }}
              >
                {item.label ?? item.value}
              </RNText>
            </Glass>
          </Pressable>
        );
      })}
    </View>
  );
}
