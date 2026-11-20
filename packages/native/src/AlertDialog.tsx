// Wave 2 — AlertDialog.
//
// The donor's deliberate modal: it is announced as an alert dialog, it does not
// dismiss on a backdrop press, and it always offers a cancel path. Dressed with
// the family's glass, buttons and destructive tone.

import { useState, type ReactNode } from "react";

import { Button } from "./Button";
import { Glass } from "./Glass";
import { colors, radii, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { useBackDismiss } from "./internal/overlay";

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  /** Extra content between the description and the actions. */
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  isDark?: boolean;
  testID?: string;
}

export function AlertDialog({
  open: openProp,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
  isDark: isDarkProp,
  testID,
}: AlertDialogProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Pressable, Text: RNText, Modal } = primitives();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp !== undefined ? openProp : internalOpen;

  const close = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  useBackDismiss(open, () => {
    onCancel?.();
    close(false);
  });

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={() => close(false)}>
      <View style={{ flex: 1, backgroundColor: theme.scrim }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          // Deliberately inert: an alert dialog is a decision, not a dismissible
          // surface. The backdrop exists only to block what is behind it.
          onPress={undefined}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View style={{ flex: 1, justifyContent: "center", padding: 24 }} pointerEvents="box-none">
          <Pressable accessibilityRole="none" onPress={() => {}}>
          <Glass
            effect="regular"
            surface="overlay"
            isDark={isDark}
            testID={testID}
            accessibilityViewIsModal
            style={{
              borderRadius: radii.lg,
              backgroundColor: theme.surface,
              padding: 20,
              gap: 10,
            }}
          >
            <RNText accessibilityRole="heading" as any style={{ ...typeScale.heading, color: theme.foreground }}>
              {title}
            </RNText>
            {description ? (
              <RNText style={{ ...typeScale.body, color: theme.muted }}>{description}</RNText>
            ) : null}
            {children ? <View>{children}</View> : null}
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
              <Button
                accessibilityLabel={cancelLabel}
                variant="ghost"
                onPress={() => {
                  onCancel?.();
                  close(false);
                }}
              >
                {cancelLabel}
              </Button>
              <Button
                accessibilityLabel={confirmLabel}
                variant="filled"
                tint={destructive ? theme.destructive : theme.fill}
                onPress={() => {
                  onConfirm?.();
                  close(false);
                }}
              >
                {confirmLabel}
              </Button>
            </View>
            </Glass>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
