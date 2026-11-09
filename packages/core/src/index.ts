import { insertStyles } from "./internal/styles";
import css from "./styles.css?inline";

insertStyles(css);

// 1. Primitive Glass
export { Glass, type GlassProps } from "./glass";

// 2. Buttons & Actions
export { Button, type ButtonProps } from "./button";

// 3. Text & Typography
export { Text, type TextProps, type TextVariant } from "./text";

// 4. Inputs & Forms
export { Input, type InputProps } from "./input";
export { Textarea, type TextareaProps } from "./textarea";
export { Label, type LabelProps } from "./label";
export { Checkbox } from "./checkbox";
export { RadioGroup, RadioGroupItem } from "./radio-group";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from "./select";
export { Slider, type SliderProps } from "./slider";
export { Switch, type SwitchProps } from "./switch";
export { SearchField, type SearchFieldProps } from "./search-field";

// 5. Showing Things (Cards, Badges, etc.)
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardBody,
  CardFooter,
  type CardProps,
} from "./card";
export { Badge, type BadgeProps } from "./badge";
export { Avatar, AvatarImage, AvatarFallback } from "./avatar";
export { Separator } from "./separator";
export { Skeleton, type SkeletonProps } from "./skeleton";
export { Spinner, type SpinnerProps } from "./spinner";
export { Progress } from "./progress";

// 6. Navigation & Layout
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
export {
  SegmentedControl,
  type SegmentedControlItem,
  type SegmentedControlProps,
} from "./segmented-control";
export { TabBar, type TabBarItem, type TabBarProps } from "./tab-bar";
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "./table";
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
} from "./sidebar";
export { ScrollArea, ScrollBar } from "./scroll-area";

// 7. Popups, Menus & Overlays
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
} from "./dialog";
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
} from "./alert-dialog";
export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverContent,
} from "./popover";
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
} from "./dropdown-menu";
export { Menu, type MenuEntry, type MenuItem, type MenuProps } from "./menu";
export {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./tooltip";
export { Toaster, toast, type ToasterProps, type ToastData } from "./sonner";

// 8. Wave 2 Components
export { ButtonGroup, type ButtonGroupProps } from "./button-group";
export { Toggle, type ToggleProps } from "./toggle";
export {
  InputGroup,
  InputGroupAddon,
  type InputGroupProps,
  type InputGroupAddonProps,
} from "./input-group";
export { Field, type FieldProps } from "./field";
export { Form, useFormContext, type FormProps } from "./form";
export {
  Combobox,
  type ComboboxOption,
  type ComboboxProps,
} from "./combobox";
export { Calendar, type CalendarProps } from "./calendar";
export { Chart, type ChartDataPoint, type ChartProps } from "./chart";
export { Empty, type EmptyProps } from "./empty";
export { Item, type ItemProps } from "./item";
export {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardPortal,
} from "./hover-card";
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuRadioGroup,
} from "./context-menu";
export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  DrawerOverlay,
  DrawerPortal,
} from "./drawer";
export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetOverlay,
  SheetPortal,
  type SheetContentProps,
} from "./sheet";
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  type ToastProps,
} from "./toast";
export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./breadcrumb";
export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
  NavigationMenuIndicator,
} from "./navigation-menu";
export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  type PaginationLinkProps,
} from "./pagination";
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./collapsible";
export {
  DataTable,
  type DataTableColumn,
  type DataTableProps,
} from "./data-table";
export {
  NativeSelect,
  type NativeSelectProps,
} from "./native-select";

// 9. Ready-Made Page Blocks
export { LoginPage, type LoginPageProps } from "./blocks/login-page";
export { AdminDashboard } from "./blocks/admin-dashboard";
export { SettingsBlock, type SettingsBlockProps } from "./blocks/settings-block";
export { ProfileBlock, type ProfileBlockProps } from "./blocks/profile-block";
export { SignupBlock, type SignupBlockProps } from "./blocks/signup-block";
