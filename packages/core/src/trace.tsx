import * as React from "react";

export interface TraceProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
}

export const Trace = React.forwardRef<HTMLDivElement, TraceProps>(
  ({ title = "Reasoning Trace", className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`gl-trace gl-glass ${className}`} {...props}>
        {title && (
          <div className="gl-trace-header">
            <span className="gl-trace-sparkle" aria-hidden="true">✦</span>
            <span className="gl-trace-title">{title}</span>
          </div>
        )}
        <div className="gl-trace-steps">{children}</div>
      </div>
    );
  }
);
Trace.displayName = "Trace";

export interface TraceStepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  status?: "running" | "completed" | "failed" | "idle";
  duration?: string;
  defaultExpanded?: boolean;
}

export const TraceStep = React.forwardRef<HTMLDivElement, TraceStepProps>(
  (
    {
      title,
      status = "completed",
      duration,
      defaultExpanded = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const [expanded, setExpanded] = React.useState(defaultExpanded);

    return (
      <div
        ref={ref}
        className={`gl-trace-step gl-trace-step-${status} ${className}`}
        {...props}
      >
        <div
          className="gl-trace-step-row"
          onClick={() => setExpanded(!expanded)}
          role="button"
          tabIndex={0}
        >
          <div className="gl-trace-step-status-icon">
            {status === "running" ? (
              <span className="gl-trace-spinner" aria-hidden="true" />
            ) : status === "completed" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : status === "failed" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            ) : (
              <span className="gl-trace-bullet" />
            )}
          </div>
          <span className="gl-trace-step-title">{title}</span>
          {duration && <span className="gl-trace-duration">{duration}</span>}
          {children && (
            <span className={`gl-trace-chevron ${expanded ? "gl-open" : ""}`} aria-hidden="true">
              ›
            </span>
          )}
        </div>
        {expanded && children && (
          <div className="gl-trace-step-body">{children}</div>
        )}
      </div>
    );
  }
);
TraceStep.displayName = "TraceStep";

export interface TraceDetailsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TraceDetails = React.forwardRef<HTMLDivElement, TraceDetailsProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`gl-trace-details ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
TraceDetails.displayName = "TraceDetails";
