import { forwardRef, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { Text } from "./Text";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";
import { hapticSelection } from "./internal/haptics";

/**
 * Registers Android's hardware back while an overlay is open.
 *
 * Shared by Menu, Sheet and Drawer so every overlay dismisses the same way a
 * Dialog does: the back button closes the layer, not the screen behind it.
 */
function useBackDismiss(open: boolean, onDismiss: () => void) {
  useEffect(() => {
    if (!open) return;
    const BackHandler = primitives().getBackHandler();
    if (!BackHandler) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      onDismiss();
      return true;
    });
    return () => sub.remove();
  }, [open, onDismiss]);
}

/**
 * Keeps a popover inside the window.
 *
 * Called with the trigger's measured frame and the popover's own size; returns
 * the offsets that bring it back on screen. A menu near the bottom edge flips
 * above its trigger rather than hanging off the display.
 */
export function anchorPopover(
  trigger: { x: number; y: number; width: number; height: number },
  popover: { width: number; height: number },
  viewport: { width: number; height: number },
  gap = 6,
): { left: number; top: number; flipped: boolean } {
  const below = trigger.y + trigger.height + gap;
  const above = trigger.y - popover.height - gap;
  const fitsBelow = below + popover.height <= viewport.height;
  const flipped = !fitsBelow && above >= 0;
  const top = Math.max(0, Math.min(flipped ? above : below, viewport.height - popover.height));
  const left = Math.max(0, Math.min(trigger.x, viewport.width - popover.width));
  return { left, top, flipped };
}

// ---------------------------------------------------------------------------
// Menu

export interface MenuItem {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  /** Renders in the destructive tone, for delete-and-similar. */
  destructive?: boolean;
  accessibilityLabel?: string;
}

