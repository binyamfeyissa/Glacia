import { forwardRef, type ReactNode } from "react";
import { colors, radii } from "./tokens";

export interface FallbackGlassProps {
  effect?: "clear" | "regular" | "none";
  tintColor?: string;
  style?: any;
  children?: ReactNode;
  isDark?: boolean;
}

export const FallbackGlassView = forwardRef<any, FallbackGlassProps>(function FallbackGlassView(
  {
    effect = "regular",
    tintColor,
    style,
    children,
    isDark = false,
    ...props
  },
  ref,
) {
  const themeColors = isDark ? colors.dark : colors.light;

  const bg =
    effect === "none"
      ? "transparent"
      : effect === "clear"
      ? "rgba(255, 255, 255, 0.25)"
      : tintColor || themeColors.glass;

  const containerStyle = {
    backgroundColor: bg,
    borderColor: themeColors.edge,
    borderWidth: 0.5,
    borderRadius: radii.md,
    overflow: "hidden" as const,
    ...style,
  };

  return (
    <div ref={ref} style={containerStyle} {...props}>
      {children}
    </div>
  );
});
