import {
  Children,
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";
import { usePress } from "./internal/press";
import { useRefraction } from "./internal/refraction";

export interface KanbanCardData {
  /** Stable id, used for selection. */
  id: string;
  /** Card title. */
  title: ReactNode;
  /** Secondary line under the title. */
  description?: ReactNode;
  /** Trailing meta (labels, avatars, dates). */
  meta?: ReactNode;
}

export interface KanbanColumnData {
  /** Stable id. */
  id: string;
  /** Column title. */
  title: ReactNode;
  /** Card count shown beside the title; defaults to `cards.length`. */
  count?: number;
  /** Cards in this column. */
  cards: KanbanCardData[];
}

export interface KanbanProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns to render. When omitted, render `KanbanColumn` children. */
  columns?: KanbanColumnData[];
  /**
   * Called when a card is selected. Columns mode only: with `KanbanColumn`
   * children, selection is not injected — pass `onSelect` / `selected` to
   * each `KanbanCard` directly. (Injection would need an `id` on
   * `KanbanCard`, which it has no prop for, so the parent cannot report
   * which card was tapped.)
   */
  onSelectCard?: (id: string, card: KanbanCardData) => void;
  /** Controlled id of the selected card. Columns mode only, as above. */
  selectedCardId?: string;
}

/**
 * A kanban board — a horizontal row of glass columns holding glass cards,
 * as in a project board. Static layout + selection only: the kit has no
 * drag-and-drop primitive, so cards do not drag.
 */
export const Kanban: ForwardRefExoticComponent<KanbanProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, KanbanProps>(function Kanban(
    { columns, onSelectCard, selectedCardId, className, children, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);

    return (
      <div ref={ref} className={cx("gl-kanban", className)} {...props}>
        {columns
          ? columns.map((column) => (
              <KanbanColumn
                key={column.id}
                title={column.title}
                count={column.count ?? column.cards.length}
                cards={column.cards}
                onSelectCard={onSelectCard}
                selectedCardId={selectedCardId}
              />
            ))
          : children}
      </div>
    );
  });

export interface KanbanColumnProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Column title. */
  title: ReactNode;
  /** Card count shown beside the title; defaults to `cards.length`. */
  count?: number;
  /** Cards in this column. When omitted, render `KanbanCard` children. */
  cards?: KanbanCardData[];
  /** Called when a card is selected. */
  onSelectCard?: (id: string, card: KanbanCardData) => void;
  /** Controlled id of the selected card. */
  selectedCardId?: string;
}

export const KanbanColumn: ForwardRefExoticComponent<
  KanbanColumnProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, KanbanColumnProps>(function KanbanColumn(
  { title, count, cards, onSelectCard, selectedCardId, className, children, ...props },
  forwardedRef,
) {
  const ref = useRef<HTMLDivElement>(null);
  useImperativeHandle(forwardedRef, () => ref.current!);
  useRefraction(ref);

  // When composed from children there is no `cards` array to count.
  const derivedCount = count ?? cards?.length ?? Children.count(children);

  return (
    <section
      ref={ref}
      aria-label={typeof title === "string" ? title : undefined}
      className={cx("gl-glass gl-card gl-kanban-column", className)}
      // The refraction engine writes data-rim and data-refracting from
      // measured geometry after hydration; those writes are intentional.
      suppressHydrationWarning
      {...props}
    >
      <header className="gl-kanban-column-header">
        <h3 className="gl-kanban-column-title">{title}</h3>
        <span className="gl-badge gl-kanban-count">{derivedCount}</span>
      </header>
      <div className="gl-kanban-column-body">
        {cards
          ? cards.map((card) => (
              <KanbanCard
                key={card.id}
                title={card.title}
                description={card.description}
                meta={card.meta}
                selected={selectedCardId === card.id}
                onSelect={onSelectCard ? () => onSelectCard(card.id, card) : undefined}
              />
            ))
          : children}
      </div>
    </section>
  );
});

export interface KanbanCardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onSelect"> {
  /** Card title. */
  title: ReactNode;
  /** Secondary line under the title. */
  description?: ReactNode;
  /** Trailing meta (labels, avatars, dates). */
  meta?: ReactNode;
  /** If true, the card is marked as selected. */
  selected?: boolean;
  disabled?: boolean;
  /** Called when the card is tapped. */
  onSelect?: () => void;
}

export const KanbanCard: ForwardRefExoticComponent<KanbanCardProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, KanbanCardProps>(function KanbanCard(
    { title, description, meta, selected, disabled, onSelect, className, children, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    usePress(ref);
    useRefraction(ref);

    const interactive = Boolean(onSelect) && !disabled;
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!interactive) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect?.();
      }
    };

    return (
      <div
        ref={ref}
        role={onSelect ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-disabled={disabled ? true : undefined}
        aria-pressed={selected ? true : undefined}
        data-selected={selected ? "" : undefined}
        onClick={interactive ? onSelect : undefined}
        onKeyDown={handleKeyDown}
        className={cx(
          "gl-glass gl-kanban-card",
          interactive && "gl-kanban-card-interactive",
          disabled && "gl-kanban-card-disabled",
          className,
        )}
        // The refraction engine writes data-rim and data-refracting from
        // measured geometry after hydration; those writes are intentional.
        suppressHydrationWarning
        {...props}
      >
        <div className="gl-kanban-card-title">{title}</div>
        {description && <div className="gl-kanban-card-description">{description}</div>}
        {meta && <div className="gl-kanban-card-meta">{meta}</div>}
        {children}
      </div>
    );
  });
