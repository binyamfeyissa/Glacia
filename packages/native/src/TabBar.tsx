import { forwardRef, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";

export interface TabBarItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface TabBarProps {
  items: TabBarItem[];
  activeId?: string;
  defaultActiveId?: string;
  onTabChange?: (id: string) => void;
  /** One selection tick when the tab changes. `false` opts out. */
  haptics?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  /** Passed through to the bar so it is testable. */
  testID?: string;
}

const BAR_HEIGHT = 52;

/**
 * The bottom bar of an app: a row of tabs on one glass surface.
 *
 * The platform rule is the point of this component. On iOS 26+ the surface is
 * Apple's real Liquid Glass (`UIGlassEffect` via `@callstack/liquid-glass`)
 * with Glacia's own items inside it; on older iOS and on Android it is
 * Glacia's bar. The items are always our Pressables and Texts — no native tab
 * bar is used on any platform.
 */
export const TabBar = forwardRef<any, TabBarProps>(function TabBar(
  {
    items,
    activeId: activeProp,
    defaultActiveId,
    onTabChange,
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

  const [internalId, setInternalId] = useState(defaultActiveId || items[0]?.id || "");
  const activeId = activeProp !== undefined ? activeProp : internalId;

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );
  // The active wash slides between equally wide items on the springs token.
  const { value: slide, animated } = useSpring(activeIndex, "snappy");

  const handleSelect = (id: string) => {
    // Selecting the tab already active is not a change, so it does not tick.
    if (haptics && id !== activeId) hapticSelection();
    if (activeProp === undefined) setInternalId(id);
    onTabChange?.(id);
  };

  const barStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    height: BAR_HEIGHT,
    paddingHorizontal: 8,
    borderRadius: radii.xl,
    ...(style as ViewStyle),
  };

  const count = Math.max(items.length, 1);
  const itemWidth = `${100 / count}%`;

  const indicatorStyle = {
    position: "absolute" as const,
    top: 6,
    bottom: 6,
    left: 8,
    width: itemWidth,
    borderRadius: radii.lg,
    backgroundColor: themeColors.glassActive,
    opacity: 0.75,
  };

  return (
    <Glass ref={ref} effect="regular" isDark={isDark} style={barStyle} testID={testID} {...props}>
      {/* The selected item's wash, one View behind the labels. */}
      {animated ? (
        <Animated.View
          pointerEvents="none"
          style={{
            ...indicatorStyle,
            transform: [
              {
                translateX: slide.interpolate({
                  inputRange: [0, Math.max(count - 1, 1)],
                  outputRange: [
                    "0%",
                    `${((count - 1) * 100) / count}%`,
                  ],
                }),
              },
            ],
          }}
        />
      ) : (
        <View
          pointerEvents="none"
          style={{ ...indicatorStyle, left: `${(activeIndex * 100) / count}%` }}
        />
      )}

      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => handleSelect(tab.id)}
            style={{
              flex: 1,
              height: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            {tab.icon ?? null}
            <Text
              numberOfLines={1}
              style={{
                fontSize: 11,
                fontWeight: isActive ? "600" : "500",
                color: isActive ? themeColors.fill : themeColors.muted,
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </Glass>
  );
});
