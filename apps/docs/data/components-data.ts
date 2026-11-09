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
  category: "Buttons & Actions" | "Text & Forms" | "Showing Things" | "Navigation & Layout" | "Popups & Menus" | "Chat & AI";
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
    nativeStatus: "Web first",
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
    slug: "native-select",
    name: "Native Select",
    description: "Semantic native select dropdown styled with Glacia glass, custom glass chevron, and mobile OS picker support.",
    category: "Text & Forms",
    appleStatus: "Apple-faithful",
    nativeStatus: "Yes",
    wave: 2,
    props: [
      { name: "sizeVariant", type: "'sm' | 'md' | 'lg'", default: "'md'", description: "Size of select wrapper." }
    ],
    codeSnippet: `import { NativeSelect } from "glacia";

export default function NativeSelectDemo() {
  return (
    <NativeSelect defaultValue="auto">
      <option value="auto">Automatic (System HIG)</option>
      <option value="light">Always Light Mode</option>
      <option value="dark">Always Dark Mode</option>
    </NativeSelect>
  );
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
    slug: "aspect-ratio",
    name: "Aspect Ratio",
    description: "Apple TV & Photos media container maintaining exact dimensional ratios (16:9, 4:3, 1:1) with optional specular glass frame.",
    category: "Showing Things",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web first",
    wave: 3,
    props: [
      { name: "ratio", type: "number", default: "16 / 9", description: "Aspect ratio width / height." },
      { name: "glassBorder", type: "boolean", default: "false", description: "Applies liquid glass squircle border." }
    ],
    codeSnippet: `import { AspectRatio } from "glacia";

export default function AspectRatioDemo() {
  return (
    <AspectRatio ratio={16 / 9} glassBorder className="overflow-hidden">
      <img src="/wallpaper.jpg" alt="Wallpaper" className="w-full h-full object-cover" />
    </AspectRatio>
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
    slug: "resizable",
    name: "Resizable",
    description: "macOS NSSplitView multi-panel layout divider with draggable liquid glass hairline handle and grip bar.",
    category: "Navigation & Layout",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web only",
    wave: 3,
    props: [
      { name: "direction", type: "'horizontal' | 'vertical'", default: "'horizontal'", description: "Layout split orientation." }
    ],
    codeSnippet: `import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "glacia";

export default function ResizableDemo() {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[200px]">
      <ResizablePanel defaultSize={25} order={0}>Sidebar</ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75} order={1}>Editor</ResizablePanel>
    </ResizablePanelGroup>
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
    slug: "trace",
    name: "Trace",
    description: "Apple Intelligence / Siri execution reasoning tree with status badges, latencies, and expandable payload inspection.",
    category: "Chat & AI",
    appleStatus: "Apple-faithful",
    nativeStatus: "Web only",
    wave: 3,
    props: [
      { name: "title", type: "ReactNode", default: "'Reasoning Trace'", description: "Header caption." }
    ],
    codeSnippet: `import { Trace, TraceStep, TraceDetails } from "glacia";

export default function TraceDemo() {
  return (
    <Trace title="Apple Intelligence Reasoning">
      <TraceStep title="Querying Semantic Index" status="completed" duration="82ms" />
      <TraceStep title="Synthesizing Fluid Answer" status="running">
        <TraceDetails>Streaming tokens through local neural engine...</TraceDetails>
      </TraceStep>
    </Trace>
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
  }
];
