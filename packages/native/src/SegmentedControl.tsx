import { useState, forwardRef } from "react";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";

export interface SegmentedControlProps {
  values: string[];
  selectedIndex?: number;
  defaultIndex?: number;
  onValueChange?: (value: string, index: number) => void;
  style?: any;
  isDark?: boolean;
}

export const SegmentedControl = forwardRef<any, SegmentedControlProps>(function SegmentedControl(
  {
    values,
    selectedIndex: selectedProp,
    defaultIndex = 0,
    onValueChange,
    style,
    isDark = false,
    ...props
  },
  ref,
) {
  const [internalIndex, setInternalIndex] = useState(defaultIndex);
  const activeIndex = selectedProp !== undefined ? selectedProp : internalIndex;
  const themeColors = isDark ? colors.dark : colors.light;

  const handleSelect = (index: number) => {
    if (selectedProp === undefined) {
      setInternalIndex(index);
    }
    const val = values[index];
    if (val !== undefined) {
      onValueChange?.(val, index);
    }
  };

  const containerStyle = {
    position: "relative" as const,
    display: "inline-flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 2,
    borderRadius: radii.md,
    backgroundColor: "rgba(118, 118, 128, 0.12)",
    ...style,
  };

  return (
    <Glass ref={ref} effect="regular" style={containerStyle} {...props}>
      {values.map((label, idx) => {
        const isSelected = idx === activeIndex;
        return (
          <button
            key={label}
            type="button"
            onClick={() => handleSelect(idx)}
            style={{
              padding: "6px 16px",
              borderRadius: radii.sm,
              border: 0,
              backgroundColor: isSelected ? "#FFFFFF" : "transparent",
              color: isSelected ? "#000000" : themeColors.muted,
              boxShadow: isSelected ? "0 1px 3px rgba(0, 0, 0, 0.12)" : "none",
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 150ms ease",
            }}
          >
            {label}
          </button>
        );
      })}
    </Glass>
  );
});
