import * as React from "react";

export interface MessageScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  autoScroll?: boolean;
}

export const MessageScroller = React.forwardRef<HTMLDivElement, MessageScrollerProps>(
  ({ autoScroll = true, className = "", children, ...props }, ref) => {
    const internalRef = React.useRef<HTMLDivElement>(null);
    const bottomRef = React.useRef<HTMLDivElement>(null);
    const [showScrollBottom, setShowScrollBottom] = React.useState(false);

    const scrollToBottom = (smooth = true) => {
      if (typeof bottomRef.current?.scrollIntoView === "function") {
        bottomRef.current.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
      }
    };

    React.useEffect(() => {
      if (autoScroll) {
        scrollToBottom(false);
      }
    }, [children, autoScroll]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowScrollBottom(distanceFromBottom > 120);
    };

    return (
      <div
        ref={(node) => {
          (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onScroll={handleScroll}
        className={`gl-message-scroller ${className}`}
        {...props}
      >
        <div className="gl-message-scroller-inner">{children}</div>
        <div ref={bottomRef} className="gl-message-scroller-bottom-anchor" aria-hidden="true" />
        {showScrollBottom && (
          <button
            type="button"
            onClick={() => scrollToBottom(true)}
            className="gl-scroll-bottom-btn gl-glass"
            aria-label="Scroll to bottom"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);
MessageScroller.displayName = "MessageScroller";

export interface MessageDateDividerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const MessageDateDivider = React.forwardRef<HTMLDivElement, MessageDateDividerProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`gl-message-date-divider-wrap ${className}`} {...props}>
        <span className="gl-message-date-divider gl-glass">{children}</span>
      </div>
    );
  }
);
MessageDateDivider.displayName = "MessageDateDivider";
