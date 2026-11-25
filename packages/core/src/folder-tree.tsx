import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";
import { useControllable } from "./internal/controllable";

export interface FolderTreeItemData {
  /** Stable id, used for selection and expansion state. */
  id: string;
  /** Row label. */
  label: ReactNode;
  /** Leading icon (folder or file glyph). */
  icon?: ReactNode;
  /** Nested items. Presence of children makes the row a folder. */
  children?: FolderTreeItemData[];
  /** Controlled expanded state for this folder. */
  expanded?: boolean;
  /** Initial expanded state for this folder (uncontrolled). */
  defaultExpanded?: boolean;
  disabled?: boolean;
}

function collectExpanded(items: FolderTreeItemData[], into = new Set<string>()): Set<string> {
  for (const item of items) {
    if (item.expanded || item.defaultExpanded) into.add(item.id);
    if (item.children) collectExpanded(item.children, into);
  }
  return into;
}

export interface FolderTreeProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect" | "onToggle"> {
  /** Nested items to render. */
  items: FolderTreeItemData[];
  /** Controlled id of the selected item. */
  selectedId?: string;
  /** Initial selected id (uncontrolled). */
  defaultSelectedId?: string;
  /** Called when an item is selected. */
  onSelect?: (id: string, item: FolderTreeItemData) => void;
  /** Controlled list of expanded folder ids. */
  expandedIds?: string[];
  /** Initial expanded folder ids (uncontrolled). */
  defaultExpandedIds?: string[];
  /** Called when a folder is expanded or collapsed. */
  onToggle?: (id: string, expanded: boolean, item: FolderTreeItemData) => void;
}

/**
 * A Liquid Glass folder tree — nested List rows with expand/collapse,
 * as in a file browser sidebar.
 *
 * Rows copy ListItem (same `gl-list-item` boxes, separator, selected
 * background); the expand chevron copies Accordion's chevron svg and
 * rotates it, as Accordion does, between collapsed and open.
 */
export const FolderTree: ForwardRefExoticComponent<FolderTreeProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, FolderTreeProps>(function FolderTree(
    {
      items,
      selectedId,
      defaultSelectedId,
      onSelect,
      expandedIds,
      defaultExpandedIds,
      onToggle,
      className,
      ...props
    },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);

    const [selected, setSelected] = useControllable(selectedId, defaultSelectedId ?? "", (id) => {
      if (id) onSelect?.(id, findItem(items, id)!);
    });
    // Roving tabindex: exactly one enabled row is in the tab order.
    const [focusedId, setFocusedId] = useState<string>(
      () => selected || items[0]?.id || "",
    );
    const [internalExpanded, setInternalExpanded] = useState<Set<string>>(() => {
      const seed = collectExpanded(items);
      for (const id of defaultExpandedIds ?? []) seed.add(id);
      return seed;
    });

    const isExpanded = (item: FolderTreeItemData): boolean => {
      if (item.expanded !== undefined) return item.expanded;
      if (expandedIds !== undefined) return expandedIds.includes(item.id);
      return internalExpanded.has(item.id);
    };

    const toggle = (item: FolderTreeItemData) => {
      const next = !isExpanded(item);
      if (item.expanded === undefined && expandedIds === undefined) {
        setInternalExpanded((prev) => {
          const copy = new Set(prev);
          if (next) copy.add(item.id);
          else copy.delete(item.id);
          return copy;
        });
      }
      onToggle?.(item.id, next, item);
    };

    const select = (item: FolderTreeItemData) => {
      if (item.disabled) return;
      setSelected(item.id);
      setFocusedId(item.id);
    };

    // Visible rows in DOM order, for roving tabindex and arrow-key moves.
    const visibleItems = (nodes: FolderTreeItemData[]): FolderTreeItemData[] => {
      const out: FolderTreeItemData[] = [];
      for (const item of nodes) {
        out.push(item);
        if (item.children?.length && isExpanded(item)) {
          out.push(...visibleItems(item.children));
        }
      }
      return out;
    };
    const visible = visibleItems(items);
    // The tab stop follows the focused row; if it was hidden by a collapse,
    // fall back to the selected row, then the first visible row.
    const activeId = visible.some((item) => item.id === focusedId)
      ? focusedId
      : (visible.find((item) => item.id === selected)?.id ?? visible[0]?.id ?? "");

    const focusRow = (id: string) => {
      setFocusedId(id);
      ref.current
        ?.querySelector<HTMLElement>(`[role="treeitem"][data-id="${id}"]`)
        ?.focus();
    };

    const moveFocus = (item: FolderTreeItemData, delta: number) => {
      const enabled = visible.filter((candidate) => !candidate.disabled);
      const index = enabled.findIndex((candidate) => candidate.id === item.id);
      const next = enabled[index + delta];
      if (next) focusRow(next.id);
    };

    const renderItems = (nodes: FolderTreeItemData[], depth: number): ReactNode =>
      nodes.map((item) => {
        const hasChildren = Boolean(item.children?.length);
        const expanded = hasChildren && isExpanded(item);
        const isSelected = selected === item.id;
        return (
          <div key={item.id}>
            <div
              role="treeitem"
              data-id={item.id}
              tabIndex={item.disabled ? undefined : activeId === item.id ? 0 : -1}
              aria-level={depth + 1}
              aria-expanded={hasChildren ? expanded : undefined}
              aria-selected={isSelected ? true : undefined}
              aria-disabled={item.disabled ? true : undefined}
              data-depth={depth === 0 ? undefined : depth}
              className={cx(
                "gl-list-item",
                "gl-folder-tree-row",
                isSelected && "gl-list-item-selected",
                item.disabled && "gl-list-item-disabled",
              )}
              style={{ paddingLeft: 16 + depth * 20 }}
              onClick={() => select(item)}
              onFocus={() => setFocusedId(item.id)}
              onKeyDown={(event) => {
                if (item.disabled) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  select(item);
                } else if (event.key === "ArrowRight" && hasChildren && !expanded) {
                  event.preventDefault();
                  toggle(item);
                } else if (event.key === "ArrowLeft" && hasChildren && expanded) {
                  event.preventDefault();
                  toggle(item);
                } else if (event.key === "ArrowDown") {
                  event.preventDefault();
                  moveFocus(item, 1);
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  moveFocus(item, -1);
                }
              }}
            >
              {hasChildren ? (
                <button
                  type="button"
                  aria-label={expanded ? `Collapse ${labelText(item.label)}` : `Expand ${labelText(item.label)}`}
                  tabIndex={-1}
                  data-expanded={expanded ? "" : undefined}
                  className="gl-folder-tree-chevron"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggle(item);
                  }}
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M4 6l4 4 4-4" />
                  </svg>
                </button>
              ) : (
                <span className="gl-folder-tree-chevron-spacer" aria-hidden />
              )}
              {item.icon && <span className="gl-list-leading">{item.icon}</span>}
              <span className="gl-list-label">
                <span className="gl-list-title">{item.label}</span>
              </span>
            </div>
            {hasChildren && expanded && (
              <div role="group">{renderItems(item.children!, depth + 1)}</div>
            )}
          </div>
        );
      });

    return (
      <div
        ref={ref}
        role="tree"
        aria-label="Folder tree"
        className={cx("gl-glass gl-list gl-folder-tree", className)}
        {...props}
      >
        <div className="gl-list-body">{renderItems(items, 0)}</div>
      </div>
    );
  });

function labelText(label: ReactNode): string {
  return typeof label === "string" ? label : "folder";
}

function findItem(items: FolderTreeItemData[], id: string): FolderTreeItemData | undefined {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItem(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
}
