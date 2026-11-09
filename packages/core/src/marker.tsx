import * as React from "react";

export interface MarkerProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: "blue" | "green" | "orange" | "red" | "purple";
  label?: React.ReactNode;
  pulse?: boolean;
}

export const Marker = React.forwardRef<HTMLDivElement, MarkerProps>(
  ({ color = "blue", label, pulse = true, className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`gl-marker-root gl-marker-${color} ${className}`}
        {...props}
      >
        <div className="gl-marker-pin gl-glass">
          {pulse && <span className="gl-marker-pulse" aria-hidden="true" />}
          <span className="gl-marker-dot" />
        </div>
        {(label || children) && (
          <div className="gl-marker-label gl-glass">
            {label || children}
          </div>
        )}
      </div>
    );
  }
);
Marker.displayName = "Marker";

export interface TextMarkerProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "yellow" | "green" | "blue" | "pink" | "orange";
}

export const TextMarker = React.forwardRef<HTMLSpanElement, TextMarkerProps>(
  ({ variant = "yellow", className = "", children, ...props }, ref) => {
    return (
      <mark
        ref={ref}
        className={`gl-text-marker gl-text-marker-${variant} ${className}`}
        {...props}
      >
        {children}
      </mark>
    );
  }
);
TextMarker.displayName = "TextMarker";
