import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface EmptyProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon or illustration displayed in the glass squircle badge. */
  icon?: ReactNode;
  /** Primary headline for the empty state. */
  title: string;
  /** Secondary description explaining why nothing is here or what to do next. */
  description?: string;
  /** Optional call-to-action button or interactive elements. */
  action?: ReactNode;
}

export const Empty: ForwardRefExoticComponent<
  EmptyProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, EmptyProps>(
  function Empty(
    { icon, title, description, action, className, children, ...props },
    ref
  ) {
    return (
      <div ref={ref} className={cx("gl-glass gl-empty", className)} {...props}>
        {icon && <div className="gl-empty-icon-plate">{icon}</div>}
        <h3 className="gl-empty-title">{title}</h3>
        {description && <p className="gl-empty-description">{description}</p>}
        {action && <div className="gl-empty-action">{action}</div>}
        {children}
      </div>
    );
  }
);
