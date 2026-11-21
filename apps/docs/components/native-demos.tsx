"use client";

// The docs import the real native package. `glacia-native` resolves React
// Native at runtime and falls back to DOM equivalent elements when it is not
// installed, which is exactly what a docs page needs: the same component code
// the phone runs, drawn with plain elements here.
import {
  Accordion,
  ActionSheet,
  Alert,
  AlertDialog,
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Chip,
  Collapsible,
  ContextMenu,
  Dialog,
  DropdownMenu,
  Field,
  Glass,
  GlassBackdrop,
  GlassContainer,
  GlassProvider,
  GlassStack,
  GlassView,
  Group,
  IconButton,
  Input,
  Label,
  MorphGroup,
  Popover,
  Progress,
  RadioGroup,
  Scrim,
  SegmentedControl,
  Select,
  Separator,
  Sheet,
  Skeleton,
  Slider,
  Stepper,
  Switch,
  TabBar,
  Tabs,
  Text,
  Textarea,
  Toast,
  Toggle,
  ToggleGroup,
  Toolbar,
  Tooltip,
} from "glacia-native";

const options = [
  { value: "a", label: "Standard" },
  { value: "b", label: "Express" },
];

/**
 * Native previews.
 *
 * Web and native previews are separate modules on purpose: a native component
 * must be shown by the native implementation, or the page would be claiming a
 * mobile rendering it never ran. Every entry below renders the real
 * `glacia-native` component.
 */
