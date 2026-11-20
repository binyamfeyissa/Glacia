// Wave 2 — Dialog.
//
// Behaviour from the donor: a modal layer that closes on the backdrop unless
// told not to, on Android's back gesture, and announces itself as a modal
// dialog with a heading. The dress is the Wave 1 family — the same glass
// surface, radius, type steps and spring entrance as the sheet.

import { useState, type ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Button } from "./Button";
import { Glass } from "./Glass";
import { colors, radii, typeScale } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";
import { useBackDismiss } from "./internal/overlay";

export interface DialogProps {
  /** Controlled open state. Omit and the dialog keeps its own. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  /** Default true. Set false for a decision that must be answered. */
  dismissOnBackdropPress?: boolean;
  isDark?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Dialog({
  open: openProp,
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
  const { View, Pressable, Text: RNText, Modal } = primitives();

  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp !== undefined ? openProp : internalOpen;

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };
  const dismiss = () => setOpen(false);
  useBackDismiss(open, dismiss);

  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={dismiss}>
      <View style={{ flex: 1, backgroundColor: theme.scrim }}>
        {/* The backdrop is a sibling of the panel, not its ancestor: a press
            target wrapped around buttons would nest one button inside another. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close dialog"
          accessibilityState={{ disabled: !dismissOnBackdropPress }}
          onPress={dismissOnBackdropPress ? dismiss : undefined}
          style={StyleSheetAbsoluteFill}
        />
        <View style={{ flex: 1, justifyContent: "center", padding: 24 }} pointerEvents="box-none">
          <Pressable accessibilityRole="none" onPress={() => {}}>
          <Glass
            effect="regular"
            surface="overlay"
            isDark={isDark}
            testID={testID}
            accessibilityViewIsModal
            style={[
              {
                borderRadius: radii.lg,
                backgroundColor: theme.surface,
                padding: 20,
                gap: 10,
                alignSelf: "stretch",
              },
              style,
            ]}
          >
            {title ? (
              <RNText accessibilityRole="heading" as any style={{ ...typeScale.heading, color: theme.foreground }}>
                {title}
              </RNText>
            ) : null}
            {description ? (
              <RNText style={{ ...typeScale.body, color: theme.muted }}>{description}</RNText>
            ) : null}
            {children ? <View style={{ gap: 10 }}>{children}</View> : null}
            {footer ? (
              <View style={{ gap: 8, marginTop: 4 }}>{footer}</View>
            ) : (
              <View style={{ alignSelf: "flex-end", marginTop: 4 }}>
                <Button accessibilityLabel="Close" variant="filled" onPress={dismiss}>
                  Close
                </Button>
              </View>
            )}
            </Glass>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const StyleSheetAbsoluteFill = {
  position: "absolute" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export interface DialogTriggerProps extends Omit<DialogProps, "open" | "onOpenChange"> {
  /** The trigger's accessible name. */
  label: string;
  children?: ReactNode;
}

/** A button that owns a dialog's open state, the donor's `Dialog.Trigger`. */
export function DialogTrigger({ label, children, ...dialog }: DialogTriggerProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button accessibilityLabel={label} onPress={() => setOpen(true)}>
        {children ?? label}
      </Button>
      <Dialog {...dialog} open={open} onOpenChange={setOpen} />
    </>
  );
}
