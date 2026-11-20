import { forwardRef, useState, type ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface InputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  /** Renders the field in an error state. Pair with a Field message. */
  invalid?: boolean;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "url";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  multiline?: boolean;
  /** Grows with its content when `multiline` is set. */
  minLines?: number;
  size?: "sm" | "md" | "lg";
  accessibilityLabel?: string;
  returnKeyType?: "done" | "next" | "go" | "search" | "send";
  onSubmitEditing?: () => void;
  /** Starting text for uncontrolled use, like React Native's `defaultValue`. */
  defaultValue?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Passed through to the text field so it is testable. */
  testID?: string;
  // Standard TextInput props a caller may still want to pass through.
  maxLength?: number;
  editable?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  // Engine-port additions (LiquidGlassTextInput): the capsule height and the
  // glass-frame controls. `height` wins when set; the size-based ergonomics above
  // remain for callers that use them.
  height?: number;
  tint?: string;
  variant?: "regular" | "clear";
  interactive?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  focusRing?: boolean;
  accentColor?: string;
}

const heights = { sm: 28, md: 34, lg: 44 };
const fontSizes = { sm: 14, md: 15, lg: 16 };

/**
 * A single-line or multiline text field — ported from the engine's
 * `LiquidGlassTextInput`, the design Binyam approved on real devices this week
 * (48dp capsule, focus ring that springs in, leading/trailing slots).
 *
 * The native TextInput has no placeholder styling prop, so the placeholder is
 * drawn as a sibling Text: that keeps its colour tied to the theme instead of the
 * OS default, which changes between iOS versions.
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved material and focus behaviour. Without one — Expo Go, below every tier,
 * or Reduce Transparency — the fallback floor renders the same capsule with the
 * fallback material, so the field is never invisible and never bare text.
 */
export const Input = forwardRef<any, InputProps>(function Input(
  {
    value,
    onChangeText,
    placeholder,
    invalid = false,
    disabled = false,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize,
    autoCorrect,
    multiline = false,
    minLines = 3,
    size = "md",
    accessibilityLabel,
    returnKeyType,
    onSubmitEditing,
    defaultValue,
    prefix,
    suffix,
    isDark: isDarkProp,
    style,
    testID,
    maxLength,
    editable,
    onFocus,
    onBlur,
    height,
    tint,
    variant = "regular",
    interactive = true,
    leading,
    trailing,
    focusRing = true,
    accentColor,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, TextInput } = primitives();
  const capabilities = glassCapabilities();
  const EngineInput = loadEngineControl("Input");

  // Uncontrolled support: with no `value` prop the field owns its text.
  const [internalText, setInternalText] = useState(defaultValue ?? "");
  const text = value !== undefined ? value : internalText;
  const handleChangeText = (next: string) => {
    if (value === undefined) setInternalText(next);
    onChangeText?.(next);
  };

  const isEditable = editable !== undefined ? editable : !disabled;
  const showPlaceholder = !text && Boolean(placeholder);

  const resolvedHeight = height ?? heights[size];

  const fieldStyle: TextStyle = {
    flex: 1,
    paddingVertical: multiline ? 0 : height_padding(size),
    paddingHorizontal: 0,
    fontSize: fontSizes[size],
    color: theme.foreground,
  };

  // ------------------------------------------------------------------
  // Fallback floor: the same capsule with the fallback material underneath.
  // ------------------------------------------------------------------
  if (!(EngineInput && capabilities.supported)) {
    const { View, Text, TextInput } = primitives();
    return (
      <Glass
        effect={variant}
        surface="field"
        isDark={isDark}
        style={{
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
          gap: 8,
          borderRadius: multiline ? radii.xl : radii.pill,
          minHeight: multiline ? 84 : resolvedHeight,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 10 : 0,
          borderColor: invalid ? theme.destructive : undefined,
          opacity: disabled ? 0.5 : 1,
          ...(style as ViewStyle),
        }}
        testID={testID}
      >
        {prefix}
        <View style={{ flex: 1, justifyContent: "center" }}>
          {showPlaceholder && (
            <Text
              style={{
                position: "absolute",
                left: 0,
                top: multiline ? 0 : undefined,
                fontSize: fontSizes[size],
                color: theme.muted,
              }}
              pointerEvents="none"
              numberOfLines={1}
            >
              {placeholder}
            </Text>
          )}
          <TextInput
            ref={ref}
            testID={testID}
            value={text}
            onChangeText={handleChangeText}
            editable={isEditable}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            multiline={multiline}
            numberOfLines={multiline ? minLines : undefined}
            maxLength={maxLength}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            onFocus={onFocus}
            onBlur={onBlur}
            accessibilityLabel={accessibilityLabel ?? placeholder}
            accessibilityState={{ disabled: !isEditable }}
            style={fieldStyle}
          />
        </View>
        {trailing}
      </Glass>
    );
  }

  const EngineInputComponent = EngineInput;
  const capsuleHeight = resolvedHeight;
  return (
    <EngineInputComponent
      value={value}
      defaultValue={defaultValue}
      onChangeText={handleChangeText}
      placeholder={placeholder}
      invalid={invalid}
      disabled={disabled}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize={autoCapitalize}
      autoCorrect={autoCorrect}
      multiline={multiline}
      minLines={minLines}
      size={size}
      accessibilityLabel={accessibilityLabel}
      returnKeyType={returnKeyType}
      onSubmitEditing={onSubmitEditing}
      onFocus={onFocus}
      onBlur={onBlur}
      maxLength={maxLength}
      editable={isEditable}
      height={capsuleHeight}
      tint={tint}
      variant={variant}
      interactive={interactive}
      leading={leading}
      trailing={trailing}
      focusRing={focusRing}
      accentColor={accentColor}
      style={style}
      contentStyle={undefined}
      inputStyle={fieldStyle}
      testID={testID}
    />
  );
});

/** Vertical padding tuned per size so the text sits optically centred. */
function height_padding(size: "sm" | "md" | "lg") {
  return size === "sm" ? 4 : size === "lg" ? 10 : 7;
}
