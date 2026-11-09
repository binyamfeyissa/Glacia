import {
  forwardRef,
  type SelectHTMLAttributes,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  sizeVariant?: "sm" | "md" | "lg";
}

export const NativeSelect: ForwardRefExoticComponent<
  NativeSelectProps & RefAttributes<HTMLSelectElement>
> = /* @__PURE__ */ forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect(
    { sizeVariant = "md", className, children, disabled, ...props },
    ref
  ) {
    return (
      <div
        className={cx("gl-glass gl-native-select-wrapper", className)}
        data-size={sizeVariant}
        data-disabled={disabled ? "" : undefined}
      >
        <select
          ref={ref}
          disabled={disabled}
          className="gl-native-select"
          {...props}
        >
          {children}
        </select>
        <span className="gl-native-select-chevron" aria-hidden="true">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </div>
    );
  }
);
