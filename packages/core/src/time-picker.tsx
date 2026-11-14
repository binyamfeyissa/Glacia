import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";

export interface TimePickerProps {
  /** Value as "HH:MM" (24h) or "h:MM AM" (12h). */
  value?: string;
  /** Called with the new time string. */
  onChange?: (time: string) => void;
  /** Use 12-hour display (default true). */
  twelveHour?: boolean;
  /** Minute step. 1 gives every minute; 5 gives iOS's five-minute wheel. */
  minuteStep?: number;
  className?: string;
}

const ROW_HEIGHT = 40;
/** Rows kept above and below the list so the first and last item can centre. */
const PAD_ROWS = 2;

/**
 * An iOS-style Time Picker: hour, minute and period wheels on Liquid Glass.
 *
 * Each wheel is a real scroll container. The selected row is the one nearest
 * the centre band, so scrolling, clicking a row, the arrow keys and the wheel
 * all move the value the same way.
 */
export const TimePicker: ForwardRefExoticComponent<
  TimePickerProps & RefAttributes<HTMLDivElement>
> = forwardRef<HTMLDivElement, TimePickerProps>(function TimePicker(
  { value, onChange, twelveHour = true, minuteStep = 1, className },
  forwardedRef,
) {
  // Time is held as minutes since midnight, which makes every edit and every
  // parse comparable without juggling AM/PM. The initial value is 09:41 — the
  // time Apple shows on its own marketing shots.
  const [minutes, setMinutes] = useState(9 * 60 + 41);

  useEffect(() => {
    if (!value) return;
    const parsed = parseTime(value, twelveHour);
    if (parsed != null) setMinutes(parsed);
  }, [value, twelveHour]);

  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const period: "AM" | "PM" = hour24 >= 12 ? "PM" : "AM";
  // 12-hour wheels count 12, 1, 2 … 11, so midnight is 12 and noon is 12.
  const hour12 = hour24 % 12 || 12;

  const commit = useCallback(
    (next: number) => {
      const clamped = ((next % 1440) + 1440) % 1440;
      setMinutes(clamped);
      onChange?.(formatTime(clamped, twelveHour));
    },
    [onChange, twelveHour],
  );

  const hours = useMemo(
    () =>
      twelveHour
        ? ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]
        : Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")),
    [twelveHour],
  );

  const minuteValues = useMemo(() => {
    const step = Math.max(1, Math.min(30, Math.round(minuteStep)));
    const out: string[] = [];
    for (let m = 0; m < 60; m += step) out.push(String(m).padStart(2, "0"));
    return out;
  }, [minuteStep]);

  // Index of the current minute inside a stepped wheel (60 with step 1).
  const minuteIndex = Math.round(minute / Math.max(1, Math.round(minuteStep)));

  return (
    <div ref={forwardedRef} className={cx("gl-glass gl-time-picker", className)}>
      <Wheel
        label="Hour"
        items={hours}
        // The wheel reads 12, 1, 2 … 11, so hour h sits at index h % 12.
        selectedIndex={twelveHour ? hour24 % 12 : hour24}
        onSelect={(index) => {
          if (twelveHour) {
            // Index 0 is 12 o'clock, so it maps to hour 0 of the period.
            const base = index + (period === "PM" ? 12 : 0);
            commit(base * 60 + minute);
          } else {
            commit(index * 60 + minute);
          }
        }}
      />

      <div className="gl-time-separator" aria-hidden>
        :
      </div>

      <Wheel
        label="Minute"
        items={minuteValues}
        selectedIndex={Math.min(minuteIndex, minuteValues.length - 1)}
        onSelect={(index) => {
          const m = Math.round(index * Math.max(1, Math.round(minuteStep)));
          commit(hour24 * 60 + m);
        }}
      />

      {twelveHour && (
        <Wheel
          label="Period"
          items={["AM", "PM"]}
          selectedIndex={period === "AM" ? 0 : 1}
          onSelect={(index) => {
            const nextPeriod = index === 0 ? "AM" : "PM";
            if (nextPeriod === period) return;
            // 12 AM is hour 0 and 12 PM is hour 12; the hour number stays put.
            const base = (hour24 % 12) + (nextPeriod === "PM" ? 12 : 0);
            commit(base * 60 + minute);
          }}
        />
      )}

      <span className="gl-sr-only" role="status">
        {formatTime(minutes, twelveHour)}
      </span>
    </div>
  );
});

