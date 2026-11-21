"use client";

// The docs import the real native package. `glacia-native` resolves React
// Native at runtime and falls back to DOM equivalent elements when it is not
// installed, which is exactly what a docs page needs: the same component code
// the phone runs, drawn with plain elements here.
import {
  ActionSheet,
  AlertDialog,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  Dialog,
  Field,
  Glass,
  Input,
  Label,
  RadioGroup,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  TabBar,
  Tabs,
  Textarea,
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
