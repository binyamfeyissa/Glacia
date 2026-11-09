export interface PropItem {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentMeta {
  slug: string;
  name: string;
  description: string;
  category: "Buttons & Actions" | "Text & Forms" | "Showing Things" | "Navigation & Layout" | "Popups & Menus";
  appleStatus: "Apple-faithful" | "Glacia extension";
  nativeStatus: "Yes" | "Web only" | "Web first";
  wave: 1 | 2 | 3;
  props: PropItem[];
  codeSnippet: string;
}

export const COMPONENTS_DATA: ComponentMeta[] = [
  {
    slug: "glass",
    name: "Glass",
    description: "The core liquid glass primitive container providing real optical refraction and specular highlight.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "effect", type: "'regular' | 'clear' | 'none'", default: "'regular'", description: "The liquid glass material style (regular is frosted; clear is transparent)." },
      { name: "tintColor", type: "string", description: "Custom background tint color applied to the glass substrate." },
      { name: "className", type: "string", description: "Additional CSS classes." },
    ],
    codeSnippet: `import { Glass } from "glacia";

export default function GlassDemo() {
  return (
    <Glass className="p-6 rounded-2xl max-w-sm">
      <p className="font-medium">Real optical refraction on the live backdrop.</p>
    </Glass>
  );
}`,
  },
  {
    slug: "button",
    name: "Button",
    description: "Clickable action trigger with iOS press-spring physics, specular rim lighting, and glass variants.",
    category: "Buttons & Actions",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "variant", type: "'glass' | 'filled' | 'ghost'", default: "'glass'", description: "Visual hierarchy variant." },
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Size preset controlling height and padding." },
      { name: "destructive", type: "boolean", default: "false", description: "Styles button with destructive tint." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction and lowers opacity." },
      { name: "icon", type: "ReactNode", description: "Optional icon placed before the label." },
    ],
    codeSnippet: `import { Button } from "glacia";

export default function ButtonDemo() {
  return (
    <div className="flex gap-3">
      <Button variant="filled">Prominent Action</Button>
      <Button variant="glass">Glass Button</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  );
}`,
  },
  {
    slug: "text",
    name: "Text",
    description: "Typographic styles and heading hierarchy designed for crystal clarity across light and dark glass.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "variant", type: "'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'lead' | 'large' | 'small' | 'muted' | 'code' | 'blockquote'", default: "'p'", description: "Typography scale variant." },
      { name: "as", type: "ElementType", description: "Custom underlying HTML element tag." },
    ],
    codeSnippet: `import { Text } from "glacia";

export default function TextDemo() {
  return (
    <div className="space-y-2">
      <Text variant="h2">Liquid Glass Typography</Text>
      <Text variant="lead">Crisp contrast directly over dynamic background materials.</Text>
      <Text variant="muted">Secondary descriptive content.</Text>
    </div>
  );
}`,
  },
  {
    slug: "input",
    name: "Input",
    description: "Refractive text field with clear button, focus ring illumination, and accessible states.",
    category: "Text & Forms",
    appleStatus: "Glacia extension",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "value", type: "string", description: "Controlled input value." },
      { name: "defaultValue", type: "string", description: "Initial value for uncontrolled usage." },
      { name: "onValueChange", type: "(val: string) => void", description: "Callback invoked on input text change." },
      { name: "icon", type: "ReactNode", description: "Leading icon displayed inside the glass box." },
      { name: "error", type: "boolean", default: "false", description: "Applies error outline." },
    ],
    codeSnippet: `import { Input } from "glacia";

export default function InputDemo() {
  return <Input placeholder="Search documents or type a command..." />;
}`,
  },
  {
    slug: "textarea",
    name: "Textarea",
    description: "Multiline expandable text entry surface housed in a responsive liquid glass container.",
    category: "Text & Forms",
    appleStatus: "Glacia extension",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "error", type: "boolean", default: "false", description: "Displays error highlight." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables typing." },
    ],
    codeSnippet: `import { Textarea } from "glacia";

export default function TextareaDemo() {
  return <Textarea placeholder="Leave detailed feedback or notes here..." rows={4} />;
}`,
  },
  {
    slug: "label",
    name: "Label",
    description: "Accessible caption label with proper click-targeting for associated input controls.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "htmlFor", type: "string", description: "ID of the target input element." },
    ],
    codeSnippet: `import { Label, Input } from "glacia";

export default function LabelDemo() {
  return (
    <div className="space-y-1">
      <Label htmlFor="email-input">Work Email Address</Label>
      <Input id="email-input" type="email" placeholder="name@company.com" />
    </div>
  );
}`,
  },
  {
    slug: "card",
    name: "Card",
    description: "Elevated glass panel with Header, Title, Description, Body, and Footer layout slots.",
    category: "Showing Things",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "variant", type: "'glass' | 'clear'", default: "'glass'", description: "Glass opacity style." },
    ],
    codeSnippet: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from "glacia";

