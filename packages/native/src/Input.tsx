import { forwardRef, useState, type ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

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
}

const heights = { sm: 28, md: 34, lg: 44 };
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
    paddingVertical: multiline ? 0 : height_padding(size),
    paddingHorizontal: 0,
    fontSize: fontSizes[size],
    color: theme.foreground,
  };

  return (
    <Glass
      surface="field"
      isDark={isDark}
      style={{
        flexDirection: "row",
        alignItems: multiline ? "flex-start" : "center",
        gap: 8,
        // Fields are pills on the web; a multi-line field relaxes to the
        // stack radius (18) because a pill around wrapped text reads wrong.
        borderRadius: multiline ? 18 : radii.pill,
        minHeight: multiline ? 84 : heights[size],
        paddingHorizontal: 14,
        paddingVertical: multiline ? 10 : 0,
        borderColor: invalid ? theme.destructive : undefined,
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
    </Glass>
  );
});

/** Vertical padding tuned per size so the text sits optically centred. */
function height_padding(size: "sm" | "md" | "lg") {
  return size === "sm" ? 4 : size === "lg" ? 10 : 7;
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
