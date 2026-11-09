import { useState, forwardRef, type ReactNode } from "react";
import { Glass } from "./Glass";
import { colors, radii } from "./internal/tokens";

export interface TabBarItem {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface TabBarProps {
  items: TabBarItem[];
  activeId?: string;
  defaultActiveId?: string;
  onTabChange?: (id: string) => void;
  style?: any;
  isDark?: boolean;
}

export const TabBar = forwardRef<any, TabBarProps>(function TabBar(
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
    if (activeProp === undefined) {
      setInternalId(id);
    }
    onTabChange?.(id);
  };

  const barStyle = {
    position: "relative" as const,
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-around" as const,
    height: 52,
    paddingHorizontal: 8,
    borderRadius: radii.xl,
    ...style,
  };

  return (
    <Glass ref={ref} effect="regular" style={barStyle} {...props}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleSelect(tab.id)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              padding: "4px 8px",
              border: 0,
              background: "transparent",
              color: isActive ? themeColors.fill : themeColors.muted,
              fontSize: 11,
              fontWeight: isActive ? 600 : 500,
              cursor: "pointer",
            }}
          >
            {tab.icon && <span style={{ fontSize: 18 }}>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </Glass>
  );
});
