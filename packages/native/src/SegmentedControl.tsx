import { forwardRef, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";
import { LensRim, lensShadow } from "./internal/lens";

export interface SegmentedControlProps {
  values: string[];
  selectedIndex?: number;
  defaultIndex?: number;
  onValueChange?: (value: string, index: number) => void;
  /** One selection tick when the segment changes. `false` opts out. */
  haptics?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  /** Passed through to the control so it is testable. */
  testID?: string;
}

// The web segment is 32 high inside a 2pt inset, on a pill container, with the
// selected pill itself a pill: 500/400 weights, not a bold selected label.
const SEGMENT_HEIGHT = 32;

/**
 * A row of mutually exclusive segments on one glass container.
 *
 * The selected segment is marked by a pill that slides on the springs token.
 * The pill's colours come from the theme tokens, so it reads correctly in both
 * light and dark instead of assuming a white-on-light palette.
 */
export const SegmentedControl = forwardRef<any, SegmentedControlProps>(function SegmentedControl(
  {
    values,
    selectedIndex: selectedProp,
    defaultIndex = 0,
    onValueChange,
    haptics = true,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable, Animated } = primitives();

  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const [held, setHeld] = useState(false);
  const activeIndex = selectedProp !== undefined ? selectedProp : internalIndex;
  const safeIndex = Math.min(Math.max(activeIndex, 0), Math.max(values.length - 1, 0));

  // The pill slides between equal-width segments, so a ratio is enough: 0 is
  // the first segment, values.length - 1 the last.
  const { value: slide, animated } = useSpring(safeIndex, "snappy");

  const handleSelect = (index: number) => {
    // Only a change ticks: re-pressing the current segment is not a selection.
    if (haptics && index !== safeIndex) hapticSelection();
    if (selectedProp === undefined) setInternalIndex(index);
    const val = values[index];
    if (val !== undefined) onValueChange?.(val, index);
  };

  const count = Math.max(values.length, 1);
  const pillWidth = `${100 / count}%`;

  const containerStyle: ViewStyle = {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    padding: 2,
    borderRadius: radii.pill,
    // The web lays the segment track tint over glass; the fallback paints the
    // same tint as the flat track the web sees through the glass.
    backgroundColor: themeColors.fieldWash,
    ...(style as ViewStyle),
  };

  const pillTranslate = animated
    ? slide.interpolate({
        inputRange: [0, Math.max(count - 1, 1)],
        // One segment's worth per step, measured against the pill's own width.
        outputRange: ["0%", `${((count - 1) * 100) / count}%`],
      })
    : `${(safeIndex * 100) / count}%`;

  return (
    <Glass
      ref={ref}
      effect="regular"
      surface="rail"
      pressed={held}
      isDark={isDark}
      style={containerStyle}
      testID={testID}
      {...props}
    >
      {/* The sliding pill: one View behind the labels, coloured by the theme. */}
      {animated ? (
        <Animated.View
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            width: pillWidth,
            height: SEGMENT_HEIGHT,
            borderRadius: radii.pill,
            backgroundColor: themeColors.glassActive,
            borderWidth: 0.5,
            borderColor: themeColors.edge,
            // The thumb is a lens: lifted off the rail, with its own rim.
            ...lensShadow(isDark),
            transform: [{ translateX: pillTranslate }],
          }}
          pointerEvents="none"
        >
          <LensRim radius={radii.pill} isDark={isDark} />
        </Animated.View>
      ) : (
        <View
          style={{
            position: "absolute",
            top: 2,
            left: `${2 + (safeIndex * 100) / count}%`,
            width: pillWidth,
            height: SEGMENT_HEIGHT,
            borderRadius: radii.pill,
            backgroundColor: themeColors.glassActive,
            borderWidth: 0.5,
            borderColor: themeColors.edge,
            ...lensShadow(isDark),
          }}
          pointerEvents="none"
        >
          <LensRim radius={radii.pill} isDark={isDark} />
        </View>
      )}

      {values.map((label, idx) => {
        const isSelected = idx === safeIndex;
        return (
          <Pressable
            key={label}
            accessibilityRole="tab"
            accessibilityLabel={label}
            accessibilityState={{ selected: isSelected }}
            onPress={() => handleSelect(idx)}
            onPressIn={() => setHeld(true)}
            onPressOut={() => setHeld(false)}
            style={{
              flex: 1,
              height: SEGMENT_HEIGHT,
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 16,
              borderRadius: radii.sm,
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                fontWeight: isSelected ? "500" : "400",
                color: isSelected ? themeColors.foreground : themeColors.muted,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </Glass>
  );
});
