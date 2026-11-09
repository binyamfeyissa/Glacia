import * as React from "react";
import { Dialog as RadixDialog } from "radix-ui";

interface CommandContextValue {
  search: string;
  setSearch: (s: string) => void;
}

const CommandContext = React.createContext<CommandContextValue>({
  search: "",
  setSearch: () => {},
});

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className = "", children, ...props }, ref) => {
    const [search, setSearch] = React.useState("");

    return (
      <CommandContext.Provider value={{ search, setSearch }}>
        <div ref={ref} className={`gl-command-root gl-glass ${className}`} {...props}>
          {children}
        </div>
      </CommandContext.Provider>
    );
  }
);
Command.displayName = "Command";

export interface CommandDialogProps extends RadixDialog.DialogProps {
  children: React.ReactNode;
}

export function CommandDialog({ children, ...props }: CommandDialogProps) {
  return (
    <RadixDialog.Root {...props}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="gl-dialog-overlay" />
        <RadixDialog.Content className="gl-command-dialog-content">
          <RadixDialog.Title className="visually-hidden">Command Palette</RadixDialog.Title>
          <RadixDialog.Description className="visually-hidden">
            Search commands and jump to items.
          </RadixDialog.Description>
          <Command className="gl-command-inside-dialog">{children}</Command>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export interface CommandInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onValueChange?: (val: string) => void;
}

export const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className = "", placeholder = "Type a command or search…", onValueChange, ...props }, ref) => {
    const ctx = React.useContext(CommandContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      ctx.setSearch(e.target.value);
      onValueChange?.(e.target.value);
    };

    return (
      <div className="gl-command-input-wrapper">
        <svg
          className="gl-command-search-icon"
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
        <input
          ref={ref}
          type="text"
          value={ctx.search}
          onChange={handleChange}
          placeholder={placeholder}
          className={`gl-command-input ${className}`}
          {...props}
        />
      </div>
    );
  }
);
CommandInput.displayName = "CommandInput";

export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`gl-command-list ${className}`} {...props}>
        {children}
      </div>
    );
  }
);
CommandList.displayName = "CommandList";

export interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`gl-command-empty ${className}`} {...props}>
        {children || "No results found."}
      </div>
    );
  }
);
CommandEmpty.displayName = "CommandEmpty";

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
}

export const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ heading, className = "", children, ...props }, ref) => {
    return (
      <div ref={ref} className={`gl-command-group ${className}`} {...props}>
        {heading && <div className="gl-command-group-heading">{heading}</div>}
        <div className="gl-command-group-items">{children}</div>
      </div>
    );
  }
);
CommandGroup.displayName = "CommandGroup";

export interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  onSelect?: () => void;
}

export const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ disabled = false, onSelect, className = "", children, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="option"
        aria-disabled={disabled}
        className={`gl-command-item ${disabled ? "gl-disabled" : ""} ${className}`}
        onClick={(e) => {
          if (disabled) return;
          onClick?.(e);
          onSelect?.();
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CommandItem.displayName = "CommandItem";

export interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const CommandShortcut = React.forwardRef<HTMLSpanElement, CommandShortcutProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <span ref={ref} className={`gl-command-shortcut ${className}`} {...props}>
        {children}
      </span>
    );
  }
);
CommandShortcut.displayName = "CommandShortcut";

export interface CommandSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CommandSeparator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(
  ({ className = "", ...props }, ref) => {
    return <div ref={ref} className={`gl-command-separator ${className}`} {...props} />;
  }
);
CommandSeparator.displayName = "CommandSeparator";
