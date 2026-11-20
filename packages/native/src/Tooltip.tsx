// Wave 2 — Tooltip.
//
// The donor's tooltip is supplementary: it appears on hover on web, on a long
// press on touch, never traps focus, and is dismissible without closing the app.
// Dressed as the family's smallest glass capsule.

import { useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { OverlayPanel, useTriggerAnchor } from "./internal/overlay";

export interface TooltipProps {
  /** The hint text. */
  label: string;
  /** The control the tooltip describes. */
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "bottom";
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Tooltip({
  label,
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  isDark: isDarkProp,
  style,
  testID,
}: TooltipProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText } = primitives();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const { ref, anchor, capture } = useTriggerAnchor();

  const open = openProp !== undefined ? openProp : internalOpen;
  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <View style={[{ alignSelf: "flex-start" }, style]}>
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(!open)}
        onLongPress={() => {
          void capture();
          setOpen(true);
        }}
      >
        {children}
      </Pressable>
      <OverlayPanel
        open={open}
        onClose={() => setOpen(false)}
        anchor={anchor}
        width={Math.min(260, 40 + label.length * 7)}
        isDark={isDark}
        testID={testID}
      >
        <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
          <RNText style={{ ...typeScale.caption, color: theme.foreground }}>{label}</RNText>
        </View>
      </OverlayPanel>
    </View>
  );
}
