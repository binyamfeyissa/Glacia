import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  /**
   * Show a time picker under the grid, so a single control can choose a
   * moment rather than only a day.
   */
  withTime?: boolean;
  /** Minutes between time options. A quarter of an hour by default. */
  minuteStep?: number;
  /** Earliest year offered in the year list. Ten years back by default. */
  fromYear?: number;
  /** Latest year offered in the year list. Ten years on by default. */
  toYear?: number;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const Calendar: ForwardRefExoticComponent<
  CalendarProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, CalendarProps>(
  function Calendar(
    {
      selected,
      onSelect,
      className,
      minDate,
      maxDate,
      withTime = false,
      minuteStep = 15,
      fromYear,
      toYear,
    },
    forwardedRef
  ) {
    const today = new Date();
    const timeId = useId();
    const [picking, setPicking] = useState<"month" | "year" | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // A picker closes on an outside press or Escape, as any popover should.
    useEffect(() => {
      if (!picking) return;
      const onDown = (event: PointerEvent) => {
        if (!panelRef.current?.contains(event.target as Node)) setPicking(null);
      };
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") setPicking(null);
      };
      document.addEventListener("pointerdown", onDown);
      document.addEventListener("keydown", onKey);
      return () => {
        document.removeEventListener("pointerdown", onDown);
        document.removeEventListener("keydown", onKey);
      };
    }, [picking]);

    const [currentMonth, setCurrentMonth] = useState(
      selected ? new Date(selected.getFullYear(), selected.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    // The year list spans a usable window around the selection rather than a
    // fixed range that would make an old date unreachable.
    const anchorYear = selected?.getFullYear() ?? today.getFullYear();
    const firstYear = fromYear ?? anchorYear - 10;
    const lastYear = toYear ?? anchorYear + 10;
    const years: number[] = [];
    for (let y = firstYear; y <= lastYear; y++) years.push(y);

    const prevMonth = () => {
      setCurrentMonth(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
      setCurrentMonth(new Date(year, month + 1, 1));
    };

    const isSameDay = (d1?: Date, d2?: Date) => {
      if (!d1 || !d2) return false;
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    };

    // Build 42 grid cells (6 rows x 7 days)
    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Leading days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Days in current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Trailing days from next month
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return (
      <div
        ref={(node) => {
          (panelRef as { current: HTMLDivElement | null }).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) forwardedRef.current = node;
        }}
        className={cx("gl-glass gl-calendar", className)}
        suppressHydrationWarning
      >
        {/* Calendar Header */}
        <div className="gl-calendar-header">
          <button
            type="button"
            className="gl-calendar-nav-btn"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M8.5 3.5L5 7L8.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* Month and year are separate controls: a year picker that adds
              twenty more clicks to a month nav is not a year picker. */}
          <div className="gl-calendar-title">
            <button
              type="button"
              className="gl-calendar-title-btn"
              onClick={() => setPicking("month")}
              aria-label="Choose month"
              aria-expanded={picking === "month"}
            >
              {MONTHS[month]}
            </button>
            <button
              type="button"
              className="gl-calendar-title-btn gl-calendar-year-btn"
              onClick={() => setPicking("year")}
              aria-label="Choose year"
              aria-expanded={picking === "year"}
            >
              {year}
            </button>
          </div>
          <button
            type="button"
            className="gl-calendar-nav-btn"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5.5 3.5L9 7L5.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {picking && (
          <div className="gl-calendar-picker" role="group" aria-label={`Choose ${picking}`}>
            {picking === "month"
              ? MONTHS.map((name, index) => (
                  <button
                    key={name}
                    type="button"
                    className="gl-calendar-picker-item"
                    data-selected={index === month ? "" : undefined}
                    onClick={() => {
                      setCurrentMonth(new Date(year, index, 1));
                      setPicking(null);
                    }}
                  >
                    {name.slice(0, 3)}
                  </button>
                ))
              : years.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="gl-calendar-picker-item"
                    data-selected={value === year ? "" : undefined}
                    onClick={() => {
                      // 29 February in a leap year would roll into March, so
                      // the day is clamped to what the target month has.
                      const day = Math.min(
                        currentMonth.getDate(),
                        new Date(value, month + 1, 0).getDate(),
                      );
                      setCurrentMonth(new Date(value, month, day));
                      setPicking(null);
                    }}
                  >
                    {value}
                  </button>
                ))}
          </div>
        )}

        {/* Weekday Row */}
        <div className="gl-calendar-weekdays">
          {WEEKDAYS.map((wd) => (
            <span key={wd} className="gl-calendar-weekday">
              {wd}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="gl-calendar-grid" role="grid">
          {days.map(({ date, isCurrentMonth }, idx) => {
            const isToday = isSameDay(date, today);
            const isSelected = isSameDay(date, selected);
            const isDisabled =
              (minDate && date < minDate) || (maxDate && date > maxDate);

            return (
              <button
                key={idx}
                type="button"
                className="gl-calendar-day"
                data-current-month={isCurrentMonth ? "" : undefined}
                data-today={isToday ? "" : undefined}
                data-selected={isSelected ? "" : undefined}
                disabled={isDisabled}
                onClick={() => onSelect?.(date)}
                aria-label={date.toDateString()}
              >
                <span>{date.getDate()}</span>
                {isToday && !isSelected && <span className="gl-calendar-today-dot" />}
              </button>
            );
          })}
        </div>

        {withTime && (
          <div className="gl-calendar-time">
            <label className="gl-calendar-time-label" htmlFor={timeId}>
              Time
            </label>
            <select
              id={timeId}
              className="gl-calendar-time-select"
              value={`${String(selected?.getHours() ?? 0).padStart(2, "0")}:${String(
                selected?.getMinutes() ?? 0,
              ).padStart(2, "0")}`}
              onChange={(event) => {
                const [hours = 0, minutes = 0] = event.target.value.split(":").map(Number);
                // Times apply to the chosen day, or to today when nothing is
                // chosen yet, so picking a time is never a no-op.
                const base = selected ?? new Date();
                const next = new Date(base);
                next.setHours(hours, minutes, 0, 0);
                onSelect?.(next);
              }}
            >
              {Array.from({ length: Math.ceil((24 * 60) / minuteStep) }, (_, i) => {
                const total = i * minuteStep;
                const value = `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(
                  total % 60,
                ).padStart(2, "0")}`;
                return (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </div>
        )}
      </div>
    );
  }
);