/**
 * One wheel.
 *
 * The bug in the original was a feedback loop: scrolling set state, which
 * scrolled the wheel again, which fired scroll, forever. Two guards break it:
 * `reported` remembers the index this wheel last agreed on, so a scroll that
 * lands where we already are reports nothing, and programmatic centring sets
 * `reported` *before* it scrolls, so the echo is recognised and dropped.
 */
function Wheel({
  items,
  selectedIndex,
  onSelect,
  label,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  label: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // The last index this wheel reported, so a rest position is reported once.
  const reported = useRef(selectedIndex);

  // Keep the wheel aligned with the value, without echoing back through
  // onScroll. Only the browser's own motion (a user drag) may report.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // The spacer rows sit above the first item, so the centre of item `i`
    // is (i + PAD_ROWS) rows down, not i.
    const target = (selectedIndex + PAD_ROWS) * ROW_HEIGHT;
    reported.current = selectedIndex;
    if (Math.abs(el.scrollTop - target) < 1) return;
    // `scrollTo` is missing in some non-browser DOMs (and in jsdom), so fall
    // back to the plain property, which every implementation supports.
    if (typeof el.scrollTo === "function") {
      el.scrollTo({ top: target, behavior: "smooth" });
    } else {
      el.scrollTop = target;
    }
  }, [selectedIndex]);

  const settle = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollTop / ROW_HEIGHT) - PAD_ROWS;
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    if (clamped === reported.current) return;
    reported.current = clamped;
    onSelect(clamped);
  }, [items.length, onSelect]);

  // A native scroll may end without `scrollend` on older browsers, so a short
  // debounce settles it too.
  const settleTimer = useRef<number | undefined>(undefined);
  const handleScroll = useCallback(() => {
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(settle, 90);
  }, [settle]);

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  return (
    <div className="gl-time-column">
      <div className="gl-time-column-glass" aria-hidden>
        <div className="gl-time-column-highlight" />
      </div>
      <div
        ref={scrollRef}
        className="gl-time-column-scroll"
        role="listbox"
        aria-label={label}
        aria-activedescendant={`${label}-${selectedIndex}`}
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            const step = event.key === "ArrowDown" ? 1 : -1;
            const next = Math.max(0, Math.min(items.length - 1, selectedIndex + step));
            if (next !== selectedIndex) onSelect(next);
          }
        }}
      >
        <div style={{ height: ROW_HEIGHT * PAD_ROWS }} aria-hidden />
        {items.map((item, index) => (
          <div
            key={item}
            id={`${label}-${index}`}
            role="option"
            aria-selected={index === selectedIndex}
            className={cx(
              "gl-time-column-item",
              index === selectedIndex && "gl-time-column-selected",
            )}
            // Clicking a row selects it. The effect above then centres the
            // wheel, guarded so it cannot report the move as a new value.
            onClick={() => {
              if (index !== selectedIndex) onSelect(index);
            }}
          >
            {item}
          </div>
        ))}
        <div style={{ height: ROW_HEIGHT * PAD_ROWS }} aria-hidden />
      </div>
    </div>
  );
}

/** Reads "14:05", "2:05 PM" or "2:05PM"; null when the text is not a time. */
function parseTime(value: string, twelveHour: boolean): number | null {
  const match = /^(\d{1,2}):(\d{2})(?:\s*([AaPp][Mm]))?$/.exec(value.trim());
  if (!match) return null;
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  const suffix = match[3]?.toUpperCase();
  if (twelveHour && suffix) {
    const isPm = suffix === "PM";
    hour = (hour % 12) + (isPm ? 12 : 0);
  }
  return hour * 60 + minute;
}

function formatTime(minutes: number, twelveHour: boolean): string {
  const hour24 = Math.floor(minutes / 60);
  const minute = minutes % 60;
  const mm = String(minute).padStart(2, "0");
  if (!twelveHour) return `${String(hour24).padStart(2, "0")}:${mm}`;
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${mm} ${hour24 >= 12 ? "PM" : "AM"}`;
}
