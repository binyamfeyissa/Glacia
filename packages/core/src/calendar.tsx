import {
  forwardRef,
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
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
    { selected, onSelect, className, minDate, maxDate },
    forwardedRef
  ) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(
      selected ? new Date(selected.getFullYear(), selected.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

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
      <div ref={forwardedRef} className={cx("gl-glass gl-calendar", className)}>
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
          <span className="gl-calendar-title">
            {MONTHS[month]} {year}
          </span>
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
      </div>
    );
  }
);
