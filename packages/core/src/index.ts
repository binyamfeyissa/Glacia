import { insertStyles } from "./internal/styles";
import { resweepGlass, watchGlass } from "./internal/auto-glass";
import css from "./styles.css?inline";

insertStyles(css);

// Every `.gl-glass` on the page gets the live backdrop lens, not only the
// components that ask for it: a class alone would buy a blur and nothing more.
watchGlass();

export { resweepGlass, watchGlass } from "./internal/auto-glass";

// 1. Primitive Glass
export { Glass, type GlassProps } from "./glass";
export type { GlassSurface } from "./internal/glass-surface";
export { useGlass } from "./internal/glass-surface";

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
  NavigationTabs,
  type NavigationItem,
  type NavigationTabsProps,
} from "./navigation-tabs";
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
// The chart layer: one shared set of scales, a frame and a glass tooltip,
// with each chart shaped to its own data.
export * from "./charts";
// AI interface pieces, built on the same primitives as the rest of Glacia.
export * from "./ai";
// Hooks shared by components and available to applications.
export * from "./hooks";
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

// 9. Wave 3 Components
export {
  ToggleGroup,
  ToggleGroupItem,
  type ToggleGroupProps,
  type ToggleGroupItemProps,
} from "./toggle-group";
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
  type InputOTPProps,
  type InputOTPGroupProps,
  type InputOTPSlotProps,
  type InputOTPSeparatorProps,
} from "./input-otp";
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  type CommandProps,
  type CommandDialogProps,
  type CommandInputProps,
  type CommandListProps,
  type CommandItemProps,
  type CommandGroupProps,
} from "./command";
export {
  Carousel,
  CarouselViewport,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  useCarousel,
  type CarouselProps,
  type CarouselViewportProps,
  type CarouselItemProps,
} from "./carousel";
export { Kbd, type KbdProps } from "./kbd";
export { CodeBlock, type CodeBlockProps } from "./code-block";
export { Marker, TextMarker, type MarkerProps, type TextMarkerProps } from "./marker";
export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarRadioGroup,
  type MenubarProps,
  type MenubarTriggerProps,
  type MenubarContentProps,
  type MenubarItemProps,
} from "./menubar";
export {
  Message,
  MessageBubble,
  MessageAvatar,
  MessageContent,
  MessageTimestamp,
  MessageStatus,
  type MessageProps,
  type MessageBubbleProps,
  type MessageAvatarProps,
  type MessageContentProps,
  type MessageTimestampProps,
  type MessageStatusProps,
} from "./message";
export {
  MessageScroller,
  MessageDateDivider,
  type MessageScrollerProps,
  type MessageDateDividerProps,
} from "./message-scroller";
export {
  Bubble,
  BubbleGroup,
  type BubbleProps,
  type BubbleGroupProps,
  type BubbleSide,
} from "./bubble";
export { Attachment, type AttachmentProps } from "./attachment";
export {
  Questionnaire,
  QuestionnaireStep,
  QuestionnaireOption,
  type QuestionnaireProps,
  type QuestionnaireStepProps,
  type QuestionnaireOptionProps,
} from "./questionnaire";
export {
  DirectionProvider,
  Direction,
  useDirection,
  type DirectionProviderProps,
  type DirectionProps,
  type DirectionType,
} from "./direction";

// 9b. Wave 4 — Figma-aligned iOS/ipadOS components
export { ActionSheet, type ActionSheetItem, type ActionSheetProps } from "./action-sheet";
export { ColorPicker, type ColorPickerProps } from "./color-picker";
export { List, ListItem, type ListProps, type ListItemProps } from "./list";
export { PopupButton, type PopupButtonProps } from "./popup-button";
export { Stepper, type StepperProps } from "./stepper";
export { TimePicker, type TimePickerProps } from "./time-picker";
export { Toolbar, type ToolbarItem, type ToolbarProps } from "./toolbar";
export { Widget, type WidgetProps } from "./widget";
export {
  PageControl,
  PageDots,
  type PageControlProps,
  type PageDotsProps,
} from "./page-control";

// 10. Ready-Made Page Blocks
export { LoginPage, type LoginPageProps } from "./blocks/login-page";
export { AdminDashboard, type AdminDashboardProps } from "./blocks/admin-dashboard";
export { AppShell, type AppShellProps } from "./blocks/app-shell";
export { SettingsBlock, type SettingsBlockProps } from "./blocks/settings-block";
export { ProfileBlock, type ProfileBlockProps } from "./blocks/profile-block";
export { SignupBlock, type SignupBlockProps } from "./blocks/signup-block";
export { CalendarPageBlock } from "./blocks/calendar-page-block";
export { PricingBlock } from "./blocks/pricing-block";
export { LandingBlock } from "./blocks/landing-block";
export { ForgotPasswordBlock } from "./blocks/forgot-password-block";
export { ErrorPageBlock, type ErrorPageBlockProps } from "./blocks/error-page-block";
// App-shape blocks: each composes existing primitives rather than introducing
// new material.
export {
  BoardingPassBlock,
  type BoardingPassProps,
  type BoardingPassFlight,
} from "./blocks/boarding-pass-block";
export { ActivityBlock, type ActivityBlockProps, type ActivityEntry } from "./blocks/activity-block";
