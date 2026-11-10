import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";

export type BubbleSide = "user" | "assistant" | "system";

export interface BubbleProps extends HTMLAttributes<HTMLDivElement> {
  /** Who the bubble belongs to. Decides the side it sits on and its fill. */
  side?: BubbleSide;
  /** The material. `glass` is the default Liquid Glass bubble. */
  variant?: "glass" | "solid" | "gradient";
  /** Where the pointed corner sits, so a run of bubbles reads as one stack. */
  tail?: "none" | "start" | "end";
  /** Grows the bubble to the wrap width, for long or quoted text. */
  full?: boolean;
  /** Timestamp shown under the bubble. */
  time?: string;
}

/**
 * A single chat bubble: the message surface on its own, without the row,
 * avatar or timestamp machinery of `Message`.
 */
export const Bubble: ForwardRefExoticComponent<BubbleProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, BubbleProps>(function Bubble(
    { side = "assistant", variant = "glass", tail = "end", full = false, time, className, children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cx(
          "gl-bubble",
          `gl-bubble-${side}`,
          `gl-bubble-${variant}`,
          tail !== "none" && `gl-bubble-tail-${tail}`,
          full && "gl-bubble-full",
          className,
        )}
        data-side={side}
        {...props}
      >
        <div
          className={cx("gl-bubble-body", variant === "glass" && "gl-glass")}
          data-surface="hint"
        >
          {children}
        </div>
        {time ? <span className="gl-bubble-time">{time}</span> : null}
      </div>
    );
  });

Bubble.displayName = "Bubble";

export interface BubbleGroupProps extends HTMLAttributes<HTMLDivElement> {
  side?: BubbleSide;
}

/** Stacks several bubbles from the same sender so they share one edge. */
export const BubbleGroup: ForwardRefExoticComponent<BubbleGroupProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, BubbleGroupProps>(function BubbleGroup(
    { side = "assistant", className, children, ...props },
    ref,
  ) {
    return (
      <div ref={ref} className={cx("gl-bubble-group", `gl-bubble-group-${side}`, className)} {...props}>
        {children}
      </div>
    );
  });

BubbleGroup.displayName = "BubbleGroup";
