import { forwardRef, type ReactNode } from "react";
import { FallbackGlassView } from "./fallback";

declare const require: any;

export interface NativeGlassProps {
  effect?: "clear" | "regular" | "none";
  tintColor?: string;
  interactive?: boolean;
  style?: any;
  children?: ReactNode;
}

let LiquidGlassViewComponent: any = null;
let supported = false;

try {
  const liquidGlass = require("@callstack/liquid-glass");
  if (liquidGlass && liquidGlass.LiquidGlassView) {
    LiquidGlassViewComponent = liquidGlass.LiquidGlassView;
    supported = Boolean(liquidGlass.isLiquidGlassSupported);
  }
} catch {
  supported = false;
}

export const isGlassSupported = supported;

/**
 * Platform Glass View:
 * - iOS 26+: Real UIGlassEffect via @callstack/liquid-glass
 * - iOS < 26 / Android / Expo Go / Fallback: Smooth translucent tint View with identical layout
 */
export const GlassView = forwardRef<any, NativeGlassProps>(function GlassView(
  {
    effect = "regular",
    tintColor,
    interactive = false,
    style,
    children,
    ...props
  },
  ref,
) {
  if (isGlassSupported && LiquidGlassViewComponent) {
    return (
      <LiquidGlassViewComponent
        ref={ref}
        effect={effect}
        tintColor={tintColor}
        interactive={interactive}
        style={style}
        {...props}
      >
        {children}
      </LiquidGlassViewComponent>
    );
  }

  return (
    <FallbackGlassView
      ref={ref}
      effect={effect}
      tintColor={tintColor}
      style={style}
      {...props}
    >
      {children}
    </FallbackGlassView>
  );
});