export interface MenuProps {
  /** The control that opens the menu. */
  trigger: ReactNode;
  items: MenuItem[];
  /** Controlled open state. Omit and the menu keeps its own. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The menu's width. The list scrolls if the items exceed the screen. */
  width?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * An anchored dropdown menu.
 *
 * A press outside or on an item closes it; Android's back button does too. The
 * popover is a glass surface with `glassActive` rows, matching the way the
 * library marks a tappable row rather than nesting another glass panel.
 */
export const Menu = forwardRef<any, MenuProps>(function Menu(
  {
    trigger,
    items,
    open: openProp,
    onOpenChange,
    width = 220,
    accessibilityLabel = "Menu",
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable, Modal } = primitives();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp !== undefined ? openProp : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const dismiss = useCallback(() => setOpen(false), [setOpen]);
  useBackDismiss(open, dismiss);

  const { value: enter, animated } = useSpring(open ? 1 : 0, "snappy");
  const scale = animated ? enter.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) : 1;

  const popover = (
    <Glass
      effect="regular"
      isDark={isDark}
      testID={testID ? `${testID}-popover` : undefined}
      style={{ width, borderRadius: radii.md, paddingVertical: 4, overflow: "hidden", ...(style as ViewStyle) }}
    >
      {items.map((item, index) => (
        <Pressable
          key={`${item.label}-${index}`}
          accessibilityRole="button"
          accessibilityLabel={item.accessibilityLabel ?? item.label}
          accessibilityState={{ disabled: item.disabled }}
          disabled={item.disabled}
          onPress={() => {
            setOpen(false);
            item.onPress();
          }}
          style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10, paddingHorizontal: 12, opacity: item.disabled ? 0.38 : 1 }}
        >
          {item.icon ? <View>{item.icon}</View> : null}
          <RNText
            numberOfLines={1}
            style={{ fontSize: 15, color: item.destructive ? theme.destructive : theme.foreground }}
          >
            {item.label}
          </RNText>
        </Pressable>
      ))}
    </Glass>
  );

  return (
    <View ref={ref} style={{ alignSelf: "flex-start" }} {...props}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open }}
        onPress={() => setOpen(!open)}
      >
        {trigger}
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={dismiss}>
        {/* The backdrop: any press outside the popover dismisses the menu. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close menu"
          onPress={dismiss}
          style={{ flex: 1, backgroundColor: theme.scrim }}
        >
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
            <Pressable accessibilityRole="none" onPress={() => {}}>
              {animated ? (
                <AnimatedScale scale={scale}>{popover}</AnimatedScale>
              ) : (
                popover
              )}
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});

/** Wraps a popover in the entrance scale, which must land on an Animated.View. */
function AnimatedScale({ scale, children }: { scale: any; children: ReactNode }) {
  const { Animated } = primitives();
  return <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>;
}

// ---------------------------------------------------------------------------
// Sheet

export interface SheetProps {
  /** Controlled visibility. Omit and the sheet keeps its own. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** Tapping the scrim dismisses. */
  dismissOnBackdropPress?: boolean;
  /** The drag handle at the top of the panel. */
  showHandle?: boolean;
  /**
   * Resting heights the sheet can settle at, smallest first. A number is
   * points; a fraction below 1 is a share of the window height. With one
   * point the sheet opens there; with several it can be dragged between them.
   * Omitted, the sheet uses its own natural height.
   */
  snapPoints?: number[];
  /** Which snap point to open at. Defaults to the first. */
  initialSnapIndex?: number;
  /** Controlled snap point. Omit and the sheet tracks its own. */
  snapIndex?: number;
  onSnapIndexChange?: (index: number) => void;
  /** Dragging below the lowest point dismisses instead of springing back. */
  dismissOnSnapToBottom?: boolean;
  /** Turns the drag gesture off, leaving press-and-back dismissal only. */
  draggable?: boolean;
  /** Opt out of the selection tick on snap changes. */
  haptics?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A bottom sheet.
 *
 * The general-purpose container: it slides up on the springs token, dismisses
 * on a scrim press and on Android back. ActionSheet remains the action-menu
 * specialisation of this shape; Sheet is for arbitrary content — a form, a
 * calendar, a detail panel.
 */
/**
 * Turns a snap point into a pixel height.
 *
 * A number under 1 is a fraction of the window; anything else is points. The
 * result is clamped so a sheet can never be taller than the space it has.
 */
export function resolveSnapPoint(point: number, windowHeight: number): number {
  const height = point > 0 && point < 1 ? point * windowHeight : point;
  return Math.max(0, Math.min(height, windowHeight));
}

/**
 * Picks the snap point nearest to where the user let go.
 *
 * `height` is how tall the sheet currently is. Ties go to the smaller sheet,
 * so a small flick does not jump the panel to full height.
 */
export function nearestSnapPoint(heights: number[], height: number): number {
  let best = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  heights.forEach((candidate, index) => {
    const distance = Math.abs(candidate - height);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = index;
    }
  });
  return best;
}

export const Sheet = forwardRef<any, SheetProps>(function Sheet(
  {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    title,
    children,
    footer,
    dismissOnBackdropPress = true,
    showHandle = true,
    snapPoints,
    initialSnapIndex = 0,
    snapIndex: snapIndexProp,
    onSnapIndexChange,
    dismissOnSnapToBottom = false,
    draggable = true,
    haptics = true,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable, Modal, PanResponder, useWindowDimensions } = primitives();

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const dismiss = useCallback(() => setOpen(false), [setOpen]);
  useBackDismiss(open, dismiss);

  // Snap points in pixels, smallest first so index 0 is the shortest sheet.
  const windowHeight = useWindowDimensions?.().height ?? 800;
  const heights = useMemo(() => {
    if (!snapPoints || snapPoints.length === 0) return [];
    return snapPoints.map((point) => resolveSnapPoint(point, windowHeight)).sort((a, b) => a - b);
  }, [snapPoints, windowHeight]);

  const [internalSnap, setInternalSnap] = useState(initialSnapIndex);
  const snapIndex = snapIndexProp !== undefined ? snapIndexProp : internalSnap;
  const activeHeight = heights.length > 0 ? heights[Math.min(snapIndex, heights.length - 1)]! : null;

  // Drag offset in pixels: 0 is resting at the active snap point, positive is
  // dragged down. It resets to 0 after a release, because the settle either
  // changes the snap index or dismisses.
  const dragRef = useRef(0);
  const [drag, setDrag] = useState(0);

  const { value: rise, animated } = useSpring(open ? 1 : 0, "gentle");
  const slideIn = animated ? rise.interpolate({ inputRange: [0, 1], outputRange: [420, 0] }) : 0;

  const heightsRef = useRef(heights);
  heightsRef.current = heights;
  const activeHeightRef = useRef(activeHeight);
  activeHeightRef.current = activeHeight;
  const snapIndexRef = useRef(snapIndex);
  snapIndexRef.current = snapIndex;

  const goToSnap = useCallback(
    (index: number) => {
      if (snapIndexProp === undefined) setInternalSnap(index);
      onSnapIndexChange?.(index);
      if (haptics) hapticSelection();
    },
    [snapIndexProp, onSnapIndexChange, haptics],
  );

  /**
   * The release decision.
   *
   * Below the lowest snap point the sheet dismisses when allowed, otherwise it
   * snaps back; anywhere else it settles at the nearest point, with a fast
   * downward flick counting as a step towards the smaller sheet.
   */
  const release = useCallback(
    (dy: number, vy: number) => {
      const list = heightsRef.current;
      const current = list[snapIndexRef.current] ?? activeHeightRef.current ?? 0;
      const restingAfterDrag = current - dy;

      if (list.length === 0) {
        // No snap points: a decisive downward drag dismisses.
        if (dy > 120 || vy > 0.8) dismiss();
        return;
      }

      const lowest = list[0]!;
      const belowLowest = restingAfterDrag < lowest - 40;
      if (belowLowest && dismissOnSnapToBottom) {
        dismiss();
        return;
      }

      // A fast flick moves one step in its direction before distance decides.
      let index = nearestSnapPoint(list, restingAfterDrag);
      if (vy > 0.5) index = Math.max(0, Math.min(index, snapIndexRef.current - 1));
      if (vy < -0.5) index = Math.max(index, Math.min(snapIndexRef.current + 1, list.length - 1));

      if (index !== snapIndexRef.current) goToSnap(index);
    },
    [dismiss, dismissOnSnapToBottom, goToSnap],
  );

  const panResponder = useMemo(() => {
    if (!draggable || !PanResponder?.create) return null;
    return PanResponder.create({
      // Vertical drags belong to the sheet; horizontal ones are left alone.
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_event: any, gesture: any) =>
        Math.abs(gesture.dy) > Math.abs(gesture.dx) && Math.abs(gesture.dy) > 6,
      onPanResponderGrant: () => {
        dragRef.current = 0;
      },
      onPanResponderMove: (_event: any, gesture: any) => {
        // Dragging up past the tallest point has nowhere to go; clamp at 0.
        const next = Math.max(-40, gesture.dy);
        dragRef.current = next;
        setDrag(next);
      },
      onPanResponderRelease: (_event: any, gesture: any) => {
        release(gesture.dy, gesture.vy);
        dragRef.current = 0;
        setDrag(0);
      },
      onPanResponderTerminate: () => {
        dragRef.current = 0;
        setDrag(0);
      },
      onPanResponderTerminationRequest: () => false,
    });
  }, [draggable, PanResponder, release]);

  // Reduce Motion is honoured by useSpring: when it is on, `animated` is false
  // and the panel is already in position, so the sheet opens and snaps without
  // a transition.
  const translateY = drag !== 0 ? drag : animated ? slideIn : 0;

  const panel = (
    <SheetPanel
      title={title}
      footer={footer}
      showHandle={showHandle}
      isDark={isDark}
      testID={testID}
      style={style}
      height={activeHeight}
    >
      {children}
    </SheetPanel>
  );

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={dismiss}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close sheet"
        onPress={dismissOnBackdropPress ? dismiss : undefined}
        style={{ flex: 1, justifyContent: "flex-end", backgroundColor: theme.scrim }}
      >
        <Pressable
          accessibilityRole="none"
          onPress={() => {}}
          style={{ width: "100%" }}
          {...(panResponder ? panResponder.panHandlers : {})}
        >
          {animated || drag !== 0 ? (
            <SheetRise translateY={translateY}>{panel}</SheetRise>
          ) : (
            panel
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
});

function SheetRise({ translateY, children }: { translateY: any; children: ReactNode }) {
  const { Animated } = primitives();
  return <Animated.View style={{ transform: [{ translateY }] }}>{children}</Animated.View>;
}

/** The panel itself: a glass surface with a handle, a title and a footer. */
function SheetPanel({
  title,
  footer,
  showHandle,
  isDark,
  testID,
  style,
  height,
  children,
}: {
  title?: string;
  footer?: ReactNode;
  showHandle: boolean;
  isDark: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
  /** The snap point's height, or null for the panel's natural height. */
  height?: number | null;
  children?: ReactNode;
}) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText } = primitives();

  return (
    <Glass
      effect="regular"
      isDark={isDark}
      testID={testID}
      style={{
        borderTopLeftRadius: radii.xl,
        borderTopRightRadius: radii.xl,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        paddingBottom: 20,
        // A snap point fixes the height; without one the panel is natural.
        ...(height != null ? { height } : { maxHeight: 560 }),
        ...(style as ViewStyle),
      }}
    >
      {showHandle ? (
        <View style={{ alignItems: "center", paddingTop: 8, paddingBottom: 4 }}>
          <View
            accessibilityElementsHidden
            // A capsule: the radius is half the handle's own height.
            style={{ width: 36, height: 5, borderRadius: 5 / 2, backgroundColor: theme.separator }}
          />
        </View>
      ) : null}
      {title ? (
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <RNText accessibilityRole="heading" style={{ fontSize: 17, fontWeight: "600", color: theme.foreground }}>
            {title}
          </RNText>
        </View>
      ) : null}
      <View style={{ paddingHorizontal: 20 }}>{children}</View>
      {footer ? <View style={{ paddingHorizontal: 20, paddingTop: 12, gap: 8 }}>{footer}</View> : null}
    </Glass>
  );
}

