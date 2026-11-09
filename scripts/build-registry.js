import fs from "node:fs";
import path from "node:path";

const BASE_URL = "https://glacia.dev/r";

const COMPONENTS = [
  {
    name: "glass",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Glass, type GlassProps } from "glacia";

export { Glass, type GlassProps };
export default Glass;
`,
  },
  {
    name: "button",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Button, type ButtonProps } from "glacia";

export { Button, type ButtonProps };
export default Button;
`,
  },
  {
    name: "text",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Text, type TextProps, type TextVariant } from "glacia";

export { Text, type TextProps, type TextVariant };
export default Text;
`,
  },
  {
    name: "input",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Input, type InputProps } from "glacia";

export { Input, type InputProps };
export default Input;
`,
  },
  {
    name: "textarea",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Textarea, type TextareaProps } from "glacia";

export { Textarea, type TextareaProps };
export default Textarea;
`,
  },
  {
    name: "label",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import { Label, type LabelProps } from "glacia";

export { Label, type LabelProps };
export default Label;
`,
  },
  {
    name: "card",
    dependencies: ["glacia@^0.1.0"],
    content: `import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardBody,
  CardFooter,
  type CardProps,
} from "glacia";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardBody,
  CardFooter,
  type CardProps,
};
export default Card;
`,
  },
  {
    name: "badge",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Badge, type BadgeProps } from "glacia";

export { Badge, type BadgeProps };
export default Badge;
`,
  },
  {
    name: "avatar",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import { Avatar, AvatarImage, AvatarFallback } from "glacia";

export { Avatar, AvatarImage, AvatarFallback };
export default Avatar;
`,
  },
  {
    name: "separator",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import { Separator } from "glacia";

export { Separator };
export default Separator;
`,
  },
  {
    name: "skeleton",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Skeleton, type SkeletonProps } from "glacia";

export { Skeleton, type SkeletonProps };
export default Skeleton;
`,
  },
  {
    name: "spinner",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Spinner, type SpinnerProps } from "glacia";

export { Spinner, type SpinnerProps };
export default Spinner;
`,
  },
  {
    name: "progress",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import { Progress } from "glacia";

export { Progress };
export default Progress;
`,
  },
  {
    name: "switch",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Switch, type SwitchProps } from "glacia";

export { Switch, type SwitchProps };
export default Switch;
`,
  },
  {
    name: "slider",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Slider, type SliderProps } from "glacia";

export { Slider, type SliderProps };
export default Slider;
`,
  },
  {
    name: "search-field",
    dependencies: ["glacia@^0.1.0"],
    content: `import { SearchField, type SearchFieldProps } from "glacia";

export { SearchField, type SearchFieldProps };
export default SearchField;
`,
  },
  {
    name: "checkbox",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import { Checkbox } from "glacia";

export { Checkbox };
export default Checkbox;
`,
  },
  {
    name: "radio-group",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import { RadioGroup, RadioGroupItem } from "glacia";

export { RadioGroup, RadioGroupItem };
export default RadioGroup;
`,
  },
  {
    name: "select",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from "glacia";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
};
export default Select;
`,
  },
  {
    name: "tabs",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "glacia";

export { Tabs, TabsList, TabsTrigger, TabsContent };
export default Tabs;
`,
  },
  {
    name: "segmented-control",
    dependencies: ["glacia@^0.1.0"],
    content: `import {
  SegmentedControl,
  type SegmentedControlItem,
  type SegmentedControlProps,
} from "glacia";

export {
  SegmentedControl,
  type SegmentedControlItem,
  type SegmentedControlProps,
};
export default SegmentedControl;
`,
  },
  {
    name: "tab-bar",
    dependencies: ["glacia@^0.1.0"],
    content: `import { TabBar, type TabBarItem, type TabBarProps } from "glacia";

export { TabBar, type TabBarItem, type TabBarProps };
export default TabBar;
`,
  },
  {
    name: "accordion",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "glacia";

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
};
export default Accordion;
`,
  },
  {
    name: "dialog",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "glacia";

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
export default Dialog;
`,
  },
  {
    name: "alert-dialog",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "glacia";

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
};
export default AlertDialog;
`,
  },
  {
    name: "popover",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverContent,
} from "glacia";

export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverContent,
};
export default Popover;
`,
  },
  {
    name: "dropdown-menu",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "glacia";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
};
export default DropdownMenu;
`,
  },
  {
    name: "menu",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Menu, type MenuEntry, type MenuItem, type MenuProps } from "glacia";

export { Menu, type MenuEntry, type MenuItem, type MenuProps };
export default Menu;
`,
  },
  {
    name: "tooltip",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "glacia";

export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
};
export default Tooltip;
`,
  },
  {
    name: "sonner",
    dependencies: ["glacia@^0.1.0"],
    content: `import { Toaster, toast, type ToasterProps, type ToastData } from "glacia";

