import { forwardRef, useRef, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { Text } from "./Text";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

// ---------------------------------------------------------------------------
// Stepper

export interface StepperProps {
  /** Controlled value. Omit and the stepper keeps its own. */
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  /** Announced by screen readers, e.g. "Guests". */
  accessibilityLabel: string;
  /** Formats the middle readout; defaults to the plain number. */
  formatValue?: (value: number) => string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * Minus / value / plus.
 *
 * The same interaction contract Slider established: `adjustable` with
 * increment and decrement accessibility actions, and clamping at min and max
 * rather than wrapping or drifting past the range.
 */
export const Stepper = forwardRef<any, StepperProps>(function Stepper(
  {
    value: valueProp,
    defaultValue = 0,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    accessibilityLabel,
    formatValue,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable } = primitives();

  const [internal, setInternal] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internal;

  const apply = (next: number) => {
    const clamped = Math.min(Math.max(next, min), max);
    if (clamped === value) return;
    if (valueProp === undefined) setInternal(clamped);
    onValueChange?.(clamped);
  };

  const atMin = value <= min;
  const atMax = value >= max;

  const stepButton = (
    label: string,
    sign: "\u2212" | "+",
    action: () => void,
    blocked: boolean,
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || blocked }}
      disabled={disabled || blocked}
      onPress={action}
      style={{ width: 36, height: 36, alignItems: "center", justifyContent: "center", opacity: disabled || blocked ? 0.38 : 1 }}
    >
      <RNText style={{ fontSize: 20, fontWeight: "500", color: theme.foreground, lineHeight: 22 }}>
        {sign}
      </RNText>
    </Pressable>
  );

  return (
    <Glass
      ref={ref}
      effect="regular"
      isDark={isDark}
      testID={testID}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(event: any) => {
        const delta = event?.nativeEvent?.actionName === "increment" ? step : -step;
        apply(value + delta);
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        borderRadius: radii.pill,
        paddingHorizontal: 2,
        opacity: disabled ? 0.38 : 1,
        ...(style as ViewStyle),
      }}
      {...props}
    >
      {stepButton(`Decrease ${accessibilityLabel}`, "\u2212", () => apply(value - step), atMin)}
      <View style={{ minWidth: 44, alignItems: "center", justifyContent: "center" }}>
        <RNText style={{ fontSize: 16, fontWeight: "600", color: theme.foreground }} numberOfLines={1}>
          {formatValue ? formatValue(value) : String(value)}
        </RNText>
      </View>
      {stepButton(`Increase ${accessibilityLabel}`, "+", () => apply(value + step), atMax)}
    </Glass>
  );
});

// ---------------------------------------------------------------------------
// Toggle

export interface ToggleProps {
  /** Controlled pressed state. Omit and the toggle keeps its own. */
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /** Equivalent to `pressed`, matching web's Toggle naming. */
  selected?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  variant?: "glass" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  /** Required when the toggle has no visible text. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

const toggleSizes = { sm: 30, md: 36, lg: 44 };

/**
 * A button that stays pressed.
 *
 * Distinct from Switch: this is a button with an on-state (bold, favourite,
 * pinned), not a setting. It reports `selected`, which is what web's Toggle
 * announces.
 */
export const Toggle = forwardRef<any, ToggleProps>(function Toggle(
  {
    pressed: pressedProp,
    defaultPressed = false,
    onPressedChange,
    selected,
    icon,
    children,
    variant = "glass",
    size = "md",
    disabled = false,
    accessibilityLabel,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable } = primitives();

  // `selected` is accepted as an alias so the controlled prop matches web.
  const controlled = pressedProp !== undefined ? pressedProp : selected;
  const [internal, setInternal] = useState(defaultPressed);
  const isPressed = controlled !== undefined ? controlled : internal;

  const dimension = toggleSizes[size];

  const handlePress = () => {
    const next = !isPressed;
    if (controlled === undefined) setInternal(next);
    onPressedChange?.(next);
  };

  return (
    <Pressable
      ref={ref}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === "string" ? children : undefined)}
      accessibilityState={{ selected: isPressed, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }: { pressed: boolean }) => ({ alignSelf: "flex-start", opacity: disabled ? 0.38 : pressed ? 0.8 : 1 })}
      {...props}
    >
      <Glass
        effect={variant === "ghost" ? "none" : "regular"}
        interactive={!disabled && variant !== "ghost"}
        isDark={isDark}
        tintColor={isPressed && variant !== "ghost" ? theme.glassActive : undefined}
        style={{
          height: dimension,
          borderRadius: radii.pill,
          paddingHorizontal: icon && !children ? 0 : 12,
          width: icon && !children ? dimension : undefined,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          backgroundColor: variant === "ghost" ? "transparent" : undefined,
          ...(style as ViewStyle),
        }}
      >
        {icon ? <View>{icon}</View> : null}
        {typeof children === "string" ? (
          <RNText
            numberOfLines={1}
            style={{
              fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13,
              fontWeight: isPressed ? "600" : "500",
              color: isPressed ? theme.foreground : theme.muted,
            }}
          >
            {children}
          </RNText>
        ) : (
          children
        )}
      </Glass>
    </Pressable>
  );
});

