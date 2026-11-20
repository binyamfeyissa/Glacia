import { forwardRef, useMemo, useRef, useState } from "react";
import { measurePreviewWidth } from "./internal/primitives";
import type { StyleProp, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors, material } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";

export interface SliderProps {
  /** Controlled value. Omit it and the slider keeps its own. */
  value?: number;
  defaultValue?: number;
  /** Inclusive lower bound. Defaults to 0. */
  min?: number;
  /** Inclusive upper bound. Defaults to 100. */
  max?: number;
  /** Increment per step. Defaults to 1. */
  step?: number;
  /** Fires while dragging and once when the gesture ends (engine order). */
  onValueChange?: (value: number) => void;
  /** Fires once when the gesture ends, after the thumb has been released. */
  onSlidingComplete?: (value: number) => void;
  disabled?: boolean;
  /** One selection tick each time the stepped value changes while dragging. */
  haptics?: boolean;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  /** Passed to the draggable track so it is testable. */
  testID?: string;
}

// The web slider: a 6pt track and a glass-lens thumb rather than a small dot.
const TRACK_HEIGHT = 6;
const THUMB_WIDTH = 40;
const THUMB_HEIGHT = 24;
const CONTAINER_HEIGHT = 40;

/** Rounds `value` onto the nearest step from `min`, clamped to the range. */
function quantize(value: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(value)) return min;
  const clamped = Math.min(max, Math.max(min, value));
  if (!(step > 0)) return clamped;
  const stepped = min + Math.round((clamped - min) / step) * step;
  const decimals = (String(step).split(".")[1] ?? "").length;
  return Number(Math.min(max, Math.max(min, stepped)).toFixed(decimals));
}

/**
 * A continuous value chosen by dragging — ported from the engine's
 * `LiquidGlassSlider`, which keeps the approved drag behaviour while the
 * material changes by platform.
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved geometry and drag behaviour. Without one — Expo Go, below every tier,
 * or Reduce Transparency — the fallback floor renders the same track and lens
 * thumb with the fallback material, so the control is never invisible.
 */
export const Slider = forwardRef<any, SliderProps>(function Slider(
  {
    value: valueProp,
    defaultValue = 50,
    min = 0,
    max = 100,
    step = 1,
    onValueChange,
    onSlidingComplete,
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
  const { View, Pressable, PanResponder } = primitives();
  const capabilities = glassCapabilities();
  const EngineSlider = loadEngineControl("Slider");

  const [internalValue, setInternalValue] = useState(() => quantize(defaultValue, min, max, step));
  const value = valueProp !== undefined ? quantize(valueProp, min, max, step) : internalValue;

  // Two actions can arrive before React re-renders (increment then decrement,
  // or two drag moves in one frame). The ref holds the newest value so the
  // second one starts from it instead of a stale closure.
  const valueRef = useRef(value);
  valueRef.current = value;
  const widthRef = useRef(0);

  /** Converts an x position relative to the track into a stepped value. */
  const valueAtX = useMemo(
    () =>
      (x: number): number | null => {
        const width = widthRef.current;
        if (width <= 0 || max === min) return null;
        const ratio = Math.min(1, Math.max(0, x / width));
        return quantize(min + ratio * (max - min), min, max, step);
      },
    [max, min, step],
  );

  const report = (next: number) => {
    // Only a real step change ticks: a drag that stays inside one step is not
    // a selection, and reporting the same value twice must not buzz twice.
    if (next === valueRef.current) return;
    if (haptics) hapticSelection();
    valueRef.current = next;
    if (valueProp === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const panResponder = useMemo(() => {
    if (!PanResponder?.create) return null;
    return PanResponder.create({
      // Claim the gesture only for horizontal movement, so a Slider inside a
      // vertical scroll view does not swallow the scroll.
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: (_event: any, gesture: any) =>
        !disabled && Math.abs(gesture.dx) > Math.abs(gesture.dy),
      onPanResponderGrant: (event: any) => {
        const next = valueAtX(event.nativeEvent.locationX);
        if (next !== null) report(next);
      },
      onPanResponderMove: (event: any) => {
        const next = valueAtX(event.nativeEvent.locationX);
        if (next !== null) report(next);
      },
      onPanResponderRelease: (event: any) => {
        const next = valueAtX(event.nativeEvent.locationX);
        if (next !== null) {
          report(next);
          onSlidingComplete?.(next);
        }
      },
      onPanResponderTerminationRequest: () => false,
    });
  }, [disabled, valueAtX]);

  /** Steps the value for accessibility actions and hardware keys. */
  const nudge = (direction: 1 | -1) => {
    if (disabled) return;
    const from = valueRef.current;
    report(quantize(from + direction * Math.max(step, (max - min) / 20), min, max, step));
  };

  const percentage = max === min ? 0 : ((value - min) / (max - min)) * 100;

  const containerStyle: ViewStyle = {
    height: CONTAINER_HEIGHT,
    justifyContent: "center",
    opacity: disabled ? 0.38 : 1,
    ...(style as ViewStyle),
  };

  const trackStyle: ViewStyle = {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    backgroundColor: "rgba(120, 120, 128, 0.2)",
    overflow: "hidden",
    width: "100%",
  };

  const fillStyle: ViewStyle = {
    height: "100%",
    width: `${Math.min(100, Math.max(0, percentage))}%`,
    backgroundColor: themeColors.fill,
  };

  const thumbStyle: ViewStyle = {
    position: "absolute",
    top: (CONTAINER_HEIGHT - THUMB_HEIGHT) / 2,
    left: `${Math.min(100, Math.max(0, percentage))}%`,
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    marginLeft: -THUMB_WIDTH / 2,
    borderRadius: THUMB_HEIGHT / 2,
    backgroundColor: themeColors.onTint,
    borderWidth: 0.5,
    borderColor: themeColors.edge,
    shadowColor: material.shadowColor,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  };

  // ------------------------------------------------------------------
  // Fallback floor: the same track and lens thumb, on the fallback material.
  // ------------------------------------------------------------------
  if (!(EngineSlider && capabilities.supported)) {
    const track = (
      <View style={trackStyle}>
        <View style={fillStyle} />
      </View>
    );
    const thumb = <View style={thumbStyle} pointerEvents="none" />;
    return (
      <Pressable
        testID={testID}
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        accessibilityValue={{ min, max, now: value }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        disabled={disabled}
        onAccessibilityAction={(event: any) => {
          if (event?.nativeEvent?.actionName === "increment") nudge(1);
          if (event?.nativeEvent?.actionName === "decrement") nudge(-1);
        }}
        onLayout={(event: any) => {
          const width = event?.nativeEvent?.layout?.width;
          if (typeof width === "number" && width > 0) widthRef.current = width;
        }}
        ref={(node: any) => {
          measurePreviewWidth(node, widthRef);
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        style={containerStyle}
        {...(panResponder ? panResponder.panHandlers : {})}
        {...props}
      >
        <Glass effect="regular" isDark={isDark} style={trackStyle}>
          {track}
        </Glass>
        {thumb}
      </Pressable>
    );
  }

  const EngineSliderComponent = EngineSlider;
  return (
    <EngineSliderComponent
      value={value}
      onValueChange={disabled ? undefined : onValueChange ?? report}
      onSlidingComplete={disabled ? undefined : onSlidingComplete}
      minimumValue={min}
      maximumValue={max}
      step={step}
      disabled={disabled}
      accentColor={themeColors.fill}
      trackColor="rgba(120, 120, 128, 0.2)"
      style={style}
    />
  );
});
