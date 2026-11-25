import { forwardRef } from "react";
import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";
import { LensRim, lensShadow } from "./internal/lens";

export interface SegmentedControlProps {
  /** Segment labels, equal-width. */
  segments: string[];
  selectedIndex: number;
  /** Fires when the user picks another segment. */
  onChange: (index: number) => void;
  /** Control height; the corner radius follows it. Defaults to 40. */
  height?: number;
  /** Track wash. */
  tint?: string;
  /** Thumb wash. */
  thumbTint?: string;
  thumbMetal?: unknown;
  accessibilityLabel?: string;
  isDark?: boolean;
  /** Passed to the control so it is testable. */
  testID?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

/**
 * A segmented control — ported from the engine's `LiquidGlassSegmentedControl`,
 * the design Binyam approved on real devices this week (40dp track, 3dp-inset
 * thumb).
 *
 * With a glass renderer available the engine's own control mounts, carrying the
 * approved geometry and thumb behaviour. Without one — Expo Go, below every
 * tier, or Reduce Transparency — the fallback floor renders the same row of
 * segments with solid selected states, so the control is never invisible.
 */
export const SegmentedControl = forwardRef<any, SegmentedControlProps>(function SegmentedControl(
  {
    segments,
    selectedIndex,
    onChange,
    height = 40,
    tint,
    thumbTint,
    thumbMetal,
    accessibilityLabel,
    isDark: isDarkProp,
    testID,
    style,
    textStyle,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText, Animated } = primitives();
  const capabilities = glassCapabilities();
  const EngineSegmentedControl = loadEngineControl("SegmentedControl");

  const selected = Math.min(Math.max(selectedIndex, 0), Math.max(segments.length - 1, 0));

  // The pill slides between equal-width segments, so a ratio is enough: 0 is
  // the first segment, values.length - 1 the last.
  const count = Math.max(segments.length, 1);
  const pillWidth = `${100 / count}%`;
  const { value: slide, animated } = useSpring(selected, "snappy");

  const pillTranslate = animated
    ? slide.interpolate({
        inputRange: [0, Math.max(count - 1, 1)],
        outputRange: ["0%", `${((count - 1) * 100) / count}%`],
      })
    : `${(selected * 100) / count}%`;

  if (EngineSegmentedControl && capabilities.supported) {
    const EngineSegmentedControlComponent = EngineSegmentedControl;
    return (
      <EngineSegmentedControlComponent
        segments={segments}
        selectedIndex={selected}
        onChange={(index: number) => {
          hapticSelection();
          onChange(index);
        }}
        height={height}
        tint={tint}
        thumbTint={thumbTint}
        thumbMetal={thumbMetal}
        style={style}
        textStyle={textStyle}
      />
    );
  }

  // Fallback floor: the sliding lens pill on a solid track, full selection
  // behaviour, so the selected segment reads exactly as it does in glass.
  // The track stretches to its parent like the engine path (no alignSelf), and
  // every segment takes an equal share of the track — a fixed cell width
  // computed from the height (11pt for 3 segments at height 40) collapsed the
  // track and piled the labels on top of each other ("D L P", run 8).
  const fallback = (
    <Glass
      effect="regular"
      surface="rail"
      pressed={false}
      isDark={isDark}
      style={{
        position: "relative",
        flexDirection: "row",
        alignItems: "center",
        height,
        padding: 3,
        borderRadius: radii.pill,
        backgroundColor: themeColors.fieldWash,
        ...(style as ViewStyle),
      }}
      testID={testID}
      {...props}
    >
      {animated ? (
        <Animated.View
          style={{
            position: "absolute",
            top: 3,
            left: 3,
            width: pillWidth,
            height: height - 6,
            borderRadius: (height - 6) / 2,
            backgroundColor: themeColors.glassActive,
            borderWidth: 0.5,
            borderColor: themeColors.edge,
            // The thumb is a lens: lifted off the rail, with its own rim.
            ...lensShadow(isDark),
            transform: [{ translateX: pillTranslate }],
          }}
          pointerEvents="none"
        >
          <LensRim radius={(height - 6) / 2} isDark={isDark} />
        </Animated.View>
      ) : (
        <View
          style={{
            position: "absolute",
            top: 3,
            left: `${3 + (selected * 100) / count}%`,
            width: pillWidth,
            height: height - 6,
            borderRadius: (height - 6) / 2,
            backgroundColor: themeColors.glassActive,
            borderWidth: 0.5,
            borderColor: themeColors.edge,
            ...lensShadow(isDark),
          }}
          pointerEvents="none"
        >
          <LensRim radius={(height - 6) / 2} isDark={isDark} />
        </View>
      )}
      {segments.map((segment, index) => {
        const isSelected = index === selected;
        return (
          <View key={segment} style={{ flex: 1, height: height - 6, position: "relative" }}>
            {isSelected ? (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: height - 6,
                  borderRadius: (height - 6) / 2,
                  backgroundColor: themeColors.glassActive,
                }}
              />
            ) : null}
            <Pressable
              testID={testID ? `${testID}-segment-${index}` : undefined}
              accessibilityRole="tab"
              accessibilityLabel={`${accessibilityLabel ?? "Segment"} ${segment}`}
              accessibilityState={{ selected: isSelected, disabled: false }}
              disabled={false}
              onPress={() => {
                if (index === selected) return;
                hapticSelection();
                onChange(index);
              }}
              style={{ width: "100%", height, alignItems: "center", justifyContent: "center" }}
            >
              <RNText
                numberOfLines={1}
                style={[
                  {
                    fontSize: 14,
                    fontWeight: isSelected ? "600" : "500",
                    // Foreground, like the engine path's label colour — onTint
                    // (white) is unreadable on the light-mode pill.
                    color: isSelected ? themeColors.foreground : themeColors.muted,
                  },
                  textStyle,
                ]}
              >
                {segment}
              </RNText>
            </Pressable>
          </View>
        );
      })}
    </Glass>
  );

  return fallback;
});
