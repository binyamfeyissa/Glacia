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
      surface="overlay"
      isDark={isDark}
      testID={testID ? `${testID}-popover` : undefined}
      style={{
        width,
        borderRadius: radii.lg,
        paddingVertical: 4,
        // The web menu is deliberately near-solid so its labels stay legible
        // over any backdrop, and it floats on a real shadow.
        backgroundColor: theme.surface,
        shadowOpacity: 0.12,
        shadowRadius: 40,
        shadowOffset: { width: 0, height: 12 },
        ...(style as ViewStyle),
      }}
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
          style={{ flexDirection: "row", alignItems: "center", gap: 10, minHeight: 40, paddingVertical: 8, paddingHorizontal: 12, opacity: item.disabled ? 0.38 : 1 }}
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
      surface="overlay"
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