export default function CardDemo() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Glacia Card</CardTitle>
        <CardDescription>Glass on content layer: Glacia extension over Apple HIG.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Content rendered with readable contrast over photo backdrops.</p>
      </CardContent>
      <CardFooter>
        <Button variant="filled" size="sm">Action</Button>
      </CardFooter>
    </Card>
  );
}`,
  },
  {
    slug: "badge",
    name: "Badge",
    description: "Compact glass pill status indicator with multiple semantic tint variants.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "variant", type: "'default' | 'secondary' | 'destructive' | 'outline'", default: "'default'", description: "Color and border appearance." },
    ],
    codeSnippet: `import { Badge } from "glacia";

export default function BadgeDemo() {
  return (
    <div className="flex gap-2">
      <Badge variant="default">Liquid Glass</Badge>
      <Badge variant="secondary">v0.1.0</Badge>
      <Badge variant="destructive">Urgent</Badge>
    </div>
  );
}`,
  },
  {
    slug: "avatar",
    name: "Avatar",
    description: "Circular user portrait with liquid glass border and fallback monogram.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "src", type: "string", description: "Image source URL." },
      { name: "alt", type: "string", description: "Image accessibility description." },
    ],
    codeSnippet: `import { Avatar, AvatarImage, AvatarFallback } from "glacia";

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="Avatar" />
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  );
}`,
  },
  {
    slug: "separator",
    name: "Separator",
    description: "Optical divider line styled with subtle liquid glass edge reflection.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "orientation", type: "'horizontal' | 'vertical'", default: "'horizontal'", description: "Layout axis of the divider." },
    ],
    codeSnippet: `import { Separator } from "glacia";

export default function SeparatorDemo() {
  return (
    <div className="space-y-4">
      <span>Top section</span>
      <Separator />
      <span>Bottom section</span>
    </div>
  );
}`,
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    description: "Glass shimmer placeholder pulse while asynchronous content loads.",
    category: "Showing Things",
    appleStatus: "Glacia extension",
    nativeStatus: "Web first",
    wave: 1,
    props: [],
    codeSnippet: `import { Skeleton } from "glacia";

export default function SkeletonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="w-48 h-4 rounded" />
        <Skeleton className="w-32 h-3 rounded" />
      </div>
    </div>
  );
}`,
  },
  {
    slug: "spinner",
    name: "Spinner",
    description: "Smooth rotating activity indicator ring for indeterminate loading states.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Size preset." },
    ],
    codeSnippet: `import { Spinner } from "glacia";

export default function SpinnerDemo() {
  return <Spinner size="md" />;
}`,
  },
  {
    slug: "progress",
    name: "Progress",
    description: "Determinate meter displaying percentage completion along a frosted glass track.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "value", type: "number", description: "Progress percentage between 0 and 100." },
    ],
    codeSnippet: `import { Progress } from "glacia";

export default function ProgressDemo() {
  return <Progress value={68} className="w-64" />;
}`,
  },
  {
    slug: "switch",
    name: "Switch",
    description: "iOS-authentic toggle switch with spring-animated lens and keyboard accessibility.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "checked", type: "boolean", description: "Controlled switch state." },
      { name: "defaultChecked", type: "boolean", default: "false", description: "Uncontrolled initial state." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "State toggle handler." },
    ],
    codeSnippet: `import { Switch } from "glacia";

export default function SwitchDemo() {
  return <Switch aria-label="Airplane Mode" defaultChecked />;
}`,
  },
  {
    slug: "slider",
    name: "Slider",
    description: "Interactive continuous value slider with lifting lens thumb and track refraction.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "value", type: "number", description: "Controlled slider position." },
      { name: "min", type: "number", default: "0", description: "Minimum range bound." },
      { name: "max", type: "number", default: "100", description: "Maximum range bound." },
      { name: "step", type: "number", default: "1", description: "Stepping increment." },
    ],
    codeSnippet: `import { Slider } from "glacia";

export default function SliderDemo() {
  return <Slider defaultValue={45} className="w-64" />;
}`,
  },
  {
    slug: "search-field",
    name: "Search Field",
    description: "Glass search capsule with magnifying glass glyph and instant reset button.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "placeholder", type: "string", default: "'Search...'", description: "Hint text displayed inside field." },
    ],
    codeSnippet: `import { SearchField } from "glacia";

