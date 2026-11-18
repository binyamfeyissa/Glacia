import { forwardRef, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, material } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** One selection tick when it toggles. `false` opts out. */
  haptics?: boolean;
  disabled?: boolean;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  /** Passed through to the switch track so it is testable. */
  testID?: string;
}

// The web switch's geometry: a 60 x 25 track with a 21pt thumb, which the web
// draws at 160 x 67 and scales down by 0.375. The thumb is a lens, not a dot:
// it carries the same shadow stack as the slider's.
const TRACK_WIDTH = 60;
const TRACK_HEIGHT = 25;
const THUMB = 21;
const TRAVEL = TRACK_WIDTH - THUMB - 4;

/**
 * An on/off switch.
 *
 * The track is Glacia's glass; the thumb is one of our own Views, animated on
 * the springs token. The material changes by platform (Apple's glass on
 * iOS 26+, Glacia's tint elsewhere) but the control is always ours — React
 * Native's built-in Switch is never used.
 */
export const Switch = forwardRef<any, SwitchProps>(function Switch(
  {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    haptics = true,
    accessibilityLabel,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { View, Pressable, Animated } = primitives();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const [held, setHeld] = useState(false);
  const isChecked = checkedProp !== undefined ? checkedProp : internalChecked;

  // The thumb's travel is a single number animated on the springs token.
  const { value: offset, animated } = useSpring(isChecked ? TRAVEL : 0, "snappy");

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (haptics) hapticSelection();
    if (checkedProp === undefined) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  const trackStyle: ViewStyle = {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: isChecked ? themeColors.fill : "rgba(120, 120, 128, 0.16)",
    padding: 2,
    justifyContent: "center",
    opacity: disabled ? 0.38 : 1,
    ...(style as ViewStyle),
  };

  const thumbStyle: ViewStyle = {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: themeColors.onTint,
    borderWidth: 0.5,
    borderColor: themeColors.edge,
    // The lens's lift: a soft shadow under the thumb, and a slight growth
    // while it is held, matching the web thumb.
    shadowColor: material.shadowColor,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    transform: [
      { translateX: animated ? offset : isChecked ? TRAVEL : 0 },
      { scale: held ? 1.06 : 1 },
    ],
  };

  return (
    <Pressable
      ref={ref}
      testID={testID}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: isChecked, disabled }}
      disabled={disabled}
      onPress={toggle}
      onPressIn={() => setHeld(true)}
      onPressOut={() => setHeld(false)}
      style={{ alignSelf: "flex-start" }}
      {...props}
    >
      <Glass effect="regular" surface="control" isDark={isDark} style={trackStyle}>
        {animated ? <Animated.View style={thumbStyle} /> : <View style={thumbStyle} />}
      </Glass>
    </Pressable>
  );
});
