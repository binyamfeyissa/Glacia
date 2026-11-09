import * as React from "react";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  size?: "sm" | "md" | "lg";
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className = "", size = "md", children, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={`gl-kbd gl-kbd-${size} ${className}`}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);
Kbd.displayName = "Kbd";
