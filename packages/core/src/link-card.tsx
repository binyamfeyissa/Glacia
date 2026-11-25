import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type AnchorHTMLAttributes,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export interface LinkCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Destination. Required: a card that goes nowhere is a Card, not a link. */
  href: string;
  variant?: "glass" | "clear";
}

/**
 * A Card that is a link: an `<a>` carrying the Card glass classes
 * (`gl-glass gl-card`), composed with Card's own Header / Title /
 * Description / Content / Footer slots. Keyboard accessible like any link;
 * focus is the kit's standard `var(--gl-ring)` outline (see styles.css).
 */
export const LinkCard: ForwardRefExoticComponent<
  LinkCardProps & RefAttributes<HTMLAnchorElement>
> = /* @__PURE__ */ forwardRef<HTMLAnchorElement, LinkCardProps>(
  function LinkCard(
    { className, variant = "glass", href, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLAnchorElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    useRefraction(ref);

    return (
      <a
        ref={ref}
        href={href}
        className={cx("gl-glass gl-card gl-link-card", className)}
        data-variant={variant === "glass" ? undefined : variant}
        // The refraction engine writes data-rim and data-refracting from measured
        // geometry after hydration; those writes are intentional.
        suppressHydrationWarning
        {...props}
      />
    );
  },
);
