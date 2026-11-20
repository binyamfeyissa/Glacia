import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { Glass } from "./Glass";
import { Button } from "./Button";

export interface ActionSheetOption {
  label: string;
  /** Tints the row destructive, for delete actions. */
  destructive?: boolean;
  onPress?: () => void;
}

export interface ActionSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  message?: string;
  options: ActionSheetOption[];
  cancelLabel?: string;
  isDark?: boolean;
  /** Passed through to the sheet so it is testable. */
  testID?: string;
}

/**
 * A list of choices attached to the bottom of the screen.
 *
 * Anchored to the bottom because that is where a thumb reaches, and it keeps a
 * separate Cancel row so a mis-tap is always reversible.
 */
export function ActionSheet({
  open: controlledOpen,
  onOpenChange,
  title,
  message,
  options,
  cancelLabel = "Cancel",
  isDark: isDarkProp,
  testID,
}: ActionSheetProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  // Android's back button is handled by Modal's onRequestClose, so no
  // BackHandler subscription is needed here.
  const { View, Text, Pressable, Modal } = primitives();
  const [uncontrolled, setUncontrolled] = useState(false);
  const open = controlledOpen ?? uncontrolled;

  const close = () => {
    if (controlledOpen === undefined) setUncontrolled(false);
    onOpenChange?.(false);
  };

  return (
    <Modal
      visible={open}
      transparent
      animationType="slide"
      onRequestClose={close}
      testID={testID}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss actions"
        onPress={close}
        style={{ flex: 1, justifyContent: "flex-end", backgroundColor: theme.scrim }}
      >
        <Pressable
          accessibilityRole="none"
          onPress={() => {}}
          style={{ padding: 10, gap: 8 }}
        >
          {/* The web's ActionSheet is not one panel: it is a stack of separate
              glass pills. That shape is the single most visible difference in
              the owner's screenshots, so each row gets its own surface. */}
          {(title || message) && (
            <Glass
              effect="regular"
              surface="overlay"
              isDark={isDark}
              style={{ borderRadius: radii.lg }}
            >
              <View style={{ paddingVertical: 12, paddingHorizontal: 16, alignItems: "center" }}>
                {title && (
                  <Text style={{ fontSize: 13, fontWeight: "600", color: theme.foreground }}>
                    {title}
                  </Text>
                )}
                {message && (
                  <Text style={{ fontSize: 12, color: theme.muted, marginTop: 4, textAlign: "center" }}>
                    {message}
                  </Text>
                )}
              </View>
            </Glass>
          )}

          {options.map((option) => (
            <Glass
              key={option.label}
              effect="regular"
              surface="overlay"
              isDark={isDark}
              style={{ borderRadius: radii.pill }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={option.label}
                onPress={() => {
                  option.onPress?.();
                  close();
                }}
                style={{ minHeight: 44, paddingVertical: 12, paddingHorizontal: 20, alignItems: "center", justifyContent: "center" }}
              >
                <Text
                  style={{
                    fontSize: 17,
                    // The web's iOS-style action sheet: every row is the tint
                    // colour, and only a destructive one is red.
                    color: option.destructive ? theme.destructive : theme.fill,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            </Glass>
          ))}

          <Glass effect="regular" surface="overlay" isDark={isDark} style={{ borderRadius: radii.pill }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
              onPress={close}
              style={{ minHeight: 44, paddingVertical: 12, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ fontSize: 17, fontWeight: "600", color: theme.foreground }}>
                {cancelLabel}
              </Text>
            </Pressable>
          </Glass>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