// ---------------------------------------------------------------------------
// ToggleGroup

export interface ToggleGroupItem {
  value: string;
  label: string;
  icon?: ReactNode;
}

export interface ToggleGroupProps {
  items: ToggleGroupItem[];
  /** Allow several items on at once. */
  multiple?: boolean;
  /** Controlled selection. A string for single mode, an array for multiple. */
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

/**
 * A row of toggles acting as one choice.
 *
 * Built from the same pieces as SegmentedControl — one glass container, toggles
 * inside it, `glassActive` marking the active ones — but each item carries the
 * button styling of Toggle.
 */
export const ToggleGroup = forwardRef<any, ToggleGroupProps>(function ToggleGroup(
  {
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
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable } = primitives();

  const initial = defaultValue ?? (multiple ? [] : "");
  const [internal, setInternal] = useState<string | string[]>(initial);
  const selection = valueProp !== undefined ? valueProp : internal;

  const isOn = (value: string) =>
    Array.isArray(selection) ? selection.includes(value) : selection === value;

  const toggle = (value: string) => {
    let next: string | string[];
    if (multiple) {
      const current = Array.isArray(selection) ? selection : [];
      next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    } else {
      // Single mode: the same item pressed again clears it, as Toggle does.
      next = selection === value ? "" : value;
    }
    if (valueProp === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const height = size === "sm" ? 30 : size === "lg" ? 42 : 36;

  return (
    <Glass
      ref={ref}
      effect="regular"
      isDark={isDark}
      testID={testID}
      accessibilityRole="radiogroup"
      accessibilityLabel={accessibilityLabel}
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        padding: 3,
        gap: 3,
        borderRadius: radii.pill,
        ...(style as ViewStyle),
      }}
      {...props}
    >
      {items.map((item) => {
        const on = isOn(item.value);
        return (
          <Pressable
            key={item.value}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: on, disabled }}
            disabled={disabled}
            onPress={() => toggle(item.value)}
            style={{ opacity: disabled ? 0.38 : 1 }}
          >
            <View
              style={{
                height: height - 6,
                paddingHorizontal: 14,
                borderRadius: radii.pill,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                backgroundColor: on ? theme.glassActive : "transparent",
                borderWidth: on ? 0.5 : 0,
                borderColor: theme.edge,
              }}
            >
              {item.icon ? <View>{item.icon}</View> : null}
              <RNText
                numberOfLines={1}
                style={{ fontSize: 13, fontWeight: on ? "600" : "500", color: on ? theme.foreground : theme.muted }}
              >
                {item.label}
              </RNText>
            </View>
          </Pressable>
        );
      })}
    </Glass>
  );
});

// ---------------------------------------------------------------------------
// InputOTP

