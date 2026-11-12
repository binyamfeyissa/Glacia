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
  NativeAIInput,
  NativeAreaChart,
  NativeBarChart,
  NativeBubbleChart,
  NativeBumpChart,
  NativeCandlestickChart,
  NativeFunnelChart,
  NativeHeatmapChart,
  NativeHexChart,
  NativeImageGeneration,
  NativeLineChart,
  NativeLiveLineChart,
  NativeMirrorAreaChart,
  NativePanelside,
  NativePlan,
  NativePlotChart,
  NativePolarAreaChart,
  NativePyramidChart,
  NativeRadarChart,
  NativeResponse,
  NativeRingChart,
  NativeSankeyChart,
  NativeScatterChart,
  NativeScrollArea,
  NativeSoundwave,
  NativeSources,
  NativeTable,
  NativeTask,
  NativeThinkingOrb,
  NativeTreemapChart,
  NativeWaterfallChart,
  RadioGroup,
  SegmentedControl,
  Select,
  Slider,
  Switch,
  TabBar,
  Tabs,
  Textarea,
} from "glacia-native";

// Datasets shared with the web chart demos so both platforms plot the same
// numbers: the scales then visibly agree, which is the claim being made.
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const spend = [42, 58, 51, 74, 66, 88];
const revenue = [58, 61, 70, 79, 88, 104];
const traffic = [
  { label: "Search", value: 46 },
  { label: "Direct", value: 28 },
  { label: "Social", value: 16 },
  { label: "Email", value: 10 },
];
const weeks = ["W1", "W2", "W3", "W4", "W5", "W6"];
const heat = [0.2, 0.4, 0.7, 0.5, 0.9, 0.3];
const funnel = [
  { label: "Visited", value: 100 },
  { label: "Signed up", value: 48 },
  { label: "Activated", value: 6 },
];
const radar = [
  { label: "Speed", value: 82 },
  { label: "Clarity", value: 74 },
  { label: "Depth", value: 61 },
  { label: "Calm", value: 90 },
  { label: "Contrast", value: 70 },
  { label: "Reach", value: 55 },
];
const waterfall = [
  { label: "Start", value: 100, isTotal: true },
  { label: "Sales", value: 30 },
  { label: "Refunds", value: -20 },
  { label: "End", value: 110, isTotal: true },
];
const candles = [
  { label: "Mon", open: 100, high: 118, low: 94, close: 112 },
  { label: "Tue", open: 112, high: 124, low: 104, close: 108 },
  { label: "Wed", open: 108, high: 132, low: 106, close: 128 },
];
const tree = [
  { label: "Product", value: 52 },
  { label: "Services", value: 26 },
  { label: "Support", value: 14 },
  { label: "Other", value: 8 },
];
const flows = {
  nodes: [
    { id: "visit", label: "Visit" },
    { id: "cart", label: "Cart" },
    { id: "buy", label: "Buy" },
  ],
  links: [
    { from: "visit", to: "cart", value: 60 },
    { from: "cart", to: "buy", value: 38 },
  ],
};
const ranks = [
  { label: "Jan", rows: [{ name: "Safari", value: 92 }, { name: "Chrome", value: 84 }] },
  { label: "Feb", rows: [{ name: "Safari", value: 84 }, { name: "Chrome", value: 92 }] },
  { label: "Mar", rows: [{ name: "Safari", value: 97 }, { name: "Chrome", value: 88 }] },
];
const radarSeries = [{ name: "Score", values: [82, 74, 61, 90, 70, 55] }];
const radarAxes = ["Speed", "Clarity", "Depth", "Calm", "Contrast", "Reach"];
const scatterSeries = [
  { name: "This month", points: [{ x: 12, y: 34, label: "A" }, { x: 28, y: 61, label: "B" }, { x: 44, y: 45, label: "C" }, { x: 61, y: 78, label: "D" }] },
];
const hexes = [
  { label: "A", value: 24 },
  { label: "B", value: 61 },
  { label: "C", value: 38 },
];
const points = [
  { label: "A", x: 12, y: 34 },
  { label: "B", x: 28, y: 61 },
  { label: "C", x: 44, y: 45 },
  { label: "D", x: 61, y: 78 },
];

