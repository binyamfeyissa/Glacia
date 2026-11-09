import { useState, forwardRef } from "react";
import { Glass } from "./Glass";
import { colors } from "./internal/tokens";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  accessibilityLabel: string;
  style?: any;
  isDark?: boolean;
}

export const Slider = forwardRef<any, SliderProps>(function Slider(
  {
    value: valueProp,
    defaultValue = 50,
    min = 0,
    max = 100,
    step = 1,
    onValueChange,
    disabled = false,
    accessibilityLabel,
    style,
    isDark = false,
    ...props
  },
  ref,
) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = valueProp !== undefined ? valueProp : internalValue;
  const themeColors = isDark ? colors.dark : colors.light;

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (valueProp === undefined) {
      setInternalValue(val);
    }
    onValueChange?.(val);
  };

  const containerStyle = {
    position: "relative" as const,
    height: 40,
    justifyContent: "center" as const,
    opacity: disabled ? 0.38 : 1,
    ...style,
  };

  const trackStyle = {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(120, 120, 128, 0.2)",
    overflow: "hidden" as const,
    width: "100%",
  };

  const fillStyle = {
    height: "100%",
    width: `${percentage}%`,
    backgroundColor: themeColors.fill,
  };

  return (
    <div ref={ref} style={containerStyle} {...props}>
      <Glass effect="regular" style={trackStyle}>
        <div style={fillStyle} />
      </Glass>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        aria-label={accessibilityLabel}
        onChange={handleChange}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: disabled ? "default" : "pointer",
          margin: 0,
        }}
      />
    </div>
  );
});
