import { useState, forwardRef, type ReactNode } from "react";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";

export interface TabItem {
  /** Stable identifier for the tab. */
  id: string;
  /** What the tab reads. */
  label: string;
  /** An optional icon element drawn before the label. */
  icon?: ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  /** The active tab's `id`. Leave undefined and the component keeps it itself. */
  activeId?: string;
  defaultActiveId?: string;
  onTabChange?: (id: string) => void;
  style?: any;
  isDark?: boolean;
}

/**
 * A row of tabs on a glass rail, in the reference implementation's style: the
 * selected tab is a lifted inner pane rather than a flat highlight.
 *
 * Follows the same conventions as the other native components — no browser
 * APIs and no CSS — so it renders on iOS and Android. On iOS 26 the rail is
 * real glass through `@callstack/liquid-glass`; elsewhere it is a translucent
 * tint of the same shape with no layout shift.
 */
export const Tabs = forwardRef<any, TabsProps>(function Tabs(
  {
    items,
    activeId: activeProp,
    defaultActiveId,
    onTabChange,
    style,
    isDark = false,
    ...props
  },
  ref,
) {
  const [internalId, setInternalId] = useState(defaultActiveId || items[0]?.id || "");
  const activeId = activeProp !== undefined ? activeProp : internalId;
  const themeColors = isDark ? colors.dark : colors.light;

  const handleSelect = (id: string) => {
    if (activeProp === undefined) setInternalId(id);
    onTabChange?.(id);
  };

  return (
    <Glass
      ref={ref}
      effect="regular"
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
        padding: 4,
        borderRadius: radii.pill,
        ...style,
      }}
      {...props}
    >
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSelect(tab.id)}
            aria-selected={isActive}
            role="tab"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "8px 12px",
              border: 0,
              borderRadius: radii.pill,
              // The selection is a lens, not a fill: a lifted pane on the rail.
              background: isActive
                ? isDark
                  ? "rgba(255,255,255,0.16)"
                  : "rgba(255,255,255,0.72)"
                : "transparent",
              color: isActive ? themeColors.foreground : themeColors.muted,
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {tab.icon && <span style={{ fontSize: 14 }}>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </Glass>
  );
});
