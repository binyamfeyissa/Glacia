import { useState, type ReactNode } from "react";

/**
 * The app shell behind every dashboard block.
 *
 * Copies the layout of the reference designs: the viewport is the backdrop,
 * the sidebar is an inset panel with large radii, and the top strip and the
 * content panel are separate surfaces. Nothing touches the window edge, and
 * every gap is the same width, which is what makes the layout read as one
 * deliberate grid rather than a pile of boxes.
 */
export interface AppShellProps {
  /** Sidebar width in pixels. */
  sidebarWidth?: number;
  /** Rendered at the top of the sidebar. */
  brand?: ReactNode;
  /** Grouped navigation rows. */
  nav?: Array<{ label?: string; items: Array<{ id: string; label: string; icon?: ReactNode }> }>;
  activeId?: string;
  onSelect?: (id: string) => void;
  /** Bottom of the sidebar, above the user row. */
  footer?: ReactNode;
  /** The signed-in user shown at the base of the sidebar. */
  user?: { name: string; email: string; initials: string };
  /** The top strip next to the heading. */
  topbarRight?: ReactNode;
  heading?: ReactNode;
  subheading?: ReactNode;
  /** Background image URL. Falls back to a plain near-black. */
  image?: string;
  children: ReactNode;
}

export function AppShell({
  sidebarWidth = 264,
  brand,
  nav = [],
  activeId,
  onSelect,
  footer,
  user,
  topbarRight,
  heading,
  subheading,
  image,
  children,
}: AppShellProps) {
  return (
    <div
      className="gl-shell"
      data-backdrop={image ? "" : undefined}
      data-glacia-backdrop="true"
      data-glisse-backdrop="true"
      style={
        image
          ? ({ "--gl-shell-image": `url("${image}")` } as React.CSSProperties)
          : undefined
      }
    >
      <aside className="gl-shell-sidebar" style={{ width: sidebarWidth, flexBasis: sidebarWidth }}>
        {brand ? <div className="gl-shell-brand">{brand}</div> : null}

        {nav.map((group, gi) => (
          <div key={group.label ?? gi}>
            {group.label ? <div className="gl-shell-group-label">{group.label}</div> : null}
            <div className="gl-shell-nav">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="gl-shell-nav-item"
                  data-active={activeId === item.id}
                  aria-current={activeId === item.id ? "page" : undefined}
                  onClick={() => onSelect?.(item.id)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="gl-shell-spacer" />

        {footer ? <div className="gl-shell-foot">{footer}</div> : null}

        {user ? (
          <div className="gl-shell-user">
            <span className="gl-shell-user-avatar">{user.initials}</span>
            <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span className="gl-shell-user-name">{user.name}</span>
              <span className="gl-shell-user-mail">{user.email}</span>
            </span>
          </div>
        ) : null}
      </aside>

      <div className="gl-shell-main">
        <header className="gl-shell-topbar">
          <div style={{ minWidth: 0 }}>
            {heading ? <h1 className="gl-shell-heading">{heading}</h1> : null}
            {subheading ? <p className="gl-shell-subheading">{subheading}</p> : null}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {topbarRight}
          </div>
        </header>

        <div className="gl-shell-content">{children}</div>
      </div>
    </div>
  );
}
