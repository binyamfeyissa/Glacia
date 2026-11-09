import {
  createContext,
  useContext,
  useState,
  forwardRef,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cx } from "./internal/cx";

interface SidebarContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({
  defaultOpen = true,
  children,
}: {
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        toggle: () => setOpen((prev) => !prev),
      }}
    >
      <div className="gl-sidebar-wrapper">{children}</div>
    </SidebarContext.Provider>
  );
}

export const Sidebar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  function Sidebar({ className, children, ...props }, ref) {
    const { open } = useSidebar();
    return (
      <aside
        ref={ref}
        data-state={open ? "expanded" : "collapsed"}
        className={cx("gl-glass gl-sidebar", className)}
        {...props}
      >
        {children}
      </aside>
    );
  },
);

export const SidebarTrigger = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  function SidebarTrigger({ className, ...props }, ref) {
    const { toggle } = useSidebar();
    return (
      <button
        ref={ref}
        type="button"
        onClick={toggle}
        className={cx("gl-glass gl-button gl-sidebar-trigger", className)}
        aria-label="Toggle Sidebar"
        data-size="sm"
        data-icon="only"
        {...props}
      >
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="14" height="14" rx="3" />
          <line x1="8" y1="3" x2="8" y2="17" />
        </svg>
      </button>
    );
  },
);

export const SidebarHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cx("gl-sidebar-header", className)} {...props} />;
  },
);

export const SidebarContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarContent({ className, ...props }, ref) {
    return <div ref={ref} className={cx("gl-sidebar-content", className)} {...props} />;
  },
);

export const SidebarFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function SidebarFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cx("gl-sidebar-footer", className)} {...props} />;
  },
);

export const SidebarMenu = forwardRef<HTMLUListElement, HTMLAttributes<HTMLUListElement>>(
  function SidebarMenu({ className, ...props }, ref) {
    return <ul ref={ref} className={cx("gl-sidebar-menu", className)} {...props} />;
  },
);

export const SidebarMenuItem = forwardRef<HTMLLIElement, HTMLAttributes<HTMLLIElement>>(
  function SidebarMenuItem({ className, ...props }, ref) {
    return <li ref={ref} className={cx("gl-sidebar-menu-item", className)} {...props} />;
  },
);

export interface SidebarMenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
}

export const SidebarMenuButton = forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  function SidebarMenuButton({ className, isActive, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        className={cx("gl-sidebar-menu-button", className)}
        data-active={isActive ? "" : undefined}
        {...props}
      />
    );
  },
);
