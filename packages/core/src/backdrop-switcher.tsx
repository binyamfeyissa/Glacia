import type { JSX } from "react";

import {
  SegmentedControl,
  type SegmentedControlItem,
  type SegmentedControlProps,
} from "./segmented-control";

export type BackdropValue = "dark" | "light" | "image";

export const defaultBackdropItems: SegmentedControlItem[] = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "image", label: "Image" },
];

export interface BackdropSwitcherProps
  extends Omit<
    SegmentedControlProps,
    "items" | "value" | "defaultValue" | "onValueChange"
  > {
  /** The three backdrop options. Defaults to Dark / Light / Image. */
  items?: SegmentedControlItem[];
  /** The selected backdrop, or `null` for none. */
  value?: BackdropValue | null;
  defaultValue?: BackdropValue | null;
  onValueChange?: (value: BackdropValue) => void;
}

/**
 * A SegmentedControl fixed to the three backdrops a template can sit on:
 * dark graphite, broken white, and the image backdrop. A thin typed wrapper
 * — the thumb, lens and glass all come from SegmentedControl unchanged.
 */
export function BackdropSwitcher({
  items = defaultBackdropItems,
  value,
  defaultValue,
  onValueChange,
  ...props
}: BackdropSwitcherProps): JSX.Element {
  return (
    <SegmentedControl
      {...props}
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={
        onValueChange ? (next) => onValueChange(next as BackdropValue) : undefined
      }
    />
  );
}
