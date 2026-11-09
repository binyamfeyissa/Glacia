import {
  forwardRef,
  type TextareaHTMLAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, error, disabled, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      className={cx("gl-glass gl-textarea", className)}
      data-error={error ? "" : undefined}
      {...props}
    />
  );
});
