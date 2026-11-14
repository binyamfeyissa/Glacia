import { forwardRef, useMemo, useState } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { Glass } from "./Glass";
import { Button } from "./Button";
import { Sheet } from "./Overlays";
import { colors, radii } from "./internal/tokens";
import { primitives } from "./internal/primitives";
import { useIsDark } from "./internal/motion";

// ---------------------------------------------------------------------------
// Date helpers
//
// Kept pure and exported so a caller (and the tests) can reason about the same
// calendar maths the grid uses. Dates are compared by day, never by instant,
// which is the bug that makes a picker select "yesterday" near midnight.

/** Midnight on the same calendar day, so two picks compare equal. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function sameDay(a: Date | undefined, b: Date | undefined): boolean {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

export interface CalendarCell {
  date: Date;
  /** True for days outside the displayed month, shown to fill the grid. */
  outside: boolean;
  key: string;
}

/**
 * The six-row month grid.
 *
 * Always six rows so the calendar does not change height as months change,
 * which would make the surrounding layout jump between February and March.
 */
export function monthGrid(year: number, month: number, weekStartsOn: 0 | 1 = 0): CalendarCell[] {
  const first = new Date(year, month, 1);
  // getDay() is 0 for Sunday; the offset is how many leading cells to add.
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const cells: CalendarCell[] = [];
  for (let i = 0; i < 42; i += 1) {
    const date = new Date(year, month, 1 - offset + i);
    cells.push({
      date,
      outside: date.getMonth() !== month,
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
    });
  }
  return cells;
}

export const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ---------------------------------------------------------------------------
// Calendar

