import {
  forwardRef,
  useRef,
  useState,
  useId,
  useEffect,
  type ForwardRefExoticComponent,
  type RefAttributes,
  type ReactNode,
} from "react";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  emptyMessage?: string;
  "aria-label"?: string;
}

export const Combobox: ForwardRefExoticComponent<
  ComboboxProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, ComboboxProps>(
  function Combobox(
    {
      options,
      value: controlledValue,
      defaultValue = "",
      onChange,
      placeholder = "Select option...",
      disabled = false,
      className,
      emptyMessage = "No results found",
      "aria-label": ariaLabel,
    },
    ref
  ) {
    const listboxId = useId();
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(controlledValue ?? defaultValue);
    const [search, setSearch] = useState("");
    const [highlightIndex, setHighlightIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useRefraction(popoverRef);

    useEffect(() => {
      if (controlledValue !== undefined) {
        setSelectedValue(controlledValue);
      }
    }, [controlledValue]);

    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const handleSelect = (val: string) => {
      setSelectedValue(val);
      onChange?.(val);
      setOpen(false);
      setSearch("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!open) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[highlightIndex] && !filtered[highlightIndex].disabled) {
          handleSelect(filtered[highlightIndex].value);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };

    // Close on click outside
    useEffect(() => {
      if (!open) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    return (
      <div
        ref={containerRef}
        className={cx("gl-combobox", className)}
        data-open={open ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        onKeyDown={handleKeyDown}
      >
        <div
          className="gl-glass gl-combobox-trigger"
          onClick={() => !disabled && setOpen(!open)}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-label={ariaLabel || placeholder}
        >
          <span className="gl-combobox-value">
            {selectedOption ? selectedOption.label : <span className="gl-combobox-placeholder">{placeholder}</span>}
          </span>
          <span className="gl-combobox-icon" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {open && (
          <div ref={popoverRef} className="gl-glass gl-combobox-dropdown" role="listbox" id={listboxId}>
            <div className="gl-combobox-search-wrapper">
              <input
                ref={inputRef}
                autoFocus
                type="text"
                className="gl-combobox-search"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setHighlightIndex(0);
                }}
              />
            </div>
            <div className="gl-combobox-options">
              {filtered.length === 0 ? (
                <div className="gl-combobox-empty">{emptyMessage}</div>
              ) : (
                filtered.map((opt, i) => {
                  const isSelected = opt.value === selectedValue;
                  const isHighlighted = i === highlightIndex;
                  return (
                    <div
                      key={opt.value}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={opt.disabled}
                      data-highlighted={isHighlighted ? "" : undefined}
                      className="gl-combobox-option"
                      onClick={() => !opt.disabled && handleSelect(opt.value)}
                      onMouseEnter={() => setHighlightIndex(i)}
                    >
                      {opt.icon && <span className="gl-combobox-option-icon">{opt.icon}</span>}
                      <span className="gl-combobox-option-label">{opt.label}</span>
                      {isSelected && (
                        <span className="gl-combobox-check" aria-hidden="true">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);
