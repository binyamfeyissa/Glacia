import { forwardRef, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors } from "./internal/tokens";
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

const TRACK_WIDTH = 51;
const TRACK_HEIGHT = 31;
const THUMB = 27;
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
    backgroundColor: "#FFFFFF",
    // A hairline edge instead of a drop shadow: RN shadows need per-platform
    // props, and the edge reads correctly on a translucent track.
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.12)",
    transform: [{ translateX: animated ? offset : isChecked ? TRAVEL : 0 }],
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
      style={{ alignSelf: "flex-start" }}
      {...props}
    >
      <Glass effect="regular" isDark={isDark} style={trackStyle}>
        {animated ? <Animated.View style={thumbStyle} /> : <View style={thumbStyle} />}
      </Glass>
    </Pressable>
  );
});
