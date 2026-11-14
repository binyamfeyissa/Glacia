import { COMPONENTS_DATA, type ComponentMeta } from "./components-data";
import type { Platform } from "./platforms";

// What actually ships on each platform.
//
// The web list is the existing catalogue verbatim: those are the 81 components
// exported by `glacia`. The native list is written by hand because
// `glacia-native` genuinely exports only these; nothing is listed here that the
// package does not export, and nothing exported is omitted.

export interface NativeComponentMeta {
  slug: string;
  name: string;
  description: string;
  category: string;
  /** Props that exist on the native component. */
  props: { name: string; type: string; default?: string; description: string }[];
  codeSnippet: string;
  /** What the glass actually does on this platform. */
  glass: string;
}

export const NATIVE_COMPONENTS: NativeComponentMeta[] = [
  {
    slug: "glass",
    name: "Glass",
    description:
      "The glass primitive. Renders a real UIGlassEffect on iOS 26+, and a translucent tinted surface with identical layout everywhere else.",
    category: "Layout",
    glass:
      "iOS 26+: native UIGlassEffect via @callstack/liquid-glass. Everywhere else: translucent tint, no optical distortion.",
    props: [
      { name: "effect", type: '"clear" | "regular" | "none"', default: '"regular"', description: "Material weight." },
      { name: "tintColor", type: "string", description: "Tint applied to the material." },
      { name: "interactive", type: "boolean", default: "false", description: "Lifts the material while pressed." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "children", type: "ReactNode", description: "Card content." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { Glass } from "glacia-native";

export function Demo() {
  return (
    <Glass style={{ padding: 20, borderRadius: 20 }}>
      <Text>Native glass surface</Text>
    </Glass>
  );
}`,
  },
  {
    slug: "button",
    name: "Button",
    description: "A pressable glass button with native press feedback.",
    category: "Actions",
    glass: "Native material on iOS 26+, translucent tint below.",
    props: [
      { name: "variant", type: '"glass" | "filled" | "ghost"', default: '"glass"', description: "Visual hierarchy." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control height preset." },
      { name: "title", type: "string", description: "Label shown inside the button." },
      { name: "onPress", type: "() => void", description: "Called when the button is pressed." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
    ],
    codeSnippet: `import { Button } from "glacia-native";

<Button title="Continue" onPress={() => {}} />`,
  },
  {
    slug: "card",
    name: "Card",
    description: "A glass container with header, content and footer slots.",
    category: "Layout",
    glass: "Native material on iOS 26+, translucent tint below.",
    props: [
      { name: "variant", type: '"glass" | "plain"', default: '"glass"', description: "Glass or plain surface." },
      { name: "children", type: "ReactNode", description: "Card content." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "glacia-native";

<Card>
  <CardHeader><CardTitle>Today</CardTitle></CardHeader>
  <CardContent><Text>12,480 steps</Text></CardContent>
</Card>`,
  },
  {
    slug: "switch",
    name: "Switch",
    description: "A native toggle styled to the Glacia material.",
    category: "Forms",
    glass: "Uses the platform switch; track tinted by the theme.",
    props: [
      { name: "value", type: "boolean", description: "Whether the switch is on." },
      { name: "onValueChange", type: "(value: boolean) => void", description: "Called with the new value." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
    ],
    codeSnippet: `<Switch value={on} onValueChange={setOn} />`,
  },
  {
    slug: "slider",
    name: "Slider",
    description: "A continuous value slider with a glass thumb.",
    category: "Forms",
    glass: "Thumb uses the glass material; track is a solid tint.",
    props: [
      { name: "value", type: "number", description: "Current slider value." },
      { name: "onValueChange", type: "(value: number) => void", description: "Called with the new value." },
      { name: "minimumValue", type: "number", default: "0", description: "Lowest selectable value." },
      { name: "maximumValue", type: "number", default: "1", description: "Highest selectable value." },
    ],
    codeSnippet: `<Slider value={v} onValueChange={setV} />`,
  },
  {
    slug: "segmented-control",
    name: "SegmentedControl",
    description: "A segmented choice with an animated glass selection.",
    category: "Navigation",
    glass: "Selection thumb is glass; track is a tint.",
    props: [
      { name: "segments", type: "string[]", description: "Segment labels." },
      { name: "value", type: "string", description: "Selected segment or tab." },
      { name: "onChange", type: "(value: string) => void", description: "Called with the selected value." },
    ],
    codeSnippet: `<SegmentedControl segments={["Day","Week"]} value={v} onChange={setV} />`,
  },
  {
    slug: "tabs",
    name: "Tabs",
    description: "In-page tabs with a moving glass indicator.",
    category: "Navigation",
    glass: "Indicator is glass; content is plain.",
    props: [
      { name: "tabs", type: "TabItem[]", description: "Tab definitions." },
      { name: "value", type: "string", description: "Selected segment or tab." },
      { name: "onChange", type: "(value: string) => void", description: "Called with the selected value." },
    ],
    codeSnippet: `<Tabs tabs={items} value={v} onChange={setV} />`,
  },
  {
    slug: "tab-bar",
    name: "TabBar",
    description: "A floating bottom tab bar in glass, with safe-area handling.",
    category: "Navigation",
    glass: "Native material on iOS 26+, translucent tint below.",
    props: [
      { name: "items", type: "TabBarItem[]", description: "Tab bar items." },
      { name: "value", type: "string", description: "Selected segment or tab." },
      { name: "onChange", type: "(value: string) => void", description: "Called with the selected value." },
    ],
    codeSnippet: `<TabBar items={items} value={v} onChange={setV} />`,
  },
  {
    slug: "line-chart",
    name: "Line Chart",
    description:
      "A continuous series drawn with react-native-svg using the same scales as the web LineChart. Tapping a column selects that point and reveals its values.",
    category: "Charts",
    glass:
      "The chart itself is a plain SVG surface, not a glass element. Put it inside Glass for the material; the series colours match the web palette.",
    props: [
      { name: "labels", type: "string[]", description: "One label per data point, used for the axis and touch targets." },
      { name: "series", type: "NativeLineSeries[]", description: "Series with a name, values and optional colour." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
      { name: "area", type: "boolean", default: "false", description: "Fill beneath each line." },
      { name: "smooth", type: "boolean", default: "true", description: "Curve the line through the points." },
      { name: "showDots", type: "boolean", default: "false", description: "Always draw a dot at each point." },
      { name: "isDark", type: "boolean", default: "false", description: "Use dark-mode axis and text colours." },
      { name: "onPointPress", type: "(index: number) => void", description: "Called when a point is tapped." },
    ],
    codeSnippet: `import { NativeLineChart } from "glacia-native";

<NativeLineChart
  labels={["Jan", "Feb", "Mar", "Apr"]}
  series={[{ name: "Revenue", values: [42, 58, 51, 74] }]}
/>`,
  },
  {
    slug: "bar-chart",
    name: "Bar Chart",
    description:
      "Grouped or stacked bars drawn with react-native-svg. Each category is a touch target, so a bar can be selected without a hover state.",
    category: "Charts",
    glass:
      "Plain SVG marks, not a glass surface. Wrap in Glass for the material; colours follow the shared chart palette.",
    props: [
      { name: "labels", type: "string[]", description: "One label per category." },
      { name: "series", type: "NativeBarSeries[]", description: "One series per set of bars." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
      { name: "stacked", type: "boolean", default: "false", description: "Stack series instead of grouping them." },
      { name: "radius", type: "number", default: "4", description: "Corner radius of each bar." },
      { name: "onBarPress", type: "(index: number) => void", description: "Called when a category is tapped." },
    ],
    codeSnippet: `import { NativeBarChart } from "glacia-native";

<NativeBarChart
  labels={["Jan", "Feb", "Mar"]}
  series={[{ name: "Spend", values: [42, 58, 51] }]}
/>`,
  },
  {
    slug: "ring-chart",
    name: "Ring Chart",
    description:
      "Proportional slices as a ring, sharing the arc maths with the web RingChart. The legend is on by default because a phone has no hover to identify a slice.",
    category: "Charts",
    glass:
      "Plain SVG arcs, not a glass surface. Wrap in Glass for the material; colours follow the shared chart palette.",
    props: [
      { name: "data", type: "NativeRingSlice[]", description: "Slices with a label, value and optional colour." },
      { name: "size", type: "number", default: "180", description: "Diameter in points." },
      { name: "thickness", type: "number", default: "22", description: "Ring thickness." },
      { name: "showLegend", type: "boolean", default: "true", description: "Show the slice list beneath the ring." },
      { name: "onSlicePress", type: "(index: number) => void", description: "Called when a slice or legend row is tapped." },
    ],
    codeSnippet: `import { NativeRingChart } from "glacia-native";

<NativeRingChart
  data={[
    { label: "Direct", value: 38 },
    { label: "Search", value: 27 },
  ]}
/>`,
  },

  {
    slug: "area-chart",
    name: "Area Chart",
    description:
      "A continuous series with its area filled. Draws through the same path as NativeLineChart, so axes and touch targets stay identical. Mirror Area flips two series across a shared centre line.",
    category: "Charts",
    glass:
      "Plain SVG fill and stroke, not a glass surface. Wrap in Glass for the material; colours follow the shared chart palette.",
    props: [
      { name: "labels", type: "string[]", description: "One label per data point." },
      { name: "series", type: "NativeLineSeries[]", description: "The series to fill." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
      { name: "smooth", type: "boolean", default: "true", description: "Curve the line through the points." },
      { name: "onPointPress", type: "(index: number) => void", description: "Called when a point is tapped." },
    ],
    codeSnippet: `import { NativeAreaChart, NativeMirrorAreaChart } from "glacia-native";

<NativeAreaChart
  labels={["Jan", "Feb", "Mar"]}
  series={[{ name: "Revenue", values: [42, 58, 51] }]}
/>

<NativeMirrorAreaChart
  labels={["Mon", "Tue", "Wed"]}
  series={{ name: "Traffic", above: [32, 48, 41], below: [18, 24, 30] }}
/>`,
  },
  {
    slug: "scatter-chart",
    name: "Scatter Chart",
    description:
      "Two numeric axes for showing correlation. Bubble Chart is the same component with marks sized by a third value, so the two share axes and touch behaviour.",
    category: "Charts",
    glass:
      "Plain SVG circles, not a glass surface. Wrap in Glass for the material; colours follow the shared chart palette.",
    props: [
      { name: "series", type: "NativeScatterSeries[]", description: "Series of x/y points with optional labels and sizes." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
      { name: "radius", type: "number", default: "4", description: "Fixed dot radius for scatter marks." },
      { name: "bubble", type: "boolean", default: "false", description: "Size each mark by its size value." },
      { name: "onPointPress", type: "(seriesIndex: number, pointIndex: number) => void", description: "Called when a mark is tapped." },
    ],
    codeSnippet: `import { NativeScatterChart, NativeBubbleChart } from "glacia-native";

<NativeScatterChart
  series={[{ name: "Plans", points: [{ x: 12, y: 30 }, { x: 28, y: 52 }] }]}
/>

<NativeBubbleChart
  series={[{ name: "Plans", points: [{ x: 12, y: 30, size: 40 }] }]}
/>`,
  },

  {
    slug: "funnel-chart",
    name: "Funnel Chart",
    description:
      "Stages that narrow as people drop out. Each row states its value, its share of entry and the step conversion, because a funnel is read for all three.",
    category: "Charts",
    glass:
      "Plain Views with a tinted fill, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "stages", type: "NativeFunnelStage[]", description: "Stages in order, each with a label, value and optional colour." },
      { name: "width", type: "number", default: "320", description: "Overall width in points." },
      { name: "stageHeight", type: "number", default: "38", description: "Height of each stage bar." },
      { name: "baseline", type: "number", description: "Value the first stage is measured against; defaults to its own value." },
      { name: "onStagePress", type: "(index: number) => void", description: "Called when a stage is tapped." },
    ],
    codeSnippet: `import { NativeFunnelChart } from "glacia-native";

<NativeFunnelChart
  stages={[
    { label: "Visited", value: 100 },
    { label: "Signed up", value: 48 },
    { label: "Purchased", value: 6 },
  ]}
/>`,
  },
  {
    slug: "heatmap-chart",
    name: "Heatmap Chart",
    description:
      "A grid where colour encodes magnitude. Tapping a cell reveals its exact value, which a phone cannot show by hover.",
    category: "Charts",
    glass:
      "Plain Views with computed tints, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "rows", type: "{ label: string; values: number[] }[]", description: "One row per series, each holding one value per column." },
      { name: "columns", type: "string[]", description: "Column labels." },
      { name: "cellSize", type: "number", default: "28", description: "Side length of each cell in points." },
      { name: "cellGap", type: "number", default: "3", description: "Space between cells." },
      { name: "minColor", type: "string", default: '"#e8eef7"', description: "Colour at the lowest value." },
      { name: "maxColor", type: "string", default: '"#0088ff"', description: "Colour at the highest value." },
      { name: "onCellPress", type: "(rowIndex: number, columnIndex: number) => void", description: "Called when a cell is tapped." },
    ],
    codeSnippet: `import { NativeHeatmapChart } from "glacia-native";

<NativeHeatmapChart
  columns={["AM", "PM"]}
  rows={[
    { label: "Mon", values: [2, 8] },
    { label: "Tue", values: [5, 1] },
  ]}
/>`,
  },

  {
    slug: "radar-chart",
    name: "Radar Chart",
    description:
      "Several axes around a circle with one closed shape per series. Every axis label is also a touch target, since a phone cannot hover for a tooltip.",
    category: "Charts",
    glass:
      "Plain SVG polygons, not a glass surface. Wrap in Glass for the material; colours follow the shared chart palette.",
    props: [
      { name: "axes", type: "string[]", description: "Axis labels. At least three are required to form a shape." },
      { name: "series", type: "NativeRadarSeries[]", description: "Series with one value per axis." },
      { name: "size", type: "number", default: "260", description: "Square size in points." },
      { name: "rings", type: "number", default: "4", description: "Concentric rings drawn behind the data." },
      { name: "max", type: "number", description: "Fixed maximum; defaults to the largest value across series." },
      { name: "onAxisPress", type: "(index: number) => void", description: "Called when an axis chip is tapped." },
    ],
    codeSnippet: `import { NativeRadarChart } from "glacia-native";

<NativeRadarChart
  axes={["Speed", "Price", "Quality", "Size", "Battery"]}
  series={[{ name: "Model A", values: [8, 5, 9, 4, 7] }]}
/>`,
  },
  {
    slug: "waterfall-chart",
    name: "Waterfall Chart",
    description:
      "How a running total moves step by step. Each bar starts where the previous ended, showing the bridge from opening to closing balance rather than unrelated changes.",
    category: "Charts",
    glass:
      "Plain SVG rectangles, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "steps", type: "NativeWaterfallStep[]", description: "Signed steps in order; set isTotal on opening and closing balances." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
      { name: "onStepPress", type: "(index: number) => void", description: "Called when a bar is tapped." },
    ],
    codeSnippet: `import { NativeWaterfallChart } from "glacia-native";

<NativeWaterfallChart
  steps={[
    { label: "Start", value: 100, isTotal: true },
    { label: "Sales", value: 30 },
    { label: "Refunds", value: -20 },
    { label: "End", value: 110, isTotal: true },
  ]}
/>`,
  },

  {
    slug: "input",
    name: "Input",
    description:
      "A single-line or multiline text field. The placeholder is drawn as sibling text so its colour follows the theme instead of the OS default.",
    category: "Text & Forms",
    glass:
      "A translucent tinted surface with a hairline border, not a refractive element. Wrap in Glass when the field sits on artwork.",
    props: [
      { name: "value", type: "string", description: "Controlled text value." },
      { name: "onChangeText", type: "(text: string) => void", description: "Called on every keystroke." },
      { name: "placeholder", type: "string", description: "Hint shown while empty." },
      { name: "invalid", type: "boolean", default: "false", description: "Tints the border destructive." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents editing and dims the field." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control height and text size." },
      { name: "multiline", type: "boolean", default: "false", description: "Allow wrapping to several lines." },
      { name: "prefix", type: "ReactNode", description: "Leading adornment, such as an icon." },
      { name: "suffix", type: "ReactNode", description: "Trailing adornment, such as a unit." },
    ],
    codeSnippet: `import { Input } from "glacia-native";

<Input
  value={email}
  onChangeText={setEmail}
  placeholder="you@example.com"
  keyboardType="email-address"
/>`,
  },
  {
    slug: "textarea",
    name: "Textarea",
    description:
      "A multi-line field. Separate from Input so a single-line field cannot silently grow, and callers set a row count instead of guessing pixel height.",
    category: "Text & Forms",
    glass: "Same tinted surface as Input, not a refractive element.",
    props: [
      { name: "value", type: "string", description: "Controlled text value." },
      { name: "onChangeText", type: "(text: string) => void", description: "Called on every keystroke." },
      { name: "rows", type: "number", default: "4", description: "Visible height in text lines." },
      { name: "placeholder", type: "string", description: "Hint shown while empty." },
      { name: "invalid", type: "boolean", default: "false", description: "Tints the border destructive." },
    ],
    codeSnippet: `import { Textarea } from "glacia-native";

<Textarea value={notes} onChangeText={setNotes} rows={5} placeholder="Notes" />`,
  },
  {
    slug: "label",
    name: "Label",
    description: "The text above a control, with optional required and disabled states.",
    category: "Text & Forms",
    glass: "Plain text, no surface.",
    props: [
      { name: "children", type: "ReactNode", description: "Label text." },
      { name: "required", type: "boolean", default: "false", description: "Appends a required asterisk." },
      { name: "disabled", type: "boolean", default: "false", description: "Dims the label." },
    ],
    codeSnippet: `import { Label } from "glacia-native";

<Label required>Email</Label>`,
  },
  {
    slug: "field",
    name: "Field",
    description:
      "Label, control and message stacked in the order assistive tech announces them, so you never place those three by hand.",
    category: "Text & Forms",
    glass: "Plain layout; the control inside carries its own surface.",
    props: [
      { name: "label", type: "string", description: "Field label." },
      { name: "description", type: "string", description: "Helper text under the control." },
      { name: "error", type: "string", description: "Error text. Replaces the description." },
      { name: "required", type: "boolean", default: "false", description: "Marks the label required." },
      { name: "children", type: "ReactNode", description: "The control." },
    ],
    codeSnippet: `import { Field, Input } from "glacia-native";

<Field label="Email" error="Enter a valid address">
  <Input value={email} onChangeText={setEmail} invalid />
</Field>`,
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description: "A tick box for one boolean, with optional label and description and an indeterminate state.",
    category: "Text & Forms",
    glass: "A filled or outlined box, not a glass element.",
    props: [
      { name: "checked", type: "boolean", default: "false", description: "Current state." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Called with the next state." },
      { name: "label", type: "string", description: "Text beside the box." },
      { name: "description", type: "string", description: "Secondary text under the label." },
      { name: "indeterminate", type: "boolean", default: "false", description: "Shows a dash for a partial selection." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents toggling." },
    ],
    codeSnippet: `import { Checkbox } from "glacia-native";

<Checkbox checked={agreed} onCheckedChange={setAgreed} label="I agree" />`,
  },
  {
    slug: "radio-group",
    name: "Radio Group",
    description: "One choice from a small, always-visible set. Lays out in a column or a row.",
    category: "Text & Forms",
    glass: "Plain marks with theme tints, no surface.",
    props: [
      { name: "value", type: "string", description: "Selected option value." },
      { name: "onValueChange", type: "(value: string) => void", description: "Called with the chosen value." },
      { name: "options", type: "RadioOption[]", description: "Each with a value, label and optional description." },
      { name: "horizontal", type: "boolean", default: "false", description: "Lay the options out in a row." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables every option." },
    ],
    codeSnippet: `import { RadioGroup } from "glacia-native";

<RadioGroup
  value={size}
  onValueChange={setSize}
  options={[
    { value: "sm", label: "Small" },
    { value: "lg", label: "Large" },
  ]}
/>`,
  },
  {
    slug: "select",
    name: "Select",
    description:
      "A dropdown of mutually exclusive options. Native has no picker that looks the same on iOS and Android, so the list opens inline: predictable across platforms and reachable without a modal.",
    category: "Text & Forms",
    glass: "A tinted trigger and list, not a refractive element.",
    props: [
      { name: "value", type: "string", description: "Selected option value." },
      { name: "onValueChange", type: "(value: string) => void", description: "Called with the chosen value." },
      { name: "options", type: "SelectOption[]", description: "Each with a value and label." },
      { name: "placeholder", type: "string", default: '"Select an option"', description: "Text shown when nothing is chosen." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents opening." },
    ],
    codeSnippet: `import { Select } from "glacia-native";

<Select
  value={plan}
  onValueChange={setPlan}
  options={[
    { value: "free", label: "Free" },
    { value: "pro", label: "Pro" },
  ]}
/>`,
  },

  {
    slug: "dialog",
    name: "Dialog",
    description:
      "A centred modal above a dimmed backdrop. React Native has no focus trap, so this covers what the platform can do: Modal blocks touches behind it, Android back closes it, and the title is marked as a heading.",
    category: "Popups & Menus",
    glass:
      "A solid panel above a scrim, not a refractive surface. A translucent panel over arbitrary content is unreadable on a phone, so the dialog is opaque by design.",
    props: [
      { name: "open", type: "boolean", description: "Controlled visibility." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when the dialog closes or opens." },
      { name: "title", type: "string", description: "Dialog heading, announced as a heading." },
      { name: "description", type: "string", description: "Supporting text under the title." },
      { name: "footer", type: "ReactNode", description: "Action row at the bottom." },
      { name: "dismissOnBackdropPress", type: "boolean", default: "true", description: "Whether tapping the scrim closes it." },
    ],
    codeSnippet: `import { Dialog, Button } from "glacia-native";

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Settings"
  description="Adjust your preferences"
  footer={<Button accessibilityLabel="Done">Done</Button>}
/>`,
  },
  {
    slug: "dialog-trigger",
    name: "Dialog Trigger",
    description: "A button that opens a Dialog, so callers do not track open state themselves.",
    category: "Popups & Menus",
    glass: "The trigger and the panel it opens carry their own surfaces.",
    props: [
      { name: "label", type: "string", description: "Button text and accessibility label." },
      { name: "title", type: "string", description: "Dialog heading." },
      { name: "description", type: "string", description: "Supporting text." },
      { name: "footer", type: "ReactNode", description: "Action row." },
    ],
    codeSnippet: `import { DialogTrigger } from "glacia-native";

<DialogTrigger label="Open settings" title="Settings" description="Adjust your preferences" />`,
  },
  {
    slug: "alert-dialog",
    name: "Alert Dialog",
    description:
      "Asks for confirmation and cannot be dismissed by the backdrop: a destructive question should require a real answer, so the only exits are the two buttons or Android back, which counts as cancel.",
    category: "Popups & Menus",
    glass: "An opaque panel above a scrim, not a refractive surface.",
    props: [
      { name: "open", type: "boolean", description: "Controlled visibility." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Called on close." },
      { name: "title", type: "string", description: "The question being asked." },
      { name: "description", type: "string", description: "Consequences of confirming." },
      { name: "confirmLabel", type: "string", default: '"Confirm"', description: "Confirming action label." },
      { name: "cancelLabel", type: "string", default: '"Cancel"', description: "Cancelling action label." },
      { name: "destructive", type: "boolean", default: "false", description: "Tints confirm destructive." },
      { name: "onConfirm", type: "() => void", description: "Called when confirmed." },
      { name: "onCancel", type: "() => void", description: "Called when cancelled." },
    ],
    codeSnippet: `import { AlertDialog } from "glacia-native";

<AlertDialog
  open={confirming}
  onOpenChange={setConfirming}
  title="Delete file?"
  description="This cannot be undone."
  confirmLabel="Delete"
  destructive
  onConfirm={remove}
/>`,
  },
  {
    slug: "action-sheet",
    name: "Action Sheet",
    description:
      "A list of choices anchored to the bottom of the screen, where a thumb reaches, with a separate Cancel row so a mis-tap is always reversible.",
    category: "Popups & Menus",
    glass: "An opaque sheet above a scrim, not a refractive surface.",
    props: [
      { name: "open", type: "boolean", description: "Controlled visibility." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Called when dismissed." },
      { name: "title", type: "string", description: "Heading above the options." },
      { name: "message", type: "string", description: "Explanatory text under the title." },
      { name: "options", type: "ActionSheetOption[]", description: "Rows with a label, optional destructive flag and onPress." },
      { name: "cancelLabel", type: "string", default: '"Cancel"', description: "Label for the cancel row." },
    ],
    codeSnippet: `import { ActionSheet } from "glacia-native";

<ActionSheet
  open={sheetOpen}
  onOpenChange={setSheetOpen}
  title="File actions"
  options={[
    { label: "Share", onPress: share },
    { label: "Delete", destructive: true, onPress: remove },
  ]}
/>`,
  },

  {
    slug: "plan",
    name: "Plan",
    description:
      "The ordered steps a model intends to take. Each step carries its own status, so a half-finished plan is legible instead of appearing blank until everything completes.",
    category: "Chat & AI",
    glass:
      "Plain layout and text, no glass surface. Wrap in Glass if you want the material around it.",
    props: [
      { name: "steps", type: "NativePlanStep[]", description: "Steps with a title, optional detail and a status." },
      { name: "title", type: "string", default: "Plan", description: "Heading above the steps." },
    ],
    codeSnippet: `import { NativePlan } from "glacia-native";\n\n<NativePlan\n  steps={[\n    { id: "1", title: "Read the file", status: "done" },\n    { id: "2", title: "Patch the bug", status: "running" },\n  ]}\n/>`,
  },
  {
    slug: "sources",
    name: "Sources",
    description:
      "Citations behind an answer, so a claim can be traced to its origin. Native has no anchor element, so a row hands the source to your onSourcePress instead of opening a browser the component cannot control.",
    category: "Chat & AI",
    glass:
      "Plain layout and text, no glass surface. Wrap in Glass if you want the material around it.",
    props: [
      { name: "sources", type: "NativeSource[]", description: "Each with a title, url and optional snippet and domain." },
      { name: "title", type: "string", default: "Sources", description: "Heading above the list." },
      { name: "onSourcePress", type: "(source: NativeSource) => void", description: "Called when a source is tapped." },
    ],
    codeSnippet: `import { NativeSources } from "glacia-native";\n\n<NativeSources\n  sources={[{ id: "a", title: "Spec", url: "https://x.dev/a" }]}\n  onSourcePress={(s) => Linking.openURL(s.url)}\n/>`,
  },
  {
    slug: "response",
    name: "Response",
    description:
      "Text revealed progressively as a streamed answer arrives. The caller owns the streaming clock; this renders the first revealed characters and shows a caret while incomplete.",
    category: "Chat & AI",
    glass:
      "Plain layout and text, no glass surface. Wrap in Glass if you want the material around it.",
    props: [
      { name: "text", type: "string", description: "The full answer." },
      { name: "revealed", type: "number", description: "Characters to show. Omit for the whole string." },
      { name: "streaming", type: "boolean", description: "Force the streaming state." },
    ],
    codeSnippet: `import { NativeResponse } from "glacia-native";\n\n<NativeResponse text={answer} revealed={chars} />`,
  },
  {
    slug: "task",
    name: "Task",
    description:
      "Progress of a long-running background task, with an indeterminate state and per-status colouring.",
    category: "Chat & AI",
    glass:
      "Plain layout and text, no glass surface. Wrap in Glass if you want the material around it.",
    props: [
      { name: "task", type: "NativeTaskProgress", description: "The task to report; progress runs from 0 to 1." },
    ],
    codeSnippet: `import { NativeTask } from "glacia-native";\n\n<NativeTask task={{ progress: 0.62, label: "Indexing" }} />`,
  },
  {
    slug: "soundwave",
    name: "Soundwave",
    description:
      "A waveform driven by real amplitude. Bars follow levels so it can show live microphone input; with no levels it rests at a static profile instead of animating, since motion with no audio behind it would be decoration.",
    category: "Chat & AI",
    glass:
      "Plain layout and text, no glass surface. Wrap in Glass if you want the material around it.",
    props: [
      { name: "levels", type: "number[]", description: "One amplitude per bar, from 0 to 1." },
      { name: "bars", type: "number", default: "28", description: "Bar count when no levels are given." },
      { name: "active", type: "boolean", default: "true", description: "Dims the waveform when inactive." },
      { name: "height", type: "number", default: "40", description: "Waveform height in points." },
      { name: "label", type: "string", default: "Audio level", description: "Accessibility label." },
    ],
    codeSnippet: `import { NativeSoundwave } from "glacia-native";\n\n<NativeSoundwave levels={amplitudes} height={40} />`,
  },
  {
    slug: "thinking-orb",
    name: "Thinking Orb",
    description:
      "A pulsing indicator shown while a model is working. Decorative in its motion, so the label is exposed as text rather than relying on the animation being perceived.",
    category: "Chat & AI",
    glass:
      "Plain layout and text, no glass surface. Wrap in Glass if you want the material around it.",
    props: [
      { name: "label", type: "string", default: "Thinking", description: "Text shown beside the orb." },
      { name: "size", type: "number", default: "22", description: "Orb diameter." },
      { name: "paused", type: "boolean", default: "false", description: "Freezes the pulse." },
    ],
    codeSnippet: `import { NativeThinkingOrb } from "glacia-native";\n\n<NativeThinkingOrb label="Thinking" />`,
  },
  {
    slug: "panelside",
    name: "Panelside",
    description:
      "A rail for an AI workspace: conversations, saved prompts or tasks. Selection is a press rather than navigation because the panel content is client state.",
    category: "Chat & AI",
    glass:
      "Plain layout and text, no glass surface. Wrap in Glass if you want the material around it.",
    props: [
      { name: "items", type: "NativePanelNavItem[]", description: "Each with an id, label and optional count." },
      { name: "value", type: "string", description: "Selected item id." },
      { name: "onValueChange", type: "(id: string) => void", description: "Called with the chosen id." },
      { name: "title", type: "string", description: "Heading above the rail." },
    ],
    codeSnippet: `import { NativePanelside } from "glacia-native";\n\n<NativePanelside\n  items={[{ id: "chats", label: "Chats", count: 12 }]}\n  value={active}\n  onValueChange={setActive}\n/>`,
  },
  {
    slug: "ai-input",
    name: "AI Input",
    description:
      "The composer for an AI conversation. Send stays disabled until there is non-whitespace to send, which prevents empty submissions rather than validating after the fact.",
    category: "Chat & AI",
    glass:
      "Plain layout and text, no glass surface. Wrap in Glass if you want the material around it.",
    props: [
      { name: "value", type: "string", description: "Current text." },
      { name: "onChangeText", type: "(text: string) => void", description: "Called on every keystroke." },
      { name: "onSubmit", type: "() => void", description: "Called when Send is pressed." },
      { name: "placeholder", type: "string", default: "Ask anything", description: "Hint shown while empty." },
      { name: "busy", type: "boolean", default: "false", description: "Prevents sending while a response is pending." },
      { name: "sendLabel", type: "string", default: "Send", description: "Label for the send action." },
    ],
    codeSnippet: `import { NativeAIInput } from "glacia-native";\n\n<NativeAIInput value={draft} onChangeText={setDraft} onSubmit={send} />`,
  },
  {
    slug: "table",
    name: "Table",
    description:
      "Tabular data laid out for a phone. A wide table cannot simply shrink, so the first column is promoted to a row title and the rest become labelled pairs beneath it — every value stays readable without horizontal scrolling.",
    category: "Navigation & Layout",
    glass:
      "Plain rows with hairline separators, no glass surface.",
    props: [
      { name: "columns", type: "NativeTableColumn[]", description: "Column definitions with a key, header and optional align." },
      { name: "rows", type: "NativeTableRow[]", description: "Each row with an id and a cell per column key." },
      { name: "onRowPress", type: "(row: NativeTableRow) => void", description: "Makes each row tappable." },
      { name: "caption", type: "string", description: "Text above the table." },
      { name: "emptyMessage", type: "string", default: "No rows to display", description: "Shown when there are no rows." },
    ],
    codeSnippet: `import { NativeTable } from \"glacia-native\";\n\n<NativeTable\n  columns={[\n    { key: \"name\", header: \"Name\" },\n    { key: \"role\", header: \"Role\" },\n  ]}\n  rows={[{ id: \"1\", cells: { name: \"Ada\", role: \"Engineer\" } }]}\n/>`,
  },
  {
    slug: "scroll-area",
    name: "Scroll Area",
    description:
      "A bounded scroll region. Uses the platform ScrollView rather than a custom scrollbar, so the indicator users already recognise stays correct under momentum, bouncing and accessibility settings.",
    category: "Navigation & Layout",
    glass:
      "Optional bordered frame; the surface itself is plain.",
    props: [
      { name: "maxHeight", type: "number", description: "Fixed height. Without one the area grows with its content." },
      { name: "bordered", type: "boolean", default: "false", description: "Adds a bordered, tinted frame." },
      { name: "horizontal", type: "boolean", default: "false", description: "Scrolls sideways instead of vertically." },
      { name: "accessibilityLabel", type: "string", description: "Announced to screen readers." },
    ],
    codeSnippet: `import { NativeScrollArea } from \"glacia-native\";\n\n<NativeScrollArea maxHeight={220} bordered>\n  <LongList />\n</NativeScrollArea>`,
  },

  {
    slug: "polar-area-chart",
    name: "Polar Area Chart",
    description:
      "Equal-angle wedges whose radius encodes value. Because every wedge uses the same angle, the reader compares one dimension rather than area, and each wedge is separately tappable.",
    category: "Charts",
    glass:
      "Plain SVG or View marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "segments", type: "NativePolarSegment[]", description: "Wedges with a label, value and optional colour." },
      { name: "size", type: "number", default: "240", description: "Square size in points." },
      { name: "max", type: "number", description: "Value mapped to the full radius." },
      { name: "onSegmentPress", type: "(index: number) => void", description: "Called when a wedge is tapped." },
    ],
    codeSnippet: `import { NativePolarAreaChart } from "glacia-native";

<NativePolarAreaChart
  segments={[{ label: "A", value: 10 }, { label: "B", value: 25 }]}
/>`,
  },
  {
    slug: "pyramid-chart",
    name: "Pyramid Chart",
    description:
      "Stacked bands that narrow toward the top. Each band is a centred rectangle sized by its share of the widest level, which native layout computes exactly.",
    category: "Charts",
    glass:
      "Plain SVG or View marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "levels", type: "NativePyramidLevel[]", description: "Bands from base to apex." },
      { name: "levelHeight", type: "number", default: "34", description: "Height of each band." },
      { name: "width", type: "number", default: "320", description: "Overall width in points." },
      { name: "onLevelPress", type: "(index: number) => void", description: "Called when a band is tapped." },
    ],
    codeSnippet: `import { NativePyramidChart } from "glacia-native";

<NativePyramidChart
  levels={[{ label: "Base", value: 100 }, { label: "Top", value: 25 }]}
/>`,
  },
  {
    slug: "live-line-chart",
    name: "Live Line Chart",
    description:
      "A line chart showing the most recent window of points. The caller pushes new values; this trims to the label count so the window slides instead of growing without bound.",
    category: "Charts",
    glass:
      "Plain SVG or View marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "labels", type: "string[]", description: "One label per visible point." },
      { name: "series", type: "NativeLineSeries[]", description: "The series to draw." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
    ],
    codeSnippet: `import { NativeLiveLineChart } from "glacia-native";

<NativeLiveLineChart labels={windowLabels} series={series} />`,
  },
  {
    slug: "candlestick-chart",
    name: "Candlestick Chart",
    description:
      "Open, high, low and close per period. A filled body means the period closed up and a hollow one means it closed down, the convention traders read without a legend. Tap a candle for the four prices.",
    category: "Charts",
    glass:
      "Plain SVG or View marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "candles", type: "NativeCandle[]", description: "Candles with open, high, low and close." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
      { name: "onCandlePress", type: "(index: number) => void", description: "Called when a candle is tapped." },
    ],
    codeSnippet: `import { NativeCandlestickChart } from "glacia-native";

<NativeCandlestickChart
  candles={[{ label: "Mon", open: 10, high: 14, low: 9, close: 13 }]}
/>`,
  },
  {
    slug: "treemap-chart",
    name: "Treemap Chart",
    description:
      "Squarified treemap: rectangles sized by value, packed to stay close to square. A naive slice-and-dice layout produces slivers that cannot hold a label, so this keeps tiles usable at any aspect ratio.",
    category: "Charts",
    glass:
      "Plain SVG or View marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "items", type: "NativeTreemapItem[]", description: "Tiles with a label and value." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
      { name: "onItemPress", type: "(index: number) => void", description: "Called with the tile's original index." },
    ],
    codeSnippet: `import { NativeTreemapChart } from "glacia-native";

<NativeTreemapChart
  items={[{ label: "Alpha", value: 60 }, { label: "Beta", value: 30 }]}
/>`,
  },
  {
    slug: "sankey-chart",
    name: "Sankey Chart",
    description:
      "Flow between stages, drawn as stacked columns. Columns are assigned by longest path from a source, so a node always sits after everything feeding it.",
    category: "Charts",
    glass:
      "Plain SVG or View marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "nodes", type: "NativeSankeyNode[]", description: "Nodes with an id and label." },
      { name: "links", type: "NativeSankeyLink[]", description: "Links with from, to and a value." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
    ],
    codeSnippet: `import { NativeSankeyChart } from "glacia-native";

<NativeSankeyChart
  nodes={[{ id: "a", label: "Visit" }, { id: "b", label: "Buy" }]}
  links={[{ from: "a", to: "b", value: 20 }]}
/>`,
  },
  {
    slug: "bump-chart",
    name: "Bump Chart",
    description:
      "Rank changes over time, where vertical position is the rank itself. Rank 1 sits at the top, so a rise in the chart is a genuine improvement in position.",
    category: "Charts",
    glass:
      "Plain SVG or View marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "labels", type: "string[]", description: "One label per period." },
      { name: "series", type: "NativeBumpSeries[]", description: "Series with a rank per period; 1 is best." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
      { name: "onPointPress", type: "(seriesIndex: number, periodIndex: number) => void", description: "Called when a point is tapped." },
    ],
    codeSnippet: `import { NativeBumpChart } from "glacia-native";

<NativeBumpChart
  labels={["Q1", "Q2"]}
  series={[{ name: "Alpha", ranks: [1, 2] }]}
/>`,
  },
  {
    slug: "hex-chart",
    name: "Hex Chart",
    description:
      "Points aggregated into hexagonal bins whose colour is the mean value. Binning keeps thousands of points legible: where density is concentrated matters more than one mark's exact position.",
    category: "Charts",
    glass:
      "Plain SVG or View marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "points", type: "NativeHexPoint[]", description: "Points with x, y and a value used for bin colour." },
      { name: "radius", type: "number", default: "9", description: "Bin radius in points." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
      { name: "onBinPress", type: "(index: number) => void", description: "Called when a bin is tapped." },
    ],
    codeSnippet: `import { NativeHexChart } from "glacia-native";

<NativeHexChart points={[{ x: 1, y: 2, value: 5 }]} />`,
  },
  {
    slug: "plot-chart",
    name: "Plot Chart",
    description:
      "A numeric plot you supply the marks for. Axes, ticks and padding are handled here and your renderer receives real pixel scales, so stroke widths and text stay honest at any width.",
    category: "Charts",
    glass:
      "Plain SVG or View marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "points", type: "NativePlotPoint[]", description: "Points with x, y and an optional label." },
      { name: "renderMark", type: "(args: NativePlotRenderArgs) => ReactNode", description: "Draws the marks from the supplied scales." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
      { name: "xLabel", type: "string", description: "Caption for the horizontal axis." },
      { name: "yLabel", type: "string", description: "Caption for the vertical axis." },
    ],
    codeSnippet: `import { NativePlotChart } from "glacia-native";

<NativePlotChart points={points} xLabel="Time" yLabel="Value" />`,
  },

  {
    slug: "mirror-area-chart",
    name: "Mirror Area Chart",
    description:
      "Two series mirrored across a shared centre line. The below series is negated onto the same axis, so both directions are measured against one honest scale rather than two charts that could be scaled differently.",
    category: "Charts",
    glass:
      "Plain SVG marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "labels", type: "string[]", description: "One label per period." },
      { name: "series", type: "NativeMirrorAreaSeries", description: "A name plus above and below value arrays." },
      { name: "aboveColor", type: "string", default: "\"#0088ff\"", description: "Colour for the upward series." },
      { name: "belowColor", type: "string", default: "\"#ff375f\"", description: "Colour for the downward series." },
    ],
    codeSnippet: `import { NativeMirrorAreaChart } from "glacia-native";

<NativeMirrorAreaChart
  labels={["Mon", "Tue"]}
  series={{ name: "Traffic", above: [30, 40], below: [20, 10] }}
/>`,
  },
  {
    slug: "bubble-chart",
    name: "Bubble Chart",
    description:
      "A scatter plot whose marks are sized by a third value. It is NativeScatterChart with bubble sizing on, so both share axes, padding and touch behaviour instead of drifting apart.",
    category: "Charts",
    glass:
      "Plain SVG marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "series", type: "NativeScatterSeries[]", description: "Series of x and y points with an optional size." },
      { name: "width", type: "number", default: "320", description: "Chart width in points." },
      { name: "height", type: "number", default: "200", description: "Chart height in points." },
      { name: "onPointPress", type: "(seriesIndex: number, pointIndex: number) => void", description: "Called when a mark is tapped." },
    ],
    codeSnippet: `import { NativeBubbleChart } from "glacia-native";

<NativeBubbleChart
  series={[{ name: "Plans", points: [{ x: 12, y: 30, size: 40 }] }]}
/>`,
  },
  {
    slug: "pie-chart",
    name: "Pie Chart",
    description:
      "Proportional slices as a filled circle. This is NativeRingChart with the hole closed up, so pie and ring share their arc maths and both remain separately tappable.",
    category: "Charts",
    glass:
      "Plain SVG marks, not a glass surface. Wrap in Glass for the material.",
    props: [
      { name: "data", type: "NativeRingSlice[]", description: "Slices with a label, value and optional colour." },
      { name: "size", type: "number", default: "180", description: "Diameter in points." },
      { name: "thickness", type: "number", default: "180", description: "Ring thickness. Set to the full diameter for a pie." },
      { name: "showLegend", type: "boolean", default: "true", description: "Show the slice list beneath the chart." },
      { name: "onSlicePress", type: "(index: number) => void", description: "Called when a slice is tapped." },
    ],
    codeSnippet: `import { NativeRingChart } from "glacia-native";

// Pie and Ring are one implementation: thickness fills the circle.

<NativeRingChart thickness={size} data={slices} />`,
  },

];

export const platformComponents = (platform: Platform): ComponentMeta[] =>
  COMPONENTS_DATA;

export const nativeComponentCount = NATIVE_COMPONENTS.length;
export const webComponentCount = COMPONENTS_DATA.length;
