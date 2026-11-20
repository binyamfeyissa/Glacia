// Wave 2 — DropdownMenu.
//
// The donor's menu button: a trigger that opens a menu of actions, closes on
// selection, on an outside press, and on Android's back gesture; the menu is a
// `menu` with `menuitem` rows. Dressed on the family's overlay surface, with the
// destructive tone the library already uses.

import { useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { OverlayPanel, PanelItem, useTriggerAnchor } from "./internal/overlay";

export interface DropdownMenuItem {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  accessibilityLabel?: string;
}

export interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  width?: number;
  accessibilityLabel?: string;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function DropdownMenu({
  trigger,
  items,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  width = 220,
  accessibilityLabel = "Menu",
  isDark: isDarkProp,
  style,
  testID,
}: DropdownMenuProps) {
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
