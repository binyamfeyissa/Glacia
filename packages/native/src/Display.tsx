import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, controlSizes, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";

// ---------------------------------------------------------------------------
// Avatar

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps {
  size?: SpinnerSize;
  /** Spinner colour; defaults to the theme's muted foreground. */
  tint?: string;
  /** Announced to screen readers, since a spinner alone has no text. */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

const spinnerSizes: Record<SpinnerSize, number> = { sm: 16, md: 22, lg: 32 };

/**
 * A loading spinner, drawn by Glacia.
 *
 * An SVG arc that rotates on the gentle spring through Animated — not the
 * platform's ActivityIndicator, so it looks the same on every platform and
 * wears the theme's colour instead of inheriting the system tint.
 */
export const Spinner = forwardRef<any, SpinnerProps>(function Spinner(
  {
    size = "md",
    tint,
    accessibilityLabel = "Loading",
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Svg, Circle, Animated } = primitives();

  const dimension = spinnerSizes[size];
  const stroke = Math.max(2, Math.round(dimension / 9));
  const color = tint ?? theme.muted;
  // An arc, not a full ring: a complete circle rotating looks static.
  const circumference = 2 * Math.PI * ((dimension - stroke) / 2);
  const dash = circumference * 0.28;

  // A continuous spin never settles, so it is driven by Animated.timing on a
  // loop rather than the spring hook, which is built for one-off targets.
  const { Animated: AnimatedAPI, isNative } = primitives();
  const spinning = isNative && Boolean(AnimatedAPI?.timing);

  const rotation = useRef<any>(null);
  if (rotation.current === null) {
    rotation.current = spinning ? new AnimatedAPI.Value(0) : null;
  }

  useEffect(() => {
    if (!spinning || !rotation.current) return;
    rotation.current.setValue(0);
    const loop = AnimatedAPI.loop(
      AnimatedAPI.timing(rotation.current, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
    );
    loop.start?.();
    return () => loop.stop?.();
  }, [AnimatedAPI, spinning]);

  const spinStyle = spinning
    ? {
        transform: [
          {
            rotate: rotation.current.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "360deg"],
            }),
          },
        ],
      }
    : undefined;

  const svg = (
    <Svg width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
      <Circle
        cx={dimension / 2}
        cy={dimension / 2}
        r={(dimension - stroke) / 2}
        stroke={theme.skeleton}
        strokeWidth={stroke}
        fill="none"
      />
      <Circle
        cx={dimension / 2}
        cy={dimension / 2}
        r={(dimension - stroke) / 2}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference - dash}`}
      />
    </Svg>
  );

  return (
    <View
      ref={ref}
      testID={testID}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      style={[{ width: dimension, height: dimension }, style as ViewStyle]}
      {...props}
    >
      {spinning ? <Animated.View style={spinStyle}>{svg}</Animated.View> : svg}
    </View>
  );
});

// ---------------------------------------------------------------------------
// Progress

const STAR_PATH =
  "M12 2.4l2.95 5.98 6.6.96-4.78 4.66 1.13 6.57L12 17.46l-5.9 3.11 1.13-6.57L2.45 9.34l6.6-.96z";

export interface RatingProps {
  /** How many stars are filled. Fractions render a partially filled star. */
  value: number;
  /** The number of stars. Defaults to five. */
  max?: number;
  size?: "sm" | "md" | "lg";
  /** Makes the stars tappable. Omit for a read-only rating. */
  onChange?: (value: number) => void;
  disabled?: boolean;
  /** The accessible name, e.g. "Rating". */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A star rating.
 *
 * The stars are drawn as SVG paths from the resolver, so nothing is a
 * platform control. A fractional value fills part of a star: 3.5 draws three
 * full stars and one half, the half produced by clipping the filled star at the
 * fraction's width rather than by rounding — a 4.5-star average must look like
 * a 4.5-star average.
 *
 * Read-only unless `onChange` is given. With it, each star is tappable, the
 * value is exposed as an adjustable control (increment/decrement through
 * accessibility actions), and each star has its own label so a screen reader
 * can name the exact rating it sets.
 */
export const Rating = forwardRef<any, RatingProps>(function Rating(
  {
    value,
    max = 5,
    size = "md",
    onChange,
    disabled = false,
    accessibilityLabel = "Rating",
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Svg, Path, Defs, ClipPath, Rect } = primitives();
  const starSize = controlSizes.star[size];
  const interactive = Boolean(onChange) && !disabled;
  const clamped = Math.max(0, Math.min(value, max));

  const setValue = (next: number) => {
    const bounded = Math.max(0, Math.min(next, max));
    onChange?.(bounded);
  };

  const star = (index: number) => {
    // How much of this star is filled: 1 for a full star, 0 for empty, and the
    // remainder for the one the value lands inside.
    const filled = Math.max(0, Math.min(1, clamped - index));
    const half = filled > 0 && filled < 1;

    const glyph = (
      <Svg width={starSize} height={starSize} viewBox="0 0 24 24">
        {half ? (
          <Defs>
            {/* The clip is what makes a fractional star possible: the filled
                star is cut at the fraction's width. */}
            <ClipPath id={`rating-clip-${index}`}>
              <Rect x="0" y="0" width={24 * filled} height={24} />
            </ClipPath>
          </Defs>
        ) : null}
        {/* The empty star is always drawn, so the shape is complete. */}
        <Path d={STAR_PATH} fill={theme.separator} />
        {filled > 0 ? (
          <Path
            d={STAR_PATH}
            fill={theme.fill}
            {...(half ? { clipPath: `url(#rating-clip-${index})` } : {})}
          />
        ) : null}
      </Svg>
    );

    if (!interactive) return <View key={index}>{glyph}</View>;

    return (
      <Pressable
        key={index}
        accessibilityRole="button"
        accessibilityLabel={`${index + 1} of ${max} stars`}
        accessibilityState={{ selected: clamped === index + 1 }}
        onPress={() => setValue(index + 1)}
        hitSlop={4}
      >
        {glyph}
      </Pressable>
    );
  };

  const stars = Array.from({ length: Math.max(1, max) }, (_unused, index) => star(index));

  if (!interactive && !onChange) {
    return (
      <View
        ref={ref}
        testID={testID}
        accessibilityRole="text"
        accessibilityLabel={`${accessibilityLabel}, ${clamped} of ${max}`}
        style={{ flexDirection: "row", alignItems: "center", gap: 2, ...(style as ViewStyle) }}
        {...props}
      >
        {stars}
      </View>
    );
  }

  return (
    <View
      ref={ref}
      testID={testID}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      accessibilityValue={{ min: 0, max, now: clamped }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(event: any) => {
        if (disabled) return;
        if (event?.nativeEvent?.actionName === "increment") setValue(clamped + 1);
        if (event?.nativeEvent?.actionName === "decrement") setValue(clamped - 1);
      }}
      style={{ flexDirection: "row", alignItems: "center", gap: 2, opacity: disabled ? 0.38 : 1, ...(style as ViewStyle) }}
      {...props}
    >
      {stars}
    </View>
  );
});

