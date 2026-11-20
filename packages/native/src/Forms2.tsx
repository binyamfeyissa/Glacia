import { forwardRef, useRef, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { Text } from "./Text";
import { colors, controlSizes, palette as tokenPalette, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { SelectedLens, lensFill } from "./internal/lens";

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
            surface="field"
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
              surface="control"
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

// ---------------------------------------------------------------------------
// ColorPicker

export interface ColorPickerProps {
  /** A palette of hex colours the caller supplies. */
  colors?: string[];
  /** Controlled value. Omit and the picker keeps its own. */
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  /** The swatch size. */
  size?: "sm" | "md" | "lg";
  /** Rows in the palette grid. Defaults to a single row. */
  columns?: number;
  /** Whether a custom row (hue + picker) appears below the palette. */
  allowCustom?: boolean;
  disabled?: boolean;
  /** The accessible name. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A colour picker built from Glacia's own parts — no native widget.
 *
 * The palette is a grid of swatches from the caller's colours; the custom row
 * is a hue track drawn as an SVG gradient (the resolver's shapes, so it works
 * wherever the charts work) driven by the same Slider mechanics as the rest of
 * the library: a drag along the track picks a hue, and a second track saturates
 * it. The value is a hex string.
 *
 * The default palette is a small set of iOS-conventional colours, in case a
 * caller wants a picker with no colour knowledge of its own.
 */
export const DEFAULT_PALETTE = tokenPalette.default;

/** Parses a hex colour into its red, green and blue channels. */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!match) return null;
  const raw = match[1]!;
  return {
    r: parseInt(raw.slice(0, 2), 16),
    g: parseInt(raw.slice(2, 4), 16),
    b: parseInt(raw.slice(4, 6), 16),
  };
}

/** Builds a hue gradient's colours, sweeping red → orange → … → red. */
export function hueGradientColors(): string[] {
  const stops = 12;
  return Array.from({ length: stops }, (_u, i) => {
    const angle = (i / stops) * 360;
    const c = hslToRgb(angle, 1, 0.5);
    return `#${c.r.toString(16).padStart(2, "0")}${c.g.toString(16).padStart(2, "0")}${c.b.toString(16).padStart(2, "0")}`;
  });
}

/** Converts an HSL triple (h 0–360, s/l 0–1) to an RGB hex string. */
function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; } else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; } else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/** Converts an RGB triple to a hex string. */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${clamp(r).toString(16).padStart(2, "0")}${clamp(g).toString(16).padStart(2, "0")}${clamp(b).toString(16).padStart(2, "0")}`;
}

export const ColorPicker = forwardRef<any, ColorPickerProps>(function ColorPicker(
  {
    colors: palette,
    value,
    defaultValue,
    onChange,
    size = "md",
    columns = 6,
    allowCustom = true,
    disabled = false,
    accessibilityLabel = "Color",
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText, PanResponder, Svg, Rect, Defs, LinearGradient, Stop } = primitives();

  const swatches = palette && palette.length > 0 ? palette : DEFAULT_PALETTE;

  const [internalValue, setInternalValue] = useState(defaultValue ?? swatches[0] ?? tokenPalette.fallback);
  const activeColor = value !== undefined ? value : internalValue;

  const setColor = (next: string) => {
    if (disabled) return;
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  };

  // The custom row's two tracks: hue on the top, saturation on the bottom.
  // Both are driven by PanResponder like the library's Slider — a press or a
  // drag along a track reports the colour at that position.
  const trackRef = useRef(0);
  const swatchSize = controlSizes.swatch[size];

  const hueColor = (h: number) => {
    const c = hslToRgb(h, 1, 0.5);
    return rgbToHex(c.r, c.g, c.b);
  };

  const colorAtFraction = (fraction: number, hue: number) => {
    const sat = Math.max(0, Math.min(1, fraction));
    const c = hslToRgb(hue, sat, 0.5);
    return rgbToHex(c.r, c.g, c.b);
  };

  const hue = hexToRgb(activeColor) ? hueOf(activeColor) : 0;

  const hueResponder = makeTrackResponder((fraction) => {
    setColor(hueColor(fraction * 360));
  }, PanResponder, trackRef);

  const satResponder = makeTrackResponder((fraction) => {
    setColor(colorAtFraction(fraction, hue));
  }, PanResponder, trackRef);

  const hueGradient = hueGradientColors();

  return (
    <View
      ref={ref}
      testID={testID}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: activeColor }}
      style={{ gap: 12, opacity: disabled ? 0.38 : 1, ...(style as ViewStyle) }}
      {...props}
    >
      {/* The palette grid. */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {swatches.map((swatch, index) => {
          const selected = swatch.toLowerCase() === activeColor.toLowerCase();
          return (
            <Pressable
              key={`${swatch}-${index}`}
              accessibilityRole="button"
              accessibilityLabel={`${swatch} color`}
              accessibilityState={{ selected }}
              disabled={disabled}
              onPress={() => setColor(swatch)}
              style={{
                width: swatchSize,
                height: swatchSize,
                borderRadius: swatchSize / 2,
                backgroundColor: swatch,
                borderWidth: selected ? 2 : 0.5,
                borderColor: selected ? theme.fill : theme.separator,
              }}
            />
          );
        })}
      </View>

      {allowCustom ? (
        <View style={{ gap: 8 }}>
          {/* Hue track */}
          <View
            style={{ height: controlSizes.picker.track, borderRadius: radii.md, overflow: "hidden" }}
            {...(hueResponder ? hueResponder.panHandlers : {})}
          >
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="hueGradient" x1="0" y1="0" x2="1" y2="0">
                  {hueGradient.map((color, i) => (
                    <Stop key={i} offset={i / (hueGradient.length - 1)} stopColor={color} />
                  ))}
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#hueGradient)" />
            </Svg>
          </View>
          {/* Saturation track: the hue at full saturation fading to white. */}
          <View
            style={{ height: controlSizes.picker.track, borderRadius: radii.md, overflow: "hidden" }}
            {...(satResponder ? satResponder.panHandlers : {})}
          >
            <Svg width="100%" height="100%">
              <Defs>
                <LinearGradient id="satGradient" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor={theme.neutralTop} />
                  <Stop offset="1" stopColor={hueColor(hue)} />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#satGradient)" />
            </Svg>
          </View>
          <RNText style={{ fontSize: 12, color: theme.muted }}>{activeColor}</RNText>
        </View>
      ) : null}
    </View>
  );
});

/** The hue (0–360) of a hex colour. */
function hueOf(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  const { r, g, b } = rgb;
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const delta = max - min;
  if (delta === 0) return 0;
  let h = 0;
  if (max === r / 255) h = ((g / 255 - b / 255) / delta) % 6;
  else if (max === g / 255) h = (b / 255 - r / 255) / delta + 2;
  else h = (r / 255 - g / 255) / delta + 4;
  const degrees = h * 60;
  return degrees < 0 ? degrees + 360 : degrees;
}

/** Builds a PanResponder that reports the fraction (0–1) across a track. */
function makeTrackResponder(
  onFraction: (fraction: number) => void,
  PanResponder: any,
  trackRef: { current: number },
): any {
  if (!PanResponder?.create) return null;
  return PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event: any) => {
      const fraction = fractionAt(event, 100);
      if (fraction !== null) onFraction(fraction);
    },
    onPanResponderMove: (event: any) => {
      const fraction = fractionAt(event, 100);
      if (fraction !== null) onFraction(fraction);
    },
    onPanResponderTerminationRequest: () => false,
  });
}

/** The fraction of the track under a touch, from the touch's X. */
function fractionAt(event: any, fallbackWidth: number): number | null {
  const x = event?.nativeEvent?.locationX;
  const width = event?.nativeEvent?.layoutMeasurement?.width ?? fallbackWidth;
  if (typeof x !== "number" || typeof width !== "number" || width <= 0) return null;
  return Math.max(0, Math.min(1, x / width));
}

// ---------------------------------------------------------------------------
// Combobox

export interface ComboboxOption {
  label: string;
  value: string;
  /** Extra text under the label, if any. */
  description?: string;
}

export interface ComboboxProps {
  /** The options the user can choose from. */
  options: ComboboxOption[];
  /** Controlled value. Omit and the combobox keeps its own. */
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** A description of the underlying field. */
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  /** Called when the dropdown's empty result shows. */
  onEmpty?: () => void;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A type-to-search select.
 *
 * The Input patterns (real TextInput, themed placeholder, `value`/`defaultValue`)
 * open a Menu-style glass dropdown whose list filters as the user types — every
 * keystroke re-filters the options, so the visible set genuinely shrinks, never
 * a list that stays put and pretends to search.
 *
 * The filter is a case-insensitive substring match on label and description. An
 * empty result shows an explicit empty row, so the user sees a search that found
 * nothing rather than a list that silently went blank. The dropdown stays open
 * until an option is picked or the field loses focus.
 */
export const Combobox = forwardRef<any, ComboboxProps>(function Combobox(
  {
    options,
    value,
    defaultValue,
    onChange,
    label,
    placeholder = "Search…",
    disabled = false,
    onEmpty,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, TextInput, Text: RNText, Pressable } = primitives();

  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const [query, setQuery] = useState("");

  const selected = value !== undefined ? value : internalValue;
  const selectedLabel = (options ?? []).find((option) => option.value === selected)?.label ?? "";

  const setValue = (next: string) => {
    if (disabled) return;
    if (value === undefined) setInternalValue(next);
    onChange?.(next);
  };

  // Filter as the user types.
  // An option list that has not loaded yet is empty, not a crash: a combobox
  // is frequently rendered before its options arrive.
  const available = options ?? [];
  const needle = query.trim().toLowerCase();
  const matches = needle.length === 0
    ? available
    : available.filter((option) =>
        option.label.toLowerCase().includes(needle) ||
        (option.description ?? "").toLowerCase().includes(needle),
      );

  return (
    <View ref={ref} testID={testID} style={{ ...(style as ViewStyle) }}>
      <Glass
        surface="field"
        isDark={isDark}
        style={{
          minHeight: 34,
          paddingHorizontal: 14,
          justifyContent: "center",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <TextInput
          value={query}
          onChangeText={(text: string) => setQuery(text)}
          placeholder={placeholder}
          accessibilityLabel={label ?? placeholder}
          accessibilityState={{ disabled }}
          editable={!disabled}
          style={{
            paddingVertical: 8,
            fontSize: 15,
            color: theme.foreground,
          }}
        />
      </Glass>
      {/* The dropdown: opens once there is something to match. */}
      {query.length > 0 ? (
        <Glass
          surface="overlay"
          isDark={isDark}
          style={{
            marginTop: 6,
            borderRadius: radii.md,
            // The web dropdown floats on its own shadow rather than sitting
            // flush on the page.
            shadowOpacity: 0.4,
            shadowRadius: 32,
            shadowOffset: { width: 0, height: 12 },
          }}
        >
          {matches.length === 0 ? (
            <View style={{ paddingHorizontal: 12, paddingVertical: 10 }}>
              <RNText style={{ fontSize: 14, color: theme.muted }}>No matches</RNText>
            </View>
          ) : (
            matches.map((option, index) => {
              const isSelected = option.value === selected;
              return (
                <Pressable
                  key={`${option.value}-${index}`}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => {
                    setValue(option.value);
                    setQuery("");
                  }}
                  style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "transparent" }}
                >
                  {isSelected ? (
                    <SelectedLens radius={8} isDark={isDark} style={lensFill} />
                  ) : null}
                  <View style={{ flex: 1 }}>
                    <RNText style={{ fontSize: 15, color: theme.foreground }}>{option.label}</RNText>
                    {option.description ? (
                      <RNText style={{ fontSize: 12, color: theme.muted }} numberOfLines={1}>{option.description}</RNText>
                    ) : null}
                  </View>
                </Pressable>
              );
            })
          )}
        </Glass>
      ) : null}
    </View>
  );
});
