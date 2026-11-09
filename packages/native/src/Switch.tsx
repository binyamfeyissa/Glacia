import { useState, forwardRef } from "react";
import { Glass } from "./Glass";
import { colors } from "./internal/tokens";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  accessibilityLabel: string;
  style?: any;
  isDark?: boolean;
}

export const Switch = forwardRef<any, SwitchProps>(function Switch(
  {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    accessibilityLabel,
    style,
    isDark = false,
    ...props
  },
  ref,
) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checkedProp !== undefined ? checkedProp : internalChecked;
  const themeColors = isDark ? colors.dark : colors.light;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (checkedProp === undefined) {
      setInternalChecked(next);
    }
    onCheckedChange?.(next);
  };

  const trackStyle = {
    width: 51,
    height: 31,
    borderRadius: 15.5,
    backgroundColor: isChecked ? themeColors.fill : "rgba(120, 120, 128, 0.16)",
    padding: 2,
    justifyContent: "center" as const,
    opacity: disabled ? 0.38 : 1,
    transition: "background-color 200ms ease",
    ...style,
  };

  const thumbStyle = {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    backgroundColor: "#FFFFFF",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    transform: isChecked ? "translateX(20px)" : "translateX(0px)",
    transition: "transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)",
  };

  return (
    <div
      ref={ref}
      role="switch"
      aria-checked={isChecked}
      aria-label={accessibilityLabel}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={toggle}
      style={{ display: "inline-block", cursor: disabled ? "default" : "pointer" }}
      {...props}
    >
      <Glass effect="regular" style={trackStyle}>
        <div style={thumbStyle} />
      </Glass>
    </div>
  );
});
