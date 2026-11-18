import { forwardRef, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";

export interface TabItem {
  /** Stable identifier for the tab. */
  id: string;
  /** What the tab reads. */
  label: string;
  /** An optional icon element drawn before the label. */
  icon?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  /** The active tab's `id`. Leave undefined and the component keeps it itself. */
  activeId?: string;
  defaultActiveId?: string;
  onTabChange?: (id: string) => void;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  /** Passed through to the rail so it is testable. */
  testID?: string;
}

/**
 * A row of tabs on a glass rail, in the reference implementation's style: the
 * selected tab is a lifted inner pane rather than a flat highlight.
 *
 * Same conventions as every other component here — React Native primitives
 * only, no browser APIs. The rail is Apple's real glass on iOS 26+ and
 * Glacia's translucent fallback of the same shape on older iOS and Android, so
 * the layout never shifts between platforms.
 */
export const Tabs = forwardRef<any, TabsProps>(function Tabs(
  {
    items,
    activeId: activeProp,
    defaultActiveId,
    onTabChange,
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
  const [held, setHeld] = useState(false);
  const activeId = activeProp !== undefined ? activeProp : internalId;

  const activeIndex = Math.max(
    0,
    items.findIndex((tab) => tab.id === activeId),
  );
  const { value: slide, animated } = useSpring(activeIndex, "snappy");

  const handleSelect = (id: string) => {
    if (activeProp === undefined) setInternalId(id);
    onTabChange?.(id);
  };

  const count = Math.max(items.length, 1);
  const itemWidth = `${100 / count}%`;

  // The selection is a lens, not a fill: a lifted pane on the rail.
  const paneStyle = {
    position: "absolute" as const,
    top: 4,
    bottom: 4,
    left: 4,
    width: itemWidth,
    borderRadius: radii.pill,
    backgroundColor: isDark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.72)",
    borderWidth: 0.5,
    borderColor: themeColors.edge,
  };

  return (
    <Glass
      ref={ref}
      effect="regular"
      surface="rail"
      pressed={held}
      isDark={isDark}
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 2,
        padding: 4,
        borderRadius: radii.pill,
        ...(style as ViewStyle),
      }}
      testID={testID}
      {...props}
    >
      {animated ? (
        <Animated.View
          pointerEvents="none"
          style={{
            ...paneStyle,
            transform: [
              {
                translateX: slide.interpolate({
                  inputRange: [0, Math.max(count - 1, 1)],
                  outputRange: ["0%", `${((count - 1) * 100) / count}%`],
                }),
              },
            ],
          }}
        />
      ) : (
        <View
          pointerEvents="none"
          style={{ ...paneStyle, left: `${(activeIndex * 100) / count}%` }}
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
            onPressIn={() => setHeld(true)}
            onPressOut={() => setHeld(false)}
            style={{
              flex: 1,
              height: 36,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              paddingHorizontal: 12,
              borderRadius: radii.pill,
            }}
          >
            {tab.icon ?? null}
            <Text
              numberOfLines={1}
              style={{
                fontSize: 13,
                fontWeight: isActive ? "600" : "500",
                color: isActive ? themeColors.foreground : themeColors.muted,
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
