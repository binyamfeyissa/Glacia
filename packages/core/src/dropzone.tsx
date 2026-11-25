import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type DragEvent,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";

import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export interface DropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, "onDrop"> {
  /** Primary label, e.g. "Drop files here". */
  label: ReactNode;
  /** Secondary description, e.g. "or click to browse". */
  description?: ReactNode;
  /** Accepted file types, passed to the file input (e.g. "image/*"). */
  accept?: string;
  /** Allow picking more than one file. */
  multiple?: boolean;
  disabled?: boolean;
  /** Called with the picked or dropped files. */
  onFiles?: (files: File[]) => void;
  /** Called with the dropped files (drop only, not the file picker). */
  onDrop?: (files: File[]) => void;
}

/**
 * A glass drop target — a Card surface that opens the file picker on tap
 * and accepts dropped files. The drag-over state is a `data-dragging`
 * hook on the Card surface; no new material is added.
 */
export const Dropzone: ForwardRefExoticComponent<DropzoneProps & RefAttributes<HTMLDivElement>> =
  /* @__PURE__ */ forwardRef<HTMLDivElement, DropzoneProps>(function Dropzone(
    {
      label,
      description,
      accept,
      multiple,
      disabled,
      onFiles,
      onDrop,
      className,
      children,
      ...props
    },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    useRefraction(ref);
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    // Drag events fire per child element, so a plain onDragLeave would clear
    // the state while the pointer is still inside (moving between children).
    // Count enters/leaves instead: only the last leave clears the state.
    const dragCount = useRef(0);

    const openPicker = () => {
      if (!disabled) inputRef.current?.click();
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (disabled) return;
      dragCount.current = 0;
      setDragging(false);
      const files = Array.from(event.dataTransfer.files);
      if (files.length === 0) return;
      onDrop?.(files);
      onFiles?.(files);
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? undefined : 0}
        aria-disabled={disabled ? true : undefined}
        data-dragging={dragging ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragEnter={(event) => {
          event.preventDefault();
          if (disabled) return;
          dragCount.current += 1;
          setDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => {
          dragCount.current = Math.max(0, dragCount.current - 1);
          if (dragCount.current === 0) setDragging(false);
        }}
        onDrop={handleDrop}
        className={cx("gl-glass gl-card gl-dropzone", disabled && "gl-dropzone-disabled", className)}
        // The refraction engine writes data-rim and data-refracting from
        // measured geometry after hydration; those writes are intentional.
        suppressHydrationWarning
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden
          className="gl-dropzone-input"
          onChange={(event) => {
            const files = Array.from(event.target.files ?? []);
            // Reset so picking the same file twice still fires onChange.
            event.target.value = "";
            if (files.length > 0) onFiles?.(files);
          }}
        />
        <div className="gl-dropzone-label">{label}</div>
        {description && <div className="gl-dropzone-description">{description}</div>}
        {children}
      </div>
    );
  });