// ---------------------------------------------------------------------------
// Drawer

export interface DrawerProps {
  /** Controlled visibility. Omit and the drawer keeps its own. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The edge the panel slides in from. */
  side?: "left" | "right";
  /** Panel width. */
  width?: number;
  children?: ReactNode;
  /** Tapping the scrim dismisses. */
  dismissOnBackdropPress?: boolean;
  /** Turns the drag-to-close gesture off. */
  draggable?: boolean;
  /** Opt out of the selection tick when the drawer is thrown closed. */
  haptics?: boolean;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A side navigation drawer.
 *
 * The same overlay discipline as Sheet — scrim, spring slide, Android back —
 * but anchored to a side edge, with a square panel that runs the full height.
 * The caller supplies the content, typically a List.
 *
 * Dragging the panel towards its own edge follows the finger; releasing past
 * the halfway point, or with enough outward velocity, closes it, and a drag
 * that stays inside springs it back open. Reduce Motion is honoured: with it
 * on, the drawer appears and disappears without sliding.
 */
export const Drawer = forwardRef<any, DrawerProps>(function Drawer(
  {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    side = "left",
    width = 280,
    children,
    dismissOnBackdropPress = true,
    draggable = true,
    haptics = true,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Modal, PanResponder } = primitives();

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange],
  );