// ---------------------------------------------------------------------------
// Image

export interface NativeImageProps {
  /** The image to show. */
  source: { uri: string } | number;
  /** A description for screen readers. Required: an image with no name is a hole. */
  accessibilityLabel: string;
  /** Shown behind the image while it loads; a Skeleton when omitted. */
  placeholder?: ReactNode;
  /** Shown when the image fails to load. */
  fallback?: ReactNode;
  /** Fades the image in when it loads. Honours Reduce Motion. */
  fadeIn?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A plain image, with the loading and error states every app ends up writing.
 *
 * Three states, because an image on a phone is three states: loading (a
 * Skeleton behind it), loaded (a fade in), and failed (the caller's fallback).
 * Aspect ratio comes from `style`, so a caller sets `aspectRatio` and the height
 * follows.
 *
 * This is the plain one; `NativeImageGeneration` is the AI-specific cousin and
 * keeps its own state machine.
 */
export const NativeImage = forwardRef<any, NativeImageProps>(function NativeImage(
  {
    source,
    accessibilityLabel,
    placeholder,
    fallback,
    fadeIn = true,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const { View, Image: RNImage, Animated } = primitives();
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { value: fade, animated } = useSpring(loaded ? 1 : 0, "gentle");

  const boxStyle: ViewStyle = { overflow: "hidden", ...(style as ViewStyle) };

  if (failed && fallback) {
    return (
      <View ref={ref} testID={testID} style={boxStyle} {...props}>
        {fallback}
      </View>
    );
  }

  const imageStyle: ViewStyle = { width: "100%", height: "100%" };
  const opacity = fadeIn && animated ? fade : 1;

  return (
    <View ref={ref} testID={testID} style={boxStyle} {...props}>
      {/* The placeholder sits under the image, so the box never collapses and
          the fade reveals rather than jumps. */}
      {!loaded ? <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>{placeholder ?? <View style={{ flex: 1, backgroundColor: (isDark ? colors.dark : colors.light).skeleton }} />}</View> : null}
      <RNImage
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel}
        source={source}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        style={[imageStyle, animated ? { opacity } : null]}
      />
    </View>
  );
});