const nativeCases: Record<string, () => React.ReactNode> = {
  glass: () => (
    <Glass style={{ padding: 20, borderRadius: 18 }}>
      <p style={{ margin: 0, fontWeight: 600 }}>Native glass surface</p>
      <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.75 }}>
        iOS 26 refracts through UIGlassEffect; older iOS and Android fall back to a tinted layer.
      </p>
    </Glass>
  ),
  button: () => (
    <div style={{ display: "grid", gap: 10 }}>
      <Button accessibilityLabel="Primary glass button" onPress={() => {}}>
        Primary glass button
      </Button>
      <Button accessibilityLabel="Ghost button" variant="ghost" onPress={() => {}}>
        Ghost button
      </Button>
    </div>
  ),
  card: () => (
    <Card>
      <CardHeader>
        <CardTitle>Today</CardTitle>
        <CardDescription>Activity summary</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ margin: 0 }}>12,480 steps</p>
      </CardContent>
    </Card>
  ),
  switch: () => <Switch value onValueChange={() => {}} accessibilityLabel="Notifications" />,
  slider: () => <Slider value={62} onValueChange={() => {}} accessibilityLabel="Volume" />,
  "segmented-control": () => (
    <SegmentedControl segments={["Day", "Week"]} selectedIndex={0} onChange={() => {}} />
  ),
  tabs: () => (
    <Tabs
      items={[
        { id: "a", label: "Overview" },
        { id: "b", label: "Details" },
      ]}
      activeId="a"
      onTabChange={() => {}}
    />
  ),
  "tab-bar": () => (
    <TabBar
      items={[
        { id: "home", label: "Home" },
        { id: "search", label: "Search" },
        { id: "me", label: "Profile" },
      ]}
      activeId="home"
      onTabChange={() => {}}
    />
  ),
  input: () => <Input placeholder="Email address" />,
  textarea: () => <Textarea placeholder="Tell us more" rows={3} />,
  label: () => <Label>Email address</Label>,
  field: () => (
    <Field label="Email" description="We never share it.">
      <Input placeholder="you@example.com" />
    </Field>
  ),
  checkbox: () => <Checkbox checked onCheckedChange={() => {}} label="Remember me" />,
  "radio-group": () => <RadioGroup value="a" onValueChange={() => {}} options={options} />,
  select: () => <Select value="a" onValueChange={() => {}} options={options} />,
  dialog: () => (
    <Dialog open title="Delete file?" description="This cannot be undone." />
  ),
  "dialog-trigger": () => (
    <Dialog open title="Delete file?" description="This cannot be undone." />
  ),
  "alert-dialog": () => (
    <AlertDialog open title="Discard changes?" description="Your edits will be lost." />
  ),
  "action-sheet": () => (
    <ActionSheet
      open
      title="Photo"
      options={[
        { label: "Take photo", onPress: () => {} },
        { label: "Choose from library", onPress: () => {} },
      ]}
    />
  ),
  "glass-view": () => (
    <GlassView style={{ padding: 20, borderRadius: 18 }}>
      <p style={{ margin: 0, fontWeight: 600 }}>Now playing</p>
      <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.75 }}>
        GlassView is Glass under the engine's name — the same surface, the same props.
      </p>
    </GlassView>
  ),
  "glass-container": () => (
    <GlassContainer spacing={8} style={{ flexDirection: "row", gap: 8 }}>
      <Glass style={{ padding: 16, borderRadius: 20 }}>
        <p style={{ margin: 0 }}>One</p>
      </Glass>
      <Glass style={{ padding: 16, borderRadius: 20 }}>
        <p style={{ margin: 0 }}>Two</p>
      </Glass>
    </GlassContainer>
  ),
  "glass-provider": () => (
    <div>
      <GlassProvider>
        <p style={{ margin: 0 }}>Page content the glass samples.</p>
        <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.75 }}>
          On Android the provider records this backdrop; the bar beside it reads it.
        </p>
      </GlassProvider>
      <TabBar
        items={[
          { id: "home", label: "Home" },
          { id: "search", label: "Search" },
          { id: "me", label: "Profile" },
        ]}
        activeId="home"
        onTabChange={() => {}}
      />
    </div>
  ),
  "glass-stack": () => (
    <GlassStack style={{ height: 160 }}>
      <GlassStack.Layer>
        <Text>Base layer</Text>
      </GlassStack.Layer>
      <GlassStack.Layer>
        <Text>Sheet over it</Text>
      </GlassStack.Layer>
    </GlassStack>
  ),
  "glass-backdrop": () => (
    <GlassBackdrop>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>Row one</p>
      <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.75 }}>Row two</p>
      <Glass style={{ padding: 16, borderRadius: 20, marginTop: 12 }}>
        <p style={{ margin: 0 }}>Floating pane</p>
      </Glass>
    </GlassBackdrop>
  ),
  "icon-button": () => (
    <IconButton accessibilityLabel="Share" icon={<Text>↗</Text>} onPress={() => {}} />
  ),
  chip: () => (
    <div style={{ display: "flex", gap: 8 }}>
      <Chip label="Nearby" defaultSelected onSelectedChange={() => {}} />
      <Chip label="Open now" onPress={() => {}} />
    </div>
  ),
  stepper: () => (
    <Stepper value={2} onValueChange={() => {}} min={1} max={8} accessibilityLabel="Guests" />
  ),
  toolbar: () => (
    <Toolbar
      title="Inbox"
      leading={
        <IconButton accessibilityLabel="Back" icon={<Text>‹</Text>} onPress={() => {}} />
      }
      trailing={
        <IconButton accessibilityLabel="Share" icon={<Text>↗</Text>} onPress={() => {}} />
      }
    />
  ),
  toast: () => <Toast visible message="Saved" duration={0} onDismiss={() => {}} />,
  sheet: () => (
    <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
      <Sheet visible height={180} onDismiss={() => {}}>
        <Text>Sheet content</Text>
      </Sheet>
    </div>
  ),
  group: () => (
    <Group>
      <Button accessibilityLabel="Cut" onPress={() => {}}>
        Cut
      </Button>
      <Button accessibilityLabel="Copy" onPress={() => {}}>
        Copy
      </Button>
      <Button accessibilityLabel="Paste" onPress={() => {}}>
        Paste
      </Button>
    </Group>
  ),
  "morph-group": () => (
    <MorphGroup
      items={[
        { key: "reply", label: "Reply" },
        { key: "forward", label: "Forward" },
        { key: "archive", label: "Archive" },
      ]}
      onMerge={() => {}}
    />
  ),
  scrim: () => (
    <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.75 }}>
        Content scrolling under the bar — the scrim keeps the edge legible.
      </p>
      <Scrim edge="bottom" size={120}>
        <TabBar
          items={[
            { id: "home", label: "Home" },
            { id: "search", label: "Search" },
            { id: "me", label: "Profile" },
          ]}
          activeId="home"
          onTabChange={() => {}}
        />
      </Scrim>
    </div>
  ),
  accordion: () => (
    <Accordion
      defaultOpenSections={["shipping"]}
      sections={[
        { value: "shipping", title: "Shipping", content: <Text>Ships in 2 days.</Text> },
        { value: "returns", title: "Returns", content: <Text>30-day returns.</Text> },
      ]}
    />
  ),
  alert: () => (
    <Alert tone="warning" title="Storage almost full" description="You have 200 MB left." />
  ),
  avatar: () => (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <Avatar name="Maya Chen" status="online" />
      <Avatar name="Jonas Berg" size="lg" />
    </div>
  ),
  badge: () => (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <Badge tone="destructive">3</Badge>
      <Badge>New</Badge>
    </div>
  ),
  collapsible: () => (
    <Collapsible defaultOpen trigger={<Text>Advanced options</Text>}>
      <Text>Revealed content</Text>
    </Collapsible>
  ),
  "context-menu": () => (
    <ContextMenu
      open
      onOpenChange={() => {}}
      trigger={<Text>Press and hold</Text>}
      items={[
        { label: "Reply", onPress: () => {} },
        { label: "Delete", destructive: true, onPress: () => {} },
      ]}
    />
  ),
  "dropdown-menu": () => (
    <DropdownMenu
      defaultOpen
      trigger={<Text>Options</Text>}
      items={[
        { label: "Edit", onPress: () => {} },
        { label: "Share", onPress: () => {} },
      ]}
    />
  ),
  popover: () => (
    <Popover defaultOpen trigger={<Text>Details</Text>}>
      <Text>Anchored panel content.</Text>
    </Popover>
  ),
  progress: () => <Progress value={62} accessibilityLabel="Upload progress" />,
  separator: () => (
    <div>
      <p style={{ margin: 0 }}>First section</p>
      <Separator inset={16} style={{ marginVertical: 10 }} />
      <p style={{ margin: 0 }}>Second section</p>
    </div>
  ),
  skeleton: () => (
    <div style={{ display: "grid", gap: 10 }}>
      <Skeleton shape="circle" height={40} />
      <Skeleton shape="line" width="60%" />
      <Skeleton shape="line" width="40%" />
    </div>
  ),
  text: () => (
    <div style={{ display: "grid", gap: 6 }}>
      <Text variant="title">Good morning</Text>
      <Text variant="body">Your summary is ready.</Text>
      <Text variant="caption" muted>
        Updated just now
      </Text>
    </div>
  ),
  toggle: () => (
    <Toggle pressed onPressedChange={() => {}} accessibilityLabel="Bold">
      B
    </Toggle>
  ),
  "toggle-group": () => (
    <ToggleGroup
      items={[
        { value: "bold", label: "Bold" },
        { value: "italic", label: "Italic" },
      ]}
      multiple
      defaultValue={["bold"]}
      onValueChange={() => {}}
    />
  ),
  tooltip: () => (
    <Tooltip label="Add to favourites" defaultOpen>
      <Text>★</Text>
    </Tooltip>
  ),
};

export const NATIVE_DEMO_SLUGS = Object.keys(nativeCases);

/** Renders the real native component, or an honest note when none is wired. */
export function NativeDemo({ slug }: { slug: string }) {
  const render = nativeCases[slug];
  if (!render) {
    return (
      <p className="doc-note">
        No live preview is wired for “{slug}”. The code example above is the component used
        unchanged.
      </p>
    );
  }
  return <div style={{ padding: "8px 0" }}>{render()}</div>;
}
