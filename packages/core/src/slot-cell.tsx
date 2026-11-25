import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type ReactNode,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";
import { usePress } from "./internal/press";
import { useRefraction } from "./internal/refraction";

export interface SlotCellProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onSelect"> {
  /** Primary label, e.g. the service or the slot name. */
  label: ReactNode;
  /** Time shown under the label, e.g. "09:30". */
  time?: ReactNode;
  /** Slot size: 'sm' (32px), 'md' (40px, default), 'lg' (48px) — copies Button. */
  size?: "sm" | "md" | "lg";
  /** Marks this slot as the chosen one (aria-pressed). */
  selected?: boolean;
  /** Called when the slot is tapped. */
  onSelect?: () => void;
}

/**
 * A selectable time-slot cell — a glass button with a label and a time,
 * for booking pickers. Reference is Button: same sizes, same press and
 * refraction behaviour, same `gl-glass` surface; `selected` is the
 * pressed state from Card's selectable patterns, exposed as aria-pressed.
 */
export const SlotCell: ForwardRefExoticComponent<
  SlotCellProps & RefAttributes<HTMLButtonElement>
> = /* @__PURE__ */ forwardRef<HTMLButtonElement, SlotCellProps>(
  function SlotCell(
    {
      label,
      time,
      size = "md",
      selected,
      disabled,
      onSelect,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) {
    const ref = useRef<HTMLButtonElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    usePress(ref);
    useRefraction(ref);

    return (
      <button
        ref={ref}
        type="button"
        className={cx("gl-glass gl-slot-cell", className)}
        data-size={size === "md" ? undefined : size}
        data-selected={selected ? "" : undefined}
        aria-pressed={selected ? true : undefined}
        disabled={disabled}
        onClick={onSelect}
        // The refraction engine writes data-rim and data-refracting from measured
        // geometry after hydration; those writes are intentional.
        suppressHydrationWarning
        {...props}
      >
        <span className="gl-slot-cell-label">{label}</span>
        {time && <span className="gl-slot-cell-time">{time}</span>}
        {children}
      </button>
    );
  },
);
