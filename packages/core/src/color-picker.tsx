import {
  forwardRef,
  useCallback,
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";

/** The 10×7 grid of palette colours. */
const SWATCHES = [
  ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF", "#5856D6", "#AF52DE", "#FF2D55", "#A2845E", "#8E8E93"],
  ["#FF453A", "#FF9F0A", "#FFD60A", "#30D158", "#0A84FF", "#5E5CE6", "#BF5AF2", "#FF375F", "#AC8E68", "#98989D"],
  ["#CC2A23", "#CC7A00", "#CCA300", "#2AA04E", "#0066CC", "#4745C2", "#8944BA", "#CC243A", "#837058", "#6D6D72"],
  ["#99191A", "#995C00", "#997A00", "#207840", "#004C99", "#3533A0", "#663385", "#991B2B", "#625342", "#515154"],
  ["#FFB3B3", "#FFD9B3", "#FFF0B3", "#B3E6B3", "#B3D9FF", "#C2C2F0", "#D9B3F2", "#FFB3C2", "#D2C2B0", "#C7C7CC"],
  ["#E5E5EA", "#FFF3D6", "#FFF9D6", "#D6F2D6", "#D6EAFF", "#DEDEF7", "#EBD6F9", "#FFD6E0", "#E3D9CB", "#E5E5EA"],
  ["#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF", "#FFFFFF"],
];

function hexToH(query: string, fallback: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(query)) return query;
  return fallback;
}

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Currently selected colour. */
  value?: string;
  /** Called with a hex string when the user picks a colour. */
  onChange?: (colour: string) => void;
}

/**
 * A Liquid Glass colour grid, like the iOS Markup / Freeform colour picker.
 */
export const ColorPicker: ForwardRefExoticComponent<ColorPickerProps & RefAttributes<HTMLDivElement>> =
  forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
    { value, onChange, className, ...props },
    forwardedRef,
  ) {
    const current = hexToH(value ?? "", "#007AFF");

    return (
      <div ref={forwardedRef} className={cx("gl-glass gl-color-picker", className)} {...props}>
        <div className="gl-color-picker-grid">
          {SWATCHES.map((row, r) =>
            row.map((entry, c) => {
              const colour = typeof entry === "string" ? entry : entry[0];
              const isSelected = colour.toUpperCase() === current.toUpperCase();
              return (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  className={cx("gl-color-swatch", isSelected && "gl-color-swatch-selected")}
                  style={{ backgroundColor: colour }}
                  aria-label={colour}
                  onClick={() => onChange?.(colour)}
                />
              );
            }),
          )}
        </div>
        <HexInput value={current} onChange={onChange} />
      </div>
    );
  });

function HexInput({
  value,
  onChange,
}: {
  value: string;
  onChange?: (colour: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const commit = useCallback(() => {
    const raw = ref.current?.value.trim() ?? "";
    if (/^#[0-9A-Fa-f]{6}$/.test(raw)) onChange?.(raw);
  }, [onChange]);
  return (
    <div className="gl-glass gl-color-hex-field">
      <span className="gl-color-hex-pound" aria-hidden>#</span>
      <input
        ref={ref}
        type="text"
        className="gl-color-hex-input"
        defaultValue={value.replace("#", "")}
        maxLength={6}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") commit(); }}
        aria-label="Hex colour"
      />
    </div>
  );
}