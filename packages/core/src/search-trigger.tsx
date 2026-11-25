import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";

import { Button, type ButtonProps } from "./button";
import { cx } from "./internal/cx";
import { Kbd } from "./kbd";

export interface SearchTriggerProps
  extends Omit<ButtonProps, "icon" | "children" | "variant"> {
  /** Label shown in the trigger. Defaults to "Search". */
  label?: string;
  /** Keyboard hint shown in a Kbd badge. Defaults to "⌘K". */
  shortcut?: string;
  /** Button size: 'sm' (32px), 'md' (40px, default), 'lg' (48px). */
  size?: "sm" | "md" | "lg";
}

/**
 * The glass button that opens the command palette: a Button with Command's
 * search icon, a label and a Kbd shortcut hint. Glass variant, Button sizes,
 * Button press / refraction behaviour — no new visuals. Wire `onClick` to
 * open a CommandDialog.
 */
export const SearchTrigger: ForwardRefExoticComponent<
  SearchTriggerProps & RefAttributes<HTMLButtonElement>
> = /* @__PURE__ */ forwardRef<HTMLButtonElement, SearchTriggerProps>(
  function SearchTrigger(
    { label = "Search", shortcut = "⌘K", size = "md", className, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLButtonElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);

    return (
      <Button
        ref={ref}
        variant="glass"
        size={size}
        className={cx("gl-search-trigger", className)}
        icon={
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        }
        {...props}
      >
        <span className="gl-search-trigger-label">{label}</span>
        <Kbd size={size}>{shortcut}</Kbd>
      </Button>
    );
  },
);
