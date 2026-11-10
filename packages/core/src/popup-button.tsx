import {
  forwardRef,
  useRef,
  useState,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";

export interface PopupButtonProps extends HTMLAttributes<HTMLButtonElement> {
  /** The label shown on the button. */
  label: string;
  /** Menu items: each has a label and action. */
  items: { label: string; onPress: () => void }[];
  /** Disabled state. */
  disabled?: boolean;
}

/**
 * A Pop-up Button — a glass button that, when tapped, shows a small menu of
 * choices above it. It is the iOS counterpart to a `<select>` / dropdown.
 */
export const PopupButton: ForwardRefExoticComponent<PopupButtonProps & RefAttributes<HTMLButtonElement>> = forwardRef<
  HTMLButtonElement,
  PopupButtonProps
>(function PopupButton(
  { label, items, disabled, className, ...props },
  forwardedRef,
) {
  const ref = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  return (
    <div className="gl-popup-button-host">
      <button
        ref={forwardedRef}
        type="button"
        className={cx("gl-glass gl-button gl-popup-button", open && "gl-popup-button-open", className)}
        disabled={disabled}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        {...props}
      >
        <span className="gl-popup-button-label">{label}</span>
        <span className="gl-popup-button-chevron" aria-hidden />
      </button>
      {open && (
        <>
          <div className="gl-popup-button-backdrop" onClick={() => setOpen(false)} />
          <div role="menu" className="gl-glass gl-popup-button-menu">
            {items.map((item, i) => (
              <button
                key={i}
                role="menuitem"
                type="button"
                className="gl-popup-button-item"
                onClick={() => {
                  setOpen(false);
                  item.onPress();
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
});