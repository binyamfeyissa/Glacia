import { forwardRef, useMemo, useRef, useState } from "react";
import { measurePreviewWidth } from "./internal/primitives";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  /** One selection tick each time the stepped value changes while dragging. */
  haptics?: boolean;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  /** Passed through to the draggable track so it is testable. */
  testID?: string;
}

const TRACK_HEIGHT = 8;
const THUMB = 22;
const CONTAINER_HEIGHT = 40;

/** Rounds `value` onto the nearest step from `min`, clamped to the range. */
function quantize(value: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(value)) return min;
  const clamped = Math.min(max, Math.max(min, value));
  if (!(step > 0)) return clamped;
  const stepped = min + Math.round((clamped - min) / step) * step;
  // Round away binary float noise introduced by the division above.
  const decimals = (String(step).split(".")[1] ?? "").length;
  return Number(Math.min(max, Math.max(min, stepped)).toFixed(decimals));
}

/**
 * A continuous value chosen by dragging.
 *
 * The interaction is Glacia's own: the track and thumb are Views and dragging
 * is a PanResponder reading the touch position against the track's measured
 * width. React Native has no DOM `<input type="range">` and the platform
 * sliders are not used, so the control looks and behaves the same on every
 * platform; only the glass material changes.
 */
export const Slider = forwardRef<any, SliderProps>(function Slider(
  {
    value: valueProp,
    defaultValue = 50,
    min = 0,
    max = 100,
    step = 1,
    onValueChange,
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

  const [internalValue, setInternalValue] = useState(() => quantize(defaultValue, min, max, step));
  const value = valueProp !== undefined ? quantize(valueProp, min, max, step) : internalValue;

  // Two actions can arrive before React re-renders (increment then decrement,
  // or two drag moves in one frame). The ref holds the newest value so the
  // second one starts from it instead of a stale closure.
  const valueRef = useRef(value);
  valueRef.current = value;

  // Track width as measured on layout. A drag before layout is a no-op rather
  // than a jump: without a width there is no honest mapping from x to value.
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
      onPanResponderTerminationRequest: () => false,
    });
    // `report` reads the value from a ref, so the responder does not need to be
    // rebuilt on every value change and never acts on a stale render.
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
    top: (CONTAINER_HEIGHT - THUMB) / 2,
    left: `${Math.min(100, Math.max(0, percentage))}%`,
    width: THUMB,
    height: THUMB,
    marginLeft: -THUMB / 2,
    borderRadius: THUMB / 2,
    backgroundColor: "#FFFFFF",
    borderWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.12)",
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(event: any) => {
        if (event?.nativeEvent?.actionName === "increment") nudge(1);
        if (event?.nativeEvent?.actionName === "decrement") nudge(-1);
      }}
      disabled={disabled}
      onLayout={(event: any) => {
        const width = event?.nativeEvent?.layout?.width;
        if (typeof width === "number" && width > 0) widthRef.current = width;
      }}
      // The DOM preview has no layout events, so measure on mount there too;
      // on a device this resolves to nothing and onLayout is the source.
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
        <View style={fillStyle} />
      </Glass>
      <View style={thumbStyle} pointerEvents="none" />
    </Pressable>
  );
});
