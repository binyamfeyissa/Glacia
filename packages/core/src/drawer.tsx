import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cx } from "./internal/cx";
import { createSpring, type Spring } from "./internal/spring";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerPortal = DialogPrimitive.Portal;
export const DrawerClose = DialogPrimitive.Close;

export const DrawerOverlay = forwardRef<
  ElementRef<typeof DialogPrimitive.Overlay>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DrawerOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cx("gl-drawer-overlay", className)}
      {...props}
    />
  );
});

export interface DrawerContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /**
   * How far the sheet must be dragged down before it dismisses, as a fraction
   * of its own height. Below this it springs back, as on iOS.
   */
  dismissThreshold?: number;
  /** Turn the drag off and keep the drawer as a fixed sheet. */
  draggable?: boolean;
}

/**
 * A bottom sheet you can pull down to dismiss.
 *
 * The whole surface is the grab area, not just the handle: on iOS the gesture
 * belongs to the sheet. Dragging up is resisted rather than allowed, because
 * there is nothing above to grow into.
 */
export const DrawerContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  DrawerContentProps
>(function DrawerContent(
  { className, children, dismissThreshold = 0.25, draggable = true, ...props },
  forwardedRef,
) {
  const contentRef = useRef<ElementRef<typeof DialogPrimitive.Content>>(null);
  // Content mounts through a portal on a later commit, so a plain effect would
  // run while the node is still null. Holding the node in state re-runs the
  // drag effect as soon as the element exists.
  const [node, setNode] = useState<ElementRef<typeof DialogPrimitive.Content> | null>(null);
  const springRef = useRef<Spring | null>(null);

  // Compose the caller's ref with ours. `useImperativeHandle` would replace it
  // rather than forward to it, which silently left both refs unset.
  const setRef = useCallback(
    (next: ElementRef<typeof DialogPrimitive.Content> | null) => {
      contentRef.current = next;
      setNode(next);
      if (typeof forwardedRef === "function") forwardedRef(next);
      else if (forwardedRef) forwardedRef.current = next;
    },
    [forwardedRef],
  );

  const dismiss = useCallback(() => {
    // A real Escape reaches Radix's own dismissal path, which also restores
    // focus; unloading the node directly would strand the keyboard user.
    const event = new KeyboardEvent("keydown", {
      key: "Escape",
      bubbles: true,
      cancelable: true,
    });
    contentRef.current?.dispatchEvent(event);
  }, []);

  useEffect(() => {
    const el = node;
    if (!el || !draggable) return;

    let dragged = false;
    let pointerId = -1;
    let startY = 0;
    let offset = 0;
    let height = 0;

    const spring = createSpring(0, 520, 42, (value) => {
      el.style.transform = value === 0 ? "" : `translateY(${value}px)`;
      // The backdrop follows the sheet, so a half-dragged drawer reads as
      // leaving rather than as a floating panel.
      const overlay = el.previousElementSibling as HTMLElement | null;
      if (overlay && value > 0) {
        overlay.style.opacity = String(Math.max(0.15, 1 - value / (height || 1)));
      }
    });
    springRef.current = spring;

    const down = (event: PointerEvent) => {
      if (!event.isPrimary || event.button !== 0) return;
      // Scrolling inside the sheet wins once its content is not at the top.
      if (el.scrollTop > 0) return;
      dragged = true;
      pointerId = event.pointerId;
      startY = event.clientY;
      height = el.offsetHeight;
      spring.stop();
      el.dataset.dragging = "";
      // Not every DOM implements pointer capture (and jsdom throws on it), so
      // a missing implementation must not abort the gesture.
      try {
        el.setPointerCapture(event.pointerId);
      } catch {
        /* the drag still works without capture */
      }
    };

    const move = (event: PointerEvent) => {
      if (!dragged || event.pointerId !== pointerId) return;
      const delta = event.clientY - startY;
      // Downward follows the finger; upward is resisted, since the sheet has
      // nowhere to grow. A negative offset decays to a wobble, not a lift.
      offset = delta >= 0 ? delta : delta * 0.12;
      el.style.transform = offset === 0 ? "" : `translateY(${offset}px)`;
      const overlay = el.previousElementSibling as HTMLElement | null;
      if (overlay) {
        overlay.style.opacity = String(
          Math.max(0.15, 1 - Math.max(0, offset) / (height || 1)),
        );
      }
    };

    const end = (event: PointerEvent) => {
      if (!dragged || event.pointerId !== pointerId) return;
      dragged = false;
      pointerId = -1;
      delete el.dataset.dragging;
      try {
        if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
      } catch {
        /* nothing to release */
      }

      if (offset > height * dismissThreshold) {
        // Hand off to the dismissal, then let the sheet finish travelling so
        // it leaves the screen on the same path it was dragged along.
        spring.set(height, true);
        dismiss();
        return;
      }
      spring.set(0);
      offset = 0;
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);

    return () => {
      spring.stop();
      springRef.current = null;
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", end);
      el.removeEventListener("pointercancel", end);
    };
  }, [node, draggable, dismissThreshold, dismiss]);

  // A closed drawer must not leave a stale offset behind for the next open.
  useEffect(() => {
    return () => {
      if (node) node.style.transform = "";
    };
  }, [node]);

  return (
    <DialogPrimitive.Portal>
      <DrawerOverlay />
      <DialogPrimitive.Content
        ref={setRef}
        className={cx("gl-glass gl-drawer-content", className)}
        data-draggable={draggable ? "" : undefined}
        {...props}
      >
        <div className="gl-drawer-handle" aria-hidden="true" />
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const DrawerHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("gl-drawer-header", className)} {...props} />
);

export const DrawerFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cx("gl-drawer-footer", className)} {...props} />
);

export const DrawerTitle = forwardRef<
  ElementRef<typeof DialogPrimitive.Title>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DrawerTitle({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cx("gl-drawer-title", className)}
      {...props}
    />
  );
});

export const DrawerDescription = forwardRef<
  ElementRef<typeof DialogPrimitive.Description>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DrawerDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cx("gl-drawer-description", className)}
      {...props}
    />
  );
});
