import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";

// ---------------------------------------------------------------------------
// Avatar

export type AvatarSize = "sm" | "md" | "lg";

export interface AvatarProps {
  /** Image to show. When absent, or when it fails to load, initials render. */
  source?: { uri: string } | number;
  /** The person's name: initials are derived from it when no image loads. */
  name?: string;
  size?: AvatarSize;
  /** Draws a status dot in the corner. */
  status?: "online" | "offline" | "busy";
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

const avatarSizes: Record<AvatarSize, number> = { sm: 28, md: 40, lg: 64 };

/** First letters of the first and last word, as an avatar fallback. */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase();
}

/**
 * A person or entity: their picture, or their initials when there is none.
 *
 * The frame is Glacia's glass so it belongs to the same family as the rest of
 * the library; the initials sit on it in the theme's foreground colour.
 */
export const Avatar = forwardRef<any, AvatarProps>(function Avatar(
  { source, name, size = "md", status, style, isDark: isDarkProp, testID, ...props },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Image } = primitives();

  // A broken remote image falls back to initials rather than an empty circle.
  const [failed, setFailed] = useState(false);
  const dimension = avatarSizes[size];
  const initials = name ? initialsOf(name) : "";

  const statusColor =
    status === "online" ? theme.on : status === "busy" ? theme.destructive : theme.muted;
  const dot = Math.max(8, Math.round(dimension * 0.26));

  return (
    <View
      ref={ref}
      testID={testID}
      accessible
      accessibilityRole="image"
      accessibilityLabel={name ? `Avatar of ${name}` : "Avatar"}
      style={{ width: dimension, height: dimension, ...(style as ViewStyle) }}
      {...props}
    >
      <Glass
        effect="regular"
        isDark={isDark}
        style={{
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {source && !failed ? (
          <Image
            source={source}
            accessibilityLabel={name ?? "Avatar"}
            onError={() => setFailed(true)}
            style={{ width: dimension, height: dimension }}
          />
        ) : (
          <Text
            style={{
              fontSize: Math.round(dimension * 0.38),
              fontWeight: "600",
              color: theme.foreground,
            }}
          >
            {initials}
          </Text>
        )}
      </Glass>

      {status && (
        <View
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            backgroundColor: statusColor,
            borderWidth: 1.5,
            borderColor: theme.glassActive,
          }}
        />
      )}
    </View>
  );
});

// ---------------------------------------------------------------------------
// Badge

export interface BadgeProps {
  /** The count or short label. Omit to render a plain dot. */
  children?: ReactNode;
  /** Draws the badge in the destructive tone (unread, errors). */
  tone?: "fill" | "destructive" | "success" | "muted";
  /** The element to overlay. Supplying it puts the badge in the corner. */
  overlay?: ReactNode;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A small count or dot.
 *
 * Deliberately not glass: a badge is a micro-element, and a translucent 16pt
 * chip loses its contrast against whatever it sits on. It uses the solid theme
 * tint instead, which is what makes it legible in both themes.
 */
export const Badge = forwardRef<any, BadgeProps>(function Badge(
  { children, tone = "fill", overlay, style, isDark: isDarkProp, testID, ...props },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text } = primitives();

  const background =
    tone === "destructive"
      ? theme.destructive
      : tone === "success"
        ? theme.on
        : tone === "muted"
          ? theme.muted
          : theme.fill;

  const isDot = children == null;
  const height = isDot ? 10 : 18;

  const badge = (
    <View
      ref={ref}
      testID={testID}
      accessibilityRole="text"
      accessibilityLabel={isDot ? undefined : String(children)}
      style={{
        minWidth: height,
        height,
        borderRadius: height / 2,
        paddingHorizontal: isDot ? 0 : 6,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: background,
        ...(style as ViewStyle),
      }}
      {...props}
    >
      {!isDot && (
        <Text style={{ fontSize: 11, fontWeight: "700", color: theme.onTint }} numberOfLines={1}>
          {children}
        </Text>
      )}
    </View>
  );

  if (overlay === undefined) return badge;

  // Overlaid: the badge floats at the top-right of whatever it decorates, which
  // needs a positioned box around the child rather than a bare fragment.
  return (
    <View style={{ alignSelf: "flex-start" }}>
      {overlay}
      <View style={{ position: "absolute", top: -4, right: -4 }}>{badge}</View>
    </View>
  );
});

// ---------------------------------------------------------------------------
// Separator

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  /** Inset from the leading edge, matching a list row's leading accessory. */
  inset?: number;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A hairline divider in the theme's separator colour.
 *
 * A plain View rather than a Glass: a 1pt rule is not a surface, and glass on
 * a line has nothing to refract.
 */
