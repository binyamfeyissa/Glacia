import type { JSX } from "react";

import {
  SegmentedControl,
  type SegmentedControlItem,
  type SegmentedControlProps,
} from "./segmented-control";

export type BackdropValue = "dark" | "light" | "image";

export const defaultBackdropItems: { value: BackdropValue; label: string }[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "image", label: "Image" },
];

export interface BackdropSwitcherProps<TValue extends string = BackdropValue>
  extends Omit<
    SegmentedControlProps,
    "items" | "value" | "defaultValue" | "onValueChange"
  > {
  /**
   * The backdrop options. Defaults to Dark / Light / Image. Passing custom
   * items widens the value type: `value`, `defaultValue` and `onValueChange`
   * all follow the items' value type instead of `BackdropValue`.
   */
  items?: (Omit<SegmentedControlItem, "value"> & { value: TValue })[];
  /** The selected backdrop, or `null` for none. */
  value?: TValue | null;
  defaultValue?: TValue | null;
  onValueChange?: (value: TValue) => void;
}

/**
 * A SegmentedControl fixed to the three backdrops a template can sit on:
 * dark graphite, broken white, and the image backdrop. A thin typed wrapper
 * — the thumb, lens and glass all come from SegmentedControl unchanged.
 */
export function BackdropSwitcher<TValue extends string = BackdropValue>({
  items,
  value,
  defaultValue,
  onValueChange,
  ...props
}: BackdropSwitcherProps<TValue>): JSX.Element {
  // No default in the destructure: the default items are BackdropValue-typed
  // and are only used when the caller passes no items, in which case TValue
  // is BackdropValue; a generic default would not typecheck.
  const resolvedItems = items ?? defaultBackdropItems;
  return (
    <SegmentedControl
      {...props}
      items={resolvedItems}
      value={value}
      defaultValue={defaultValue}
      onValueChange={
        onValueChange ? (next) => onValueChange(next as TValue) : undefined
      }
    />
  );
}