export { Toaster, toast, type ToasterProps, type ToastData };
export default Toaster;
`,
  },
  {
    name: "table",
    dependencies: ["glacia@^0.1.0"],
    content: `import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "glacia";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
};
export default Table;
`,
  },
  {
    name: "sidebar",
    dependencies: ["glacia@^0.1.0"],
    content: `import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  type SidebarMenuButtonProps,
} from "glacia";

export {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  type SidebarMenuButtonProps,
};
export default Sidebar;
`,
  },
  {
    name: "scroll-area",
    dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
    content: `import { ScrollArea, ScrollBar } from "glacia";

export { ScrollArea, ScrollBar };
export default ScrollArea;
`,
  },
];

const registryIndex = [];

const registryDir = path.resolve("registry/new-york");
const docsPublicRDir = path.resolve("apps/docs/public/r");

if (!fs.existsSync(registryDir)) fs.mkdirSync(registryDir, { recursive: true });
if (!fs.existsSync(docsPublicRDir)) fs.mkdirSync(docsPublicRDir, { recursive: true });

for (const comp of COMPONENTS) {
  const item = {
    name: comp.name,
    type: "registry:ui",
    dependencies: comp.dependencies,
    registryDependencies: [`${BASE_URL}/glass.json`],
    files: [
      {
        path: `${comp.name}.tsx`,
        content: comp.content,
        type: "registry:ui",
      },
    ],
  };

  const jsonStr = JSON.stringify(item, null, 2);
  fs.writeFileSync(path.join(registryDir, `${comp.name}.json`), jsonStr, "utf-8");
  fs.writeFileSync(path.join(docsPublicRDir, `${comp.name}.json`), jsonStr, "utf-8");

  registryIndex.push({
    name: comp.name,
    type: "registry:ui",
    dependencies: comp.dependencies,
    registryDependencies: [`${BASE_URL}/glass.json`],
    files: [`${comp.name}.tsx`],
  });
}

// all.json bundle
const allItem = {
  name: "all",
  type: "registry:ui",
  dependencies: ["glacia@^0.1.0", "radix-ui@^1.8.1"],
  registryDependencies: COMPONENTS.map((c) => `${BASE_URL}/${c.name}.json`),
  files: [],
};
fs.writeFileSync(path.join(registryDir, "all.json"), JSON.stringify(allItem, null, 2), "utf-8");
fs.writeFileSync(path.join(docsPublicRDir, "all.json"), JSON.stringify(allItem, null, 2), "utf-8");

// Base theme
const baseItem = {
  name: "base",
  type: "registry:base",
  cssVars: {
    light: {
      "--gl-foreground": "rgb(0 0 0 / 0.88)",
      "--gl-muted": "rgb(60 60 67 / 0.6)",
      "--gl-glass": "rgb(255 255 255 / 0.6)",
      "--gl-glass-active": "rgb(236 236 240 / 0.85)",
      "--gl-edge": "rgb(0 0 0 / 0.08)",
      "--gl-fill": "#0088ff",
      "--gl-ring": "rgb(0 0 0 / 0.4)",
    },
    dark: {
      "--gl-foreground": "rgb(255 255 255)",
      "--gl-muted": "rgb(235 235 245 / 0.6)",
      "--gl-glass": "rgb(40 40 40 / 0.62)",
      "--gl-glass-active": "rgb(70 70 70 / 0.62)",
      "--gl-edge": "rgb(255 255 255 / 0.08)",
      "--gl-fill": "#0091ff",
      "--gl-ring": "rgb(255 255 255 / 0.5)",
    },
  },
};
fs.writeFileSync(path.join(registryDir, "base.json"), JSON.stringify(baseItem, null, 2), "utf-8");
fs.writeFileSync(path.join(docsPublicRDir, "base.json"), JSON.stringify(baseItem, null, 2), "utf-8");

// Main registry.json
const fullRegistry = {
  "$schema": "https://glacia.dev/schema/registry.json",
  name: "glacia",
  homepage: "https://glacia.dev",
  items: [...registryIndex, baseItem, allItem],
};
fs.writeFileSync(path.resolve("registry/registry.json"), JSON.stringify(fullRegistry, null, 2), "utf-8");
fs.writeFileSync(path.join(docsPublicRDir, "index.json"), JSON.stringify(fullRegistry, null, 2), "utf-8");

console.log(`✓ Built ${COMPONENTS.length} registry items into registry/ and apps/docs/public/r/`);
