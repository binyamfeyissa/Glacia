import {
  forwardRef,
  useCallback,
  useState,
} from "react";
import {
  Dialog as DialogPrimitive,
} from "radix-ui";
import { cx } from "./internal/cx";

export interface ActionSheetItem {
  /** Label shown to the user. */
  label: string;
  /** Called when tapped. */
  onPress: () => void;
  /** A destructive action reads red. */
  destructive?: boolean;
  /** Disabled items are greyed out. */
  disabled?: boolean;
}

export interface ActionSheetProps {
  /** The items shown. Destructive items appear before the cancel button. */
  items: ActionSheetItem[];
  /** Label for the cancel button. */
  cancelLabel?: string;
  /** Called when the user dismisses the sheet. */
  onOpenChange?: (open: boolean) => void;
  /** Whether the sheet is open. */
  open?: boolean;
  /** The trigger that opens the sheet. */
  children?: React.ReactNode;
}

/**
 * An iOS-style action sheet — slides up from the bottom with a list of
 * options and a Cancel button, in Liquid Glass.
 */
export function ActionSheet({
  items,
  cancelLabel = "Cancel",
  onOpenChange,
  open: openProp,
  children,
}: ActionSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const handlePress = useCallback(
    (item: ActionSheetItem) => {
      if (!item.disabled) {
        setOpen(false);
        // Wait for the sheet to start closing, then fire.
        setTimeout(() => item.onPress(), 100);
      }
    },
    [setOpen],
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {children && (
        <DialogPrimitive.Trigger asChild>
          {children}
        </DialogPrimitive.Trigger>
      )}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="gl-action-sheet-overlay"
          onClick={() => setOpen(false)}
        />
        <DialogPrimitive.Content
          className="gl-action-sheet-content"
          onEscapeKeyDown={() => setOpen(false)}
        >
          <div role="menu" className="gl-action-sheet-menu">
            {items.map((item, i) => (
              <button
                key={i}
                role="menuitem"
                type="button"
                className={cx(
                  "gl-action-sheet-item gl-glass",
                  item.destructive && "gl-action-sheet-item-destructive",
                )}
                disabled={item.disabled}
                onClick={() => handlePress(item)}
              >
                <span className="gl-action-sheet-label">{item.label}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="gl-action-sheet-cancel gl-glass"
            onClick={() => setOpen(false)}
          >
            {cancelLabel}
          </button>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}