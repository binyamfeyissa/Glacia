import * as React from "react";
import { AspectRatio as RadixAspectRatio } from "radix-ui";

export interface AspectRatioProps
  extends React.ComponentPropsWithoutRef<typeof RadixAspectRatio.Root> {
  glassBorder?: boolean;
}

export const AspectRatio = React.forwardRef<
  React.ElementRef<typeof RadixAspectRatio.Root>,
  AspectRatioProps
>(({ className = "", ratio = 16 / 9, glassBorder = false, children, ...props }, ref) => {
  return (
    <RadixAspectRatio.Root
      ref={ref}
      ratio={ratio}
      className={`gl-aspect-ratio ${glassBorder ? "gl-aspect-ratio-glass" : ""} ${className}`}
      {...props}
    >
      {children}
    </RadixAspectRatio.Root>
  );
});
AspectRatio.displayName = "AspectRatio";