export default function SearchFieldDemo() {
  return <SearchField placeholder="Search components, tokens, blocks..." />;
}`,
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description: "Glass selection square that illuminates with accent fill and checkmark icon.",
    category: "Text & Forms",
    appleStatus: "Glacia extension",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "checked", type: "boolean", description: "Controlled check status." },
    ],
    codeSnippet: `import { Checkbox, Label } from "glacia";

export default function CheckboxDemo() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" defaultChecked />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  );
}`,
  },
  {
    slug: "radio-group",
    name: "Radio Group",
    description: "Single-choice selection list featuring liquid glass circular indicator buttons.",
    category: "Text & Forms",
    appleStatus: "Glacia extension",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "defaultValue", type: "string", description: "Initial selected option value." },
    ],
    codeSnippet: `import { RadioGroup, RadioGroupItem, Label } from "glacia";

export default function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="pro">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="free" id="r-free" />
        <Label htmlFor="r-free">Free Plan</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="pro" id="r-pro" />
        <Label htmlFor="r-pro">Pro Plan</Label>
      </div>
    </RadioGroup>
  );
}`,
  },
  {
    slug: "select",
    name: "Select",
    description: "Picker control triggering a floating glass sheet menu with checkmark indicators.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "defaultValue", type: "string", description: "Initially selected item." },
    ],
    codeSnippet: `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "glacia";

export default function SelectDemo() {
  return (
    <Select defaultValue="apple">
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
      </SelectContent>
    </Select>
  );
}`,
  },
  {
    slug: "tabs",
    name: "Tabs",
    description: "Segmented panel navigation switching views with smooth glass indicators.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "defaultValue", type: "string", description: "Initial active tab value." },
    ],
    codeSnippet: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "glacia";

export default function TabsDemo() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content</TabsContent>
      <TabsContent value="analytics">Analytics content</TabsContent>
      <TabsContent value="settings">Settings content</TabsContent>
    </Tabs>
  );
}`,
  },
  {
    slug: "segmented-control",
    name: "Segmented Control",
    description: "Sliding capsule selector with dynamic lens physics based on iOS HIG.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "items", type: "SegmentedControlItem[]", description: "Array of choice items with keys and labels." },
      { name: "value", type: "string", description: "Controlled selection key." },
    ],
    codeSnippet: `import { SegmentedControl } from "glacia";

export default function SegmentedDemo() {
  return (
    <SegmentedControl
      defaultValue="day"
      items={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ]}
    />
  );
}`,
  },
  {
    slug: "tab-bar",
    name: "Tab Bar",
    description: "Floating compact glass bar with lifting lens thumb for primary app navigation.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "items", type: "TabBarItem[]", description: "List of tab destinations with label and optional icon." },
    ],
    codeSnippet: `import { TabBar } from "glacia";

export default function TabBarDemo() {
  return (
    <TabBar
      defaultValue="home"
      items={[
        { value: "home", label: "Home" },
        { value: "explore", label: "Explore" },
        { value: "profile", label: "Profile" },
      ]}
    />
  );
}`,
  },
  {
    slug: "accordion",
    name: "Accordion",
    description: "Stacked glass disclosure panels displaying expandable content sections.",
    category: "Navigation & Layout",
    appleStatus: "Glacia extension",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "type", type: "'single' | 'multiple'", default: "'single'", description: "Whether one or multiple panels can stay open." },
    ],
    codeSnippet: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "glacia";

export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible className="w-full max-w-md">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Glacia?</AccordionTrigger>
        <AccordionContent>A Liquid Glass UI kit with real refraction for web and iOS.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How does browser fallback work?</AccordionTrigger>
        <AccordionContent>Chromium renders real SVG displacement; Safari & Firefox use Layer 1 frosted blur.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`,
  },
  {
    slug: "dialog",
    name: "Dialog",
    description: "Modal window with blur backdrop scrim, focus trapping, and centered glass dialog card.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "open", type: "boolean", description: "Controlled modal open state." },
    ],
    codeSnippet: `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from "glacia";

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="filled">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Liquid Glass Modal</DialogTitle>
          <DialogDescription>Floating dialog layer anchored over blurred scrim.</DialogDescription>
        </DialogHeader>
        <p className="text-sm">Manage configuration settings cleanly.</p>
        <DialogFooter>
          <Button variant="filled" size="sm">Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`,
  },
  {
    slug: "alert-dialog",
    name: "Alert Dialog",
    description: "Confirmation popup asking 'Are you sure?' with prominent confirm and cancel actions.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [],
    codeSnippet: `import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, Button } from "glacia";

