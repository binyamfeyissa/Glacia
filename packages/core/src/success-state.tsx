import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";

/**
 * SuccessState — a success confirmation built on the Empty layout.
 *
 * Reference: Empty (src/empty.tsx) — same structure (icon plate, title,
 * description, action), same `gl-empty` layout classes. It is a success
 * state, NOT an empty state: it never renders Empty itself, and the
 * `gl-success-state` hook tints the icon plate with the success tone
 * (`--gl-on`) instead of the neutral `--gl-highlight`.
 */
export interface SuccessStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon or illustration displayed in the glass squircle badge. */
  icon?: ReactNode;
  /** Primary headline confirming the success. */
  title: string;
  /** Secondary description explaining what happened or what comes next. */
  description?: string;
  /** Optional call-to-action button or interactive elements. */
  action?: ReactNode;
}

export const SuccessState: ForwardRefExoticComponent<
  SuccessStateProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, SuccessStateProps>(
  function SuccessState(
    { icon, title, description, action, className, children, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        role="status"
        className={cx("gl-glass gl-empty gl-success-state", className)}
        {...props}
      >
        {icon && <div className="gl-empty-icon-plate">{icon}</div>}
        <h3 className="gl-empty-title">{title}</h3>
        {description && <p className="gl-empty-description">{description}</p>}
        {action && <div className="gl-empty-action">{action}</div>}
        {children}
      </div>
    );
  },
);
