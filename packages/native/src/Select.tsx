// Wave 2 — Select.
//
// The donor's single-choice field: a `listbox`-style combobox whose trigger
// shows the chosen label, opening an anchored list where each option is
// selectable and the chosen one is marked. Controlled or internal, with a
// placeholder and disabled options.

import { useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";
import { OverlayPanel, PanelItem, useTriggerAnchor } from "./internal/overlay";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  accessibilityLabel?: string;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Select({
  value: valueProp,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select…",
  disabled = false,
  accessibilityLabel = "Select",
  isDark: isDarkProp,
  style,
  testID,
}: SelectProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText } = primitives();
  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const { ref, anchor, capture } = useTriggerAnchor();

  const value = valueProp !== undefined ? valueProp : internal;
  const chosen = options.find((option) => option.value === value);

  return (
    <View style={{ alignSelf: "flex-start", width: 220, maxWidth: "100%" }}>
      <Pressable
        ref={ref}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={chosen ? chosen.label : accessibilityLabel}
        accessibilityState={{ expanded: open, disabled }}
        accessibilityValue={chosen ? { text: chosen.label } : undefined}
        disabled={disabled}
        onPress={() => {
          void capture();
          setOpen(true);
        }}
        style={{ opacity: disabled ? 0.38 : 1 }}
      >
        <Glass
          effect="regular"
          surface="control"
          isDark={isDark}
          pressed={open}
          style={{
            height: 40,
            borderRadius: radii.md,
            paddingHorizontal: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <RNText
            numberOfLines={1}
            style={{
              flex: 1,
              fontSize: 15,
              color: chosen ? theme.foreground : theme.muted,
            }}
          >
            {chosen?.label ?? placeholder}
          </RNText>
          <RNText style={{ fontSize: 11, color: theme.muted, transform: [{ rotate: open ? "180deg" : "0deg" }] }}>
            ▾
          </RNText>
        </Glass>
      </Pressable>

      <OverlayPanel
        open={open}
        onClose={() => setOpen(false)}
        anchor={anchor}
        width={220}
        isDark={isDark}
        testID={testID ? `${testID}-list` : undefined}
        accessibilityLabel={chosen ? chosen.label : accessibilityLabel}
        role="listbox"
      >
        {options.map((option) => (
          <PanelItem
            key={option.value}
            label={option.label}
            disabled={option.disabled}
            selected={option.value === value}
            role="option"
            isDark={isDark}
            onPress={() => {
              if (option.disabled) return;
              setOpen(false);
              if (valueProp === undefined) setInternal(option.value);
              hapticSelection();
              onValueChange?.(option.value);
            }}
          />
        ))}
      </OverlayPanel>
    </View>
  );
}
