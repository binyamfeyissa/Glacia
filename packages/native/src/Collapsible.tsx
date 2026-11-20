// Wave 2 — Collapsible.
//
// The donor's single disclosure: the trigger announces `expanded`, the content
// mounts only while open, and state can be controlled or internal. Nothing is
// styled like the donor — the trigger is the family's glass control.

import { useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

export interface CollapsibleProps {
  /** Controlled open state. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The control that opens the section. Rendered as given. */
  trigger: ReactNode;
  accessibilityLabel?: string;
  disabled?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

export function Collapsible({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  accessibilityLabel = "Toggle section",
  disabled = false,
  children,
  style,
  isDark: isDarkProp,
  testID,
}: CollapsibleProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText } = primitives();

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <View testID={testID} style={style}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        onPress={() => setOpen(!open)}
      >
        {trigger}
      </Pressable>
      {open ? <View style={{ paddingTop: 8 }}>{children}</View> : null}
    </View>
  );
}
