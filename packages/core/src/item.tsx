import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface ItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Leading icon or avatar. */
  icon?: ReactNode;
  /** Background tint colour for the icon squircle badge (e.g. Apple blue, green, orange). */
  iconTint?: string;
  /** Primary label/title. */
  title: ReactNode;
  /** Secondary subtitle or detail text. */
  description?: ReactNode;
  /** Trailing accessory: chevron '›', switch, badge, or custom element. */
  accessory?: ReactNode;
  /** Marks the item as an interactive clickable row. */
  interactive?: boolean;
  /** Visual variant: 'glass' (frosted liquid glass surface) or 'plain'. */
  variant?: "glass" | "plain";
}

export const Item: ForwardRefExoticComponent<
  ItemProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, ItemProps>(
  function Item(
    {
      icon,
      iconTint,
      title,
      description,
      accessory,
      interactive = false,
      variant = "glass",
      className,
      children,
      ...props
    },
    ref
  ) {
    return (
      <div
        ref={ref}
        className={cx("gl-item", variant === "glass" && "gl-glass", className)}
        data-interactive={interactive ? "" : undefined}
        {...props}
      >
        {icon && (
          <div
            className="gl-item-icon-badge"
            style={iconTint ? { backgroundColor: iconTint } : undefined}
          >
            {icon}
          </div>
        )}
        <div className="gl-item-content">
          <div className="gl-item-title">{title}</div>
          {description && <div className="gl-item-description">{description}</div>}
          {children}
        </div>
        {accessory && <div className="gl-item-accessory">{accessory}</div>}
      </div>
    );
  }
);
