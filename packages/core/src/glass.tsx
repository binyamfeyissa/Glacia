import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";
import type { GlassSurface } from "./internal/glass-surface";

export interface GlassProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The physical surface this glass is: `panel`, `control`, `field`,
   * `overlay`, `hint` or `rail`. It selects which lens profile is fitted, so a
   * tooltip stays a thin pane and a dialog reads as a thick slab.
   */
  surface?: GlassSurface;
  /** Turn the bend off, leaving flat frosted glass. */
  flat?: boolean;
}

/**
 * The glass primitive: bends whatever is behind it, whether that is a marked
 * element it can follow or the live page backdrop.
 */
export const Glass: ForwardRefExoticComponent<GlassProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, GlassProps>(function Glass(
    { className, surface = "panel", flat = false, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    useRefraction(ref);
    return (
      <div
        ref={ref}
        className={cx("gl-glass", flat && "gl-glass-flat", className)}
        data-surface={surface}
        // The refraction engine writes data-rim and data-refracting onto this
        // node from measured geometry, which no server render can know. Those
        // writes are intentional, not a hydration bug.
        suppressHydrationWarning
        {...props}
      />
    );
  });
