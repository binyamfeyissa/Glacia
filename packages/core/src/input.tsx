import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";

import { useControllable } from "./internal/controllable";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Shown before the text, such as a person or envelope glyph. */
  icon?: ReactNode;
  /** Error state for invalid form field */
  error?: boolean;
}

export const Input: ForwardRefExoticComponent<InputProps & RefAttributes<HTMLInputElement>> = /* @__PURE__ */ forwardRef<
  HTMLInputElement,
  InputProps
>(function Input({ value: valueProp, defaultValue = "", onValueChange, onChange, icon, error, className, style, ...props }, forwardedRef) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useControllable(valueProp, defaultValue, onValueChange);
  useImperativeHandle(forwardedRef, () => inputRef.current!);
  useRefraction(rootRef);

  return (
    <div
      ref={rootRef}
      className={cx("gl-glass gl-input", className)}
      data-error={error ? "" : undefined}
      style={style}
      onPointerDown={(event) => {
        if (event.target !== inputRef.current) inputRef.current?.focus();
      }}
    >
      {icon == null ? null : <span className="gl-input-icon">{icon}</span>}
      <input
        ref={inputRef}
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          setValue(event.currentTarget.value);
          onChange?.(event);
        }}
        {...props}
      />
      {props.type === "search" && value && !props.disabled ? (
        <button
          type="button"
          className="gl-input-clear"
          aria-label="Clear"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => {
            setValue("");
            inputRef.current?.focus();
          }}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden>
            <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.18" />
            <path d="m5.5 5.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
});