export interface CalendarProps {
  /** Controlled selection. */
  value?: Date;
  /** Fires when a day is tapped. */
  onChange?: (date: Date) => void;
  /** Days before this are dimmed and cannot be picked. */
  minDate?: Date;
  /** Days after this are dimmed and cannot be picked. */
  maxDate?: Date;
  /** Which month to open on when there is no value. */
  initialMonth?: Date;
  /** 0 starts the week on Sunday, 1 on Monday. */
  weekStartsOn?: 0 | 1;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A month calendar, built from Glacia's own views.
 *
 * No native date picker anywhere: the grid, the weekday header and the month
 * navigation are ours, so the calendar looks the same on iOS and Android and
 * wears the library's tokens. The selected day is a `glassActive` fill, today
 * carries a ring, and disabled days are dimmed.
 */
export const Calendar = forwardRef<any, CalendarProps>(function Calendar(
  {
    value,
    onChange,
    minDate,
    maxDate,
    initialMonth,
    weekStartsOn = 0,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable } = primitives();

  const anchor = value ?? initialMonth ?? new Date();
  const [month, setMonth] = useState({ year: anchor.getFullYear(), month: anchor.getMonth() });

  const cells = useMemo(() => monthGrid(month.year, month.month, weekStartsOn), [month, weekStartsOn]);
  const today = startOfDay(new Date());

  const isDisabled = (date: Date) => {
    const day = startOfDay(date);
    if (minDate && day < startOfDay(minDate)) return true;
    if (maxDate && day > startOfDay(maxDate)) return true;
    return false;
  };

  const shift = (delta: number) => {
    setMonth((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  };

  const cellSize = 38;

  return (
    <View
      ref={ref}
      testID={testID}
      accessibilityRole="none"
      style={[{ alignSelf: "stretch" }, style as ViewStyle]}
      {...props}
    >
      {/* Month navigation. */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingBottom: 8 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          onPress={() => shift(-1)}
          hitSlop={8}
          style={{ padding: 6 }}
        >
          <RNText style={{ fontSize: 17, color: theme.foreground }}>{"\u2039"}</RNText>
        </Pressable>
        <RNText accessibilityRole="heading" style={{ fontSize: 16, fontWeight: "600", color: theme.foreground }}>
          {`${MONTHS[month.month]} ${month.year}`}
        </RNText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Next month"
          onPress={() => shift(1)}
          hitSlop={8}
          style={{ padding: 6 }}
        >
          <RNText style={{ fontSize: 17, color: theme.foreground }}>{"\u203A"}</RNText>
        </Pressable>
      </View>

      {/* Weekday header, derived from the same weekStartsOn as the grid. */}
      <View style={{ flexDirection: "row" }}>
        {Array.from({ length: 7 }, (_, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center", paddingVertical: 4 }}>
            <RNText
              accessibilityElementsHidden
              style={{ fontSize: 11, fontWeight: "600", color: theme.muted }}
            >
              {WEEKDAYS[(i + weekStartsOn) % 7]}
            </RNText>
          </View>
        ))}
      </View>

      {/* The grid: six rows of seven. */}
      {Array.from({ length: 6 }, (_, row) => (
        <View key={row} style={{ flexDirection: "row" }}>
          {cells.slice(row * 7, row * 7 + 7).map((cell) => {
            const selected = sameDay(cell.date, value);
            const isToday = sameDay(cell.date, today);
            const disabled = isDisabled(cell.date);
            return (
              <View key={cell.key} style={{ flex: 1, alignItems: "center", paddingVertical: 2 }}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={cell.date.toDateString()}
                  accessibilityState={{ selected, disabled }}
                  disabled={disabled}
                  onPress={() => onChange?.(startOfDay(cell.date))}
                  style={{
                    width: cellSize,
                    height: cellSize,
                    borderRadius: cellSize / 2,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: selected ? theme.glassActive : "transparent",
                    borderWidth: isToday && !selected ? 0.5 : selected ? 1 : 0,
                    borderColor: isToday && !selected ? theme.fill : theme.edge,
                    opacity: disabled ? 0.28 : cell.outside ? 0.45 : 1,
                  }}
                >
                  <RNText
                    style={{
                      fontSize: 14,
                      fontWeight: selected ? "600" : "400",
                      color: selected ? theme.foreground : theme.foreground,
                    }}
                  >
                    {String(cell.date.getDate())}
                  </RNText>
                </Pressable>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
});

// ---------------------------------------------------------------------------
// DatePicker

export interface DatePickerProps {
  /** Controlled visibility. Omit and the picker keeps its own. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The committed date. */
  value?: Date;
  /** Fires only when the user confirms, never on a mere browse. */
  onConfirm?: (date: Date) => void;
  onCancel?: () => void;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  minDate?: Date;
  maxDate?: Date;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/**
 * A date picker: the Calendar presented in a Sheet.
 *
 * Browsing months does not commit anything — the pending date is local until
 * the user confirms, so an accidental swipe of the calendar cannot change a
 * saved value.
 */
export const DatePicker = forwardRef<any, DatePickerProps>(function DatePicker(
  {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    value,
    onConfirm,
    onCancel,
    title = "Select date",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    minDate,
    maxDate,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;

  const [pending, setPending] = useState<Date | undefined>(value);

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <Sheet
      ref={ref}
      open={open}
      onOpenChange={setOpen}
      title={title}
      isDark={isDark}
      testID={testID}
      style={style}
      footer={
        <>
          <Button
            variant="ghost"
            accessibilityLabel={cancelLabel}
            onPress={() => {
              // Cancelling restores the committed value for the next open.
              setPending(value);
              onCancel?.();
              setOpen(false);
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="filled"
            accessibilityLabel={confirmLabel}
            disabled={pending === undefined}
            onPress={() => {
              if (pending) onConfirm?.(pending);
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
      {...props}
    >
      <Calendar
        value={pending}
        onChange={setPending}
        minDate={minDate}
        maxDate={maxDate}
        isDark={isDark}
        initialMonth={value}
      />
    </Sheet>
  );
});

// ---------------------------------------------------------------------------
// TimePicker

export interface TimePickerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The committed time, as "HH:MM" (24-hour). */
  value?: string;
  /** Fires only on confirm. */
  onConfirm?: (time: string) => void;
  onCancel?: () => void;
  /** Show an AM/PM column and present times in 12-hour form. */
  use12Hour?: boolean;
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  minuteStep?: number;
  style?: StyleProp<ViewStyle>;
  isDark?: boolean;
  testID?: string;
}

/** Splits "HH:MM" into parts, falling back to a sane default. */
export function parseTime(value: string | undefined): { hour: number; minute: number } {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value ?? "");
  if (!match) return { hour: 9, minute: 0 };
  return {
    hour: Math.min(Math.max(Number(match[1]), 0), 23),
    minute: Math.min(Math.max(Number(match[2]), 0), 59),
  };
}

/** Formats parts back to zero-padded "HH:MM". */
export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

/**
 * A time picker: tappable hour/minute drums inside a Sheet.
 *
 * The drums are ordinary Pressables drawn by Glacia — not a native picker
 * widget. Tapping a value selects it; the whole column scrolls in the Sheet.
 */
export const TimePicker = forwardRef<any, TimePickerProps>(function TimePicker(
  {
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    value,
    onConfirm,
    onCancel,
    use12Hour = false,
    title = "Select time",
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    minuteStep = 1,
    style,
    isDark: isDarkProp,
    testID,
    ...props
  },
  ref,
) {
  const isDark = useIsDark(isDarkProp);
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text: RNText, Pressable } = primitives();

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp !== undefined ? openProp : internalOpen;

  const initial = parseTime(value);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);

  // In 12-hour mode the column shows 1–12; the stored hour stays 24-hour.
  const displayHour = use12Hour ? (hour % 12 === 0 ? 12 : hour % 12) : hour;
  const isPm = hour >= 12;

  const column = (items: number[], selected: number, onPick: (value: number) => void, label: string, pad = 2) => (
    <View style={{ height: 168, flex: 1 }} accessibilityRole="none" accessibilityLabel={label}>
      <ScrollColumn
        items={items}
        selected={selected}
        onPick={onPick}
        isDark={isDark}
        pad={pad}
      />
    </View>
  );

  return (
    <Sheet
      ref={ref}
      open={open}
      onOpenChange={setOpen}
      title={title}
      isDark={isDark}
      testID={testID}
      style={style}
      footer={
        <>
          <Button
            variant="ghost"
            accessibilityLabel={cancelLabel}
            onPress={() => {
              setHour(initial.hour);
              setMinute(initial.minute);
              onCancel?.();
              setOpen(false);
            }}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="filled"
            accessibilityLabel={confirmLabel}
            onPress={() => {
              onConfirm?.(formatTime(hour, minute));
              setOpen(false);
            }}
          >
            {confirmLabel}
          </Button>
        </>
      }
      {...props}
    >
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        {column(use12Hour ? Array.from({ length: 12 }, (_, i) => i + 1) : hours, displayHour, (picked) => {
          if (!use12Hour) {
            setHour(picked);
            return;
          }
          // Keep the current half of the day when the hour column changes.
          setHour(picked % 12 === 0 ? (isPm ? 12 : 0) : isPm ? picked + 12 : picked);
        }, "Hour")}
        <RNText style={{ fontSize: 22, color: theme.muted }}>{":"}</RNText>
        {column(minutes, minute, setMinute, "Minute")}
        {use12Hour && (
          <View style={{ flex: 1, gap: 6 }}>
            {["AM", "PM"].map((label) => {
              const active = label === "PM" ? isPm : !isPm;
              return (
                <Pressable
                  key={label}
                  accessibilityRole="button"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: active }}
                  onPress={() => {
                    const nextPm = label === "PM";
                    if (nextPm === isPm) return;
                    setHour((current) => (nextPm ? (current % 12) + 12 : current % 12));
                  }}
                  style={{
                    height: 34,
                    borderRadius: radii.sm,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: active ? theme.glassActive : "transparent",
                    borderWidth: 0.5,
                    borderColor: active ? theme.edge : "transparent",
                  }}
                >
                  <RNText style={{ fontSize: 14, fontWeight: active ? "600" : "500", color: active ? theme.foreground : theme.muted }}>
                    {label}
                  </RNText>
                </Pressable>
              );
            })}
          </View>
        )}
      </View>
    </Sheet>
  );
});

/** One scrollable column of the time drums. */
function ScrollColumn({
  items,
  selected,
  onPick,
  isDark,
  pad,
}: {
  items: number[];
  selected: number;
  onPick: (value: number) => void;
  isDark: boolean;
  pad: number;
}) {
  const theme = isDark ? colors.dark : colors.light;
  const { getScrollView } = primitives();
  const ScrollView = getScrollView();
  const { View, Text: RNText, Pressable } = primitives();

  const rows = items.map((item) => {
    const active = item === selected;
    return (
      <Pressable
        key={item}
        accessibilityRole="button"
        accessibilityLabel={String(item).padStart(pad, "0")}
        accessibilityState={{ selected: active }}
        onPress={() => onPick(item)}
        style={{
          height: 34,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: radii.sm,
          backgroundColor: active ? theme.glassActive : "transparent",
        }}
      >
        <RNText style={{ fontSize: 17, fontWeight: active ? "600" : "400", color: active ? theme.foreground : theme.muted }}>
          {String(item).padStart(pad, "0")}
        </RNText>
      </Pressable>
    );
  });

  if (!ScrollView) {
    // Off-device: no ScrollView, so the column is clipped to its height rather
    // than truncated. Every value stays present and selectable, which is what
    // the real drum shows once it can scroll.
    return <View style={{ gap: 2, overflow: "hidden", height: 168 }}>{rows}</View>;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      <View style={{ gap: 2 }}>{rows}</View>
    </ScrollView>
  );
}
