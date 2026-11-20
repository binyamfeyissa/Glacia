// Wave 2 — Skeleton.
//
// The donor's placeholder is decorative: it hides its content from screen
// readers and announces a busy state on the container instead. The shimmer is
// the family's motion and disappears under Reduce Motion.

import { useEffect, useRef } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { useReducedMotion } from "./internal/a11y";

export interface SkeletonProps {
  shape?: "rect" | "circle" | "line";
  width?: number | string;
  height?: number;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Skeleton({
  shape = "rect",
  width,
  height,
  isDark: isDarkProp,
  style,
  testID,
}: SkeletonProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const reducedMotion = useReducedMotion();
  const { View, Animated, isNative } = primitives();

  const pulse = useRef<any>(null);
  const animate = Boolean(isNative && Animated?.Value && Animated?.timing) && !reducedMotion;
  if (pulse.current === null) pulse.current = animate ? new Animated.Value(0.55) : { value: 1 };

  useEffect(() => {
    if (!animate) {
      pulse.current.value = 1;
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse.current, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse.current, { toValue: 0.55, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop?.();
  }, [animate]);

  const resolvedHeight = height ?? (shape === "line" ? 12 : 20);

  const size = shape === "circle" ? resolvedHeight : undefined;
  return (
    <Animated.View
      testID={testID}
      accessibilityRole="none"
      importantForAccessibility="no"
      accessibilityElementsHidden
      style={[
        {
          width: size ?? (width as any) ?? "100%",
          height: resolvedHeight,
          backgroundColor: theme.skeleton,
          borderRadius: shape === "circle" ? resolvedHeight / 2 : radii.sm,
          opacity: pulse.current,
        },
        style,
      ]}
    />
  );
}
