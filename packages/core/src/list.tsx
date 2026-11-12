import {
  forwardRef,
  useState,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";

export interface ListProps extends HTMLAttributes<HTMLDivElement> {
  /** Items in the list. */
  children: ReactNode;
  /** Label shown at the top of a grouped list section. */
  header?: string;
}

/**
 * A Liquid Glass list — the kind shown in iOS Settings and Mail.
 *
 * Wrap ListItem children inside it. Use `gl-list-item` boxes, optionally with
 * a `leading` avatar/icon and `trailing` accessory.
 */
export const List: ForwardRefExoticComponent<ListProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  ListProps
>(function List(
  { header, className, children, ...props },
  forwardedRef,
) {
  return (
    <div ref={forwardedRef} className={cx("gl-glass gl-list", className)} {...props}>
      {header && <div className="gl-list-header">{header}</div>}
      <div className="gl-list-body">{children}</div>
    </div>
  );
});

export interface ListItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "onClick"> {
  leading?: ReactNode;
  trailing?: ReactNode;
  /** A second, muted line under the label, as in a Mail or Settings row. */
  subtitle?: ReactNode;
  /** If true, a chevron is shown as the trailing accessory. */
  chevron?: boolean;
  /** If true, the row is marked as selected. */
  selected?: boolean;
  disabled?: boolean;
  /** Called when the row is tapped. */
  onPress?: () => void;
}

export const ListItem: ForwardRefExoticComponent<ListItemProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  ListItemProps
>(function ListItem(
  { leading, trailing, subtitle, chevron, selected, disabled, onPress, className, children, ...props },
  forwardedRef,
) {
  // Always a div: a row may or may not be interactive, and mixing the two
  // element types would make the prop types incompatible. When `onPress` is
  // given the row becomes a focusable button for keyboard and screen readers.
  const interactive = Boolean(onPress) && !disabled;
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onPress?.();
    }
  };
  return (
    <div
      ref={forwardedRef}
      role={onPress ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-disabled={disabled ? true : undefined}
      aria-pressed={selected ? true : undefined}
      data-leading={leading ? "" : undefined}
      onClick={interactive ? onPress : undefined}
      onKeyDown={handleKeyDown}
      className={cx(
        "gl-list-item",
        Boolean(onPress) && "gl-list-item-interactive",
        selected && "gl-list-item-selected",
        disabled && "gl-list-item-disabled",
        className,
      )}
      {...props}
    >
      {leading && <span className="gl-list-leading">{leading}</span>}
      <span className="gl-list-label">
        <span className="gl-list-title">{children}</span>
        {subtitle != null && <span className="gl-list-subtitle">{subtitle}</span>}
      </span>
      {chevron && !trailing && <span className="gl-list-chevron" aria-hidden />}
      {trailing && <span className="gl-list-trailing">{trailing}</span>}
    </div>
  );
});
