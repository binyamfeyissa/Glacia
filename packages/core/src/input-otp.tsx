import * as React from "react";

export interface OTPContextValue {
  value: string;
  focusedIndex: number;
  maxLength: number;
  disabled?: boolean;
}

const OTPContext = React.createContext<OTPContextValue | null>(null);

export interface InputOTPProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  maxLength?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
}

export const InputOTP = React.forwardRef<HTMLDivElement, InputOTPProps>(
  (
    {
      maxLength = 6,
      value: controlledValue,
      defaultValue = "",
      onChange,
      onComplete,
      disabled = false,
      autoFocus = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const value = isControlled ? controlledValue : internalValue;
    const [focused, setFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (autoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }, [autoFocus]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = e.target.value.slice(0, maxLength);
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
      if (next.length === maxLength) {
        onComplete?.(next);
      }
    };

    const focusedIndex = focused ? Math.min(value.length, maxLength - 1) : -1;

    return (
      <OTPContext.Provider value={{ value, focusedIndex, maxLength, disabled }}>
        <div
          ref={ref}
          className={`gl-input-otp-root ${disabled ? "gl-disabled" : ""} ${className}`}
          onClick={() => {
            if (!disabled && inputRef.current) {
              inputRef.current.focus();
            }
          }}
          {...props}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
            maxLength={maxLength}
            value={value}
            disabled={disabled}
            onChange={handleInput}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="gl-input-otp-hidden"
            aria-label="One-Time Code"
          />
          {children}
        </div>
      </OTPContext.Provider>
    );
  }
);
InputOTP.displayName = "InputOTP";

export interface InputOTPGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InputOTPGroup = React.forwardRef<HTMLDivElement, InputOTPGroupProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`gl-input-otp-group ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
InputOTPGroup.displayName = "InputOTPGroup";

export interface InputOTPSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  index: number;
}

export const InputOTPSlot = React.forwardRef<HTMLDivElement, InputOTPSlotProps>(
  ({ index, className = "", ...props }, ref) => {
    const ctx = React.useContext(OTPContext);
    if (!ctx) {
      throw new Error("InputOTPSlot must be used within InputOTP");
    }

    const char = ctx.value[index] || "";
    const isFocused = ctx.focusedIndex === index;
    const hasFakeCaret = isFocused && !char;

    return (
      <div
        ref={ref}
        className={`gl-input-otp-slot ${isFocused ? "gl-active" : ""} ${char ? "gl-has-value" : ""} ${className}`}
        {...props}
      >
        <span className="gl-input-otp-char">{char}</span>
        {hasFakeCaret && <span className="gl-input-otp-caret" aria-hidden="true" />}
      </div>
    );
  }
);
InputOTPSlot.displayName = "InputOTPSlot";

export interface InputOTPSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const InputOTPSeparator = React.forwardRef<HTMLDivElement, InputOTPSeparatorProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`gl-input-otp-separator ${className}`} aria-hidden="true" {...props}>
        {children || "—"}
      </div>
    );
  }
);
InputOTPSeparator.displayName = "InputOTPSeparator";
