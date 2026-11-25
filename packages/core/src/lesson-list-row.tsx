import {
  forwardRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";

export interface LessonListRowProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Lesson number shown in the leading badge (1-based). */
  index: number;
  /** Lesson title. */
  title: ReactNode;
  /** Length shown as the trailing accessory, e.g. "12:04". */
  duration?: ReactNode;
  /** Lesson already watched — shows a check in the leading badge. */
  completed?: boolean;
  /** Lesson not yet available — shows a lock, disables the row. */
  locked?: boolean;
  /** Called when the row is tapped. Omitted for a non-interactive row. */
  onSelect?: () => void;
}

/**
 * A lesson row for course lists. Reference is ListItem, copied exactly:
 * the same `gl-list-item` layout (leading badge, title, trailing
 * accessory, inset separator), the same interactive behaviour (role
 * button, keyboard handling, aria-pressed) — with the leading badge
 * carrying the lesson index, a check when completed, or a lock when locked.
 */
export const LessonListRow: ForwardRefExoticComponent<
  LessonListRowProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, LessonListRowProps>(
  function LessonListRow(
    { index, title, duration, completed, locked, onSelect, className, ...props },
    forwardedRef,
  ) {
    // Mirrors ListItem: a row may or may not be interactive, and mixing the
    // two element types would make the prop types incompatible. A locked row
    // is never interactive.
    const interactive = Boolean(onSelect) && !locked;
    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!interactive) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect?.();
      }
    };

    return (
      <div
        ref={forwardedRef}
        role={onSelect ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-disabled={locked ? true : undefined}
        data-completed={completed ? "" : undefined}
        data-locked={locked ? "" : undefined}
        onClick={interactive ? onSelect : undefined}
        onKeyDown={handleKeyDown}
        className={cx(
          "gl-list-item",
          "gl-lesson-list-row",
          Boolean(onSelect) && "gl-list-item-interactive",
          locked && "gl-list-item-disabled",
          className,
        )}
        {...props}
      >
        <span className="gl-list-leading" aria-hidden>
          {locked ? (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              className="gl-lesson-list-row-lock"
            >
              <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" />
              <path d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7" />
            </svg>
          ) : completed ? (
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="gl-lesson-list-row-check"
            >
              <path d="M3 8.5l3.5 3.5L13 4.5" />
            </svg>
          ) : (
            <span className="gl-lesson-list-row-index">{index}</span>
          )}
        </span>
        <span className="gl-list-label">
          <span className="gl-list-title">{title}</span>
        </span>
        {duration && <span className="gl-list-trailing">{duration}</span>}
      </div>
    );
  },
);
