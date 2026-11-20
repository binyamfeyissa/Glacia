import { forwardRef, useEffect } from "react";
import type { ReactNode } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface ToastProps {
  /** Shown while `true`; springs out when it turns `false`. */
  visible: boolean;
  /** The text. */
  message: string;
  /** Rendered before the message; a function receives the label colour and a glyph size. */
  icon?: ReactNode;
  /**
   * Called when the toast wants to go — after `duration`, or on a tap. The app
   * flips `visible`; the toast never hides itself.
   */
  onDismiss?: () => void;
  /** Auto-dismiss after this many ms of being visible. `0` keeps it up. Defaults to 2600. */
  duration?: number;
  /** Which screen edge it slides in from. Defaults to `"top"`. */
  edge?: "top" | "bottom";
  /** Distance from that edge, dp. Defaults to 60. */
  offset?: number;
  /** Surface wash. */
  tint?: string;
  variant?: "regular" | "clear";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isDark?: boolean;
  /** Passed to the toast so it is testable. */
  testID?: string;
}

/**
 * A transient message on a glass pill — ported from the engine's
 * `LiquidGlassToast`, the design Binyam approved on real devices this week (44dp
 * capsule, 60dp from the screen edge, auto-dismiss after 2.6s).
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved material and motion. Without one — Expo Go, below every tier, or
 * Reduce Transparency — the fallback floor renders the same pill with the
 * fallback material, so the toast is never invisible.
 */
export const Toast = forwardRef<any, ToastProps>(function Toast(
  {
    visible,
    message,
    icon,
    onDismiss,
    duration = 2600,
    edge = "top",
    offset = 60,
    tint,
    variant = "regular",
    style,
    textStyle,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable } = primitives();
  const capabilities = glassCapabilities();
  const EngineToast = loadEngineControl("Toast");

  // Auto-dismiss: the toast never hides itself, the timer only fires its
  // `onDismiss` so the app owns the visible state.
  useEffect(() => {
    if (!visible) return;
    if (!onDismiss || duration <= 0) return;
    const id = setTimeout(() => onDismiss(), duration);
    return () => clearTimeout(id);
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  if (EngineToast && capabilities.supported) {
    const EngineToastComponent = EngineToast;
    return (
      <EngineToastComponent
        visible={visible}
        message={message}
        icon={icon}
        onDismiss={onDismiss}
        duration={duration}
        edge={edge}
        offset={offset}
        tint={tint}
        variant={variant}
        style={style}
        textStyle={textStyle}
      />
    );
  }

  // Fallback floor: solid pill, same geometry, dismissible by tap.
  const pillStyle: ViewStyle = {
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    ...(edge === "bottom" ? { bottom: offset } : { top: offset }),
    ...(style as ViewStyle),
  };
  return (
    <View pointerEvents="box-none" style={[pillStyle]} testID={testID} {...(props as any)}>
      <Pressable
        testID={testID ? `${testID}-pill` : undefined}
        accessibilityRole="button"
        accessibilityLabel={`Dismiss toast: ${message}`}
        onPress={onDismiss}
        style={pillStyle}
      >
        <Glass effect={variant} surface="control" tintColor={tint} isDark={isDark} style={pillStyle}>
          {icon}
          <RNText style={[textStyle, { fontSize: 14, fontWeight: "500" }]}>{message}</RNText>
        </Glass>
      </Pressable>
    </View>
  );
});