  const dismiss = useCallback(() => setOpen(false), [setOpen]);
  useBackDismiss(open, dismiss);

  const { value: slide, animated } = useSpring(open ? 1 : 0, "gentle");
  // Slide in from off-screen: negative from the left, positive from the right.
  const slideIn = animated
    ? slide.interpolate({ inputRange: [0, 1], outputRange: [side === "left" ? -width : width, 0] })
    : 0;

  // The drag is measured in the drawer's own closing direction, so a drag
  // towards the anchored edge is always positive whichever side it is on.
  const [drag, setDrag] = useState(0);

  const panResponder = useMemo(() => {
    if (!draggable || !PanResponder?.create) return null;
    const outward = side === "left" ? -1 : 1;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_event: any, gesture: any) =>
        // Only a horizontal drag towards the edge is ours; the other way has
        // nowhere to go and should not fight content inside the panel.
        Math.abs(gesture.dx) > Math.abs(gesture.dy) && gesture.dx * outward > 6,
      onPanResponderMove: (_event: any, gesture: any) => {
        setDrag(Math.max(0, gesture.dx * outward));
      },
      onPanResponderRelease: (_event: any, gesture: any) => {
        const travelled = Math.max(0, gesture.dx * outward);
        const thrown = gesture.vx * outward > 0.4;
        setDrag(0);
        if (travelled > width / 2 || thrown) {
          if (haptics) hapticSelection();
          dismiss();
        }
      },
      onPanResponderTerminate: () => setDrag(0),
      onPanResponderTerminationRequest: () => false,
    });
    // `dismiss` is stable; the gesture only needs rebuilding when its shape
    // (side or width) changes.
  }, [draggable, PanResponder, side, width, haptics, dismiss]);

  const translateX = drag !== 0 ? (side === "left" ? -drag : drag) : animated ? slideIn : 0;

  const panel = (
    <Glass
      effect="regular"
      isDark={isDark}
      testID={testID}
      style={{
        width,
        height: "100%",
        borderRadius: 0,
        paddingTop: 56,
        ...(style as ViewStyle),
      }}
    >
      {children}
    </Glass>
  );

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={dismiss}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close drawer"
        onPress={dismissOnBackdropPress ? dismiss : undefined}
        style={{ flex: 1, backgroundColor: theme.scrim }}
      >
        <View
          style={{
            flex: 1,
            alignItems: side === "left" ? "flex-start" : "flex-end",
          }}
        >
          <Pressable
            accessibilityRole="none"
            onPress={() => {}}
            style={{ height: "100%" }}
            {...(panResponder ? panResponder.panHandlers : {})}
          >
            {animated || drag !== 0 ? <DrawerSlide translateX={translateX}>{panel}</DrawerSlide> : panel}
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
});

function DrawerSlide({ translateX, children }: { translateX: any; children: ReactNode }) {
  const { Animated } = primitives();
  return <Animated.View style={{ height: "100%", transform: [{ translateX }] }}>{children}</Animated.View>;
}
