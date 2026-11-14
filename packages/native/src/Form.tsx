import { forwardRef, useState, type ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface LabelProps {
  children?: ReactNode;
  /** Marks the field required with a visible asterisk. */
  required?: boolean;
  disabled?: boolean;
  /**
   * The id of the control this label describes. Same meaning and prop name as
   * React Native's `nativeID`.
   */
  nativeID?: string;
  isDark?: boolean;
  style?: StyleProp<TextStyle>;
}

/** The text above a control. */
export const Label = forwardRef<any, LabelProps>(function Label(
  { children, required = false, disabled = false, nativeID, isDark: isDarkProp, style },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { Text } = primitives();

  return (
    <Text
      ref={ref}
      nativeID={nativeID}
      accessibilityRole="text"
      style={{
        fontSize: 13,
        fontWeight: "600",
        color: disabled ? theme.muted : theme.foreground,
        opacity: disabled ? 0.6 : 1,
        ...(style as TextStyle),
      }}
    >
      {children}
      {required && <Text style={{ color: theme.destructive }}> *</Text>}
    </Text>
  );
});

export interface FieldProps {
  label?: string;
  /** Helper text shown under the control. */
  description?: string;
  /** Error text. Overrides `description` and tints the label. */
  error?: string;
  required?: boolean;
  disabled?: boolean;
  isDark?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Label, control and message stacked in the order assistive tech announces
 * them, so a caller never has to place these three by hand.
 */
export function Field({
  label,
  description,
  error,
  required = false,
  disabled = false,
  isDark: isDarkProp,
  children,
  style,
}: FieldProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text } = primitives();
  const message = error ?? description;

  return (
    <View style={{ gap: 6, ...(style as ViewStyle) }}>
      {label && (
        <Label required={required} disabled={disabled} isDark={isDark}>
          {label}
        </Label>
      )}

      {children}

      {message && (
        <Text
          accessibilityRole={error ? "alert" : "text"}
          style={{
            fontSize: 11,
            color: error ? theme.destructive : theme.muted,
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

export interface CheckboxProps {
  checked?: boolean;
  /** Starting state for uncontrolled use. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  indeterminate?: boolean;
  disabled?: boolean;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Passed through to the pressable row so it is testable. */
  testID?: string;
}

/** A tick box for a single boolean, with an optional label and description. */
export function Checkbox({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  label,
  description,
  indeterminate = false,
  disabled = false,
  isDark: isDarkProp,
  style,
  testID,
}: CheckboxProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();

  // Controlled when `checked` is given, otherwise the box owns its state.
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const checked = checkedProp !== undefined ? checkedProp : internalChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (checkedProp === undefined) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  const filled = checked || indeterminate;

  return (
    <Pressable
      testID={testID}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={toggle}
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        opacity: disabled ? 0.45 : 1,
        ...(style as ViewStyle),
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 6,
          borderWidth: filled ? 0 : 1.5,
          borderColor: theme.edge,
          backgroundColor: filled ? theme.fill : "transparent",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        {indeterminate ? (
          <View style={{ width: 10, height: 2, borderRadius: 1, backgroundColor: "#fff" }} />
        ) : checked ? (
          // A glyph rather than an icon dependency: one text node, no package.
          <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700", lineHeight: 14 }}>
            ✓
          </Text>
        ) : null}
      </View>

      {(label || description) && (
        <View style={{ flex: 1 }}>
          {label && (
            <Text style={{ fontSize: 14, color: theme.foreground, fontWeight: "500" }}>{label}</Text>
          )}
          {description && (
            <Text style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>{description}</Text>
          )}
        </View>
      )}
    </Pressable>
  );
}

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value?: string;
  /** Starting selection for uncontrolled use. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: RadioOption[];
  /** Lay the options out in a row instead of a column. */
  horizontal?: boolean;
  disabled?: boolean;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Passed through to the group so it is testable. */
  testID?: string;
}

/** One choice from a small, always-visible set. */
export function RadioGroup({
  value: valueProp,
  defaultValue,
  onValueChange,
  options,
  horizontal = false,
  disabled = false,
  isDark: isDarkProp,
  style,
  testID,
}: RadioGroupProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();

  // Controlled when `value` is given, otherwise the group owns its selection.
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const select = (next: string, isDisabled: boolean | undefined) => {
    if (isDisabled) return;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <View
      testID={testID}
      accessibilityRole="radiogroup"
      style={{
        gap: horizontal ? 14 : 10,
        flexDirection: horizontal ? "row" : "column",
        ...(style as ViewStyle),
      }}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        const isDisabled = disabled || option.disabled;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected, disabled: isDisabled }}
            accessibilityLabel={option.label}
            disabled={isDisabled}
            onPress={() => select(option.value, isDisabled)}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 9,
              opacity: isDisabled ? 0.45 : 1,
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: isSelected ? 6 : 1.5,
                borderColor: isSelected ? theme.fill : theme.edge,
                marginTop: 1,
              }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: theme.foreground }}>{option.label}</Text>
              {option.description && (
                <Text style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>
                  {option.description}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value?: string;
  /** Starting selection for uncontrolled use. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Passed through to the trigger so it is testable. */
  testID?: string;
}

/**
 * A dropdown of mutually exclusive options.
 *
 * Native has no built-in picker that looks the same on iOS and Android, so the
 * list opens inline: predictable across platforms and reachable without a
 * modal. A long list scrolls naturally with the page.
 */
export function Select({
  value: valueProp,
  defaultValue,
  onValueChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  isDark: isDarkProp,
  style,
  testID,
}: SelectProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();
  const [open, setOpen] = useState(false);

  // Controlled when `value` is given, otherwise the select owns its choice.
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;

  const choose = (next: string) => {
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const selected = options.find((option) => option.value === value);

  return (
    <View style={style as StyleProp<ViewStyle>}>
      <Pressable
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ expanded: open, disabled }}
        accessibilityLabel={selected?.label ?? placeholder}
        disabled={disabled}
        onPress={() => setOpen(!open)}
        style={{
          minHeight: 42,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor: theme.edge,
          backgroundColor: theme.glass,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <Text style={{ fontSize: 15, color: selected ? theme.foreground : theme.muted }}>
          {selected?.label ?? placeholder}
        </Text>
        <Text style={{ fontSize: 10, color: theme.muted }}>{open ? "▲" : "▼"}</Text>
      </Pressable>

      {open && (
        <View
          style={{
            marginTop: 6,
            borderRadius: radii.md,
            borderWidth: 1,
            borderColor: theme.edge,
            backgroundColor: theme.glass,
            overflow: "hidden",
          }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={option.label}
                onPress={() => {
                  choose(option.value);
                  setOpen(false);
                }}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  backgroundColor: isSelected ? theme.glassActive : "transparent",
                }}
              >
                <Text style={{ fontSize: 14, color: theme.foreground }}>{option.label}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
