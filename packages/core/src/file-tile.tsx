import {
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

export interface FileTileProps extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  /** Leading icon, shown in the icon plate when no thumb is given. */
  icon?: ReactNode;
  /** Thumbnail (e.g. an image or preview) shown above the name. Wins over `icon`. */
  thumb?: ReactNode;
  /** File name. */
  name: ReactNode;
  /** Secondary line under the name (size, date, kind). */
  meta?: ReactNode;
  /** Trailing actions (buttons, menu). Clicks on actions do not select the tile. */
  actions?: ReactNode;
  /** If true, the tile is marked as selected. */
  selected?: boolean;
  disabled?: boolean;
  /** Called when the tile is tapped. */
  onSelect?: () => void;
}

/**
 * A compact glass tile for one file — a Card surface with an Item-style
 * icon plate, name and meta, as in a file grid.
 */
export const FileTile: ForwardRefExoticComponent<FileTileProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, FileTileProps>(function FileTile(
    { icon, thumb, name, meta, actions, selected, disabled, onSelect, className, children, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    usePress(ref);
    useRefraction(ref);

    // Always a div, as ListItem is: a tile may or may not be interactive,
    // and mixing element types would make the prop types incompatible.
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
          "gl-glass gl-card gl-file-tile",
          interactive && "gl-file-tile-interactive",
          disabled && "gl-file-tile-disabled",
          className,
        )}
        // The refraction engine writes data-rim and data-refracting from
        // measured geometry after hydration; those writes are intentional.
        suppressHydrationWarning
        {...props}
      >
        {thumb ? (
          <div className="gl-file-tile-thumb">{thumb}</div>
        ) : (
          icon && <div className="gl-file-tile-icon">{icon}</div>
        )}
        <div className="gl-file-tile-body">
          <div className="gl-file-tile-name">{name}</div>
          {meta && <div className="gl-file-tile-meta">{meta}</div>}
          {children}
        </div>
        {actions && (
          <div
            className="gl-file-tile-actions"
            onClick={(event) => event.stopPropagation()}
          >
            {actions}
          </div>
        )}
      </div>
    );
  });
