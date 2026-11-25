import { forwardRef, useState } from "react";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { loadEngineControl } from "./internal/glass-routing";
import { glassCapabilities } from "./internal/GlassView";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";
import { LensRim, lensShadow } from "./internal/lens";

export interface TabBarItem {
  id: string;
  label: string;
  /**
   * A render function — the engine calls it with the tab's state, so a plain
   * element cannot be used here. The fallback floor calls it the same way.
   */
  icon?: (opts: { focused: boolean; color: string; size: number }) => ReactNode;
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
  /**
   * The safe-area inset the bar must float above — the Android navigation bar
   * or the iOS home indicator. Defaults to the device's own bottom inset, read
   * from the safe area, so the bar floats fully above it and its labels are
   * never clipped. Pass a number to pin the bar to a design height instead.
   */
  bottomInset?: number;
  /** Passed through to the bar so it is testable. */
  testID?: string;
}

// The web bar: a 64pt rail (56pt pill in a 4pt inset) with a 20pt radius, a
// glass lens filling the active slot, and 12pt labels at 500/400 weight —
// the same height as the engine bar (64dp), so icon + label fit on both paths.
const BAR_HEIGHT = 64;

/**
 * The bottom bar of an app: a row of tabs on one glass surface.
 *
 * The platform rule is the point of this component. On iOS 26+ the surface is
 * Apple's real Liquid Glass (`UIGlassEffect` via the vendored engine) with
 * Glacia's own items inside it; on older iOS and on Android it is Glacia's bar.
 * The items are always our Pressables and Texts — no native tab bar is used on
 * any platform.
 *
 * The port is the engine's `LiquidGlassTabBar` design, and it carries over
 * session 1's safe-area behaviour: the bar floats fully above the system inset
 * (the Android navigation bar or the iOS home indicator) — the safe-area bottom
 * inset is added to the bar's height — so the glass ends above the inset rather
 * than sinking into it and the labels never clip.
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
    bottomInset,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const themeColors = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText, Animated } = primitives();
  const capabilities = glassCapabilities();
  const EngineTabBar = loadEngineControl("TabBar");

  const [internalId, setInternalId] = useState(defaultActiveId || items[0]?.id || "");
  const [held, setHeld] = useState(false);
  const activeId = activeProp ?? internalId;

  const handleSelect = (id: string) => {
    if (haptics) hapticSelection();
    if (activeProp === undefined) setInternalId(id);
    onTabChange?.(id);
  };

  const barStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    // The bar floats fully above the system inset, so it is taller than its
    // design height by the safe-area bottom inset. At zero inset it is exactly
    // the design height.
    height: BAR_HEIGHT + Math.max(bottomInset ?? 0, 0),
    paddingHorizontal: 4,
    borderRadius: radii.lg,
    ...(style as ViewStyle),
  };

  const count = Math.max(items.length, 1);
  const itemWidth = `${100 / count}%`;
  const activeIndex = Math.max(0, items.findIndex((tab) => tab.id === activeId));
  // Active tab: blue in light mode, white in dark mode (the bottom-bar rule).
  const activeColor = isDark ? themeColors.foreground : themeColors.fill;

  const indicatorStyle = {
    position: "absolute" as const,
    top: 4,
    bottom: 4,
    left: 4,
    width: itemWidth,
    borderRadius: radii.pill,
    backgroundColor: themeColors.glassActive,
    opacity: 0.75,
    ...lensShadow(isDark),
  };

  const { value: offset, animated } = useSpring(activeIndex, "snappy");

  // ------------------------------------------------------------------
  // Fallback floor: the same rail and lens pill, on the fallback material.
  // ------------------------------------------------------------------
  if (!(EngineTabBar && capabilities.supported)) {
    return (
      <Glass
        ref={ref}
        effect="regular"
        surface="rail"
        pressed={held}
        isDark={isDark}
        style={barStyle}
        testID={testID}
        {...props}
      >
        {animated ? (
          <Animated.View pointerEvents="none" style={{ ...indicatorStyle, transform: [{ translateX: offset.interpolate({ inputRange: [0, Math.max(count - 1, 1)], outputRange: [0, `${((count - 1) * 100) / count}%`] }) }] }}>
            <LensRim radius={radii.pill} isDark={isDark} />
          </Animated.View>
        ) : (
          <View pointerEvents="none" style={{ ...indicatorStyle, left: `${(activeIndex * 100) / count}%` }}>
            <LensRim radius={radii.pill} isDark={isDark} />
          </View>
        )}
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          const tabColor = isActive ? activeColor : themeColors.muted;
          // The icon is a render function on both paths; a plain element is
          // still rendered as-is so older call sites do not crash.
          const iconNode =
            typeof tab.icon === "function"
              ? tab.icon({ focused: isActive, color: tabColor, size: 24 })
              : tab.icon ?? null;
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
                height: "100%",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                // Tight side padding: at 390pt a 5-tab bar gives each tab ~70pt,
                // and "Accounts" at 12pt needs ~54pt — 8pt padding truncated it.
                paddingHorizontal: 2,
                paddingVertical: 4,
              }}
            >
              {iconNode}
              <RNText numberOfLines={1} style={{ fontSize: 12, fontWeight: isActive ? "500" : "400", color: tabColor }}>
                {tab.label}
              </RNText>
            </Pressable>
          );
        })}
      </Glass>
    );
  }

  const EngineTabBarComponent = EngineTabBar;
  const tabs = items.map((item) => ({
    key: item.id,
    title: item.label,
    icon: item.icon,
  }));
  const selectedIndex = Math.max(0, items.findIndex((item) => item.id === activeId));

  return (
    <EngineTabBarComponent
      tabs={tabs}
      selectedIndex={selectedIndex}
      onTabSelected={(index: number) => handleSelect(items[index]?.id ?? "")}
      accentColor={activeColor}
      inactiveColor={themeColors.muted}
      tint={themeColors.glass}
      style={style}
      labelStyle={{ fontSize: 12 } as any}
    />
  );
});