export default function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="glass" destructive>Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone and will permanently remove your data.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}`,
  },
  {
    slug: "popover",
    name: "Popover",
    description: "Contextual floating glass panel anchored to a trigger with collision handling.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "sideOffset", type: "number", default: "6", description: "Distance between trigger and content in pixels." },
    ],
    codeSnippet: `import { Popover, PopoverTrigger, PopoverContent, Button } from "glacia";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="glass">Info Details</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <p className="text-sm font-medium">Quick Settings</p>
        <p className="text-xs text-muted-foreground mt-1">Adjust real-time liquid glass properties.</p>
      </PopoverContent>
    </Popover>
  );
}`,
  },
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    description: "Floating action menu with items, keyboard navigation, separators, and destructive actions.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [],
    codeSnippet: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, Button } from "glacia";

export default function DropdownDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="glass">Options ▾</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Profile Settings</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive>Sign Out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}`,
  },
  {
    slug: "menu",
    name: "Menu",
    description: "iPhone-style pop-out menu from Glisse engine with spring presentation.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "items", type: "MenuEntry[]", description: "Array of menu entries." },
    ],
    codeSnippet: `import { Menu } from "glacia";

export default function MenuDemo() {
  return (
    <Menu
      aria-label="App Menu"
      items={[
        { label: "Share Document", onSelect: () => console.log("Share") },
        { label: "Copy Link", onSelect: () => console.log("Copy") },
        "separator",
        { label: "Move to Trash", destructive: true, onSelect: () => console.log("Delete") },
      ]}
    />
  );
}`,
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    description: "Floating capsule hint displayed on pointer hover with gentle delay.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web only",
    wave: 1,
    props: [
      { name: "delayDuration", type: "number", default: "700", description: "Hover delay before rendering tooltip." },
    ],
    codeSnippet: `import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Button } from "glacia";

export default function TooltipDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="glass">Hover over me</Button>
        </TooltipTrigger>
        <TooltipContent>Liquid Glass Refraction Tooltip</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`,
  },
  {
    slug: "sonner",
    name: "Sonner",
    description: "Bottom notification toast system presenting sleek floating glass messages.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 1,
    props: [
      { name: "position", type: "string", default: "'bottom-right'", description: "Screen corner or edge position." },
    ],
    codeSnippet: `import { Toaster, toast, Button } from "glacia";

export default function SonnerDemo() {
  return (
    <div>
      <Toaster position="bottom-right" />
      <Button
        variant="filled"
        onClick={() => toast("Operation Complete", { description: "Your files were saved to the cloud." })}
      >
        Show Toast
      </Button>
    </div>
  );
}`,
  },
  {
    slug: "table",
    name: "Table",
    description: "Tabular data presentation with translucent rows and subtle hover highlights.",
    category: "Navigation & Layout",
    appleStatus: "Glacia extension",
    nativeStatus: "Web first",
    wave: 1,
    props: [],
    codeSnippet: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "glacia";

export default function TableDemo() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>INV-001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}`,
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    description: "iPad/macOS-style floating glass sidebar with trigger toggle and navigation items.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [
      { name: "defaultOpen", type: "boolean", default: "true", description: "Initial sidebar expanded state." },
    ],
    codeSnippet: `import { SidebarProvider, Sidebar, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "glacia";

export default function SidebarDemo() {
  return (
    <SidebarProvider>
      <SidebarTrigger />
      <Sidebar>
        <SidebarMenu>
          <SidebarMenuItem><SidebarMenuButton isActive>Home</SidebarMenuButton></SidebarMenuItem>
          <SidebarMenuItem><SidebarMenuButton>Projects</SidebarMenuButton></SidebarMenuItem>
          <SidebarMenuItem><SidebarMenuButton>Settings</SidebarMenuButton></SidebarMenuItem>
        </SidebarMenu>
      </Sidebar>
    </SidebarProvider>
  );
}`,
  },
  {
    slug: "scroll-area",
    name: "Scroll Area",
    description: "Scrollable viewport featuring a custom floating glass pill scrollbar thumb.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 1,
    props: [],
    codeSnippet: `import { ScrollArea } from "glacia";

export default function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-48 w-64 rounded-xl border p-4">
      <div className="space-y-4">
        <p>Glacia provides real liquid glass refraction across all platforms.</p>
        <p>Scrollable smoothly with translucent glass thumb.</p>
        <p>Zero layout shifting.</p>
        <p>Consistent across browsers.</p>
      </div>
    </ScrollArea>
  );
}`,
  },
];