export const Separator = forwardRef<any, SeparatorProps>(function Separator(
  { orientation = "horizontal", inset = 0, style, isDark: isDarkProp, testID, ...props },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View } = primitives();

  const separatorStyle: ViewStyle =
    orientation === "horizontal"
      ? { height: 0.5, alignSelf: "stretch", marginLeft: inset, backgroundColor: theme.separator }
      : { width: 0.5, alignSelf: "stretch", backgroundColor: theme.separator };

  return (
    <View
      ref={ref}
      testID={testID}
      accessibilityRole="none"
      style={{ ...separatorStyle, ...(style as ViewStyle) }}
      {...props}
    />
  );
});

// ---------------------------------------------------------------------------
// Skeleton

export interface SkeletonProps {
  /** Rectangles for cards and rows, circles for avatars, lines for a run of text. */
  shape?: "rect" | "circle" | "line";
  width?: number | string;
  height?: number;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A loading placeholder.
 *
 * The pulse is opacity only and slow, on the gentle spring, so it reads as
 * "loading" without motion that could bother someone sensitive to movement.
 * Nothing about it is essential to understanding the screen, so it is hidden
 * from screen readers rather than announced.
 */
export const Skeleton = forwardRef<any, SkeletonProps>(function Skeleton(
  { shape = "rect", width, height, style, isDark: isDarkProp, testID, ...props },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Animated } = primitives();

  const { value: pulse, animated } = useSpring(1, "gentle");
  const opacity = animated
    ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] })
    : 1;

  const resolvedWidth = width ?? (shape === "line" ? "100%" : shape === "circle" ? 40 : 120);
  const resolvedHeight = height ?? (shape === "line" ? 12 : shape === "circle" ? 40 : 80);
  const radius =
    shape === "circle" ? Math.min(resolvedHeight, 9999) / 2 : shape === "line" ? radii.sm : radii.md;

  const skeletonStyle: ViewStyle = {
    width: resolvedWidth as any,
    height: resolvedHeight,
    borderRadius: radius,
    backgroundColor: theme.skeleton,
    ...(style as ViewStyle),
  };

  const a11y = { accessibilityRole: "none" as const, accessible: false, testID };

  return animated ? (
    <Animated.View ref={ref} style={{ ...skeletonStyle, opacity }} {...a11y} {...props} />
  ) : (
    <View ref={ref} style={skeletonStyle} {...a11y} {...props} />
  );
});

// ---------------------------------------------------------------------------
// Spinner

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

export type ProgressVariant = "bar" | "ring";

export interface ProgressProps {
  /** 0–100. Values outside the range are clamped rather than drawn wrong. */
  value: number;
  variant?: ProgressVariant;
  /** Overrides the fill colour; defaults to the theme accent. */
  tint?: string;
  /** Announced by screen readers, e.g. "Uploading photo". */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

const RING = 64;

/**
 * Progress, linear or circular.
 *
 * The track is a glass surface, so it refracts what it sits on exactly like the
 * rest of the library; the fill is the theme accent. Both forms report
 * `progressbar` with a value, which is the contract NativeTask relies on
 * internally — this component generalises it.
 */
export const Progress = forwardRef<any, ProgressProps>(function Progress(
  {
    value,
    variant = "bar",
    tint,
    accessibilityLabel,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Svg, Circle } = primitives();

  const clamped = Math.min(Math.max(value, 0), 100);
  const fill = tint ?? theme.fill;
  const a11y = {
    accessibilityRole: "progressbar" as const,
    accessibilityValue: { min: 0, max: 100, now: Math.round(clamped) },
    accessibilityLabel,
    testID,
  };

  if (variant === "ring") {
    const stroke = 6;
    const radius = (RING - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    return (
      <View
        ref={ref}
        style={[{ width: RING, height: RING }, style as ViewStyle]}
        {...a11y}
        {...props}
      >
        <Svg width={RING} height={RING} viewBox={`0 0 ${RING} ${RING}`}>
          <Circle
            cx={RING / 2}
            cy={RING / 2}
            r={radius}
            stroke={theme.skeleton}
            strokeWidth={stroke}
            fill="none"
          />
          <Circle
            cx={RING / 2}
            cy={RING / 2}
            r={radius}
            stroke={fill}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${(clamped / 100) * circumference} ${circumference}`}
            // Start the arc at twelve o'clock, the way progress dials read.
            transform={`rotate(-90 ${RING / 2} ${RING / 2})`}
          />
        </Svg>
        <View
          style={{
            position: "absolute",
            width: RING,
            height: RING,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "600", color: theme.foreground }}>
            {`${Math.round(clamped)}%`}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <Glass
      ref={ref}
      effect="regular"
      isDark={isDark}
      style={{
        height: 8,
        borderRadius: radii.pill,
        overflow: "hidden",
        justifyContent: "center",
        ...(style as ViewStyle),
      }}
      {...a11y}
      {...props}
    >
      <View
        style={{
          width: `${clamped}%`,
          height: 8,
          borderRadius: radii.pill,
          backgroundColor: fill,
        }}
      />
    </Glass>
  );
});
