import { forwardRef, useCallback, useEffect, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { Text } from "./Text";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark, useSpring } from "./internal/motion";

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

  // 0 is fully dismissed, 1 fully presented; the panel rides up this value.
  const { value: rise, animated } = useSpring(open ? 1 : 0, "gentle");
  const translateY = animated ? rise.interpolate({ inputRange: [0, 1], outputRange: [420, 0] }) : 0;

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={dismiss}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close sheet"
        onPress={dismissOnBackdropPress ? dismiss : undefined}
        style={{ flex: 1, justifyContent: "flex-end", backgroundColor: theme.scrim }}
      >
        <Pressable accessibilityRole="none" onPress={() => {}} style={{ width: "100%" }}>
          {animated ? (
            <SheetRise translateY={translateY}>
              <SheetPanel
                title={title}
                footer={footer}
                showHandle={showHandle}
                isDark={isDark}
                testID={testID}
                style={style}
              >
                {children}
              </SheetPanel>
            </SheetRise>
          ) : (
            <SheetPanel
              title={title}
              footer={footer}
              showHandle={showHandle}
              isDark={isDark}
              testID={testID}
              style={style}
            >
              {children}
            </SheetPanel>
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
  children,
}: {
  title?: string;
  footer?: ReactNode;
  showHandle: boolean;
  isDark: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
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
        maxHeight: 560,
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
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Modal } = primitives();

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
  const translateX = animated
    ? slide.interpolate({ inputRange: [0, 1], outputRange: [side === "left" ? -width : width, 0] })
    : 0;

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
          <Pressable accessibilityRole="none" onPress={() => {}} style={{ height: "100%" }}>
            {animated ? <DrawerSlide translateX={translateX}>{panel}</DrawerSlide> : panel}
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