const rows = [
  { id: "1", cells: { name: "Ada Lovelace", role: "Engineer" } },
  { id: "2", cells: { name: "Grace Hopper", role: "Admiral" } },
];

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
  switch: () => <Switch checked onCheckedChange={() => {}} accessibilityLabel="Notifications" />,
  slider: () => <Slider value={62} onValueChange={() => {}} accessibilityLabel="Volume" />,
  "segmented-control": () => (
    <SegmentedControl values={["Day", "Week"]} selectedIndex={0} onValueChange={() => {}} />
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
  "line-chart": () => (
    <NativeLineChart labels={months} series={[{ name: "Spend", values: spend }]} width={300} />
  ),
  "area-chart": () => (
    <NativeAreaChart labels={months} series={[{ name: "Spend", values: spend }]} width={300} />
  ),
  "mirror-area-chart": () => (
    <NativeMirrorAreaChart
      labels={months}
      series={{ name: "Cash flow", above: revenue, below: spend }}
      width={300}
    />
  ),
  "bar-chart": () => (
    <NativeBarChart labels={months} series={[{ name: "Spend", values: spend }]} width={300} />
  ),
  "pie-chart": () => <NativeRingChart data={traffic} size={170} thickness={170} />,
  "ring-chart": () => <NativeRingChart data={traffic} size={170} />,
  "radar-chart": () => <NativeRadarChart axes={radarAxes} series={radarSeries} size={220} />,
  "scatter-chart": () => <NativeScatterChart series={scatterSeries} width={300} />,
  "bubble-chart": () => <NativeScatterChart series={scatterSeries} bubble width={300} />,
  "heatmap-chart": () => (
    <NativeHeatmapChart
      rows={[
        { label: "Mon", values: heat },
        { label: "Tue", values: heat.slice().reverse() },
        { label: "Wed", values: heat },
      ]}
      columns={weeks}
    />
  ),
  "hex-chart": () => (
    <NativeHexChart
      points={[
        { x: 12, y: 34, value: 2 },
        { x: 18, y: 40, value: 5 },
        { x: 26, y: 31, value: 1 },
        { x: 33, y: 47, value: 7 },
        { x: 41, y: 38, value: 3 },
      ]}
      width={300}
    />
  ),
  "funnel-chart": () => <NativeFunnelChart stages={funnel} width={300} />,
  "waterfall-chart": () => <NativeWaterfallChart steps={waterfall} width={300} />,
  "candlestick-chart": () => <NativeCandlestickChart candles={candles} width={300} />,
  "treemap-chart": () => <NativeTreemapChart items={tree} width={300} />,
  "sankey-chart": () => <NativeSankeyChart nodes={flows.nodes} links={flows.links} width={300} />,
  "bump-chart": () => (
    <NativeBumpChart
      labels={["Jan", "Feb", "Mar"]}
      series={[
        { name: "Safari", ranks: [1, 2, 1] },
        { name: "Chrome", ranks: [2, 1, 2] },
      ]}
      width={300}
    />
  ),
  "polar-area-chart": () => <NativePolarAreaChart segments={traffic} size={240} />,
  "pyramid-chart": () => <NativePyramidChart levels={funnel} width={300} />,
  "live-line-chart": () => (
    <NativeLiveLineChart labels={months} series={[{ name: "Live", values: spend }]} width={300} />
  ),
  "plot-chart": () => <NativePlotChart points={points} width={300} />,

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

  plan: () => (
    <NativePlan
      steps={[
        { id: "a", title: "Read the schema", status: "done" },
        { id: "b", title: "Draft the query", status: "running" },
      ]}
    />
  ),
  sources: () => (
    <NativeSources
      sources={[
        { id: "a", title: "Glacia docs", url: "https://example.com/docs" },
        { id: "b", title: "Apple HIG", url: "https://example.com/hig" },
      ]}
    />
  ),
  response: () => (
    <NativeResponse text="Liquid glass bends the backdrop through a squircle lens rather than blurring it." />
  ),
  task: () => <NativeTask task={{ label: "Summarise the thread", status: "running", progress: 0.4 }} />,
  soundwave: () => <NativeSoundwave levels={[0.3, 0.7, 0.45, 0.9, 0.2, 0.6]} />,
  "thinking-orb": () => <NativeThinkingOrb />,
  panelside: () => (
    <NativePanelside
      title="Assistant"
      value="a"
      items={[
        { id: "a", label: "Conversations", count: 12 },
        { id: "b", label: "Saved prompts", count: 4 },
      ]}
    />
  ),
  "ai-input": () => <NativeAIInput onSubmit={() => {}} />,
  "image-generation": () => (
    <NativeImageGeneration
      status="done"
      prompt="A glass wall on a rainy street"
      image={{ url: "https://picsum.photos/400/260", alt: "Generated glass wall" }}
    />
  ),

  table: () => (
    <NativeTable
      columns={[
        { key: "name", header: "Name" },
        { key: "role", header: "Role" },
      ]}
      rows={rows}
    />
  ),
  "scroll-area": () => (
    <NativeScrollArea maxHeight={150} bordered>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ padding: 6 }}>
          Row {i + 1}
        </div>
      ))}
    </NativeScrollArea>
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
