import { forwardRef, useRef, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";

// ---------------------------------------------------------------------------
// Carousel

export interface CarouselProps {
  /** One node per page. */
  slides: ReactNode[];
  /** Controlled page. Omit and the carousel tracks itself. */
  index?: number;
  defaultIndex?: number;
  /** Fires when a swipe settles on a new page. */
  onIndexChange?: (index: number) => void;
  /** Gap between pages, so neighbours peek at the edges. */
  gap?: number;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A horizontally paging swiper.
 *
 * It rides the resolver's ScrollView with `pagingEnabled`, so the paging feel is
 * the platform's own and the pages are plain content the caller supplies. The
 * active page is derived from the scroll offset, which is also what reports
 * `onIndexChange`.
 */
export const Carousel = forwardRef<any, CarouselProps>(function Carousel(
  {
    slides,
    index: indexProp,
    defaultIndex = 0,
    onIndexChange,
    gap = 0,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const { getScrollView } = primitives();
  const ScrollView = getScrollView();
  const { View } = primitives();

  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const index = indexProp !== undefined ? indexProp : internalIndex;

  const viewportWidth = useRef(0);
  const scrollRef = useRef<any>(null);

  // Derives the page from the offset rather than trusting a counter, so a
  // fast swipe that skips pages still reports the page it landed on.
  const handleScroll = (event: any) => {
    const { contentOffset, layoutMeasurement } = event?.nativeEvent ?? {};
    const width = layoutMeasurement?.width || viewportWidth.current;
    if (!width || !contentOffset) return;
    const next = Math.round(contentOffset.x / width);
    const clamped = Math.min(Math.max(next, 0), Math.max(slides.length - 1, 0));
    if (clamped !== index) {
      if (indexProp === undefined) setInternalIndex(clamped);
      onIndexChange?.(clamped);
    }
  };

  const pages = slides.map((slide, i) => (
    <View key={i} style={{ width: viewportWidth.current || "100%", paddingRight: gap }}>
      {slide}
    </View>
  ));

  // Off-device there is no ScrollView; the pages still render in a row so the
  // component mounts, and the tests drive `handleScroll` through onScroll.
  if (!ScrollView) {
    return (
      <View ref={ref} testID={testID} style={[{ flexDirection: "row", overflow: "hidden" }, style as ViewStyle]} {...props}>
        {pages}
      </View>
    );
  }

  return (
    <View
      ref={ref}
      testID={testID}
      onLayout={(event: any) => {
        viewportWidth.current = event?.nativeEvent?.layout?.width ?? 0;
      }}
      style={style as ViewStyle}
      {...props}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled={gap === 0}
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        accessibilityRole="adjustable"
        accessibilityLabel="Carousel"
        accessibilityValue={{ min: 0, max: Math.max(slides.length - 1, 0), now: index }}
        accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
        onAccessibilityAction={(event: any) => {
          const step = event?.nativeEvent?.actionName === "increment" ? 1 : -1;
          const next = Math.min(Math.max(index + step, 0), Math.max(slides.length - 1, 0));
          if (next === index) return;
          if (indexProp === undefined) setInternalIndex(next);
          onIndexChange?.(next);
        }}
      >
        {pages}
      </ScrollView>
    </View>
  );
});

// ---------------------------------------------------------------------------
// PageControl

export interface PageControlProps {
  count: number;
  /** Controlled active page. Omit and the control keeps its own. */
  activeIndex?: number;
  defaultActiveIndex?: number;
  /** Called when a dot is tapped. */
  onChange?: (index: number) => void;
  /** Tint the active dot; defaults to the theme accent. */
  tint?: string;
  /** Hide the dots when there is only one page. */
  hidesForSinglePage?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

const DOT = 7;
const ACTIVE_DOT = 18;

/**
 * The page dots.
 *
 * The active dot elongates and the others stay narrow, which is how iOS reads
 * "you are here". The width change runs on the springs token through Animated.
 */
export const PageControl = forwardRef<any, PageControlProps>(function PageControl(
  {
    count,
    activeIndex: activeProp,
    defaultActiveIndex = 0,
    onChange,
    tint,
    hidesForSinglePage = false,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable } = primitives();

  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const active = activeProp !== undefined ? activeProp : internalIndex;

  if (hidesForSinglePage && count <= 1) return null;

  // The accent tints the active dot; the resting dots sit on `glassActive` so
  // selection reads the same way it does in SegmentedControl and TabBar.
  const accent = tint ?? theme.fill;
  const resting = theme.glassActive;

  return (
    <View
      ref={ref}
      testID={testID}
      accessibilityRole="tablist"
      style={[{ flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "center" }, style as ViewStyle]}
      {...props}
    >
      {Array.from({ length: Math.max(count, 0) }, (_, index) => {
        const isActive = index === active;
        return (
          <Pressable
            key={index}
            accessibilityRole="tab"
            accessibilityLabel={`Page ${index + 1} of ${count}`}
            accessibilityState={{ selected: isActive }}
            onPress={() => {
              if (activeProp === undefined) setInternalIndex(index);
              onChange?.(index);
            }}
            hitSlop={8}
          >
            <Dot active={isActive} accent={accent} muted={resting} />
          </Pressable>
        );
      })}
    </View>
  );
});

/** One dot, whose width springs between the resting and active lengths. */
function Dot({ active, accent, muted }: { active: boolean; accent: string; muted: string }) {
  const { Animated, View } = primitives();
  const { value: progress, animated } = useSpring(active ? 1 : 0, "snappy");

  const width = animated
    ? progress.interpolate({ inputRange: [0, 1], outputRange: [DOT, ACTIVE_DOT] })
    : active
      ? ACTIVE_DOT
      : DOT;

  const style: ViewStyle = {
    height: DOT,
    borderRadius: DOT / 2,
    backgroundColor: active ? accent : muted,
  };

  return animated ? (
    <Animated.View style={{ ...style, width }} />
  ) : (
    <View style={{ ...style, width: width as number }} />
  );
}
