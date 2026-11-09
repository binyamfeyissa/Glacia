import * as React from "react";

interface ResizableContextValue {
  direction: "horizontal" | "vertical";
  sizes: number[];
  setSizes: React.Dispatch<React.SetStateAction<number[]>>;
  registerPanel: (index: number, defaultSize: number) => void;
  updateSize: (index: number, deltaPercent: number) => void;
}

const ResizableContext = React.createContext<ResizableContextValue | null>(null);

export interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "horizontal" | "vertical";
}

export const ResizablePanelGroup = React.forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  ({ direction = "horizontal", className = "", children, ...props }, ref) => {
    const [sizes, setSizes] = React.useState<number[]>([]);
    const initialSizes = React.useRef<number[]>([]);

    const registerPanel = React.useCallback((index: number, defaultSize: number) => {
      setSizes((prev) => {
        if (prev[index] === defaultSize) return prev;
        const next = [...prev];
        next[index] = defaultSize;
        return next;
      });
    }, []);

    const updateSize = React.useCallback((index: number, deltaPercent: number) => {
      setSizes((prev) => {
        if (index < 0 || index >= prev.length - 1) return prev;
        const next = [...prev];
        const currentFirst = next[index] ?? 50;
        const currentSecond = next[index + 1] ?? 50;
        const newFirst = Math.max(10, Math.min(90, currentFirst + deltaPercent));
        const diff = newFirst - currentFirst;
        next[index] = newFirst;
        next[index + 1] = Math.max(10, currentSecond - diff);
        return next;
      });
    }, []);

    const contextValue = React.useMemo(
      () => ({ direction, sizes, setSizes, registerPanel, updateSize }),
      [direction, sizes, registerPanel, updateSize]
    );

    return (
      <ResizableContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={`gl-resizable-group gl-resizable-${direction} ${className}`}
          {...props}
        >
          {children}
        </div>
      </ResizableContext.Provider>
    );
  }
);
ResizablePanelGroup.displayName = "ResizablePanelGroup";

export interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  order?: number;
}

export const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ defaultSize = 50, minSize = 10, maxSize = 90, order = 0, className = "", style, children, ...props }, ref) => {
    const ctx = React.useContext(ResizableContext);
    const registerPanel = ctx?.registerPanel;

    React.useEffect(() => {
      registerPanel?.(order, defaultSize);
    }, [registerPanel, order, defaultSize]);

    const size = ctx?.sizes[order] ?? defaultSize;

    return (
      <div
        ref={ref}
        className={`gl-resizable-panel ${className}`}
        style={{
          flex: `${size} 1 0%`,
          minWidth: ctx?.direction === "horizontal" ? `${minSize}%` : undefined,
          minHeight: ctx?.direction === "vertical" ? `${minSize}%` : undefined,
          maxWidth: ctx?.direction === "horizontal" ? `${maxSize}%` : undefined,
          maxHeight: ctx?.direction === "vertical" ? `${maxSize}%` : undefined,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ResizablePanel.displayName = "ResizablePanel";

export interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  withHandle?: boolean;
}

export const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ withHandle = true, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        className={`gl-resizable-handle ${className}`}
        tabIndex={0}
        {...props}
      >
        {withHandle && (
          <div className="gl-resizable-grip" aria-hidden="true">
            <span className="gl-resizable-grip-bar" />
          </div>
        )}
      </div>
    );
  }
);
ResizableHandle.displayName = "ResizableHandle";
