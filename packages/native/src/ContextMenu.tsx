// Wave 2 — ContextMenu.
//
// The donor's context menu: nothing opens it until a long press on the trigger,
// the panel carries a `menu` role with `menuitem` rows, and it closes on
// selection, outside press, or Android's back gesture. Dressed like the
// dropdown menu — same surface, same rows.

import { useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { OverlayPanel, PanelItem, useTriggerAnchor } from "./internal/overlay";

export interface ContextMenuItem {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  accessibilityLabel?: string;
}

export interface ContextMenuProps {
  /** The element the menu belongs to. Long-press it to open. */
  trigger: ReactNode;
  items: ContextMenuItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: number;
  accessibilityLabel?: string;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ContextMenu({
  trigger,
  items,
  open: openProp,
  onOpenChange,
  width = 220,
  accessibilityLabel = "Context menu",
  isDark: isDarkProp,
  style,
  testID,
}: ContextMenuProps) {
  const isDark = useIsDark(isDarkProp);
  const { View, Pressable } = primitives();
  const [internalOpen, setInternalOpen] = useState(false);
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
        onLongPress={() => {
          void capture();
          setOpen(true);
        }}
        delayLongPress={350}
      >
        {trigger}
      </Pressable>
      <OverlayPanel
        open={open}
        onClose={() => setOpen(false)}
        anchor={anchor}
        width={width}
        isDark={isDark}
        testID={testID ? `${testID}-menu` : undefined}
        accessibilityLabel={accessibilityLabel}
        role="menu"
        panelStyle={style}
      >
        {items.map((item, index) => (
          <PanelItem
            key={`${item.label}-${index}`}
            label={item.label}
            icon={item.icon}
            destructive={item.destructive}
            disabled={item.disabled}
            role="menuitem"
            isDark={isDark}
            onPress={() => {
              setOpen(false);
              item.onPress();
            }}
          />
        ))}
      </OverlayPanel>
    </View>
  );
}