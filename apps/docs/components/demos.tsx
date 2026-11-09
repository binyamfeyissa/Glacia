"use client";

import { useState } from "react";
import {
  Glass,
  Button,
  Text,
  Input,
  Textarea,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Separator,
  Skeleton,
  Spinner,
  Progress,
  Switch,
  Slider,
  SearchField,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SegmentedControl,
  TabBar,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  Popover,
  PopoverTrigger,
  PopoverContent,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  Menu,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  Toaster,
  toast,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  ScrollArea,
} from "glacia";

export function ComponentDemo({ slug }: { slug: string }) {
  switch (slug) {
    case "glass":
      return (
        <Glass className="p-8 rounded-2xl max-w-sm text-center">
          <p className="font-semibold text-lg mb-1">Liquid Glass Primitive</p>
          <p className="text-sm opacity-80">
            Real optical refraction bending live background details behind this panel.
          </p>
        </Glass>
      );

    case "button":
      return (
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Button variant="filled">Prominent Action</Button>
          <Button variant="glass">Glass Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="glass" destructive>Destructive</Button>
          <Button variant="filled" size="sm">Small</Button>
          <Button variant="filled" size="lg">Large</Button>
        </div>
      );

    case "text":
      return (
        <div className="space-y-3 max-w-md text-left">
          <Text variant="h2">Optical Typography</Text>
          <Text variant="lead">Crisp legibility designed specifically over glass materials.</Text>
          <Text variant="p">
            Apple HIG requires dark text on light glass, and light text on dark glass with ample contrast.
          </Text>
          <Text variant="code">const effect = "liquid-glass";</Text>
        </div>
      );

    case "input":
      return (
        <div className="w-full max-w-sm space-y-3">
          <Input placeholder="Enter username..." />
          <Input type="password" placeholder="Enter password..." />
          <Input placeholder="Input with error state" error />
        </div>
      );

    case "textarea":
      return (
        <div className="w-full max-w-sm">
          <Textarea placeholder="Type feedback or project notes here..." rows={4} />
        </div>
      );

    case "label":
      return (
        <div className="space-y-2 w-full max-w-sm">
          <Label htmlFor="demo-email">Account Email</Label>
          <Input id="demo-email" type="email" placeholder="alexander@glacia.dev" />
        </div>
      );

    case "card":
      return (
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Liquid Glass Card</CardTitle>
            <CardDescription>Glacia Extension: Putting glass on content layers with real refraction.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              While Apple reserves glass for navigation, Glacia brings Liquid Glass to cards and dashboards.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="glass" size="sm">Dismiss</Button>
            <Button variant="filled" size="sm">Save</Button>
          </CardFooter>
        </Card>
      );

    case "badge":
      return (
        <div className="flex flex-wrap gap-2 items-center justify-center">
          <Badge variant="default">Liquid Glass</Badge>
          <Badge variant="secondary">Wave 1</Badge>
          <Badge variant="destructive">Critical</Badge>
          <Badge variant="outline">Verified</Badge>
        </div>
      );

    case "avatar":
      return (
        <div className="flex gap-4 items-center justify-center">
          <Avatar>
            <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120" alt="Sarah" />
            <AvatarFallback>ST</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>GL</AvatarFallback>
          </Avatar>
        </div>
      );

    case "separator":
      return (
        <div className="w-full max-w-xs space-y-3">
          <p className="text-sm">Upper section</p>
          <Separator />
          <p className="text-sm">Lower section</p>
        </div>
      );

    case "skeleton":
      return (
        <div className="flex items-center gap-4 w-full max-w-sm">
          <Skeleton style={{ width: 48, height: 48, borderRadius: 24 }} />
          <div className="space-y-2 flex-1">
            <Skeleton style={{ height: 16, width: "80%" }} />
            <Skeleton style={{ height: 12, width: "60%" }} />
          </div>
        </div>
      );

    case "spinner":
      return (
        <div className="flex gap-6 items-center justify-center">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      );

    case "progress":
      return (
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between text-xs">
            <span>Optimizing shaders...</span>
            <span>72%</span>
          </div>
          <Progress value={72} />
        </div>
      );

    case "switch":
      return (
        <div className="flex items-center gap-4">
          <Switch aria-label="Enable Liquid Refraction" defaultChecked />
          <span className="text-sm font-medium">Liquid Refraction</span>
        </div>
      );

    case "slider":
      return (
        <div className="w-full max-w-sm space-y-2">
          <div className="flex justify-between text-xs">
            <span>Refraction Strength</span>
            <span>65%</span>
          </div>
          <Slider defaultValue={65} />
        </div>
      );

    case "search-field":
      return (
        <div className="w-full max-w-sm">
          <SearchField placeholder="Search components, tokens, guides..." />
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-center gap-3">
          <Checkbox id="demo-check" defaultChecked />
          <Label htmlFor="demo-check">Synchronize optical presets across devices</Label>
        </div>
      );

    case "radio-group":
      return (
        <RadioGroup defaultValue="regular" className="space-y-2">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="regular" id="opt-1" />
            <Label htmlFor="opt-1">Regular (Frosted, optimal contrast)</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="clear" id="opt-2" />
            <Label htmlFor="opt-2">Clear (Transparent, floating over video)</Label>
          </div>
        </RadioGroup>
      );

    case "select":
      return (
        <Select defaultValue="chromeweb">
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chromeweb">Chromium (SVG Refraction)</SelectItem>
            <SelectItem value="safari">Safari (Layer 1 Blur)</SelectItem>
            <SelectItem value="firefox">Firefox (Layer 1 Blur)</SelectItem>
            <SelectItem value="ios">iOS 26+ (UIGlassEffect)</SelectItem>
          </SelectContent>
        </Select>
      );

    case "tabs":
      return (
        <Tabs defaultValue="overview" className="w-full max-w-sm">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="specs">Specs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-2 text-sm">
            Overview: Liquid Glass engineered with real physics.
          </TabsContent>
          <TabsContent value="features" className="pt-2 text-sm">
            Features: Chromium refraction, iOS 26 UIGlassEffect, universal fallbacks.
          </TabsContent>
          <TabsContent value="specs" className="pt-2 text-sm">
            Specs: Zero external CSS framework requirements, standalone React primitives.
          </TabsContent>
        </Tabs>
      );

    case "segmented-control":
      return (
        <SegmentedControl
          defaultValue="daily"
          items={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
          ]}
        />
      );

    case "tab-bar":
      return (
        <TabBar
          defaultValue="home"
          items={[
            { value: "home", label: "Home" },
            { value: "explore", label: "Explore" },
            { value: "library", label: "Library" },
            { value: "profile", label: "Profile" },
          ]}
        />
      );

    case "accordion":
      return (
        <Accordion type="single" collapsible className="w-full max-w-sm">
          <AccordionItem value="item-1">
            <AccordionTrigger>What makes Glacia different?</AccordionTrigger>
            <AccordionContent>
              Unlike simple backdrop-blur kits, Glacia implements genuine SVG refraction on Chromium and native UIGlassEffect on iOS 26.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What is the Browser Rule?</AccordionTrigger>
            <AccordionContent>
              Safari & Firefox receive Layer 1 (frosted blur + specular rim + soft shadow) via @supports so nothing breaks.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );

    case "dialog":
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="filled">Open Dialog Modal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Liquid Glass Dialog</DialogTitle>
              <DialogDescription>Floating modal layer with backdrop blur scrim.</DialogDescription>
            </DialogHeader>
            <p className="text-sm">Focus trapped, Escape key closes, smooth entry animation.</p>
            <DialogFooter>
              <Button variant="filled" size="sm">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

    case "alert-dialog":
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="glass" destructive>Reset System Settings</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset settings to factory default?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset your custom lens refractive index back to 1.5.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );

    case "popover":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="glass">Trigger Popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <p className="font-semibold text-sm">Optical Tuning</p>
            <p className="text-xs text-muted-foreground mt-1">
              Collision detection and light dismiss handled seamlessly.
            </p>
          </PopoverContent>
        </Popover>
      );

    case "dropdown-menu":
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="glass">Actions ▾</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Duplicate Layer</DropdownMenuItem>
            <DropdownMenuItem>Export as PNG</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Delete Surface</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

    case "menu":
      return (
        <Menu
          aria-label="App Menu"
          items={[
            { label: "Share Preset", onSelect: () => alert("Share clicked") },
            { label: "Duplicate", onSelect: () => alert("Duplicate clicked") },
            "separator",
            { label: "Delete", destructive: true, onSelect: () => alert("Delete clicked") },
          ]}
        />
      );

    case "tooltip":
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="glass">Hover for Tooltip</Button>
            </TooltipTrigger>
            <TooltipContent>Liquid Glass Tooltip Capsule</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

    case "sonner":
      return (
        <div>
          <Toaster position="bottom-right" />
          <Button
            variant="filled"
            onClick={() =>
              toast("Preset Applied", {
                description: "Apple iOS 26 refraction profile loaded.",
              })
            }
          >
            Dispatch Toast Notification
          </Button>
        </div>
      );

    case "table":
      return (
        <Table className="max-w-md">
          <TableHeader>
            <TableRow>
              <TableHead>Platform</TableHead>
              <TableHead>Material</TableHead>
              <TableHead>Refraction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Chromium</TableCell>
              <TableCell>SVG Filter</TableCell>
              <TableCell>Real Bend</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Safari</TableCell>
              <TableCell>Layer 1</TableCell>
              <TableCell>Frosted Blur</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">iOS 26+</TableCell>
              <TableCell>UIGlassEffect</TableCell>
              <TableCell>Native Glass</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      );

    case "sidebar":
      return (
        <SidebarProvider defaultOpen={true}>
          <div className="flex border rounded-2xl overflow-hidden h-64 max-w-md w-full">
            <Sidebar className="w-40 border-r p-3">
              <SidebarHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">App</span>
                  <SidebarTrigger />
                </div>
              </SidebarHeader>
              <SidebarContent className="mt-2">
                <SidebarMenu>
                  <SidebarMenuItem><SidebarMenuButton isActive>Inbox</SidebarMenuButton></SidebarMenuItem>
                  <SidebarMenuItem><SidebarMenuButton>Projects</SidebarMenuButton></SidebarMenuItem>
                  <SidebarMenuItem><SidebarMenuButton>Settings</SidebarMenuButton></SidebarMenuItem>
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <div className="flex-1 p-4 text-xs opacity-70">Main Content Canvas</div>
          </div>
        </SidebarProvider>
      );

    case "scroll-area":
      return (
        <ScrollArea style={{ height: 160, width: 280, borderRadius: 16, border: "1px solid var(--gl-separator)", padding: 16 }}>
          <div className="space-y-3 text-sm">
            <p className="font-medium">Apple's Liquid Glass</p>
            <p>Real optical refraction on web and iOS from one API.</p>
            <p>Layer 1 frosted blur supported in all browsers.</p>
            <p>Layer 2 Chromium bend behind @supports.</p>
            <p>Native iOS 26 UIGlassEffect integration.</p>
            <p>Independent, open-source under MIT.</p>
          </div>
        </ScrollArea>
      );

    default:
      return <div>Component Demo</div>;
  }
}
