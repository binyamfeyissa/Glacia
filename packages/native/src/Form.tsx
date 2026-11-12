import { forwardRef, useState, type ReactNode } from "react";

import { colors, radii } from "./internal/tokens";
import { primitives } from "./charts/primitives";

export interface LabelProps {
  children?: ReactNode;
  /** Marks the field required with a visible asterisk. */
  required?: boolean;
  disabled?: boolean;
  /** Ties the label to the control for screen readers. */
  htmlFor?: string;
  isDark?: boolean;
  style?: any;
}

/** The text above a control. */
export const Label = forwardRef<any, LabelProps>(function Label(
  { children, required = false, disabled = false, htmlFor, isDark = false, style },
  ref,
) {
  const theme = isDark ? colors.dark : colors.light;
  const { Text } = primitives();

  return (
    <Text
      ref={ref}
      nativeID={htmlFor}
      accessibilityRole="text"
      style={{
        fontSize: 13,
        fontWeight: "600",
        color: disabled ? theme.muted : theme.foreground,
        opacity: disabled ? 0.6 : 1,
        ...style,
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
  style?: any;
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
  isDark = false,
  children,
  style,
}: FieldProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text } = primitives();
  const message = error ?? description;

  return (
    <View style={{ gap: 6, ...style }}>
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
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  indeterminate?: boolean;
  disabled?: boolean;
  isDark?: boolean;
  style?: any;
}

/** A tick box for a single boolean, with an optional label and description. */
export function Checkbox({
  checked = false,
  onCheckedChange,
  label,
  description,
  indeterminate = false,
  disabled = false,
  isDark = false,
  style,
}: CheckboxProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();

  const filled = checked || indeterminate;

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => !disabled && onCheckedChange?.(!checked)}
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        opacity: disabled ? 0.45 : 1,
        ...style,
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
  onValueChange?: (value: string) => void;
  options: RadioOption[];
  /** Lay the options out in a row instead of a column. */
  horizontal?: boolean;
  disabled?: boolean;
  isDark?: boolean;
  style?: any;
}

/** One choice from a small, always-visible set. */
export function RadioGroup({
  value,
  onValueChange,
  options,
  horizontal = false,
  disabled = false,
  isDark = false,
  style,
}: RadioGroupProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();

  return (
    <View
      accessibilityRole="radiogroup"
      style={{ gap: horizontal ? 14 : 10, flexDirection: horizontal ? "row" : "column", ...style }}
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
            onPress={() => !isDisabled && onValueChange?.(option.value)}
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
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  isDark?: boolean;
  style?: any;
}

/**
 * A dropdown of mutually exclusive options.
 *
 * Native has no built-in picker that looks the same on iOS and Android, so the
 * list opens inline: predictable across platforms and reachable without a
 * modal. A long list scrolls naturally with the page.
 */
export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  isDark = false,
  style,
}: SelectProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();
  const [open, setOpen] = useState(false);

  const selected = options.find((option) => option.value === value);

  return (
    <View style={style}>
      <Pressable
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
                  onValueChange?.(option.value);
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
