import { forwardRef, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { hapticSelection } from "./internal/haptics";
import { useIsDark } from "./internal/motion";

export interface SwitchProps {
  /** Controlled on/off value. Omit it and the switch keeps its own. */
  value?: boolean;
  defaultValue?: boolean;
  /** Fires with the next value. The engine's controlled contract. */
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  /** Track colour while on. A parseable colour string. Defaults to the scheme's system blue. */
  accentColor?: string;
  /** Track colour while off. */
  trackColor?: string;
  accessibilityLabel?: string;
  /** One selection tick when it toggles. `false` opts out. */
  haptics?: boolean;
  isDark?: boolean;
  /** Passed to the control so it is testable. */
  testID?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * An on/off switch — ported from the engine's `LiquidGlassSwitch`, the design
 * Binyam approved on real devices this week (64x28 track, 40x24 lens thumb).
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved geometry and interaction. Without one — Expo Go, below every tier, or
 * Reduce Transparency — the fallback floor renders the same geometry with a solid
 * track and lens thumb, so the control is never invisible.
 */
export const Switch = forwardRef<any, SwitchProps>(function Switch(
  {
    value: valueProp,
    defaultValue = false,
    onValueChange,
    disabled = false,
    accentColor,
    trackColor,
    accessibilityLabel,
    haptics = true,
    isDark: isDarkProp,
    testID,
    style,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { View, Pressable } = primitives();
  const capabilities = glassCapabilities();
  const EngineSwitch = loadEngineControl("Switch");

  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp ?? internalValue;

  const toggle = () => {
    if (disabled) return;
    const next = !value;
    if (haptics) hapticSelection();
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  if (EngineSwitch && capabilities.supported) {
    const EngineSwitchComponent = EngineSwitch;
    return (
      <EngineSwitchComponent
        value={value}
        onValueChange={disabled ? undefined : toggle}
        disabled={disabled}
        accentColor={accentColor}
        trackColor={trackColor}
        style={style}
      />
    );
  }

  // Fallback floor: solid track + lens thumb, full geometry, full states.
  const trackHeight = 28;
  const thumbHeight = 24;
  const thumbInset = 2;
  const travel = 64 - 40 - thumbInset * 2;
  return (
    <Pressable
      ref={ref}
      testID={testID}
      accessibilityRole="switch"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={disabled ? undefined : toggle}
      style={{ alignSelf: "flex-start" }}
      {...props}
    >
      <View
        style={{
          width: 64,
          height: trackHeight,
          borderRadius: trackHeight / 2,
          backgroundColor: value ? accentColor ?? themeColors.fill : themeColors.fieldWash,
          overflow: "hidden",
          opacity: disabled ? 0.38 : 1,
        }}
      >
        <View
          style={{
            position: "absolute",
            left: thumbInset,
            top: (trackHeight - thumbHeight) / 2,
            width: 40,
            height: thumbHeight,
            borderRadius: thumbHeight / 2,
            backgroundColor: themeColors.onTint,
            transform: [{ translateX: value ? travel : 0 }],
          }}
        />
      </View>
    </Pressable>
  );
});
