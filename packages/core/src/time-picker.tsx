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
  className?: string;
}

/**
 * An iOS-style Time Picker — three spinning columns (hour, minute, period)
 * with Liquid Glass rings around each.
 */
export const TimePicker: ForwardRefExoticComponent<TimePickerProps & RefAttributes<HTMLDivElement>> = forwardRef<
  HTMLDivElement,
  TimePickerProps
>(function TimePicker(
  { value, onChange, twelveHour = true, className },
  forwardedRef,
) {
  const [hour, setHour] = useState(9);
  const [minute, setMinute] = useState(41);
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  // Parse incoming value.
  useEffect(() => {
    if (!value) return;
    const match = value.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
    if (!match) return;
    let h = parseInt(match[1]!, 10);
    const m = parseInt(match[2]!, 10);
    const p = match[3]?.toUpperCase() as "AM" | "PM" | undefined;
    if (twelveHour && p === "PM" && h !== 12) h += 12;
    if (twelveHour && p === "AM" && h === 12) h = 0;
    if (twelveHour) setPeriod(p ?? (h >= 12 ? "PM" : "AM"));
    setHour(twelveHour ? h % 12 || 12 : h);
    setMinute(m);
  }, [value, twelveHour]);

  const emit = useCallback(
    (h: number, m: number, p: "AM" | "PM") => {
      const minutes = String(m).padStart(2, "0");
      if (twelveHour) onChange?.(`${h}:${minutes} ${p}`);
      else onChange?.(`${String(h).padStart(2, "0")}:${minutes}`);
    },
    [onChange, twelveHour],
  );

  const hours = useMemo(() => {
    if (twelveHour) return ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
    return Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  }, [twelveHour]);

  const minutes = useMemo(() => Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")), []);

  const hIdx = twelveHour ? (hour % 12 || 12) - 1 : hour;
  const mIdx = minute;

  return (
    <div ref={forwardedRef} className={cx("gl-glass gl-time-picker", className)}>
      <GlassColumn
        items={hours}
        selectedIndex={hIdx}
        onSelect={(_, label) => {
          const h = parseInt(label, 10);
          setHour(h);
          emit(h, minute, period);
        }}
      />
      <div className="gl-time-separator">:</div>
      <GlassColumn
        items={minutes}
        selectedIndex={mIdx}
        onSelect={(_, label) => {
          const m = parseInt(label, 10);
          setMinute(m);
          emit(hour, m, period);
        }}
      />
      {twelveHour && (
        <GlassColumn
          items={["AM", "PM"]}
          selectedIndex={period === "AM" ? 0 : 1}
          onSelect={(_, label) => {
            const p = label as "AM" | "PM";
            setPeriod(p);
            emit(hour, minute, p);
          }}
        />
      )}
    </div>
  );
});

/* A single spinning column: glass ring with a highlight over the selected row. */
function GlassColumn({
  items,
  selectedIndex,
  onSelect,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number, label: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const ROW_HEIGHT = 40;
  const visible = 5; // show 5 rows

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: selectedIndex * ROW_HEIGHT, behavior: "smooth" });
  }, [selectedIndex]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollTop / ROW_HEIGHT);
    onSelect(idx, items[idx] ?? "");
  }, [items, onSelect]);

  return (
    <div className="gl-time-column">
      <div className="gl-time-column-glass" aria-hidden>
        <div className="gl-time-column-highlight" />
      </div>
      <div
        ref={scrollRef}
        className="gl-time-column-scroll"
        onScroll={handleScroll}
      >
        <div style={{ height: ROW_HEIGHT * 2 }} />
        {items.map((label, i) => (
          <div
            key={i}
            className={cx("gl-time-column-item", i === selectedIndex && "gl-time-column-selected")}
            onClick={() => onSelect(i, label)}
          >
            {label}
          </div>
        ))}
        <div style={{ height: ROW_HEIGHT * 2 }} />
      </div>
    </div>
  );
}