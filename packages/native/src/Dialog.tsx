import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { Glass } from "./Glass";
import { Button } from "./Button";

export interface DialogProps {
  /** Controlled visibility. Omit it and the dialog keeps its own state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** Tapping the backdrop dismisses. Off for destructive confirmations. */
  dismissOnBackdropPress?: boolean;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  /** Passed through to the dialog panel so it is testable. */
  testID?: string;
}

/**
 * A centred modal panel above a dimmed backdrop.
 *
 * The panel is a glass surface, so it is Apple's real Liquid Glass on iOS 26+
 * and Glacia's translucent tint elsewhere; the text sits on it with the
 * theme's foreground colour, so contrast holds either way.
 *
 * React Native has no built-in focus trap, so this component covers what the
 * platform can actually do: `Modal` blocks touches behind it, Android's back
 * button routes to `onOpenChange(false)`, and the heading is marked as such so
 * screen readers announce the dialog as it appears.
 *
 * To open a dialog from a button, use `DialogTrigger`.
 */
export function Dialog({
  open: controlledOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  dismissOnBackdropPress = true,
  isDark: isDarkProp,
  style,
  testID,
}: DialogProps) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable, Modal, getBackHandler } = primitives();

  const [uncontrolled, setUncontrolled] = useState(false);
  const open = controlledOpen ?? uncontrolled;

  const setOpen = useCallback(
    (next: boolean) => {
      if (controlledOpen === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange],
  );

  // Android's hardware back must close the dialog, not the screen behind it.
  useEffect(() => {
    if (!open) return;
    const BackHandler = getBackHandler();
    if (!BackHandler) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      setOpen(false);
      return true;
    });
    return () => sub.remove();
  }, [open, setOpen, getBackHandler]);

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close dialog"
        onPress={dismissOnBackdropPress ? () => setOpen(false) : undefined}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          backgroundColor: "rgba(0, 0, 0, 0.45)",
        }}
      >
        {/* Stops a press inside the panel from reaching the backdrop. */}
        <Pressable
          accessibilityRole="none"
          onPress={() => {}}
          style={{ width: "100%", maxWidth: 380 }}
        >
          <Glass
            effect="regular"
            surface="overlay"
            isDark={isDark}
            testID={testID}
            style={{
              borderRadius: radii.xl,
              padding: 20,
              gap: 8,
              // The web overlay shadow: the panel has to float above the scrim.
              shadowOpacity: 0.12,
              shadowRadius: 50,
              shadowOffset: { width: 0, height: 20 },
              ...(style as ViewStyle),
            }}
          >
            {title && (
              <Text
                accessibilityRole="heading"
                style={{ fontSize: 17, fontWeight: "600", color: theme.foreground }}
              >
                {title}
              </Text>
            )}

            {description && (
              <Text style={{ fontSize: 14, color: theme.muted, lineHeight: 20 }}>{description}</Text>
            )}

            {children}

            {footer && <View style={{ marginTop: 12, gap: 8 }}>{footer}</View>}
          </Glass>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/** Opens the dialog without the caller tracking state. */
export function DialogTrigger({
  label,
  children,
  ...dialogProps
}: Omit<DialogProps, "open" | "onOpenChange"> & { label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button accessibilityLabel={label} onPress={() => setOpen(true)}>
        {label}
      </Button>
      <Dialog {...dialogProps} open={open} onOpenChange={setOpen} />
    </>
  );
}

export interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  /** Label for the confirming action. */
  confirmLabel?: string;
  cancelLabel?: string;
  /** Tints the confirm button destructive. */
  destructive?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  isDark?: boolean;
  /** Passed through to the dialog panel so it is testable. */
  testID?: string;
}

/**
 * A dialog that asks for confirmation.
 *
 * Deliberately not dismissible by tapping the backdrop: a destructive question
 * should require a real answer, so the only ways out are the two buttons or the
 * Android back button, which counts as cancel.
 */
export function AlertDialog({
  open: controlledOpen,
  onOpenChange,
  title,
  description,
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
  const { View } = primitives();
  const [uncontrolled, setUncontrolled] = useState(false);
  const open = controlledOpen ?? uncontrolled;

  const close = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  const cancel = () => {
    onCancel?.();
    close(false);
  };

  return (
    <Dialog
      open={open}
      testID={testID}
      // Android's back button routes here as a dismissal, and a dismissal of a
      // confirmation question is a cancellation, so onCancel fires too.
      onOpenChange={(next) => {
        if (!next) {
          cancel();
          return;
        }
        close(true);
      }}
      title={title}
      description={description}
      dismissOnBackdropPress={false}
      isDark={isDark}
      footer={
        <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
          <Button accessibilityLabel={cancelLabel} variant="ghost" onPress={cancel}>
            {cancelLabel}
          </Button>
          <Button
            accessibilityLabel={confirmLabel}
            variant="filled"
            tint={destructive ? theme.destructive : undefined}
            onPress={() => {
              onConfirm?.();
              close(false);
            }}
          >
            {confirmLabel}
          </Button>
        </View>
      }
    />
  );
}

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
        style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" }}
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
