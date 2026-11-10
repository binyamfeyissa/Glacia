import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";
import { usePress } from "./internal/press";

export interface StepperProps {
  /** Current value. */
  value?: number;
  /** Called with the new value when the user taps + or −. */
  onValueChange?: (value: number) => void;
  /** Smallest allowed value (default 0). */
  min?: number;
  /** Largest allowed value (default 100). */
  max?: number;
  /** Amount to add or subtract each tap (default 1). */
  step?: number;
  /** Disable both buttons. */
  disabled?: boolean;
  className?: string;
}

export const Stepper: ForwardRefExoticComponent<StepperProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  StepperProps
>(function Stepper(
  { value = 0, onValueChange, min = 0, max = 100, step = 1, disabled, className },
  forwardedRef,
) {
  const ref = useRef<HTMLDivElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current!);

  const isMin = value <= min;
  const isMax = value >= max;

  const stepDown = () => {
    if (!disabled && !isMin) onValueChange?.(Math.max(min, value - step));
  };
  const stepUp = () => {
    if (!disabled && !isMax) onValueChange?.(Math.min(max, value + step));
  };

  return (
    <div ref={ref} className={cx("gl-stepper", className)}>
      <StepperButton onClick={stepDown} disabled={disabled || isMin} aria-label="Decrease">
        <span className="gl-stepper-sign">−</span>
      </StepperButton>
      <div className="gl-stepper-divider" aria-hidden />
      <StepperButton onClick={stepUp} disabled={disabled || isMax} aria-label="Increase">
        <span className="gl-stepper-sign">+</span>
      </StepperButton>
    </div>
  );
});

/* A small square glass button for the stepper. */
function StepperButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useRef<HTMLButtonElement>(null);
  usePress(ref);
  return (
    <button ref={ref} type="button" className="gl-glass gl-stepper-btn" {...props}>
      {children}
    </button>
  );
}