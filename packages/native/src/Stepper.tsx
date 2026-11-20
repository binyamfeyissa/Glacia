import { forwardRef, useEffect, useRef, useState } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors, radii, springs } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { useReducedMotion } from "./internal/a11y";
import { hapticSelection } from "./internal/haptics";

// The engine's stepper geometry, kept exactly: a 40dp capsule whose `−`/`+`
// ends are 44dp cells around a 44dp-minimum readout, with the thumb inset by
// the segmented control's 3dp.
const STEPPER_HEIGHT = 40;
const STEPPER_CELL_WIDTH = 44;
const STEPPER_VALUE_MIN_WIDTH = 44;
const STEPPER_INSET = 3;
const STEPPER_REPEAT_DELAY_MS = 400;
const STEPPER_REPEAT_INTERVAL_MS = 110;
const STEPPER_VALUE_POP_SCALE = 1.18;

export interface StepperProps {
  /** Controlled value. Omit it and the stepper keeps its own. */
  value?: number;
  defaultValue?: number;
  /** Fires with the next value whenever one of the ends steps it. */
  onValueChange?: (value: number) => void;
  /** Inclusive lower bound. Defaults to 0. `minimumValue` is the engine's spelling. */
  min?: number;
  /** Inclusive upper bound. Defaults to 100. `maximumValue` is the engine's spelling. */
  max?: number;
  minimumValue?: number;
  maximumValue?: number;
  /** Increment per press. Defaults to 1. */
  step?: number;
  /** Hold an end and it keeps stepping, the way the system's does. Defaults to true. */
  autoRepeat?: boolean;
  /** One selection tick each time the value changes. `false` opts out. */
  haptics?: boolean;
  disabled?: boolean;
  /** Capsule height, dp. Defaults to the engine's 40. */
  height?: number;
  /** Formats the middle readout; defaults to the plain number. */
  formatValue?: (value: number) => string;
  /** Announced by screen readers, e.g. "Guests". */
  accessibilityLabel: string;
  /** The track's wash. Defaults to the scheme's glass tint. */
  tint?: string;
  /** The pressed thumb's wash. Defaults to the scheme's glass-active tint. */
  thumbTint?: string;
  /** Pairs the surface with its Android backdrop provider. */
  providerId?: string;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

/**
 * Minus / value / plus — ported from the engine's `LiquidGlassStepper`, the
 * design Binyam approved on real devices this week (40dp capsule, 44dp cells,
 * press thumb blooming over the held end, the value popping as it changes, and
 * hold-to-repeat).
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved geometry and behaviour. Without one — Expo Go, below every tier, or
 * Reduce Transparency — the fallback floor renders the same capsule, cells and
 * readout on Glacia's solid material, so the control is never invisible.
 */
export const Stepper = forwardRef<any, StepperProps>(function Stepper(
  {
    value: valueProp,
    defaultValue = 0,
    onValueChange,
    min,
    max,
    minimumValue,
    maximumValue,
    step = 1,
    autoRepeat = true,
    haptics = true,
    disabled = false,
    height = STEPPER_HEIGHT,
    formatValue,
    accessibilityLabel,
    tint,
    thumbTint,
    providerId,
    isDark: isDarkProp,
    style,
    textStyle,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const reducedMotion = useReducedMotion();
  const { Animated, View, Pressable, Text: RNText, isNative } = primitives();
  const capabilities = glassCapabilities();
  const EngineStepper = loadEngineControl("Stepper");

  const lower = min ?? minimumValue ?? 0;
  const upper = max ?? maximumValue ?? 100;

  const [internalValue, setInternalValue] = useState(() => clamp(defaultValue, lower, upper));
  const value = clamp(valueProp !== undefined ? valueProp : internalValue, lower, upper);

  // Two actions can arrive before a re-render (hold-to-repeat, or both ends in
  // one frame). The ref holds the newest value so the next step starts from it.
  const valueRef = useRef(value);
  valueRef.current = value;

  const [held, setHeld] = useState<-1 | 0 | 1>(0);
  const repeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => stopRepeat(), []);

  // The readout pops on each change, like the engine's: an immediate lift then
  // a spring home. Reduce Motion settles it straight at its resting scale.
  const pop = useRef<any>(null);
  const animate = Boolean(isNative && Animated?.Value && Animated?.spring) && !reducedMotion;
  if (pop.current === null) {
    pop.current = animate ? new Animated.Value(1) : { value: 1 };
  }
  const firstValue = useRef(true);
  useEffect(() => {
    if (firstValue.current) {
      firstValue.current = false;
      return;
    }
    if (!animate) return;
    pop.current.setValue(STEPPER_VALUE_POP_SCALE);
    const animation = Animated.spring(pop.current, {
      toValue: 1,
      ...springs.snappy,
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop?.();
  }, [animate, value]);

  const atMin = value <= lower;
  const atMax = value >= upper;

  const apply = (next: number) => {
    const clamped = clamp(next, lower, upper);
    if (clamped === valueRef.current) return;
    if (haptics) hapticSelection();
    valueRef.current = clamped;
    if (valueProp === undefined) setInternalValue(clamped);
    onValueChange?.(clamped);
  };

  function stopRepeat() {
    if (repeatTimer.current != null) {
      clearInterval(repeatTimer.current);
      repeatTimer.current = null;
    }
  }

  const stepBy = (direction: -1 | 1) => apply(valueRef.current + direction * step);

  const handlePressIn = (direction: -1 | 1) => {
    setHeld(direction);
  };
  const handlePressOut = () => {
    setHeld(0);
    stopRepeat();
  };
  const handleLongPress = (direction: -1 | 1) => {
    if (!autoRepeat) return;
    stepBy(direction);
    stopRepeat();
    repeatTimer.current = setInterval(() => stepBy(direction), STEPPER_REPEAT_INTERVAL_MS);
  };

  const label = formatValue ? formatValue(value) : String(value);

  const rootStyle: ViewStyle = {
    height,
    borderRadius: radii.pill,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "stretch",
    opacity: disabled ? 0.5 : 1,
    ...(style as ViewStyle),
  };

  const cellStyle: ViewStyle = {
    width: STEPPER_CELL_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  };


  // ------------------------------------------------------------------
  // Fallback floor: the same capsule, cells and readout, on Glacia's
  // solid-capable material.
  // ------------------------------------------------------------------
  if (!(EngineStepper && capabilities.supported)) {
    const thumbWidth = STEPPER_CELL_WIDTH - STEPPER_INSET;
    const thumb = held !== 0 ? (
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: STEPPER_INSET,
          left: held < 0 ? STEPPER_INSET : undefined,
          right: held > 0 ? STEPPER_INSET : undefined,
          width: thumbWidth,
          height: height - 2 * STEPPER_INSET,
          borderRadius: radii.pill,
          backgroundColor: thumbTint ?? theme.glassActive,
        }}
      />
    ) : null;

    const cell = (label: string, sign: "\u2212" | "+", direction: -1 | 1, blocked: boolean) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityState={{ disabled: disabled || blocked }}
        disabled={disabled || blocked}
        delayLongPress={STEPPER_REPEAT_DELAY_MS}
        onPressIn={() => handlePressIn(direction)}
        onPressOut={handlePressOut}
        onPress={() => stepBy(direction)}
        onLongPress={() => handleLongPress(direction)}
        style={cellStyle}
      >
        <RNText
          style={{
            fontSize: 20,
            fontWeight: "500",
            color: theme.foreground,
            opacity: disabled || blocked ? 0.35 : 1,
          }}
        >
          {sign}
        </RNText>
      </Pressable>
    );

    return (
      <Glass
        ref={ref}
        effect="regular"
        surface="control"
        tintColor={tint}
        isDark={isDark}
        testID={testID}
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        accessibilityValue={{ min: lower, max: upper, now: value, text: label }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(event: any) => {
          const action = event?.nativeEvent?.actionName;
          if (action === "increment") apply(valueRef.current + step);
          if (action === "decrement") apply(valueRef.current - step);
        }}
        style={rootStyle}
        {...props}
      >
        {cell(`Decrease ${accessibilityLabel}`, "\u2212", -1, atMin)}
        <View style={{ minWidth: STEPPER_VALUE_MIN_WIDTH, justifyContent: "center", alignItems: "center" }}>
          <Animated.View style={{ transform: [{ scale: pop.current }] }}>
            <RNText
              numberOfLines={1}
              style={[
                { fontSize: 16, fontWeight: "600", color: theme.foreground },
                textStyle,
              ]}
            >
              {label}
            </RNText>
          </Animated.View>
        </View>
        {cell(`Increase ${accessibilityLabel}`, "+", 1, atMax)}
        {thumb}
      </Glass>
    );
  }

  const EngineStepperComponent = EngineStepper;
  return (
    <EngineStepperComponent
      value={value}
      onValueChange={disabled ? undefined : (next: number) => apply(next)}
      minimumValue={lower}
      maximumValue={upper}
      step={step}
      disabled={disabled}
      autoRepeat={autoRepeat}
      formatValue={formatValue}
      height={height}
      tint={tint}
      thumbTint={thumbTint}
      providerId={providerId}
      style={style}
      textStyle={textStyle}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
});

/** Keeps a value inside the stepper's range. */
function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}
