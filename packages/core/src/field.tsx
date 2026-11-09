import {
  forwardRef,
  useId,
  type HTMLAttributes,
  type ReactNode,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Text or element for the field's label. */
  label?: ReactNode;
  /** Marks the field as required, showing a subtle Apple red dot or asterisk. */
  required?: boolean;
  /** Optional secondary description / helper note beneath the input. */
  description?: ReactNode;
  /** Error message to display when validation fails. */
  error?: ReactNode;
  /** Layout direction: 'vertical' (stacked, default) or 'horizontal' (Mac preferences style). */
  orientation?: "vertical" | "horizontal";
  /** HTML id of the input control this field labels. Auto-generated if omitted. */
  htmlFor?: string;
}

export const Field: ForwardRefExoticComponent<
  FieldProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, FieldProps>(
  function Field(
    {
      label,
      required,
      description,
      error,
      orientation = "vertical",
      htmlFor,
      className,
      children,
      ...props
    },
    ref
  ) {
    const fallbackId = useId();
    const id = htmlFor || fallbackId;
    const hasError = Boolean(error);

    return (
      <div
        ref={ref}
        className={cx("gl-field", className)}
        data-orientation={orientation}
        data-invalid={hasError ? "" : undefined}
        {...props}
      >
        {label && (
          <label htmlFor={id} className="gl-field-label">
            <span>{label}</span>
            {required && <span className="gl-field-required" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="gl-field-control">{children}</div>
        {description && !hasError && (
          <p className="gl-field-description">{description}</p>
        )}
        {hasError && (
          <p role="alert" className="gl-field-error">
            {error}
          </p>
        )}
      </div>
    );
  }
);
