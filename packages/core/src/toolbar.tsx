import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";

export interface ToolbarItem {
  /** Icon to display. */
  icon: ReactNode;
  /** Accessible label. */
  label: string;
  /** Called on press. */
  onPress?: () => void;
  /** Whether the item is currently active / selected. */
  active?: boolean;
  /** Disable the item. */
  disabled?: boolean;
}

export interface ToolbarProps extends HTMLAttributes<HTMLDivElement> {
  /** Items shown in the toolbar. */
  items: ToolbarItem[];
  /** Accessible name for the toolbar. */
  "aria-label": string;
}

/**
 * A Liquid Glass toolbar — sits at the bottom of a view above the tab bar.
 *
 * Each item is a glass button with an icon. Tapping one calls its `onPress`.
 */
export const Toolbar: ForwardRefExoticComponent<ToolbarProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  ToolbarProps
>(function Toolbar({ items, className, ...props }, forwardedRef) {
  return (
    <div
      ref={forwardedRef}
      role="toolbar"
      className={cx("gl-glass gl-toolbar", className)}
      {...props}
    >
      {items.map((item, index) => (
        <button
          key={index}
          type="button"
          className={cx("gl-toolbar-item", item.active && "gl-toolbar-item-active")}
          onClick={item.onPress}
          disabled={item.disabled}
          aria-label={item.label}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
});