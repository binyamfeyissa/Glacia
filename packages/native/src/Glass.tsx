import { forwardRef } from "react";
import { GlassView, type NativeGlassProps } from "./internal/GlassView";

export interface GlassProps extends NativeGlassProps {
  testID?: string;
}

export const Glass = forwardRef<any, GlassProps>(function Glass(
  { effect = "regular", tintColor, interactive = false, style, children, ...props },
  ref,
) {
  return (
    <GlassView
      ref={ref}
      effect={effect}
      tintColor={tintColor}
      interactive={interactive}
      style={style}
      {...props}
    >
      {children}
    </GlassView>
  );
});
