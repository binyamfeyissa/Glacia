// Wave 2 — Popover.
//
// The donor's popover: an anchored panel with its own open state, dismissed by
// an outside press or Android's back gesture, never stealing a rendering pass
// from the screen behind it. Dressed on the family's overlay surface.

import { useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { OverlayPanel, useTriggerAnchor } from "./internal/overlay";

export interface PopoverProps {
  /** The control that opens the panel. */
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Panel width, dp. Defaults to 260. */
  width?: number;
  accessibilityLabel?: string;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Popover({
  trigger,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  width = 260,
  accessibilityLabel = "Popover",
  isDark: isDarkProp,
  style,
  testID,
}: PopoverProps) {
  const isDark = useIsDark(isDarkProp);
  const { View, Pressable } = primitives();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const { ref, anchor, capture } = useTriggerAnchor();

  const open = openProp !== undefined ? openProp : internalOpen;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <View style={{ alignSelf: "flex-start" }}>
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open }}
        onPress={() => {
          void capture();
          setOpen(!open);
        }}
      >
        {trigger}
      </Pressable>
      <OverlayPanel
        open={open}
        onClose={() => setOpen(false)}
        anchor={anchor}
        width={width}
        isDark={isDark}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        role="dialog"
        panelStyle={style}
      >
        <View style={{ padding: 14 }}>{children}</View>
      </OverlayPanel>
    </View>
  );
}