export interface InputOTPProps {
  /** Controlled code. Omit and the field keeps its own. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fires once the code reaches `length` characters. */
  onComplete?: (value: string) => void;
  /** How many digits. */
  length?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A verification-code row.
 *
 * One real text field drives the boxes. Keeping a single field — rather than N
 * inputs — is what makes paste and autofill fill every box in one go, and it is
 * what keeps the caret and keyboard behaviour sane across platforms.
 */
export const InputOTP = forwardRef<any, InputOTPProps>(function InputOTP(
  {
    value: valueProp,
    defaultValue = "",
    onChange,
    onComplete,
    length = 6,
    disabled = false,
    accessibilityLabel = "Verification code",
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, TextInput } = primitives();

  const [internal, setInternal] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internal;

  // The code is digits only, and never longer than the boxes available.
  const normalise = (raw: string) => raw.replace(/[^0-9]/g, "").slice(0, length);

  const handleChange = (raw: string) => {
    const next = normalise(raw);
    if (valueProp === undefined) setInternal(next);
    onChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const focusedIndex = Math.min(value.length, length - 1);

  return (
    <View
      ref={ref}
      testID={testID}
      style={[{ flexDirection: "row", alignItems: "center", gap: 8, alignSelf: "flex-start" }, style as ViewStyle]}
      {...props}
    >
      {Array.from({ length }, (_, index) => {
        const char = value[index] ?? "";
        const isActive = index === focusedIndex && !disabled;
        return (
          <Glass
            key={index}
            effect="regular"
            isDark={isDark}
            tintColor={isActive ? theme.glassActive : undefined}
            style={{
              width: 44,
              height: 52,
              borderRadius: radii.md,
              alignItems: "center",
              justifyContent: "center",
              borderColor: isActive ? theme.fill : theme.edge,
              opacity: disabled ? 0.38 : 1,
            }}
          >
            <RNText style={{ fontSize: 22, fontWeight: "600", color: theme.foreground }}>{char}</RNText>
          </Glass>
        );
      })}
      {/* The single real field. It is transparent and spans the row so a tap
          anywhere lands in the code, which is how the boxes stay in step. */}
      <TextInput
        accessibilityRole="text"
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ text: value }}
        value={value}
        onChangeText={handleChange}
        editable={!disabled}
        keyboardType="number-pad"
        maxLength={length}
        textContentType="oneTimeCode"
        autoComplete="one-time-code"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          // Invisible but present: the boxes are the visible representation.
          opacity: 0.02,
          color: "transparent",
        }}
      />
    </View>
  );
});

// ---------------------------------------------------------------------------
// ButtonGroup

export interface ButtonGroupItem {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface ButtonGroupProps {
  items: ButtonGroupItem[];
  size?: "sm" | "md" | "lg";
  /** `attached` shares edges; `segmented` leaves a gap between buttons. */
  variant?: "attached" | "segmented";
  /** A single handler instead of per-item `onPress`. */
  onItemPress?: (item: ButtonGroupItem, index: number) => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A connected row of buttons.
 *
 * Stateless by design: it reports presses and holds no selection, which is what
 * separates it from SegmentedControl (a stateful choice) and ToggleGroup.
 */
export const ButtonGroup = forwardRef<any, ButtonGroupProps>(function ButtonGroup(
  {
    items,
    size = "md",
    variant = "attached",
    onItemPress,
    accessibilityLabel,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable } = primitives();

  const height = size === "sm" ? 32 : size === "lg" ? 46 : 40;

  return (
    <View
      ref={ref}
      testID={testID}
      accessibilityRole="group"
      accessibilityLabel={accessibilityLabel}
      style={{
        flexDirection: "row",
        alignSelf: "flex-start",
        gap: variant === "segmented" ? 6 : 0,
        ...(style as ViewStyle),
      }}
      {...props}
    >
      {items.map((item, index) => {
        const first = index === 0;
        const last = index === items.length - 1;
        // Attached buttons share edges: only the outer corners are rounded,
        // and the inner edges stay square so the group reads as one control.
        const pill = variant === "segmented" ? radii.pill : 0;
        return (
          <Pressable
            key={`${item.label}-${index}`}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityState={{ disabled: item.disabled }}
            disabled={item.disabled}
            onPress={() => {
              item.onPress();
              onItemPress?.(item, index);
            }}
            style={({ pressed }: { pressed: boolean }) => ({
              opacity: item.disabled ? 0.38 : pressed ? 0.85 : 1,
            })}
          >
            <Glass
              effect="regular"
              interactive={!item.disabled}
              isDark={isDark}
              style={{
                height,
                paddingHorizontal: 18,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: variant === "segmented" ? pill : undefined,
                borderTopLeftRadius: variant === "segmented" ? pill : first ? radii.md : 0,
                borderBottomLeftRadius: variant === "segmented" ? pill : first ? radii.md : 0,
                borderTopRightRadius: variant === "segmented" ? pill : last ? radii.md : 0,
                borderBottomRightRadius: variant === "segmented" ? pill : last ? radii.md : 0,
              }}
            >
              <RNText numberOfLines={1} style={{ fontSize: size === "sm" ? 13 : 14, fontWeight: "500", color: theme.foreground }}>
                {item.label}
              </RNText>
            </Glass>
          </Pressable>
        );
      })}
    </View>
  );
});
