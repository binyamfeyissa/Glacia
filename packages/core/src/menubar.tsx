import * as React from "react";
import { Menubar as RadixMenubar } from "radix-ui";

export function MenubarMenu(props: React.ComponentPropsWithoutRef<typeof RadixMenubar.Menu>) {
  return <RadixMenubar.Menu {...props} />;
}
export function MenubarGroup(props: React.ComponentPropsWithoutRef<typeof RadixMenubar.Group>) {
  return <RadixMenubar.Group {...props} />;
}
export function MenubarPortal(props: React.ComponentPropsWithoutRef<typeof RadixMenubar.Portal>) {
  return <RadixMenubar.Portal {...props} />;
}
export function MenubarSub(props: React.ComponentPropsWithoutRef<typeof RadixMenubar.Sub>) {
  return <RadixMenubar.Sub {...props} />;
}
export function MenubarRadioGroup(props: React.ComponentPropsWithoutRef<typeof RadixMenubar.RadioGroup>) {
  return <RadixMenubar.RadioGroup {...props} />;
}

export interface MenubarProps
  extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Root> {}

export const Menubar = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Root>,
  MenubarProps
>(({ className = "", ...props }, ref) => (
  <RadixMenubar.Root
    ref={ref}
    className={`gl-menubar gl-glass ${className}`}
    {...props}
  />
));
Menubar.displayName = "Menubar";

export interface MenubarTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Trigger> {}

export const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Trigger>,
  MenubarTriggerProps
>(({ className = "", ...props }, ref) => (
  <RadixMenubar.Trigger
    ref={ref}
    className={`gl-menubar-trigger ${className}`}
    {...props}
  />
));
MenubarTrigger.displayName = "MenubarTrigger";

export interface MenubarContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Content> {}

export const MenubarContent = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Content>,
  MenubarContentProps
>(({ className = "", align = "start", alignOffset = -4, sideOffset = 8, ...props }, ref) => (
  <RadixMenubar.Portal>
    <RadixMenubar.Content
      ref={ref}
      align={align}
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className={`gl-menubar-content gl-glass ${className}`}
      {...props}
    />
  </RadixMenubar.Portal>
));
MenubarContent.displayName = "MenubarContent";

export interface MenubarItemProps
  extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Item> {
  inset?: boolean;
}

export const MenubarItem = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Item>,
  MenubarItemProps
>(({ className = "", inset, ...props }, ref) => (
  <RadixMenubar.Item
    ref={ref}
    className={`gl-menubar-item ${inset ? "gl-inset" : ""} ${className}`}
    {...props}
  />
));
MenubarItem.displayName = "MenubarItem";

export interface MenubarSeparatorProps
  extends React.ComponentPropsWithoutRef<typeof RadixMenubar.Separator> {}

export const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.Separator>,
  MenubarSeparatorProps
>(({ className = "", ...props }, ref) => (
  <RadixMenubar.Separator
    ref={ref}
    className={`gl-menubar-separator ${className}`}
    {...props}
  />
));
MenubarSeparator.displayName = "MenubarSeparator";

export interface MenubarShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const MenubarShortcut = ({
  className = "",
  ...props
}: MenubarShortcutProps) => {
  return (
    <span
      className={`gl-menubar-shortcut ${className}`}
      {...props}
    />
  );
};
MenubarShortcut.displayName = "MenubarShortcut";

export interface MenubarSubTriggerProps
  extends React.ComponentPropsWithoutRef<typeof RadixMenubar.SubTrigger> {
  inset?: boolean;
}

export const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.SubTrigger>,
  MenubarSubTriggerProps
>(({ className = "", inset, children, ...props }, ref) => (
  <RadixMenubar.SubTrigger
    ref={ref}
    className={`gl-menubar-sub-trigger ${inset ? "gl-inset" : ""} ${className}`}
    {...props}
  >
    {children}
    <svg className="gl-menubar-sub-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  </RadixMenubar.SubTrigger>
));
MenubarSubTrigger.displayName = "MenubarSubTrigger";

export interface MenubarSubContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixMenubar.SubContent> {}

export const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof RadixMenubar.SubContent>,
  MenubarSubContentProps
>(({ className = "", ...props }, ref) => (
  <RadixMenubar.Portal>
    <RadixMenubar.SubContent
      ref={ref}
      className={`gl-menubar-content gl-glass ${className}`}
      {...props}
    />
  </RadixMenubar.Portal>
));
MenubarSubContent.displayName = "MenubarSubContent";
