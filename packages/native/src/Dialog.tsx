import { useCallback, useEffect, useState, type ReactNode } from "react";

import { colors, radii } from "./internal/tokens";
import { primitives } from "./charts/primitives";
import { Button } from "./Button";

export interface DialogProps {
  /** Controlled visibility. Omit to use `trigger` and uncontrolled state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** Tapping the backdrop dismisses. Off for destructive confirmations. */
  dismissOnBackdropPress?: boolean;
  isDark?: boolean;
  style?: any;
}

/**
 * A centred modal surface above a dimmed backdrop.
 *
 * React Native has no built-in focus trap, so this component covers what the
 * platform can actually do: `Modal` blocks touches behind it, Android's back
 * button routes to `onOpenChange(false)`, and the heading is marked as such so
 * screen readers announce the dialog as it appears.
 */
export function Dialog({
  open: controlledOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  dismissOnBackdropPress = true,
  isDark = false,
  style,
}: DialogProps) {
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
          style={{
            width: "100%",
            maxWidth: 380,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: theme.edge,
            backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
            padding: 20,
            gap: 8,
            ...style,
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
            <Text style={{ fontSize: 13, color: theme.muted, lineHeight: 18 }}>{description}</Text>
          )}

          {children}

          {footer && <View style={{ marginTop: 12, gap: 8 }}>{footer}</View>}
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
  isDark = false,
}: AlertDialogProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View } = primitives();
  const [uncontrolled, setUncontrolled] = useState(false);
  const open = controlledOpen ?? uncontrolled;

  const close = (next: boolean) => {
    if (controlledOpen === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={close}
      title={title}
      description={description}
      dismissOnBackdropPress={false}
      isDark={isDark}
      footer={
        <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
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
  isDark = false,
}: ActionSheetProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable, Modal, getBackHandler } = primitives();
  const [uncontrolled, setUncontrolled] = useState(false);
  const open = controlledOpen ?? uncontrolled;

  const close = () => {
    if (controlledOpen === undefined) setUncontrolled(false);
    onOpenChange?.(false);
  };

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={close}>
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
          <View
            style={{
              borderRadius: radii.lg,
              overflow: "hidden",
              backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
            }}
          >
            {(title || message) && (
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
            )}

            {options.map((option, index) => (
              <Pressable
                key={option.label}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                onPress={() => {
                  option.onPress?.();
                  close();
                }}
                style={{
                  paddingVertical: 14,
                  alignItems: "center",
                  borderTopWidth: index === 0 && !title && !message ? 0 : 1,
                  borderTopColor: theme.edge,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: option.destructive ? theme.destructive : theme.foreground,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={cancelLabel}
            onPress={close}
            style={{
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: radii.lg,
              backgroundColor: isDark ? "#1c1c1e" : "#ffffff",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", color: theme.foreground }}>
              {cancelLabel}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
