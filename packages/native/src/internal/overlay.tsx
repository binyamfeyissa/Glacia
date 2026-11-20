// The invisible behaviour every Wave 2 component shares.
//
// These are the donor's contracts, implemented on React Native's own
// primitives: a component can be controlled or keep its own state, overlays
// dismiss on Android's back gesture and on an outside press, and every control
// exposes the accessibility role the donor gives it (checkbox, radio, tab,
// dialog, menu). Nothing here styles anything — the Apple dress lives in the
// component files.

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "../Glass";
import { colors, radii } from "./tokens";
import { primitives } from "./primitives";
import { useIsDark } from "./motion";

/**
 * Controlled-or-uncontrolled state. The donor's model: a `value` prop makes the
 * component controlled, `defaultValue` seeds it, and `onChange` is called either
 * way. Kept in one place so every component behaves identically.
 */
export function useControllable<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): [T, (next: T) => void] {
  const [internal, setInternal] = useState(defaultValue);
  const current = value !== undefined ? value : internal;
  const set = useCallback(
    (next: T) => {
      if (value === undefined) setInternal(next);
      onChange?.(next);
    },
    [value, onChange],
  );
  return [current, set];
}

/**
 * Registers Android's hardware back while an overlay is open, so back closes the
 * layer and not the screen behind it.
 */
export function useBackDismiss(open: boolean, dismiss: () => void) {
  useEffect(() => {
    if (!open) return;
    const BackHandler = primitives().getBackHandler();
    if (!BackHandler?.addEventListener) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      dismiss();
      return true;
    });
    return () => sub?.remove?.();
  }, [open, dismiss]);
}

export interface AnchorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Reads a view's rectangle in window coordinates, when the runtime can. */
export function measureAnchor(node: any): Promise<AnchorRect | null> {
  return new Promise((resolve) => {
    if (!node || typeof node.measureInWindow !== "function") {
      resolve(null);
      return;
    }
    try {
      node.measureInWindow((x: number, y: number, width: number, height: number) => {
        resolve({ x, y, width, height });
      });
    } catch {
      resolve(null);
    }
  });
}

/**
 * Places a panel beside its trigger. Flips above when there is no room below,
 * and clamps to the viewport otherwise — the donor's collision handling, kept
 * deliberately small.
 */
export function placePanel(
  trigger: AnchorRect,
  panel: { width: number; height: number },
  viewport: { width: number; height: number },
  gap = 6,
): { left: number; top: number; flipped: boolean } {
  const below = trigger.y + trigger.height + gap;
  const above = trigger.y - panel.height - gap;
  const fitsBelow = below + panel.height <= viewport.height;
  const flipped = !fitsBelow && above >= 0;
  const top = Math.max(8, Math.min(flipped ? above : below, viewport.height - panel.height - 8));
  const left = Math.max(8, Math.min(trigger.x, viewport.width - panel.width - 8));
  return { left, top, flipped };
}

/**
 * A full-screen modal layer with a dimmed backdrop and a glass panel. Used by
 * Dialog, Alert, AlertDialog, Popover, DropdownMenu, ContextMenu, Select and
 * Tooltip, so dismissal, back handling and the surface are one implementation.
 */
export function OverlayPanel({
  open,
  onClose,
  dismissOnBackdropPress = true,
  anchor,
  width,
  panelStyle,
  children,
  testID,
  isDark: isDarkProp,
  accessibilityLabel,
  role = "menu",
}: {
  open: boolean;
  onClose: () => void;
  dismissOnBackdropPress?: boolean;
  anchor?: AnchorRect | null;
  width?: number;
  panelStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  testID?: string;
  isDark?: boolean;
  accessibilityLabel?: string;
  role?: string;
}) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Modal, useWindowDimensions } = primitives();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  useBackDismiss(open, onClose);

  if (!open) return null;

  const placed = anchor ? placePanel(anchor, { width: width ?? 240, height: 0 }, { width: screenWidth, height: screenHeight }) : null;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: theme.scrim }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={dismissOnBackdropPress ? "Close" : undefined}
          onPress={dismissOnBackdropPress ? onClose : undefined}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View
          pointerEvents="box-none"
          style={placed ? { position: "absolute", left: placed.left, top: placed.top } : { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}
        >
          <Pressable accessibilityRole="none" onPress={() => {}}>
            <Glass
              effect="regular"
              surface="overlay"
              isDark={isDark}
              testID={testID}
              accessibilityLabel={accessibilityLabel}
              accessibilityRole={role as any}
              style={[
                {
                  width: placed ? width ?? 240 : undefined,
                  maxWidth: screenWidth - 32,
                  borderRadius: radii.lg,
                  backgroundColor: theme.surface,
                  paddingVertical: 6,
                },
                panelStyle,
              ]}
            >
              {children}
            </Glass>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

/** One row inside an overlay panel — the donor's menu/option item. */
export function PanelItem({
  label,
  onPress,
  icon,
  destructive = false,
  selected = false,
  disabled = false,
  role = "button",
  style,
  testID,
  isDark: isDarkProp,
}: {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  destructive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  role?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  isDark?: boolean;
}) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText } = primitives();
  return (
    <Pressable
      testID={testID}
      accessibilityRole={role as any}
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected }}
      disabled={disabled}
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          minHeight: 40,
          paddingHorizontal: 14,
          paddingVertical: 8,
          opacity: disabled ? 0.38 : 1,
        },
        style,
      ]}
    >
      {icon ? <View>{icon}</View> : null}
      <RNText
        numberOfLines={1}
        style={{
          flex: 1,
          fontSize: 15,
          color: destructive ? theme.destructive : theme.foreground,
          fontWeight: selected ? "600" : "400",
        }}
      >
        {label}
      </RNText>
      {selected ? <RNText style={{ fontSize: 15, color: theme.fill }}>✓</RNText> : null}
    </Pressable>
  );
}

/** A positioned trigger that reports its window rectangle when it is pressed. */
export function useTriggerAnchor() {
  const ref = useRef<any>(null);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const capture = useCallback(async () => {
    const rect = await measureAnchor(ref.current);
    if (rect) setAnchor(rect);
    return rect;
  }, []);
  return { ref, anchor, capture };
}
