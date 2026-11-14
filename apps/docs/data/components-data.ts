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
  category: "Buttons & Actions" | "Text & Forms" | "Showing Things" | "Navigation & Layout" | "Popups & Menus" | "Chat & AI" | "Charts";
  appleStatus: "Apple-faithful" | "Glacia extension";
  nativeStatus: "Yes" | "Web only" | "Web first";
  wave: 1 | 2 | 3 | 4;
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
    nativeStatus: "Web only",
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
    nativeStatus: "Yes",
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
    nativeStatus: "Yes",
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
    nativeStatus: "Yes",
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
    nativeStatus: "Web only",
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
    nativeStatus: "Web only",
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
    nativeStatus: "Web only",
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
    nativeStatus: "Web only",
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
    nativeStatus: "Yes",
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
    nativeStatus: "Yes",
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
    nativeStatus: "Yes",
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
    nativeStatus: "Yes",
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
    nativeStatus: "Yes",
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
    nativeStatus: "Web only",
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
    nativeStatus: "Yes",
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
    nativeStatus: "Yes",
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

  {
    slug: "button-group",
    name: "Button Group",
    description: "Apple-style unified segmented button grouping for toolbars and multi-action controls.",
    category: "Buttons & Actions",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "orientation", type: "'horizontal' | 'vertical'", default: "'horizontal'", description: "Layout axis of buttons in the group." },
      { name: "variant", type: "'segmented' | 'attached' | 'ghost'", default: "'segmented'", description: "Border and glass container styling." },
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Button size in the group." }
    ],
    codeSnippet: `import { ButtonGroup, Button } from "glacia";

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup variant="segmented">
      <Button size="sm">Day</Button>
      <Button size="sm" variant="filled">Week</Button>
      <Button size="sm">Month</Button>
      <Button size="sm">Year</Button>
    </ButtonGroup>
  );
}`
  },
  {
    slug: "toggle",
    name: "Toggle",
    description: "Two-state glass button with luminous active state, inspired by Apple Control Center controls.",
    category: "Buttons & Actions",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "pressed", type: "boolean", description: "Controlled pressed state." },
      { name: "defaultPressed", type: "boolean", default: "false", description: "Uncontrolled initial pressed state." },
      { name: "onPressedChange", type: "(pressed: boolean) => void", description: "Fired when pressed state changes." },
      { name: "variant", type: "'glass' | 'outline' | 'filled'", default: "'glass'", description: "Glass visual style." }
    ],
    codeSnippet: `import { Toggle } from "glacia";

export default function ToggleDemo() {
  return (
    <Toggle defaultPressed variant="glass">
      Live Photos
    </Toggle>
  );
}`
  },
  {
    slug: "input-group",
    name: "Input Group",
    description: "Composite input with attached glass prefixes, suffixes, icons, and interactive action buttons.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Size of composite group." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables inputs and addons." }
    ],
    codeSnippet: `import { InputGroup, InputGroupAddon, Input, Button } from "glacia";

export default function InputGroupDemo() {
  return (
    <InputGroup>
      <InputGroupAddon align="leading">https://</InputGroupAddon>
      <Input placeholder="apple.com" />
      <InputGroupAddon align="trailing">
        <Button size="sm" variant="ghost">Go</Button>
      </InputGroupAddon>
    </InputGroup>
  );
}`
  },
  {
    slug: "field",
    name: "Field",
    description: "Form field container bundling label, control slot, description, and Apple system red error text.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 2,
    props: [
      { name: "label", type: "ReactNode", description: "Primary label text." },
      { name: "required", type: "boolean", default: "false", description: "Shows required indicator." },
      { name: "description", type: "ReactNode", description: "Help text beneath input." },
      { name: "error", type: "ReactNode", description: "Error text displayed in Apple red." },
      { name: "orientation", type: "'vertical' | 'horizontal'", default: "'vertical'", description: "Stacked or inline Mac preferences layout." }
    ],
    codeSnippet: `import { Field, Input } from "glacia";

export default function FieldDemo() {
  return (
    <Field label="Apple ID" required description="Enter your iCloud account email address.">
      <Input placeholder="name@icloud.com" />
    </Field>
  );
}`
  },
  {
    slug: "form",
    name: "Form",
    description: "Accessible form container with context provider for validation handling and submission.",
    category: "Text & Forms",
    appleStatus: "Glacia extension",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "disabled", type: "boolean", default: "false", description: "Disables all child inputs." }
    ],
    codeSnippet: `import { Form, Field, Input, Button } from "glacia";

export default function FormDemo() {
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Field label="Passkey Name">
        <Input placeholder="MacBook Pro Touch ID" />
      </Field>
      <Button type="submit" variant="filled">Register Key</Button>
    </Form>
  );
}`
  },
  {
    slug: "combobox",
    name: "Combobox",
    description: "Apple Spotlight / Safari autocomplete input with floating liquid glass dropdown list and checkmark indicator.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "options", type: "ComboboxOption[]", description: "List of items with value, label, and icon." },
      { name: "value", type: "string", description: "Controlled value." },
      { name: "placeholder", type: "string", default: "'Select option...'", description: "Placeholder string." }
    ],
    codeSnippet: `import { Combobox } from "glacia";

const OPTIONS = [
  { value: "cupertino", label: "Cupertino (Apple Park)" },
  { value: "austin", label: "Austin Campus" },
  { value: "london", label: "Battersea Power Station" }
];

export default function ComboboxDemo() {
  return <Combobox options={OPTIONS} placeholder="Select campus..." />;
}`
  },
  {
    slug: "calendar",
    name: "Calendar",
    description: "Apple iOS/macOS Calendar widget with circular selection in Apple blue and today dot.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "selected", type: "Date", description: "Selected date." },
      { name: "onSelect", type: "(date: Date) => void", description: "Date change handler." }
    ],
    codeSnippet: `import { Calendar } from "glacia";

export default function CalendarDemo() {
  return <Calendar onSelect={(d) => console.log(d)} />;
}`
  },
  {
    slug: "chart",
    name: "Chart",
    description: "Apple Health & Fitness inspired minimalist glass metrics chart with glowing SVG gradient fills and hover tooltip.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "data", type: "ChartDataPoint[]", description: "Array of { label, value } points." },
      { name: "type", type: "'bar' | 'line' | 'area'", default: "'bar'", description: "Chart visualization type." },
      { name: "color", type: "string", default: "'#0088ff'", description: "Accent stroke & fill color." }
    ],
    codeSnippet: `import { Chart } from "glacia";

const DATA = [
  { label: "Mon", value: 34 },
  { label: "Tue", value: 45 },
  { label: "Wed", value: 68 },
  { label: "Thu", value: 52 },
  { label: "Fri", value: 89 },
  { label: "Sat", value: 95 },
  { label: "Sun", value: 78 }
];

export default function ChartDemo() {
  return <Chart data={DATA} type="area" color="#34c759" valueSuffix=" bpm" />;
}`
  },
  {
    slug: "empty",
    name: "Empty",
    description: "Apple empty state screen featuring glass squircle icon plate, clear headline, and action button.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "title", type: "string", description: "Headline text." },
      { name: "description", type: "string", description: "Explanatory note." },
      { name: "icon", type: "ReactNode", description: "Icon inside squircle badge." },
      { name: "action", type: "ReactNode", description: "Interactive call to action." }
    ],
    codeSnippet: `import { Empty, Button } from "glacia";

export default function EmptyDemo() {
  return (
    <Empty
      icon={<span>📬</span>}
      title="No Unread Mail"
      description="All conversations in your VIP inbox have been reviewed."
      action={<Button variant="filled">Check All Mail</Button>}
    />
  );
}`
  },
  {
    slug: "item",
    name: "Item",
    description: "Apple iOS Settings and list row with leading squircle icon, titles, and trailing accessory slot.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "title", type: "ReactNode", description: "Primary title." },
      { name: "description", type: "ReactNode", description: "Secondary detail text." },
      { name: "icon", type: "ReactNode", description: "Leading icon." },
      { name: "iconTint", type: "string", description: "Background tint of icon squircle." },
      { name: "accessory", type: "ReactNode", description: "Trailing accessory element." },
      { name: "interactive", type: "boolean", default: "false", description: "Enables hover highlight and click feedback." }
    ],
    codeSnippet: `import { Item, Switch } from "glacia";

export default function ItemDemo() {
  return (
    <Item
      icon={<span>📶</span>}
      iconTint="#0088ff"
      title="Wi-Fi"
      description="Apple Park 5GHz"
      accessory={<Switch defaultChecked />}
    />
  );
}`
  },
  {
    slug: "hover-card",
    name: "Hover Card",
    description: "macOS QuickLook and Safari link preview hover card floating over liquid glass.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web only",
    wave: 2,
    props: [
      { name: "align", type: "'center' | 'start' | 'end'", default: "'center'", description: "Popover alignment relative to trigger." }
    ],
    codeSnippet: `import { HoverCard, HoverCardTrigger, HoverCardContent, Avatar, AvatarFallback } from "glacia";

export default function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger className="underline cursor-pointer">@tim_cook</HoverCardTrigger>
      <HoverCardContent className="w-64 p-4 space-y-2">
        <div className="flex gap-3 items-center">
          <Avatar><AvatarFallback>TC</AvatarFallback></Avatar>
          <div>
            <p className="font-semibold text-sm">Tim Cook</p>
            <p className="text-xs opacity-70">CEO at Apple</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}`
  },
  {
    slug: "context-menu",
    name: "Context Menu",
    description: "macOS / iOS long-press and right-click context menu with keyboard shortcuts and destructive red actions.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web only",
    wave: 2,
    props: [],
    codeSnippet: `import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuShortcut } from "glacia";

export default function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="p-8 border border-dashed rounded-xl text-center">
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Back <ContextMenuShortcut>⌘[</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuItem>Reload <ContextMenuShortcut>⌘R</ContextMenuShortcut></ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem destructive>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}`
  },
  {
    slug: "drawer",
    name: "Drawer",
    description: "Apple iOS modal sheet with glass pull grabber handle, rounded top squircle corners, and backdrop blur.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [],
    codeSnippet: `import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, Button } from "glacia";

export default function DrawerDemo() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="filled">Open Apple Sheet</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Share with Nearby Devices</DrawerTitle>
          <DrawerDescription>AirDrop is active and discovering contacts.</DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}`
  },
  {
    slug: "sheet",
    name: "Sheet",
    description: "Apple slide-over panel sliding from right, left, top, or bottom with frosted glass elevation.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "side", type: "'top' | 'bottom' | 'left' | 'right'", default: "'right'", description: "Slide-in entry side." }
    ],
    codeSnippet: `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Button } from "glacia";

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="glass">Open Inspector</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Properties Inspector</SheetTitle>
          <SheetDescription>Configure Liquid Glass shader parameters.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}`
  },
  {
    slug: "toast",
    name: "Toast",
    description: "Apple Dynamic Island / HUD notification pill floating at the top of the viewport with spring entrance.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "variant", type: "'default' | 'destructive' | 'success'", default: "'default'", description: "Accent styling." }
    ],
    codeSnippet: `import { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription } from "glacia";

export default function ToastDemo() {
  return (
    <ToastProvider>
      <Toast defaultOpen>
        <div>
          <ToastTitle>AirPods Pro</ToastTitle>
          <ToastDescription>Connected · 98% Battery</ToastDescription>
        </div>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}`
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    description: "macOS Finder path bar and iOS navigation hierarchy with glass pills and chevron dividers.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [],
    codeSnippet: `import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "glacia";

export default function BreadcrumbDemo() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="/">iCloud Drive</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbLink href="/documents">Documents</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Liquid Glass</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}`
  },
  {
    slug: "navigation-menu",
    name: "Navigation Menu",
    description: "macOS application menu bar / top navigation with glass trigger items and animated dropdown viewport panels.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web only",
    wave: 2,
    props: [],
    codeSnippet: `import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from "glacia";

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 w-48">
            <p className="text-sm font-medium">Vision Pro</p>
            <p className="text-xs opacity-70">Spatial computing glass</p>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}`
  },
  {
    slug: "pagination",
    name: "Pagination",
    description: "Apple-style pagination pills with previous/next glass chevron buttons and active state indicator.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [],
    codeSnippet: `import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "glacia";

export default function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
        <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
        <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
        <PaginationItem><PaginationNext href="#" /></PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}`
  },
  {
    slug: "collapsible",
    name: "Collapsible",
    description: "Apple disclosure widget with rotating chevron and smooth expansion.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "defaultOpen", type: "boolean", default: "false", description: "Initial open state." }
    ],
    codeSnippet: `import { Collapsible, CollapsibleTrigger, CollapsibleContent, Button } from "glacia";

export default function CollapsibleDemo() {
  return (
    <Collapsible defaultOpen className="p-4 border rounded-xl">
      <CollapsibleTrigger asChild>
        <Button variant="ghost">Developer Options</Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 text-sm opacity-80">
        WebGL2 and SVG refraction displacement diagnostics.
      </CollapsibleContent>
    </Collapsible>
  );
}`
  },
  {
    slug: "data-table",
    name: "Data Table",
    description: "Apple Numbers / Finder column view interactive table with search bar, column sorting, and multi-row selection.",
    category: "Navigation & Layout",
    appleStatus: "Glacia extension",
    nativeStatus: "Web first",
    wave: 2,
    props: [
      { name: "data", type: "Record<string, any>[]", description: "Array of data records." },
      { name: "columns", type: "DataTableColumn[]", description: "Column definitions with headers and keys." },
      { name: "searchable", type: "boolean", default: "true", description: "Shows search input bar." },
      { name: "selectable", type: "boolean", default: "true", description: "Enables row select checkboxes." }
    ],
    codeSnippet: `import { DataTable } from "glacia";

const DATA = [
  { id: 1, name: "Mac Studio M4 Ultra", status: "Active", price: "$3,999" },
  { id: 2, name: "Studio Display XDR", status: "In Transit", price: "$1,599" },
  { id: 3, name: "Magic Keyboard with Touch ID", status: "Delivered", price: "$199" }
];

const COLUMNS = [
  { key: "name", header: "Device", sortable: true },
  { key: "status", header: "Status" },
  { key: "price", header: "Price", sortable: true }
];

export default function DataTableDemo() {
  return <DataTable data={DATA} columns={COLUMNS} />;
}`
  },
  {
    slug: "toggle-group",
    name: "Toggle Group",
    description: "Apple segmented toolbar or filter bar for toggling one or multiple active states with haptic spring feedback.",
    category: "Buttons & Actions",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "type", type: "'single' | 'multiple'", default: "'single'", description: "Whether one or multiple items can be selected." },
      { name: "variant", type: "'glass' | 'outline' | 'ghost'", default: "'glass'", description: "Visual glass style." },
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Sizing preset." },
      { name: "value", type: "string | string[]", description: "Controlled value." },
      { name: "onValueChange", type: "(val: any) => void", description: "Value change handler." }
    ],
    codeSnippet: `import { ToggleGroup, ToggleGroupItem } from "glacia";

export default function ToggleGroupDemo() {
  return (
    <ToggleGroup type="multiple" defaultValue={["bold", "italic"]}>
      <ToggleGroupItem value="bold">B</ToggleGroupItem>
      <ToggleGroupItem value="italic">I</ToggleGroupItem>
      <ToggleGroupItem value="underline">U</ToggleGroupItem>
    </ToggleGroup>
  );
}`
  },
  {
    slug: "input-otp",
    name: "Input OTP",
    description: "Apple ID Two-Factor Authentication SMS & Passkey 6-digit code verification entry slots with glowing focus rings.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "maxLength", type: "number", default: "6", description: "Total number of code digits." },
      { name: "value", type: "string", description: "Controlled input value." },
      { name: "onChange", type: "(val: string) => void", description: "Value update callback." },
      { name: "onComplete", type: "(val: string) => void", description: "Fires when all slots are filled." }
    ],
    codeSnippet: `import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "glacia";

export default function InputOTPDemo() {
  return (
    <InputOTP maxLength={6} onComplete={(code) => console.log(code)}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}`
  },
  {
    slug: "command",
    name: "Command",
    description: "macOS Spotlight / Apple Command Palette floating quick-search window with categorized shortcut actions.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "children", type: "ReactNode", description: "Command palette items, inputs, and groups." }
    ],
    codeSnippet: `import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut } from "glacia";

export default function CommandDemo() {
  return (
    <Command>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar<CommandShortcut>⌘1</CommandShortcut></CommandItem>
          <CommandItem>Settings<CommandShortcut>⌘,</CommandShortcut></CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}`
  },
  {
    slug: "carousel",
    name: "Carousel",
    description: "iOS Photos & App Store swipeable hero card carousel with momentum snapping and dynamic pill indicator dots.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "defaultIndex", type: "number", default: "0", description: "Initial active slide index." }
    ],
    codeSnippet: `import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots } from "glacia";

export default function CarouselDemo() {
  return (
    <Carousel className="max-w-md">
      <CarouselContent>
        <CarouselItem>Slide 1</CarouselItem>
        <CarouselItem>Slide 2</CarouselItem>
        <CarouselItem>Slide 3</CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
      <CarouselDots />
    </Carousel>
  );
}`
  },
  {
    slug: "kbd",
    name: "Kbd",
    description: "macOS physical keycap badge with micro-bevel depth, top highlight hairline, and SF monospaced glyphs.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web only",
    wave: 3,
    props: [
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Keycap dimension size." }
    ],
    codeSnippet: `import { Kbd } from "glacia";

export default function KbdDemo() {
  return (
    <div className="flex gap-2 items-center">
      <Kbd size="md">⌘</Kbd>
      <Kbd size="md">K</Kbd>
    </div>
  );
}`
  },
  {
    slug: "code-block",
    name: "Code Block",
    description: "Apple Developer documentation & Xcode code preview window with macOS traffic light controls and haptic copy button.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web only",
    wave: 3,
    props: [
      { name: "code", type: "string", description: "Source code to display." },
      { name: "filename", type: "string", description: "Optional filename header." },
      { name: "language", type: "string", default: "'typescript'", description: "Programming language badge." },
      { name: "showLineNumbers", type: "boolean", default: "true", description: "Toggles line numbers." }
    ],
    codeSnippet: `import { CodeBlock } from "glacia";

export default function CodeBlockDemo() {
  return (
    <CodeBlock
      filename="App.tsx"
      language="typescript"
      code="import { Glass } from 'glacia';\\n\\nexport default function App() {\\n  return <Glass>Hello</Glass>;\\n}"
    />
  );
}`
  },
  {
    slug: "marker",
    name: "Marker",
    description: "Apple Maps teardrop pin with animated pulsing ripple, and Safari luminous text highlighter marker.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "color", type: "'blue' | 'green' | 'orange' | 'red' | 'purple'", default: "'blue'", description: "Pin marker accent color." },
      { name: "label", type: "ReactNode", description: "Floating label caption." },
      { name: "pulse", type: "boolean", default: "true", description: "Animates pulsing radar wave." }
    ],
    codeSnippet: `import { Marker, TextMarker } from "glacia";

export default function MarkerDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Marker color="blue" label="Cupertino, CA" />
      <p>Bending light across <TextMarker variant="yellow">liquid glass</TextMarker> materials.</p>
    </div>
  );
}`
  },
  {
    slug: "menubar",
    name: "Menubar",
    description: "macOS system menu bar with liquid glass dropdown surfaces, keyboard shortcuts, and nested submenus.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web only",
    wave: 3,
    props: [
      { name: "children", type: "ReactNode", description: "Menubar menus and triggers." }
    ],
    codeSnippet: `import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarShortcut, MenubarSeparator } from "glacia";

export default function MenubarDemo() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Close Window <MenubarShortcut>⌘W</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}`
  },
  {
    slug: "message",
    name: "Message",
    description: "Apple iMessage & Apple Intelligence speech bubbles in rich system gradients or frosted liquid glass.",
    category: "Chat & AI",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "role", type: "'user' | 'assistant' | 'system'", default: "'user'", description: "Message sender role." }
    ],
    codeSnippet: `import { Message, MessageBubble, MessageAvatar, MessageContent, MessageTimestamp, MessageStatus } from "glacia";

export default function MessageDemo() {
  return (
    <div className="flex flex-col gap-3">
      <Message role="assistant">
        <MessageAvatar fallback="AI" />
        <MessageBubble>
          <MessageContent>Designing for iOS 26 Liquid Glass.</MessageContent>
          <MessageTimestamp>9:41 AM</MessageTimestamp>
        </MessageBubble>
      </Message>
      <Message role="user">
        <MessageBubble>
          <MessageContent>Looks completely authentic!</MessageContent>
          <MessageTimestamp>9:42 AM <MessageStatus status="read" /></MessageTimestamp>
        </MessageBubble>
      </Message>
    </div>
  );
}`
  },
  {
    slug: "bubble",
    name: "Bubble",
    description: "A single chat bubble on its own: Liquid Glass, solid or gradient fill, with a pointed corner so a run of bubbles reads as one stack.",
    category: "Chat & AI",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "side", type: "'user' | 'assistant' | 'system'", default: "'assistant'", description: "Who the bubble belongs to; sets its side and fill." },
      { name: "variant", type: "'glass' | 'solid' | 'gradient'", default: "'glass'", description: "The material the bubble is drawn in." },
      { name: "tail", type: "'none' | 'start' | 'end'", default: "'end'", description: "Which bottom corner points, so consecutive bubbles stack." },
      { name: "full", type: "boolean", default: "false", description: "Grows the bubble to the full wrap width." },
      { name: "time", type: "string", description: "Timestamp shown under the bubble." },
    ],
    codeSnippet: `import { Bubble } from "glacia";

export default function BubbleDemo() {
  return (
    <div className="flex flex-col gap-2 max-w-sm">
      <Bubble side="assistant" time="9:41 AM">
        Designing for iOS 26 Liquid Glass.
      </Bubble>
      <Bubble side="user" variant="gradient" tail="start" time="9:42 AM">
        Real refraction is bending underneath!
      </Bubble>
    </div>
  );
}`,
  },
  {
    slug: "message-scroller",
    name: "Message Scroller",
    description: "iOS Messages auto-scrolling conversation feed with sticky date headers and floating glass scroll-to-bottom capsule.",
    category: "Chat & AI",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "autoScroll", type: "boolean", default: "true", description: "Auto-scrolls to bottom on new messages." }
    ],
    codeSnippet: `import { MessageScroller, MessageDateDivider, Message, MessageBubble } from "glacia";

export default function MessageScrollerDemo() {
  return (
    <MessageScroller className="h-64">
      <MessageDateDivider>Today 9:41 AM</MessageDateDivider>
      <Message role="assistant"><MessageBubble>How can I help you?</MessageBubble></Message>
      <Message role="user"><MessageBubble>Build Wave 3!</MessageBubble></Message>
    </MessageScroller>
  );
}`
  },
  {
    slug: "attachment",
    name: "Attachment",
    description: "iOS iMessage / Mail file attachment cards and pills with file icons, formatted sizes, and preview actions.",
    category: "Chat & AI",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "name", type: "string", description: "File name with extension." },
      { name: "size", type: "string", description: "Human-readable file size." },
      { name: "type", type: "'image' | 'pdf' | 'audio' | 'code' | 'file'", default: "'file'", description: "Attachment MIME kind." },
      { name: "onRemove", type: "() => void", description: "Delete button handler." }
    ],
    codeSnippet: `import { Attachment } from "glacia";

export default function AttachmentDemo() {
  return (
    <div className="flex gap-2">
      <Attachment name="Keynote.pdf" size="4.8 MB" type="pdf" onRemove={() => {}} />
      <Attachment name="VoiceMemo.m4a" size="1.2 MB" type="audio" />
    </div>
  );
}`
  },
  {
    slug: "questionnaire",
    name: "Questionnaire",
    description: "Apple Health & Fitness onboarding diagnostic step-by-step quiz with progress bar and option checkmarks.",
    category: "Chat & AI",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "currentStep", type: "number", default: "1", description: "Active step index." },
      { name: "totalSteps", type: "number", default: "3", description: "Total steps count." },
      { name: "onNext", type: "() => void", description: "Next step handler." }
    ],
    codeSnippet: `import { Questionnaire, QuestionnaireStep, QuestionnaireOption } from "glacia";

export default function QuestionnaireDemo() {
  return (
    <Questionnaire currentStep={1} totalSteps={3} onNext={() => {}}>
      <QuestionnaireStep title="Device Preference" description="Select your primary workstation">
        <QuestionnaireOption label="MacBook Pro" description="Liquid Retina XDR display" selected />
        <QuestionnaireOption label="Mac Studio" description="M4 Max or M4 Ultra power" />
      </QuestionnaireStep>
    </Questionnaire>
  );
}`
  },
  {
    slug: "direction",
    name: "Direction",
    description: "Right-to-Left (RTL) internationalization context provider supporting Arabic, Hebrew, and bidirectional layouts.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "dir", type: "'ltr' | 'rtl'", description: "Text and layout reading direction." }
    ],
    codeSnippet: `import { DirectionProvider, Button } from "glacia";

export default function DirectionDemo() {
  return (
    <DirectionProvider dir="rtl">
      <div className="flex gap-2">
        <Button>مرحبا (Hello)</Button>
        <Button variant="glass">إلغاء (Cancel)</Button>
      </div>
    </DirectionProvider>
  );
}`
  },

  {
    slug: "action-sheet",
    name: "Action Sheet",
    description: "An iOS action sheet: options slide up from the bottom in glass, with a Cancel button below.",
    category: "Popups & Menus",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 4,
    props: [
      { name: "items", type: "ActionSheetItem[]", description: "The options. Each has label, onPress, and optional destructive / disabled." },
      { name: "cancelLabel", type: "string", default: "'Cancel'", description: "Text for the cancel button." },
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the sheet opens or closes." },
      { name: "children", type: "ReactNode", description: "Optional trigger element." }
    ],
    codeSnippet: `import { ActionSheet } from "glacia";

export default function ActionSheetDemo() {
  return (
    <ActionSheet
      items={[
        { label: "Save to Files", onPress: () => {} },
        { label: "Copy Link", onPress: () => {} },
        { label: "Delete", onPress: () => {}, destructive: true },
      ]}
    >
      <button>Show Options</button>
    </ActionSheet>
  );
}`
  },
  {
    slug: "color-picker",
    name: "Color Picker",
    description: "An iOS colour grid with a hex field, in glass.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 4,
    props: [
      { name: "value", type: "string", description: "The selected colour as a hex string." },
      { name: "onChange", type: "(colour: string) => void", description: "Called when a swatch or hex is committed." }
    ],
    codeSnippet: `import { ColorPicker } from "glacia";
import { useState } from "react";

export default function ColorPickerDemo() {
  const [colour, setColour] = useState("#007AFF");
  return <ColorPicker value={colour} onChange={setColour} />;
}`
  },
  {
    slug: "list",
    name: "List",
    description: "An iOS grouped list, like Settings or Mail: glass rows with leading icons and trailing detail.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 4,
    props: [
      { name: "header", type: "string", description: "Section caption above the rows." },
      { name: "ListItem.leading", type: "ReactNode", description: "Icon or avatar at the start of a row." },
      { name: "ListItem.trailing", type: "ReactNode", description: "Detail shown at the end of a row." },
      { name: "ListItem.chevron", type: "boolean", description: "Shows a disclosure chevron." },
      { name: "ListItem.onPress", type: "() => void", description: "Makes the row a button." }
    ],
    codeSnippet: `import { List, ListItem } from "glacia";

export default function ListDemo() {
  return (
    <List header="Settings">
      <ListItem leading="Wi-Fi" chevron>Wi-Fi</ListItem>
      <ListItem leading="BT" trailing="On" chevron>Bluetooth</ListItem>
      <ListItem leading="P" trailing="4" chevron>Privacy</ListItem>
    </List>
  );
}`
  },
  {
    slug: "page-control",
    name: "Page Control",
    description: "The iOS row of page dots. The active dot fills and widens, and tapping one changes page.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 4,
    props: [
      { name: "count", type: "number", description: "How many dots to show." },
      { name: "index", type: "number", description: "The active dot, 0-based." },
      { name: "onChange", type: "(index: number) => void", description: "Called when a dot is tapped." },
      { name: "tint", type: "string", description: "Colour for the active dot." },
      { name: "hidesForSinglePage", type: "boolean", default: "true", description: "Hide when there is only one page." }
    ],
    codeSnippet: `import { PageControl } from "glacia";
import { useState } from "react";

export default function PageControlDemo() {
  const [page, setPage] = useState(0);
  return <PageControl count={5} index={page} onChange={setPage} />;
}`
  },
  {
    slug: "popup-button",
    name: "Pop-up Button",
    description: "A glass button that opens a small menu of choices above it, like an iOS pop-up button.",
    category: "Buttons & Actions",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 4,
    props: [
      { name: "label", type: "string", description: "The text shown on the button." },
      { name: "items", type: "{ label: string; onPress: () => void }[]", description: "The menu choices." },
      { name: "disabled", type: "boolean", description: "Disables the button." }
    ],
    codeSnippet: `import { PopupButton } from "glacia";

export default function PopupButtonDemo() {
  return (
    <PopupButton
      label="Sort by"
      items={[
        { label: "Name", onPress: () => {} },
        { label: "Date", onPress: () => {} },
        { label: "Size", onPress: () => {} },
      ]}
    />
  );
}`
  },
  {
    slug: "stepper",
    name: "Stepper",
    description: "An iOS stepper: a − and + pair in glass that increments and decrements a value.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 4,
    props: [
      { name: "value", type: "number", description: "Current value." },
      { name: "onValueChange", type: "(value: number) => void", description: "Called with the new value." },
      { name: "min", type: "number", default: "0", description: "Smallest allowed value." },
      { name: "max", type: "number", default: "100", description: "Largest allowed value." },
      { name: "step", type: "number", default: "1", description: "Amount changed per tap." },
      { name: "disabled", type: "boolean", description: "Disables both buttons." }
    ],
    codeSnippet: `import { Stepper } from "glacia";
import { useState } from "react";

export default function StepperDemo() {
  const [count, setCount] = useState(1);
  return <Stepper value={count} onValueChange={setCount} min={0} max={10} />;
}`
  },
  {
    slug: "time-picker",
    name: "Time Picker",
    description: "An iOS time picker: hour, minute and AM/PM columns that scroll, ringed in glass.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 4,
    props: [
      { name: "value", type: "string", description: "The time, as 'h:MM AM' or 'HH:MM'." },
      { name: "onChange", type: "(time: string) => void", description: "Called when a column settles." },
      { name: "twelveHour", type: "boolean", default: "true", description: "Show AM/PM instead of 24 hours." }
    ],
    codeSnippet: `import { TimePicker } from "glacia";
import { useState } from "react";

export default function TimePickerDemo() {
  const [time, setTime] = useState("9:41 AM");
  return <TimePicker value={time} onChange={setTime} />;
}`
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    description: "An iOS toolbar: a glass rail of icon buttons that sits above the tab bar.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 4,
    props: [
      { name: "items", type: "ToolbarItem[]", description: "Each has icon, label, onPress, and optional active / disabled." },
      { name: "aria-label", type: "string", description: "Accessible name for the toolbar." }
    ],
    codeSnippet: `import { Toolbar } from "glacia";

export default function ToolbarDemo() {
  return (
    <Toolbar
      aria-label="Editing"
      items={[
        { icon: "↶", label: "Undo", onPress: () => {} },
        { icon: "↷", label: "Redo", onPress: () => {} },
        { icon: "B", label: "Bold", onPress: () => {}, active: true },
        { icon: "⤴", label: "Share", onPress: () => {} },
      ]}
    />
  );
}`
  },
  {
    slug: "widget",
    name: "Widget",
    description: "An iOS Home Screen widget in glass, sized small, medium or large, with corner slots.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 4,
    props: [
      { name: "size", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Widget footprint." },
      { name: "leading", type: "ReactNode", description: "Content in the top-left corner." },
      { name: "trailing", type: "ReactNode", description: "Content in the top-right corner." }
    ],
    codeSnippet: `import { Widget } from "glacia";

export default function WidgetDemo() {
  return (
    <Widget size="md" leading="Weather" trailing="Cupertino">
      <span style={{ fontSize: 40 }}>21°</span>
      <span>Sunny · H:24° L:15°</span>
    </Widget>
  );
}`
  },
  {
    slug: "line-chart",
    name: "Line Chart",
    description: "A continuous series over ordered categories, drawn in real pixels so strokes stay 2px and labels stay legible at any width.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "labels", type: "string[]", description: "One label per data point along the x axis." },
      { name: "series", type: "LineSeries[]", description: "Series to draw. Each has a name, values and optional colour." },
      { name: "height", type: "number", default: "220", description: "Height of the plot in pixels." },
      { name: "area", type: "boolean", default: "false", description: "Fill beneath each line with a soft gradient." },
      { name: "smooth", type: "boolean", default: "true", description: "Curve the line through the points. Off draws straight segments." },
      { name: "dots", type: "boolean", default: "false", description: "Always show a dot at each point. Hover always shows them." },
      { name: "format", type: "(value: number) => string", description: "Formats axis ticks and tooltip values." },
    ],
    codeSnippet: `import { LineChart } from "glacia";

<LineChart
  labels={["Jan", "Feb", "Mar", "Apr"]}
  series={[{ name: "Revenue", values: [42, 58, 51, 74] }]}
/>`,
  },
  {
    slug: "area-chart",
    name: "Area Chart",
    description: "A continuous series with its area filled. Same scales, ticks and tooltip as Line Chart, so the two align when used together.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "labels", type: "string[]", description: "One label per data point." },
      { name: "series", type: "LineSeries[]", description: "The series to fill." },
      { name: "height", type: "number", default: "220", description: "Height of the plot in pixels." },
      { name: "smooth", type: "boolean", default: "true", description: "Curve the line through the points." },
      { name: "format", type: "(value: number) => string", description: "Formats axis ticks and tooltip values." },
    ],
    codeSnippet: `import { AreaChart } from "glacia";

<AreaChart
  labels={["Jan", "Feb", "Mar", "Apr"]}
  series={[{ name: "Revenue", values: [42, 58, 51, 74] }]}
/>`,
  },
  {
    slug: "mirror-area-chart",
    name: "Mirror Area Chart",
    description: "Two series mirrored across a shared centre line, for comparing opposing flows such as inflow against outflow.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "labels", type: "string[]", description: "One label per data point." },
      { name: "series", type: "MirrorAreaSeries", description: "An above series and a below series sharing one axis." },
      { name: "height", type: "number", default: "220", description: "Height of the plot in pixels." },
      { name: "aboveColor", type: "string", description: "Colour for the upward series." },
      { name: "belowColor", type: "string", description: "Colour for the downward series." },
    ],
    codeSnippet: `import { MirrorAreaChart } from "glacia";

<MirrorAreaChart
  labels={["Mon", "Tue", "Wed"]}
  series={{ name: "Traffic", above: [32, 48, 41], below: [18, 24, 30] }}
/>`,
  },
  {
    slug: "bar-chart",
    name: "Bar Chart",
    description: "Values compared across categories, as grouped or stacked bars.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "labels", type: "string[]", description: "One label per category." },
      { name: "series", type: "BarSeries[]", description: "One series per set of bars." },
      { name: "height", type: "number", default: "220", description: "Height of the plot in pixels." },
      { name: "stacked", type: "boolean", default: "false", description: "Stack series on top of each other instead of grouping." },
      { name: "radius", type: "number", default: "5", description: "Corner radius of each bar." },
      { name: "format", type: "(value: number) => string", description: "Formats axis ticks and tooltip values." },
    ],
    codeSnippet: `import { BarChart } from "glacia";

<BarChart
  labels={["Jan", "Feb", "Mar"]}
  series={[{ name: "Spend", values: [42, 58, 51] }]}
/>`,
  },
  {
    slug: "pie-chart",
    name: "Pie Chart",
    description: "Proportional slices around a circle, with a legend so slices never have to be matched to colours by eye.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "data", type: "Slice[]", description: "Slices with a label, value and optional colour." },
      { name: "size", type: "number", default: "200", description: "Diameter in pixels." },
      { name: "format", type: "(value: number) => string", description: "Formats values in the legend and tooltip." },
    ],
    codeSnippet: `import { PieChart } from "glacia";

<PieChart
  data={[
    { label: "Direct", value: 38 },
    { label: "Search", value: 27 },
    { label: "Social", value: 20 },
  ]}
/>`,
  },
  {
    slug: "radar-chart",
    name: "Radar Chart",
    description: "Several axes around a circle with each series as a closed shape, for comparing profiles across many dimensions.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "axes", type: "string[]", description: "Axis names. At least three are required." },
      { name: "series", type: "RadarSeries[]", description: "Series with one value per axis." },
      { name: "size", type: "number", default: "240", description: "Diameter in pixels." },
      { name: "rings", type: "number", default: "4", description: "Number of concentric reference rings." },
      { name: "max", type: "number", description: "Fixed maximum. Defaults to the largest value." },
    ],
    codeSnippet: `import { RadarChart } from "glacia";

<RadarChart
  axes={["Speed", "Quality", "Cost", "Support"]}
  series={[{ name: "Current", values: [78, 84, 66, 72] }]}
/>`,
  },
  {
    slug: "heatmap-chart",
    name: "Heatmap Chart",
    description: "Intensity across a grid of rows and columns, shaded by value with the exact number available on hover.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "rows", type: "string[]", description: "Row labels, top to bottom." },
      { name: "columns", type: "string[]", description: "Column labels, left to right." },
      { name: "cells", type: "HeatmapCell[]", description: "Cells addressed by row and column index." },
      { name: "cellSize", type: "number", default: "26", description: "Size of each cell in pixels." },
      { name: "gap", type: "number", default: "3", description: "Gap between cells." },
      { name: "format", type: "(value: number) => string", description: "Formats the value in the tooltip." },
    ],
    codeSnippet: `import { HeatmapChart } from "glacia";

<HeatmapChart
  rows={["Mon", "Tue"]}
  columns={["9a", "1p", "5p"]}
  cells={[{ x: 0, y: 0, value: 20 }, { x: 1, y: 0, value: 48 }]}
/>`,
  },
  {
    slug: "hex-chart",
    name: "Hex Chart",
    description: "A tessellated grid of hexagons shaded by value, where neighbours touch on all six sides.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "points", type: "HexPoint[]", description: "Points placed on a hex grid by column and row." },
      { name: "radius", type: "number", default: "14", description: "Hexagon radius in pixels." },
      { name: "format", type: "(value: number) => string", description: "Formats the value in the tooltip." },
    ],
    codeSnippet: `import { HexChart } from "glacia";

<HexChart
  points={[{ q: 0, r: 0, value: 30 }, { q: 1, r: 0, value: 52 }]}
/>`,
  },
  {
    slug: "funnel-chart",
    name: "Funnel Chart",
    description: "A sequence of stages where each narrows the one before it, showing share of entry and step conversion.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "stages", type: "FunnelStage[]", description: "Stages in order, widest first." },
      { name: "stageHeight", type: "number", default: "44", description: "Height of each stage bar in pixels." },
      { name: "baseline", type: "number", description: "Value the first stage is measured against. Defaults to the first stage." },
      { name: "format", type: "(value: number) => string", description: "Formats stage values." },
    ],
    codeSnippet: `import { FunnelChart } from "glacia";

<FunnelChart
  stages={[
    { label: "Visited", value: 12400 },
    { label: "Signed up", value: 4210 },
    { label: "Paid", value: 640 },
  ]}
/>`,
  },
  {
    slug: "waterfall-chart",
    name: "Waterfall Chart",
    description: "How a starting value moves to an ending one through a series of changes, with the running balance visible at every step.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "steps", type: "WaterfallStep[]", description: "Steps with a positive or negative value, or marked as a total." },
      { name: "height", type: "number", default: "240", description: "Height of the plot in pixels." },
      { name: "increaseColor", type: "string", description: "Colour for positive changes." },
      { name: "decreaseColor", type: "string", description: "Colour for negative changes." },
      { name: "totalColor", type: "string", description: "Colour for total bars." },
    ],
    codeSnippet: `import { WaterfallChart } from "glacia";

<WaterfallChart
  steps={[
    { label: "Start", total: true },
    { label: "New", value: 480 },
    { label: "Churn", value: -160 },
    { label: "End", total: true },
  ]}
/>`,
  },
  {
    slug: "candlestick-chart",
    name: "Candlestick Chart",
    description: "Open, high, low and close for each period, with wicks showing the full range.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "candles", type: "Candle[]", description: "Candles in chronological order." },
      { name: "height", type: "number", default: "260", description: "Height of the plot in pixels." },
      { name: "upColor", type: "string", description: "Colour when close is above open." },
      { name: "downColor", type: "string", description: "Colour when close is below open." },
    ],
    codeSnippet: `import { CandlestickChart } from "glacia";

<CandlestickChart
  candles={[{ label: "Mon", open: 100, high: 112, low: 96, close: 108 }]}
/>`,
  },
  {
    slug: "bump-chart",
    name: "Bump Chart",
    description: "Position over time, where rank is what matters rather than magnitude. Crossings are the signal.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "labels", type: "string[]", description: "One label per period." },
      { name: "series", type: "BumpSeries[]", description: "Series with a rank per period. 1 is the top." },
      { name: "height", type: "number", default: "240", description: "Height of the plot in pixels." },
      { name: "format", type: "(value: number) => string", description: "Formats rank labels." },
    ],
    codeSnippet: `import { BumpChart } from "glacia";

<BumpChart
  labels={["W1", "W2", "W3"]}
  series={[
    { name: "Alpha", ranks: [1, 2, 2] },
    { name: "Beta", ranks: [2, 1, 3] },
  ]}
/>`,
  },
  {
    slug: "polar-area-chart",
    name: "Polar Area Chart",
    description: "Equal-angle segments whose radius encodes the value, so magnitude is not forced into a share of a whole.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "segments", type: "PolarSegment[]", description: "Segments with a label and value." },
      { name: "size", type: "number", default: "240", description: "Diameter in pixels." },
      { name: "max", type: "number", description: "Value mapped to the full radius. Defaults to the largest segment." },
    ],
    codeSnippet: `import { PolarAreaChart } from "glacia";

<PolarAreaChart
  segments={[{ label: "North", value: 62 }, { label: "East", value: 48 }]}
/>`,
  },
  {
    slug: "live-line-chart",
    name: "Live Line Chart",
    description: "A line that keeps sampling on a real timer, with a sliding window and a pause control.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "initialValues", type: "number[]", description: "Starting samples, oldest first." },
      { name: "window", type: "number", default: "40", description: "How many samples to keep in view." },
      { name: "interval", type: "number", default: "900", description: "Sample interval in milliseconds." },
      { name: "sample", type: "(previous: number, index: number) => number", description: "Produces the next sample." },
      { name: "values", type: "number[]", description: "Plot external values instead of generating them." },
      { name: "height", type: "number", default: "180", description: "Height of the plot in pixels." },
    ],
    codeSnippet: `import { LiveLineChart } from "glacia";

<LiveLineChart window={40} interval={900} />`,
  },
  {
    slug: "plot-chart",
    name: "Plot Chart",
    description: "A bare plotting surface where you supply the mark renderer and get pixel-accurate positions inside a real axis system.",
    category: "Charts",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 3,
    props: [
      { name: "marks", type: "PlotMark[]", description: "Marks with a category and value." },
      { name: "categories", type: "string[]", description: "Category order. Defaults to first-seen order." },
      { name: "height", type: "number", default: "220", description: "Height of the plot in pixels." },
      { name: "renderMark", type: "(mark, geometry) => ReactNode", description: "Draws each mark at its computed position." },
    ],
    codeSnippet: `import { PlotChart } from "glacia";

<PlotChart
  marks={[{ category: "Mon", value: 32 }, { category: "Tue", value: 58 }]}
  renderMark={(_m, { x, y }) => <circle cx={x} cy={y} r={5} fill="var(--gl-chart-1)" />}
/>`,
  },
  {
    slug: "shimmer",
    name: "Shimmer",
    description: "A shimmering placeholder that occupies the same number of lines the final text will need, so the layout does not jump when content arrives.",
    category: "Chat & AI",
    appleStatus: "Glacia extension",
    nativeStatus: "Web only",
    wave: 4,
    props: [
      { name: "lines", type: "number", default: "3", description: "How many placeholder lines to draw." },
      { name: "label", type: "string", default: "Loading content", description: "Announced to assistive technology." },
    ],
    codeSnippet: `import { Shimmer } from "glacia";

<Shimmer lines={3} />`,
  },
  {
    slug: "plan",
    name: "Plan",
    description: "An ordered list of steps a model intends to take, each stating its own status so a running plan is legible while incomplete.",
    category: "Chat & AI",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 4,
    props: [
      { name: "title", type: "string", default: "Plan", description: "Heading above the steps." },
      { name: "steps", type: "PlanStep[]", description: "Steps with an id, title, optional detail and status." },
    ],
    codeSnippet: `import { Plan } from "glacia";

<Plan
  steps={[
    { id: "1", title: "Read the files", status: "done" },
    { id: "2", title: "Write the patch", status: "running" },
  ]}
/>`,
  },
  {
    slug: "response",
    name: "Response",
    description: "Reveals a streamed answer progressively, with a caret while the stream is live and a status announcement when it completes.",
    category: "Chat & AI",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 4,
    props: [
      { name: "text", type: "string", description: "The full response text." },
      { name: "revealed", type: "number", description: "How many characters to show. Omit to show all." },
      { name: "streaming", type: "boolean", description: "Force the streaming state." },
    ],
    codeSnippet: `import { Response } from "glacia";

<Response text="The answer is 42." revealed={12} />`,
  },
  {
    slug: "panelside",
    name: "Panelside",
    description: "A side rail for an AI workspace: conversations, saved prompts or tasks, with counts and a footer slot.",
    category: "Chat & AI",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 4,
    props: [
      { name: "items", type: "AIPanelNavItem[]", description: "Items with an id, label and optional count." },
      { name: "activeId", type: "string", description: "Controlled selection." },
      { name: "onSelect", type: "(id: string) => void", description: "Called when an item is chosen." },
      { name: "title", type: "string", default: "Workspace", description: "Rail heading." },
    ],
    codeSnippet: `import { Panelside } from "glacia";

<Panelside
  items={[{ id: "a", label: "Conversations", count: 4 }, { id: "b", label: "Prompts" }]}
/>`,
  },
  {
    slug: "ai-input",
    name: "AI Input",
    description: "The prompt composer. Grows with its content, submits on Enter, inserts newlines on Shift+Enter, and blocks empty or busy submissions.",
    category: "Chat & AI",
    appleStatus: "Glacia extension",
    nativeStatus: "Yes",
    wave: 4,
    props: [
      { name: "value", type: "string", description: "Controlled value." },
      { name: "onValueChange", type: "(value: string) => void", description: "Called as the user types." },
      { name: "onSubmit", type: "(value: string) => void", description: "Called with the trimmed prompt." },
      { name: "busy", type: "boolean", default: "false", description: "Disables submission while a request is in flight." },
      { name: "hint", type: "ReactNode", description: "Shown above the field, e.g. the active model." },
    ],
    codeSnippet: `import { AIInput } from "glacia";

<AIInput onSubmit={(prompt) => send(prompt)} hint="Model: Glacia 1" />`,
  },
];
