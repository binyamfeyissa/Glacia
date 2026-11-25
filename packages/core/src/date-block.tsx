import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export interface DateBlockProps extends HTMLAttributes<HTMLDivElement> {
  /** The date to show. Day numeral, month and weekday are derived from it. */
  date?: Date;
  /** Day numeral override, e.g. 25. Defaults to the date's day. */
  day?: number | string;
  /** Month override, e.g. "Nov". Defaults to the date's month. */
  month?: string;
  /** Weekday override, e.g. "Tue". Defaults to the date's weekday. */
  weekday?: string;
  /** Block size: 'sm' (compact), 'md' (default), 'lg' (large). */
  size?: "sm" | "md" | "lg";
}

/**
 * A compact glass date block — day numeral, month, weekday — the kind
 * shown on calendar and event cards. Reference is Card (glass surface,
 * useRefraction) sized like Badge: small, stacked, tabular numerals.
 */
export const DateBlock: ForwardRefExoticComponent<
  DateBlockProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, DateBlockProps>(
  function DateBlock(
    { date, day, month, weekday, size = "md", className, children, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    useRefraction(ref);

    const dayValue = day ?? date?.getDate();
    const monthValue = month ?? (date ? MONTHS[date.getMonth()] : undefined);
    const weekdayValue = weekday ?? (date ? WEEKDAYS[date.getDay()] : undefined);

    return (
      <div
        ref={ref}
        className={cx("gl-glass gl-date-block", className)}
        data-size={size === "md" ? undefined : size}
        suppressHydrationWarning
        {...props}
      >
        {weekdayValue && <span className="gl-date-block-weekday">{weekdayValue}</span>}
        {dayValue != null && <span className="gl-date-block-day">{dayValue}</span>}
        {monthValue && <span className="gl-date-block-month">{monthValue}</span>}
        {children}
      </div>
    );
  },
);
