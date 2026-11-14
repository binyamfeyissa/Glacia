import { forwardRef, useState, type ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

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
}

const heights = { sm: 34, md: 42, lg: 50 };
const fontSizes = { sm: 14, md: 15, lg: 16 };

/**
 * A single-line or multiline text field.
 *
 * The native TextInput has no placeholder styling prop, so the placeholder is
 * drawn as a sibling Text: that keeps its colour tied to the theme instead of
 * the OS default, which changes between iOS versions.
 *
 * The field works controlled (`value` + `onChangeText`) or uncontrolled (no
 * `value` prop). In uncontrolled use it tracks its own text so the themed
 * placeholder disappears as soon as the user types; without that state the
 * overlay would sit on top of the typed text until the parent re-rendered.
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
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, TextInput } = primitives();

  // Uncontrolled support: with no `value` prop the field owns its text.
  const [internalText, setInternalText] = useState(defaultValue ?? "");
  const text = value !== undefined ? value : internalText;
  const handleChangeText = (next: string) => {
    if (value === undefined) setInternalText(next);
    onChangeText?.(next);
  };

  const isEditable = editable !== undefined ? editable : !disabled;
  const showPlaceholder = !text && Boolean(placeholder);

  const fieldStyle: TextStyle = {
    flex: 1,
    paddingVertical: height_padding(size),
    paddingHorizontal: 0,
    fontSize: fontSizes[size],
    color: theme.foreground,
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: multiline ? "flex-start" : "center",
        gap: 8,
        minHeight: multiline ? undefined : heights[size],
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: invalid ? theme.destructive : theme.edge,
        backgroundColor: theme.glass,
        paddingHorizontal: 12,
        opacity: disabled ? 0.5 : 1,
        ...(style as ViewStyle),
      }}
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

      {suffix}
    </View>
  );
});

/** Vertical padding tuned per size so the text sits optically centred. */
function height_padding(size: "sm" | "md" | "lg") {
  return size === "sm" ? 6 : size === "lg" ? 12 : 9;
}

export interface TextareaProps extends Omit<InputProps, "size" | "multiline" | "minLines"> {
  /** Visible height in text lines. */
  rows?: number;
}

/**
 * A multi-line field.
 *
 * Separate from Input so `multiline` cannot silently turn off the single-line
 * sizing, and so callers get a `rows` prop instead of guessing a pixel height.
 */
export const Textarea = forwardRef<any, TextareaProps>(function Textarea(
  { rows = 4, ...props },
  ref,
) {
  return <Input ref={ref} {...props} multiline minLines={rows} />;
});
