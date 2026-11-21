import { COMPONENTS_DATA } from "./components-data";
import type { Platform } from "./platforms";

// What actually ships on each platform.
//
// The web list is the catalogue in components-data.ts (COMPONENTS_DATA). The
// native list below documents the components exported by `glacia-native`
// 0.6.0; it was extracted from the package source and its README, so nothing
// is listed here that the package does not export. The Card sub-parts are
// documented inside the single `card` entry, as in the web catalogue.

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
      "The glass surface every component is built on — Apple's UIGlassEffect on iOS 26+, the engine's Metal renderer on iOS 16.4–25, AGSL on Android 13+, and Glacia's fallback elsewhere.",
    category: "Showing Things",
    glass:
      "The surface itself: routes through the package's single switch — native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+, and Glacia's layered fallback (blur, tint, rim light, top highlight, edge, shadow) everywhere else, including Expo Go.",
    props: [
      { name: "effect", type: '"clear" | "regular" | "none"', default: '"regular"', description: "Material weight." },
      { name: "tintColor", type: "string", description: "Tint applied to the material." },
      { name: "interactive", type: "boolean", default: "false", description: "Lifts the material while pressed." },
      { name: "surface", type: '"panel" | "control" | "field" | "overlay" | "hint" | "rail"', description: "Which web surface profile the fallback uses to pick blur, rim brightness and highlight. Read by the fallback branch only; not forwarded to Apple's material." },
      { name: "pressed", type: "boolean", description: "True while the surface is held, so the fallback can fade its specular glow in. Not forwarded to Apple's view." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "children", type: "ReactNode", description: "Surface content." },
      { name: "isDark", type: "boolean", description: "Explicit dark override for the fallback tint. When omitted the phone's colour scheme decides." },
      { name: "testID", type: "string", description: "Passed to whichever surface renders, so tests can find the glass itself." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { Glass } from "glacia-native";

export function Demo() {
  return (
    <Glass effect="regular" style={{ padding: 20, borderRadius: 24 }}>
      <Text>Account</Text>
    </Glass>
  );
}`,
  },
  {
    slug: "glass-view",
    name: "GlassView",
    description:
      "The same surface under the engine's name — GlassView is Glass; both names ship, and both are the same component with the same props.",
    category: "Showing Things",
    glass:
      "Identical to Glass: native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+, and Glacia's layered fallback everywhere else.",
    props: [
      { name: "effect", type: '"clear" | "regular" | "none"', default: '"regular"', description: "Material weight." },
      { name: "tintColor", type: "string", description: "Tint applied to the material." },
      { name: "interactive", type: "boolean", default: "false", description: "Lifts the material while pressed." },
      { name: "surface", type: '"panel" | "control" | "field" | "overlay" | "hint" | "rail"', description: "Which web surface profile the fallback uses. Read by the fallback branch only." },
      { name: "pressed", type: "boolean", description: "True while the surface is held, so the fallback can fade its specular glow in." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "children", type: "ReactNode", description: "Surface content." },
      { name: "isDark", type: "boolean", description: "Explicit dark override for the fallback tint." },
      { name: "testID", type: "string", description: "Passed to whichever surface renders." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { GlassView } from "glacia-native";

<GlassView style={{ padding: 20, borderRadius: 24 }}>
  <Text>Now playing</Text>
</GlassView>`,
  },
  {
    slug: "glass-container",
    name: "GlassContainer",
    description:
      "Groups glass surfaces so iOS 26 can merge close neighbours into one connected liquid surface with a single shared edge.",
    category: "Showing Things",
    glass:
      "Merging is an iOS 26+ visual effect and a no-op everywhere else: on older iOS, Android and Expo Go this renders a plain wrapper with identical layout, and the children keep their own separate edges.",
    props: [
      { name: "spacing", type: "number", default: "0", description: "How close two glass surfaces must be before iOS 26 blends them into one connected liquid surface, in points. 0 merges only what touches." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "children", type: "ReactNode", description: "Glass surfaces placed side by side — not a panel wrapping another panel." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the container so it is testable." },
    ],
    codeSnippet: `import { Glass, GlassContainer, Text } from "glacia-native";

<GlassContainer spacing={8}>
  <Glass style={{ padding: 16, borderRadius: 20 }}>
    <Text>One</Text>
  </Glass>
  <Glass style={{ padding: 16, borderRadius: 20 }}>
    <Text>Two</Text>
  </Glass>
</GlassContainer>`,
  },
  {
    slug: "glass-provider",
    name: "GlassProvider",
    description:
      "Marks the content whose backdrop the glass samples — on Android the provider records the backdrop, and the glass views that read it are its siblings, never its children.",
    category: "Showing Things",
    glass:
      "On Android the provider is the backdrop source itself. On iOS and on platforms without a glass renderer it renders a plain view — whole-window capture is the iOS default — so it is safe to wrap unconditionally.",
    props: [
      { name: "children", type: "ReactNode", description: "The content whose backdrop the glass behind it samples. On Android this is the provider's single direct child." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Layout style of the recording container." },
      { name: "providerId", type: "string", default: '"default"', description: "Pairs this provider with the glass views that read its backdrop. Defaults to the engine's \"default\"." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed through to the underlying container so tests can find it." },
    ],
    codeSnippet: `import { ScrollView, View } from "react-native";
import { GlassProvider, TabBar } from "glacia-native";

<View style={{ flex: 1 }}>
  <GlassProvider style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
    <ScrollView>{/* page content and its background */}</ScrollView>
  </GlassProvider>
  <TabBar items={items} />
</View>`,
  },
  {
    slug: "glass-stack",
    name: "GlassStack",
    description:
      "Stacked glass layers, bottom to top: glass inside an upper layer refracts everything below it, including lower layers' finished glass.",
    category: "Showing Things",
    glass:
      "The engine's stack builds the nested provider topology for its layers, so each layer reads a backdrop containing the layers beneath it. Below every glass tier the layers still render, as plain views, so a stack is never blank.",
    props: [
      { name: "children", type: "ReactNode", description: "The layers, bottom to top, marked with GlassStack.Layer. Bare children are treated as layers of their own." },
      { name: "style", type: "StyleProp<ViewStyle>", default: "flex: 1", description: "The stack's box. Layers are absolute, so the stack must own a size — pass flex: 1 or a fixed height." },
      { name: "testID", type: "string", description: "Passed to the underlying stack so tests can find it." },
    ],
    codeSnippet: `import { GlassStack, Text } from "glacia-native";

<GlassStack style={{ height: 240 }}>
  <GlassStack.Layer>
    <Text>Base layer</Text>
  </GlassStack.Layer>
  <GlassStack.Layer>
    <Text>Sheet over it</Text>
  </GlassStack.Layer>
</GlassStack>`,
  },
  {
    slug: "glass-backdrop",
    name: "GlassBackdrop",
    description:
      "A bounded backdrop scope: on iOS 16.4–25, glass inside it photographs scroll content in content coordinates, so a pane dragged over a list keeps refracting the right rows.",
    category: "Showing Things",
    glass:
      "Content-space capture is iOS 16.4–25 with Metal only. iOS 26+ uses Apple's own glass, which reads the live window; Android has its own provider contract; on both — and below the floor — this is a plain wrapper that lays out its children exactly once. The scope is a hint, not a guarantee: sticky headers, parallax and nested scrollers fall back to fresh window captures.",
    props: [
      { name: "children", type: "ReactNode", description: "The subtree whose first scroll view is tracked, and the glass that reads it." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "testID", type: "string", description: "Passed to the wrapper so it is testable." },
    ],
    codeSnippet: `import { ScrollView } from "react-native";
import { Glass, GlassBackdrop, Text } from "glacia-native";

<GlassBackdrop>
  <ScrollView>{/* list rows */}</ScrollView>
  <Glass style={{ padding: 16, borderRadius: 20 }}>
    <Text>Floating pane</Text>
  </Glass>
</GlassBackdrop>`,
  },
  {
    slug: "tab-bar",
    name: "TabBar",
    description:
      "The app's bottom bar: Glacia's own tab items on one glass rail — Apple's real glass on iOS 26+, Glacia's bar below it; no native tab bar is used on any platform. The bar floats fully above the system safe-area inset, so labels never clip.",
    category: "Navigation & Layout",
    glass:
      "On iOS 26+ the surface is Apple's real UIGlassEffect via the vendored engine, with Glacia's own items inside it; the engine's Metal renderer serves iOS 16.4–25 and AGSL serves Android 13+. Elsewhere the same 40pt rail and lens indicator render on Glacia's fallback material.",
    props: [
      { name: "items", type: "TabBarItem[]", description: "The tabs: each item has an id, a label and an optional icon." },
      { name: "activeId", type: "string", description: "The active tab's id. Leave undefined and the bar keeps it itself." },
      { name: "defaultActiveId", type: "string", description: "Starting active tab for uncontrolled use." },
      { name: "onTabChange", type: "(id: string) => void", description: "Fires with the newly selected tab's id." },
      { name: "haptics", type: "boolean", default: "true", description: "One selection tick when the tab changes. false opts out." },
      { name: "bottomInset", type: "number", description: "The safe-area inset the bar must float above — the Android navigation bar or the iOS home indicator. Defaults to the device's own bottom inset, read from the safe area; pass a number to pin the bar to a design height instead." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed through to the bar so it is testable." },
    ],
    codeSnippet: `import { TabBar } from "glacia-native";

<TabBar
  items={[
    { id: "home", label: "Home" },
    { id: "search", label: "Search" },
    { id: "profile", label: "Profile" },
  ]}
  defaultActiveId="home"
  onTabChange={(id) => {}}
/>`,
  },
  {
    slug: "button",
    name: "Button",
    description:
      "A pressable button on Glacia's glass, ported from the engine's LiquidGlassButton at the web control scale — heights 28, 34 and 44 for sm, md and lg.",
    category: "Buttons & Actions",
    glass:
      "With a glass renderer available the engine's own control mounts — native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+. Without one the fallback floor renders the same geometry with a solid surface, so the button is never invisible. The ghost variant wears no surface on any tier.",
    props: [
      { name: "variant", type: '"glass" | "filled" | "ghost"', default: '"glass"', description: "Visual hierarchy. Ghost renders the bare control with no surface." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control height preset: 28, 34 or 44." },
      { name: "shape", type: '"capsule" | "circle"', default: '"capsule"', description: "Button outline." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
      { name: "loading", type: "boolean", default: "false", description: "Blocks presses while work is in flight." },
      { name: "onPress", type: "() => void", description: "Called when the button is pressed." },
      { name: "onLongPress", type: "() => void", description: "Called on a long press." },
      { name: "interactive", type: "boolean", default: "true", description: "Whether the glass lifts while pressed." },
      { name: "pressLight", type: "number", description: "Strength of the press light effect." },
      { name: "adaptive", type: "boolean", default: "false", description: "Adaptive glass: the frost flips polarity with the backdrop." },
      { name: "tint", type: "string", description: "Surface wash. Filled buttons default to the scheme's fill colour." },
      { name: "height", type: "number", description: "Explicit height; wins over the size preset when set." },
      { name: "icon", type: "ReactNode", description: "Icon rendered inside the button." },
      { name: "accessibilityLabel", type: "string", description: "Required accessible name of the button." },
      { name: "accessibilityState", type: "Record<string, any>", description: "Extra accessibility state merged with the disabled state." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The outer frame." },
      { name: "contentStyle", type: "StyleProp<ViewStyle>", description: "The inner content view." },
      { name: "textStyle", type: "StyleProp<TextStyle>", description: "Applied to a string label." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the button so it is testable." },
      { name: "children", type: "ReactNode", description: "The label — a string or custom content." },
    ],
    codeSnippet: `import { Button } from "glacia-native";

<Button variant="glass" accessibilityLabel="Save changes" onPress={() => {}}>
  Save Changes
</Button>`,
  },
  {
    slug: "icon-button",
    name: "IconButton",
    description:
      "An icon-only button on glass, ported from the engine's LiquidGlassIconButton — the accessibility label is required because a bare circle of glass has no text to read.",
    category: "Buttons & Actions",
    glass:
      "With a glass renderer available the engine's own control mounts (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+); without one, a solid circle of the same size renders on the fallback material.",
    props: [
      { name: "icon", type: "ReactNode | ((state: any) => ReactNode)", description: "The icon, or a function of the press state returning one." },
      { name: "onPress", type: "() => void", description: "Called when the button is pressed." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Diameter preset: 32, 38 or 44." },
      { name: "tint", type: "string", description: "Surface wash." },
      { name: "accessibilityLabel", type: "string", description: "Required accessible name of the button." },
      { name: "accessibilityState", type: "Record<string, any>", description: "Extra accessibility state merged with the disabled state." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the button so it is testable." },
      { name: "children", type: "ReactNode", description: "Optional content rendered by the engine control." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { IconButton } from "glacia-native";

<IconButton
  accessibilityLabel="Share"
  icon={<Text>↗</Text>}
  onPress={() => {}}
/>`,
  },
  {
    slug: "chip",
    name: "Chip",
    description:
      "A filter or tag pill ported from the engine's LiquidGlassChip, whose selected state wears the accent as a wash. A chip with no action and no selection is a static label, not a button.",
    category: "Buttons & Actions",
    glass:
      "Interactive chips mount the engine's control where a glass renderer exists (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+) and a solid pill on the fallback floor. Static chips render on a Glass control surface.",
    props: [
      { name: "label", type: "string", description: "The chip's text." },
      { name: "icon", type: "ReactNode | ((state: any) => ReactNode)", description: "Icon before the label, or a function of state returning one." },
      { name: "onPress", type: "() => void", description: "Called when the chip is pressed." },
      { name: "selected", type: "boolean", description: "Controlled selected state." },
      { name: "defaultSelected", type: "boolean", default: "false", description: "Starting selection for uncontrolled use." },
      { name: "onSelectedChange", type: "(selected: boolean) => void", description: "Fires with the next selection." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the chip so it is testable." },
    ],
    codeSnippet: `import { Chip } from "glacia-native";

<Chip label="Nearby" defaultSelected onSelectedChange={(selected) => {}} />`,
  },
  {
    slug: "switch",
    name: "Switch",
    description:
      "An on/off switch ported from the engine's LiquidGlassSwitch — a 64×28 track with a 40×24 lens thumb.",
    category: "Text & Forms",
    glass:
      "With a glass renderer available the engine's own control mounts (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the same geometry with a solid track and lens thumb, so the control is never invisible.",
    props: [
      { name: "value", type: "boolean", description: "Controlled on/off value. Omit it and the switch keeps its own." },
      { name: "defaultValue", type: "boolean", default: "false", description: "Starting value for uncontrolled use." },
      { name: "onValueChange", type: "(value: boolean) => void", description: "Fires with the next value." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
      { name: "accentColor", type: "string", description: "Track colour while on. Defaults to the scheme's system blue." },
      { name: "trackColor", type: "string", description: "Track colour while off." },
      { name: "accessibilityLabel", type: "string", description: "Accessible name of the switch." },
      { name: "haptics", type: "boolean", default: "true", description: "One selection tick when it toggles. false opts out." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the control so it is testable." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
    ],
    codeSnippet: `import { useState } from "react";
import { Switch } from "glacia-native";

const [on, setOn] = useState(true);
<Switch value={on} onValueChange={setOn} accessibilityLabel="Passkey authentication" />`,
  },
  {
    slug: "slider",
    name: "Slider",
    description:
      "A continuous value chosen by dragging, ported from the engine's LiquidGlassSlider — a 6pt track and a 40×24 glass-lens thumb rather than a small dot.",
    category: "Text & Forms",
    glass:
      "With a glass renderer available the engine's own control mounts (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the same track and lens thumb with the fallback material.",
    props: [
      { name: "value", type: "number", description: "Controlled value. Omit it and the slider keeps its own." },
      { name: "defaultValue", type: "number", default: "50", description: "Starting value for uncontrolled use." },
      { name: "min", type: "number", default: "0", description: "Inclusive lower bound." },
      { name: "max", type: "number", default: "100", description: "Inclusive upper bound." },
      { name: "step", type: "number", default: "1", description: "Increment per step." },
      { name: "onValueChange", type: "(value: number) => void", description: "Fires while dragging and once when the gesture ends." },
      { name: "onSlidingComplete", type: "(value: number) => void", description: "Fires once when the gesture ends, after the thumb has been released." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
      { name: "haptics", type: "boolean", default: "true", description: "One selection tick each time the stepped value changes while dragging." },
      { name: "accessibilityLabel", type: "string", description: "Required accessible name of the slider." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the draggable track so it is testable." },
    ],
    codeSnippet: `import { useState } from "react";
import { Slider } from "glacia-native";

const [v, setV] = useState(65);
<Slider value={v} onValueChange={setV} min={0} max={100} accessibilityLabel="Transmission" />`,
  },
  {
    slug: "stepper",
    name: "Stepper",
    description:
      "Minus / value / plus, ported from the engine's LiquidGlassStepper — a 40dp capsule with 44dp end cells, hold-to-repeat, and a readout that pops as the value changes.",
    category: "Text & Forms",
    glass:
      "With a glass renderer available the engine's own control mounts (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the same capsule, cells and readout on Glacia's solid-capable material.",
    props: [
      { name: "value", type: "number", description: "Controlled value. Omit it and the stepper keeps its own." },
      { name: "defaultValue", type: "number", default: "0", description: "Starting value for uncontrolled use." },
      { name: "onValueChange", type: "(value: number) => void", description: "Fires with the next value whenever one of the ends steps it." },
      { name: "min", type: "number", default: "0", description: "Inclusive lower bound." },
      { name: "max", type: "number", default: "100", description: "Inclusive upper bound." },
      { name: "minimumValue", type: "number", description: "The engine's spelling of min; min wins when both are set." },
      { name: "maximumValue", type: "number", description: "The engine's spelling of max; max wins when both are set." },
      { name: "step", type: "number", default: "1", description: "Increment per press." },
      { name: "autoRepeat", type: "boolean", default: "true", description: "Hold an end and it keeps stepping, the way the system's does." },
      { name: "haptics", type: "boolean", default: "true", description: "One selection tick each time the value changes. false opts out." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
      { name: "height", type: "number", default: "40", description: "Capsule height, dp." },
      { name: "formatValue", type: "(value: number) => string", description: "Formats the middle readout; defaults to the plain number." },
      { name: "accessibilityLabel", type: "string", description: "Required accessible name, announced by screen readers, e.g. \"Guests\"." },
      { name: "tint", type: "string", description: "The track's wash. Defaults to the scheme's glass tint." },
      { name: "thumbTint", type: "string", description: "The pressed thumb's wash. Defaults to the scheme's glass-active tint." },
      { name: "providerId", type: "string", description: "Pairs the surface with its Android backdrop provider." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "textStyle", type: "StyleProp<TextStyle>", description: "Applied to the readout." },
      { name: "testID", type: "string", description: "Passed to the stepper so it is testable." },
    ],
    codeSnippet: `import { useState } from "react";
import { Stepper } from "glacia-native";

const [guests, setGuests] = useState(2);
<Stepper value={guests} onValueChange={setGuests} min={1} max={8} accessibilityLabel="Guests" />`,
  },
  {
    slug: "segmented-control",
    name: "SegmentedControl",
    description:
      "A segmented choice ported from the engine's LiquidGlassSegmentedControl — a 40dp track with the glass thumb inset by 3dp, sliding between equal-width segments.",
    category: "Navigation & Layout",
    glass:
      "With a glass renderer available the engine's own control mounts (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the sliding lens pill on a solid track, so the selected segment reads exactly as it does in glass.",
    props: [
      { name: "segments", type: "string[]", description: "Segment labels, equal-width." },
      { name: "selectedIndex", type: "number", description: "Index of the selected segment." },
      { name: "onChange", type: "(index: number) => void", description: "Fires when the user picks another segment." },
      { name: "height", type: "number", default: "40", description: "Control height; the corner radius follows it." },
      { name: "tint", type: "string", description: "Track wash." },
      { name: "thumbTint", type: "string", description: "Thumb wash." },
      { name: "thumbMetal", type: "unknown", description: "The thumb's canvas material, forwarded to the engine control." },
      { name: "accessibilityLabel", type: "string", description: "Accessible name prefix for the segments." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the control so it is testable." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "textStyle", type: "StyleProp<TextStyle>", description: "Applied to the segment labels." },
    ],
    codeSnippet: `import { useState } from "react";
import { SegmentedControl } from "glacia-native";

const segments = ["Overview", "Optics", "Security"];
const [index, setIndex] = useState(0);
<SegmentedControl segments={segments} selectedIndex={index} onChange={setIndex} />`,
  },
  {
    slug: "input",
    name: "Input",
    description:
      "A single-line or multiline text field ported from the engine's LiquidGlassTextInput — a glass capsule with a focus ring that springs in and leading/trailing slots.",
    category: "Text & Forms",
    glass:
      "With a glass renderer available the engine's own control mounts (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the same capsule with the fallback material, so the field is never invisible and never bare text.",
    props: [
      { name: "value", type: "string", description: "Controlled text. Omit it and the field keeps its own." },
      { name: "onChangeText", type: "(text: string) => void", description: "Fires with the next text." },
      { name: "placeholder", type: "string", description: "Hint shown while the field is empty, drawn as a sibling Text so its colour stays tied to the theme." },
      { name: "invalid", type: "boolean", default: "false", description: "Renders the field in an error state. Pair with a Field message." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents editing." },
      { name: "secureTextEntry", type: "boolean", default: "false", description: "Masks the entered text, for passwords." },
      { name: "keyboardType", type: '"default" | "email-address" | "numeric" | "phone-pad" | "url"', default: '"default"', description: "Which keyboard the OS shows." },
      { name: "autoCapitalize", type: '"none" | "sentences" | "words" | "characters"', description: "Auto-capitalisation behaviour." },
      { name: "autoCorrect", type: "boolean", description: "Whether autocorrect is offered." },
      { name: "multiline", type: "boolean", default: "false", description: "Allows several lines of text." },
      { name: "minLines", type: "number", default: "3", description: "Grows with its content when multiline is set." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Field height preset: 28, 34 or 44." },
      { name: "accessibilityLabel", type: "string", description: "Accessible name of the field; the placeholder is used when omitted." },
      { name: "returnKeyType", type: '"done" | "next" | "go" | "search" | "send"', description: "The return key's label." },
      { name: "onSubmitEditing", type: "() => void", description: "Fires when the return key submits." },
      { name: "defaultValue", type: "string", description: "Starting text for uncontrolled use, like React Native's defaultValue." },
      { name: "prefix", type: "ReactNode", description: "Content before the text, inside the capsule." },
      { name: "suffix", type: "ReactNode", description: "Content after the text, inside the capsule." },
      { name: "maxLength", type: "number", description: "Maximum number of characters." },
      { name: "editable", type: "boolean", description: "Overrides the editable state otherwise derived from disabled." },
      { name: "onFocus", type: "() => void", description: "Fires when the field gains focus." },
      { name: "onBlur", type: "() => void", description: "Fires when the field loses focus." },
      { name: "height", type: "number", description: "Capsule height; wins over the size preset when set." },
      { name: "tint", type: "string", description: "Surface wash." },
      { name: "variant", type: '"regular" | "clear"', default: '"regular"', description: "Glass material variant." },
      { name: "interactive", type: "boolean", default: "true", description: "Whether the glass frame is interactive." },
      { name: "leading", type: "ReactNode", description: "Content before the text — the engine's spelling of the leading slot." },
      { name: "trailing", type: "ReactNode", description: "Content after the text — the engine's spelling of the trailing slot." },
      { name: "focusRing", type: "boolean", default: "true", description: "Whether the focus ring is drawn." },
      { name: "accentColor", type: "string", description: "Accent colour forwarded to the engine control." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The capsule's style." },
      { name: "testID", type: "string", description: "Passed through to the text field so it is testable." },
    ],
    codeSnippet: `import { Input } from "glacia-native";

<Input placeholder="Email address" keyboardType="email-address" autoCapitalize="none" />`,
  },
  {
    slug: "card",
    name: "Card",
    description:
      "A content panel on Glacia's glass, ported from the engine's LiquidGlassCard — 24dp continuous corners, 16dp padding, presses to 98% — with CardHeader, CardTitle, CardDescription, CardContent (also exported as CardBody) and CardFooter parts.",
    category: "Showing Things",
    glass:
      "With a glass renderer available the engine's own control mounts (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the same geometry on a Glass panel surface, so the card is never invisible. The header, title, description, content and footer parts are plain layout and text — they carry no surface of their own.",
    props: [
      { name: "onPress", type: "() => void", description: "Makes the card a control: it presses to 98% and fires on release." },
      { name: "onLongPress", type: "() => void", description: "Called on a long press." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
      { name: "cornerRadius", type: "number", default: "24", description: "Corner radius, continuous." },
      { name: "padding", type: "number", default: "16", description: "Inner padding, dp." },
      { name: "adaptive", type: "boolean", default: "false", description: "Adaptive glass: the frost flips polarity with the backdrop under the card." },
      { name: "tint", type: "string", description: "Surface wash. Defaults to the scheme's bar surface." },
      { name: "variant", type: '"regular" | "clear"', default: '"regular"', description: "Glass material variant." },
      { name: "metal", type: "unknown", description: "The canvas material, forwarded to the engine control." },
      { name: "providerId", type: "string", description: "Pairs the surface with its Android backdrop provider." },
      { name: "accessibilityLabel", type: "string", description: "Accessible name when the card is a control." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The outer frame — size it here." },
      { name: "contentStyle", type: "StyleProp<ViewStyle>", description: "The inner content view." },
      { name: "children", type: "ReactNode", description: "Card content, usually the Card parts." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed through to the card's glass so it is testable." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "glacia-native";

<Card>
  <CardHeader>
    <CardTitle>Today</CardTitle>
    <CardDescription>Activity summary</CardDescription>
  </CardHeader>
  <CardContent>
    <Text>12,480 steps</Text>
  </CardContent>
</Card>`,
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    description:
      "A toolbar ported from the engine's LiquidGlassToolbar — a 48dp row whose title sits in a glass capsule of its own between leading and trailing groups that merge when pressed.",
    category: "Navigation & Layout",
    glass:
      "With a glass renderer available the engine's own control mounts (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the same row with the title capsule on the fallback material.",
    props: [
      { name: "title", type: "ReactNode", description: "The title. A string is set in a glass capsule of its own between the two ends; a node is rendered as given." },
      { name: "leading", type: "ReactNode", description: "Controls at the leading end — a back button, a menu. They merge when pressed." },
      { name: "trailing", type: "ReactNode", description: "Controls at the trailing end — actions. They merge when pressed." },
      { name: "spacing", type: "number", default: "28", description: "The merge distance for each end's group, dp." },
      { name: "gap", type: "number", default: "12", description: "Gap between controls at either end, dp." },
      { name: "height", type: "number", default: "48", description: "Bar height, dp." },
      { name: "tint", type: "string", description: "The title capsule's wash." },
      { name: "variant", type: '"regular" | "clear"', default: '"regular"', description: "Glass material variant." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "titleStyle", type: "StyleProp<TextStyle>", description: "Applied to a string title." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the control so it is testable." },
    ],
    codeSnippet: `import { Toolbar } from "glacia-native";

<Toolbar title="Inbox" />`,
  },
  {
    slug: "toast",
    name: "Toast",
    description:
      "A transient message on a glass pill, ported from the engine's LiquidGlassToast — a 44dp capsule, 60dp from the screen edge, auto-dismissing after 2.6 seconds.",
    category: "Popups & Menus",
    glass:
      "With a glass renderer available the engine's own control mounts (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the same pill on a Glass control surface. The toast never hides itself: the timer only fires onDismiss, so the app owns the visible state.",
    props: [
      { name: "visible", type: "boolean", description: "Shown while true; springs out when it turns false." },
      { name: "message", type: "string", description: "The text." },
      { name: "icon", type: "ReactNode", description: "Rendered before the message." },
      { name: "onDismiss", type: "() => void", description: "Called when the toast wants to go — after duration, or on a tap. The app flips visible." },
      { name: "duration", type: "number", default: "2600", description: "Auto-dismiss after this many ms of being visible. 0 keeps it up." },
      { name: "edge", type: '"top" | "bottom"', default: '"top"', description: "Which screen edge it slides in from." },
      { name: "offset", type: "number", default: "60", description: "Distance from that edge, dp." },
      { name: "tint", type: "string", description: "Surface wash." },
      { name: "variant", type: '"regular" | "clear"', default: '"regular"', description: "Glass material variant." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The pill's frame." },
      { name: "textStyle", type: "StyleProp<TextStyle>", description: "Applied to the message." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the toast so it is testable." },
    ],
    codeSnippet: `import { useState } from "react";
import { Toast } from "glacia-native";

const [visible, setVisible] = useState(true);
<Toast visible={visible} message="Saved" onDismiss={() => setVisible(false)} />`,
  },
  {
    slug: "sheet",
    name: "Sheet",
    description:
      "A bottom sheet ported from the engine's LiquidGlassSheet — 28dp top corners, a 36×5 grab handle, dismissed past 30% of its height, on a fling down, or by tapping the dim.",
    category: "Popups & Menus",
    glass:
      "With a glass renderer available the engine's own control mounts, carrying the approved material, handle and dismissal behaviour (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the same panel with a solid surface and the same dismissal affordances.",
    props: [
      { name: "visible", type: "boolean", description: "Up while true; slides away when it turns false." },
      { name: "onDismiss", type: "() => void", description: "Called when the sheet wants to go — dragged down past 30% of its height, flung down, or the dim behind it tapped. The app flips visible; the sheet never hides itself." },
      { name: "height", type: "number", default: "420", description: "The sheet's height, dp." },
      { name: "cornerRadius", type: "number", default: "28", description: "Top corner radius, continuous." },
      { name: "handle", type: "boolean", default: "true", description: "Shows the grab handle." },
      { name: "dim", type: "number", default: "0.25", description: "Opacity of the black dim behind the sheet at full height; 0 for none." },
      { name: "dismissOnTap", type: "boolean", default: "true", description: "A tap on the dim dismisses." },
      { name: "tint", type: "string", description: "Surface wash." },
      { name: "variant", type: '"regular" | "clear"', description: "Glass material variant." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The sheet frame — positioned absolutely at the bottom of its parent." },
      { name: "contentStyle", type: "StyleProp<ViewStyle>", description: "The content view, under the handle." },
      { name: "children", type: "ReactNode", description: "Sheet content." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the sheet so it is testable." },
    ],
    codeSnippet: `import { useState } from "react";
import { Text } from "react-native";
import { Sheet } from "glacia-native";

const [open, setOpen] = useState(true);
<Sheet visible={open} onDismiss={() => setOpen(false)}>
  <Text>Sheet content</Text>
</Sheet>`,
  },
  {
    slug: "group",
    name: "Group",
    description:
      "A group of glass members that merge when pressed together, ported from the engine's LiquidGlassGroup — the kit's buttons, icon buttons and chips join automatically.",
    category: "Navigation & Layout",
    glass:
      "With a glass renderer available the engine's own control mounts, carrying the merge behaviour (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the same row of members with the fallback material, so the group is never invisible.",
    props: [
      { name: "spacing", type: "number", default: "28", description: "The distance at which a pressed member begins to fuse with its neighbour, dp." },
      { name: "gap", type: "number", default: "12", description: "Resting gap between members, dp." },
      { name: "direction", type: '"row" | "column"', default: '"row"', description: "Lay the members out along a row or a column." },
      { name: "metal", type: "unknown", description: "The canvas glass — the material the merged silhouette is drawn with. Defaults to the kit's button recipe." },
      { name: "tint", type: "string", description: "Surface wash over the canvas." },
      { name: "providerId", type: "string", description: "Android only — which LiquidGlassProvider supplies the backdrop." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "children", type: "ReactNode", description: "The members — the kit's buttons, icon buttons and chips join automatically." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the group so it is testable." },
    ],
    codeSnippet: `import { Button, Group } from "glacia-native";

<Group>
  <Button accessibilityLabel="Cut" onPress={() => {}}>Cut</Button>
  <Button accessibilityLabel="Copy" onPress={() => {}}>Copy</Button>
  <Button accessibilityLabel="Paste" onPress={() => {}}>Paste</Button>
</Group>`,
  },
  {
    slug: "morph-group",
    name: "MorphGroup",
    description:
      "A morphing group of capsules, ported from the engine's LiquidGlassMorphGroup: capsules fuse when one is dragged onto a neighbour and spring home on release.",
    category: "Navigation & Layout",
    glass:
      "With a glass renderer available the engine's own control mounts, carrying the morph behaviour (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the same capsules with solid surfaces, so the group is never invisible.",
    props: [
      { name: "items", type: "MorphGroupItem[]", description: "The capsules, laid out in a row. Each item has a key, an optional label and icon, and an optional onPress. Two or more make the morph reachable." },
      { name: "onMerge", type: "(fromKey: string, toKey: string) => void", description: "A capsule was dragged onto a neighbour and released there. What that means is the app's; the group only springs everything home." },
      { name: "onItemPress", type: "(key: string) => void", description: "A plain tap, forwarded alongside the item's own onPress." },
      { name: "spacing", type: "number", default: "28", description: "The distance at which two capsules begin to fuse, dp." },
      { name: "gap", type: "number", default: "12", description: "Gap between capsules at rest, dp." },
      { name: "height", type: "number", default: "48", description: "Capsule height; the corner radius follows it." },
      { name: "tint", type: "string", description: "Surface wash over every capsule's glass." },
      { name: "variant", type: '"regular" | "clear"', default: '"regular"', description: "Glass material variant." },
      { name: "metal", type: "unknown", description: "The canvas material, forwarded to the engine control." },
      { name: "providerId", type: "string", description: "Pairs the surfaces with their Android backdrop provider." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "textStyle", type: "StyleProp<TextStyle>", description: "Applied to item labels." },
    ],
    codeSnippet: `import { MorphGroup } from "glacia-native";

<MorphGroup
  items={[
    { key: "reply", label: "Reply" },
    { key: "forward", label: "Forward" },
    { key: "archive", label: "Archive" },
  ]}
  onMerge={(from, to) => {}}
/>`,
  },
  {
    slug: "scrim",
    name: "Scrim",
    description:
      "A scroll-edge scrim ported from the engine's LiquidGlassScrim: an edge-hugging blur ramp for content that sits over scrolling pages, like a tab bar or toolbar.",
    category: "Navigation & Layout",
    glass:
      "With a glass renderer available the engine's own control mounts, carrying the blur ramp (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+). Without one the fallback floor renders the same scrim with a solid wash, so content is never lost behind an invisible scrim.",
    props: [
      { name: "edge", type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: "Which screen edge the scrim hugs — and therefore which way the blur ramps." },
      { name: "size", type: "number", default: "160", description: "Thickness of the scrim along its axis, dp." },
      { name: "radius", type: "number", default: "24", description: "Blur radius at the outer edge, dp." },
      { name: "reach", type: "number", default: "0.7", description: "Fraction of the scrim over which the ramp completes, measured from the content side. Past it the blur holds at full radius." },
      { name: "tint", type: "string", description: "Optional wash over the blur — e.g. the bar surface colour at low alpha." },
      { name: "providerId", type: "string", description: "Android: which provider(s) to read. Same semantics as the glass view." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Extra positioning/size overrides, applied after the edge placement." },
      { name: "children", type: "ReactNode", description: "Content over the scrim — a tab bar, a toolbar. Laid out edge-aligned, untouched." },
    ],
    codeSnippet: `import { Scrim, TabBar } from "glacia-native";

<Scrim edge="bottom">
  <TabBar items={items} />
</Scrim>`,
  },
  {
    slug: "accordion",
    name: "Accordion",
    description:
      "Disclosure sections on one glass panel: one section open at a time unless multiple is set, and headers that announce their expanded state.",
    category: "Navigation & Layout",
    glass:
      "The panel is a Glass surface: Apple's UIGlassEffect on iOS 26+, the engine's Metal renderer on iOS 16.4–25 and AGSL on Android 13+, and Glacia's layered fallback everywhere else.",
    props: [
      { name: "sections", type: "AccordionSection[]", description: "The sections: each has a stable value, a title, an optional description and content." },
      { name: "multiple", type: "boolean", default: "false", description: "Allow several sections open at once." },
      { name: "openSections", type: "string[]", description: "Controlled list of open section values." },
      { name: "defaultOpenSections", type: "string[]", description: "Starting open sections for uncontrolled use." },
      { name: "onOpenSectionsChange", type: "(open: string[]) => void", description: "Fires with the next list of open section values." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the panel so it is testable." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { Accordion } from "glacia-native";

<Accordion
  sections={[
    { value: "shipping", title: "Shipping", content: <Text>Ships in 2 days.</Text> },
    { value: "returns", title: "Returns", content: <Text>30-day returns.</Text> },
  ]}
/>`,
  },
  {
    slug: "alert",
    name: "Alert",
    description:
      "A static callout: a named region with a title and description, not a tap target, tinted by tone rather than by a second surface.",
    category: "Showing Things",
    glass:
      "The callout sits on a Glass panel surface: Apple's UIGlassEffect on iOS 26+, the engine's Metal renderer on iOS 16.4–25 and AGSL on Android 13+, and Glacia's layered fallback everywhere else.",
    props: [
      { name: "title", type: "string", description: "The callout's heading." },
      { name: "description", type: "string", description: "Supporting text under the title." },
      { name: "icon", type: "ReactNode", description: "Icon before the title." },
      { name: "tone", type: '"default" | "info" | "success" | "warning" | "destructive"', default: '"default"', description: "Tints the title with the tone's colour." },
      { name: "onDismiss", type: "() => void", description: "Optional dismiss control." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "testID", type: "string", description: "Passed to the alert so it is testable." },
    ],
    codeSnippet: `import { Alert } from "glacia-native";

<Alert tone="warning" title="Storage almost full" description="You have 200 MB left." />`,
  },
  {
    slug: "alert-dialog",
    name: "AlertDialog",
    description:
      "A deliberate modal: announced as an alert dialog, it does not dismiss on a backdrop press, and it always offers a cancel path.",
    category: "Popups & Menus",
    glass:
      "The panel is a Glass overlay surface backed by the theme's solid surface colour, above a scrim that blocks what is behind it. The glass routes as usual: native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+, layered fallback elsewhere.",
    props: [
      { name: "open", type: "boolean", description: "Controlled open state. Omit and the dialog keeps its own." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Fires when the open state changes." },
      { name: "title", type: "string", description: "The dialog's heading, announced as an alert." },
      { name: "description", type: "string", description: "Supporting text under the title." },
      { name: "children", type: "ReactNode", description: "Extra content between the description and the actions." },
      { name: "confirmLabel", type: "string", default: '"Confirm"', description: "The confirm button's label." },
      { name: "cancelLabel", type: "string", default: '"Cancel"', description: "The cancel button's label." },
      { name: "destructive", type: "boolean", default: "false", description: "Tints the confirm action destructive." },
      { name: "onConfirm", type: "() => void", description: "Fires when the confirm action is pressed, before the dialog closes." },
      { name: "onCancel", type: "() => void", description: "Fires on cancel or on Android's back gesture, before the dialog closes." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the panel so it is testable." },
    ],
    codeSnippet: `import { useState } from "react";
import { AlertDialog } from "glacia-native";

const [open, setOpen] = useState(false);
<AlertDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete this photo?"
  description="This cannot be undone."
  destructive
  confirmLabel="Delete"
  onConfirm={() => {}}
/>`,
  },
  {
    slug: "avatar",
    name: "Avatar",
    description:
      "A person's image in a glass ring, with an initials fallback when the image is missing or fails, and a status dot that is announced rather than colour-only.",
    category: "Showing Things",
    glass:
      "The ring is a Glass control surface: Apple's UIGlassEffect on iOS 26+, the engine's Metal renderer on iOS 16.4–25 and AGSL on Android 13+, and Glacia's layered fallback everywhere else. The image and initials sit inside it.",
    props: [
      { name: "source", type: "{ uri: string } | number", description: "Image source, as React Native's Image takes it." },
      { name: "name", type: "string", description: "The person's name — drives the initials fallback and the accessible label." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Diameter preset from the control size scale." },
      { name: "status", type: '"online" | "offline" | "busy"', description: "Shows a status dot in the corner." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the avatar so it is testable." },
    ],
    codeSnippet: `import { Avatar } from "glacia-native";

<Avatar name="Maya Chen" status="online" />`,
  },
  {
    slug: "badge",
    name: "Badge",
    description:
      "A short, non-interactive count or label that is announced as one unit, dressed as a capsule in the family's type step. With overlay, it wraps around a control — an icon button with a count.",
    category: "Showing Things",
    glass:
      "No glass: the badge is a solid tone fill (fill, destructive, success or muted wash) on a plain view.",
    props: [
      { name: "children", type: "ReactNode", description: "The count or label." },
      { name: "tone", type: '"fill" | "destructive" | "success" | "muted"', default: '"fill"', description: "The fill colour's tone." },
      { name: "overlay", type: "ReactNode", description: "Wraps the badge around a control, e.g. an icon button with a count; the badge sits at its top-right." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "testID", type: "string", description: "Passed to the badge so it is testable." },
    ],
    codeSnippet: `import { Badge } from "glacia-native";

<Badge tone="destructive">3</Badge>`,
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description:
      "A checkbox with role=\"checkbox\" semantics — checked and mixed states exposed to screen readers, controlled or internal state, and a label that is part of the same press target.",
    category: "Text & Forms",
    glass:
      "No glass surface: the box is drawn with solid fills and borders in the theme's colours, dressed as the family's small square.",
    props: [
      { name: "checked", type: "boolean", description: "Controlled checked state. Omit it and the checkbox keeps its own." },
      { name: "defaultChecked", type: "boolean", default: "false", description: "Starting state for uncontrolled use." },
      { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Fires with the next checked state." },
      { name: "label", type: "string", description: "Label beside the box, inside the same press target." },
      { name: "description", type: "string", description: "Second line under the label." },
      { name: "indeterminate", type: "boolean", default: "false", description: "Shows the mixed state instead of a check." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "testID", type: "string", description: "Passed to the checkbox so it is testable." },
    ],
    codeSnippet: `import { useState } from "react";
import { Checkbox } from "glacia-native";

const [checked, setChecked] = useState(false);
<Checkbox checked={checked} onCheckedChange={setChecked} label="Remember me" />`,
  },
  {
    slug: "collapsible",
    name: "Collapsible",
    description:
      "A single disclosure: the trigger announces its expanded state, the content mounts only while open, and state can be controlled or internal.",
    category: "Navigation & Layout",
    glass:
      "No surface of its own: the trigger is rendered as given, so whatever glass it carries is the trigger component's. The wrapper is a plain view.",
    props: [
      { name: "open", type: "boolean", description: "Controlled open state." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Starting state for uncontrolled use." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Fires when the open state changes." },
      { name: "trigger", type: "ReactNode", description: "The control that opens the section. Rendered as given." },
      { name: "accessibilityLabel", type: "string", default: '"Toggle section"', description: "Accessible name of the trigger." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
      { name: "children", type: "ReactNode", description: "The disclosed content." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the wrapper so it is testable." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { Collapsible } from "glacia-native";

<Collapsible trigger={<Text>Advanced options</Text>}>
  <Text>Revealed content</Text>
</Collapsible>`,
  },
  {
    slug: "context-menu",
    name: "ContextMenu",
    description:
      "A context menu: nothing opens it until a long press on the trigger, and it closes on selection, outside press, or Android's back gesture.",
    category: "Popups & Menus",
    glass:
      "The panel is the family's shared overlay surface — a Glass overlay: native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+, layered fallback elsewhere. It carries a menu role with menuitem rows.",
    props: [
      { name: "trigger", type: "ReactNode", description: "The element the menu belongs to. Long-press it to open." },
      { name: "items", type: "ContextMenuItem[]", description: "The rows: each has a label, an onPress, and optional icon, disabled and destructive flags." },
      { name: "open", type: "boolean", description: "Controlled open state. Omit it and the menu keeps its own." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Fires when the open state changes." },
      { name: "width", type: "number", default: "220", description: "Panel width, dp." },
      { name: "accessibilityLabel", type: "string", default: '"Context menu"', description: "Accessible name of the trigger and menu." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The panel's style." },
      { name: "testID", type: "string", description: "Passed to the menu so it is testable." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { ContextMenu } from "glacia-native";

<ContextMenu
  trigger={<Text>Press and hold</Text>}
  items={[
    { label: "Reply", onPress: () => {} },
    { label: "Delete", destructive: true, onPress: () => {} },
  ]}
/>`,
  },
  {
    slug: "dialog",
    name: "Dialog",
    description:
      "A modal dialog that closes on the backdrop unless told not to, and on Android's back gesture, announcing itself as a modal dialog with a heading.",
    category: "Popups & Menus",
    glass:
      "The panel is a Glass overlay surface backed by the theme's solid surface colour, above a scrim. The glass routes as usual: native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+, layered fallback elsewhere.",
    props: [
      { name: "open", type: "boolean", description: "Controlled open state. Omit and the dialog keeps its own." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Fires when the open state changes." },
      { name: "title", type: "string", description: "The dialog's heading." },
      { name: "description", type: "string", description: "Supporting text under the title." },
      { name: "children", type: "ReactNode", description: "Dialog content." },
      { name: "footer", type: "ReactNode", description: "Action area under the content. Without it, a single Close button is rendered." },
      { name: "dismissOnBackdropPress", type: "boolean", default: "true", description: "Set false for a decision that must be answered." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The panel's style." },
      { name: "testID", type: "string", description: "Passed to the panel so it is testable." },
    ],
    codeSnippet: `import { useState } from "react";
import { Text } from "react-native";
import { Dialog } from "glacia-native";

const [open, setOpen] = useState(false);
<Dialog open={open} onOpenChange={setOpen} title="About" description="Version 1.0">
  <Text>Details go here.</Text>
</Dialog>`,
  },
  {
    slug: "dialog-trigger",
    name: "DialogTrigger",
    description:
      "A button that owns a dialog's open state — it renders the trigger button and the dialog it opens, with the dialog's props passed through.",
    category: "Popups & Menus",
    glass:
      "The trigger is a Button and the panel it opens is the Dialog's Glass overlay surface: native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+, layered fallback elsewhere.",
    props: [
      { name: "label", type: "string", description: "The trigger's accessible name, and its text when no children are given." },
      { name: "title", type: "string", description: "The dialog's heading." },
      { name: "description", type: "string", description: "Supporting text under the dialog's title." },
      { name: "children", type: "ReactNode", description: "The trigger button's content. The label is used when omitted." },
      { name: "footer", type: "ReactNode", description: "The dialog's action area." },
      { name: "dismissOnBackdropPress", type: "boolean", default: "true", description: "Set false for a decision that must be answered." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The dialog panel's style." },
      { name: "testID", type: "string", description: "Passed to the dialog panel so it is testable." },
    ],
    codeSnippet: `import { DialogTrigger } from "glacia-native";

<DialogTrigger label="About" title="About" description="Version 1.0" />`,
  },
  {
    slug: "dropdown-menu",
    name: "DropdownMenu",
    description:
      "A menu button: a trigger that opens a menu of actions, closing on selection, on an outside press, and on Android's back gesture.",
    category: "Popups & Menus",
    glass:
      "The panel is the family's shared overlay surface — a Glass overlay: native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+, layered fallback elsewhere. It is a menu with menuitem rows.",
    props: [
      { name: "trigger", type: "ReactNode", description: "The control that opens the menu." },
      { name: "items", type: "DropdownMenuItem[]", description: "The rows: each has a label, an onPress, and optional icon, disabled and destructive flags." },
      { name: "open", type: "boolean", description: "Controlled open state. Omit it and the menu keeps its own." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Starting state for uncontrolled use." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Fires when the open state changes." },
      { name: "width", type: "number", default: "220", description: "Panel width, dp." },
      { name: "accessibilityLabel", type: "string", default: '"Menu"', description: "Accessible name of the trigger and menu." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The panel's style." },
      { name: "testID", type: "string", description: "Passed to the menu so it is testable." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { DropdownMenu } from "glacia-native";

<DropdownMenu
  trigger={<Text>Options</Text>}
  items={[
    { label: "Edit", onPress: () => {} },
    { label: "Share", onPress: () => {} },
  ]}
/>`,
  },
  {
    slug: "label",
    name: "Label",
    description:
      "Names a control through nativeID, marks required and disabled states for screen readers, and does not intercept touches.",
    category: "Text & Forms",
    glass: "Plain text, no surface.",
    props: [
      { name: "children", type: "ReactNode", description: "The label text." },
      { name: "required", type: "boolean", default: "false", description: "Adds the required marker and reports it to screen readers." },
      { name: "disabled", type: "boolean", default: "false", description: "Dims the label and reports the disabled state." },
      { name: "nativeID", type: "string", description: "Matched by a control's aria-labelledby/nativeID." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<TextStyle>", description: "Standard React Native text style." },
      { name: "testID", type: "string", description: "Passed to the label so it is testable." },
    ],
    codeSnippet: `import { Label } from "glacia-native";

<Label nativeID="email-label" required>Email address</Label>`,
  },
  {
    slug: "popover",
    name: "Popover",
    description:
      "An anchored panel with its own open state, dismissed by an outside press or Android's back gesture, never stealing a rendering pass from the screen behind it.",
    category: "Popups & Menus",
    glass:
      "The panel is the family's shared overlay surface — a Glass overlay: native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+, layered fallback elsewhere.",
    props: [
      { name: "trigger", type: "ReactNode", description: "The control that opens the panel." },
      { name: "children", type: "ReactNode", description: "Panel content." },
      { name: "open", type: "boolean", description: "Controlled open state. Omit it and the popover keeps its own." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Starting state for uncontrolled use." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Fires when the open state changes." },
      { name: "width", type: "number", default: "260", description: "Panel width, dp." },
      { name: "accessibilityLabel", type: "string", default: '"Popover"', description: "Accessible name of the trigger and panel." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The panel's style." },
      { name: "testID", type: "string", description: "Passed to the popover so it is testable." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { Popover } from "glacia-native";

<Popover trigger={<Text>Details</Text>}>
  <Text>Anchored panel content.</Text>
</Popover>`,
  },
  {
    slug: "progress",
    name: "Progress",
    description:
      "Progress with progressbar semantics — the value, minimum and maximum exposed to screen readers — as a bar, track or ring, or indeterminate.",
    category: "Showing Things",
    glass:
      "The track is a Glass control surface: Apple's UIGlassEffect on iOS 26+, the engine's Metal renderer on iOS 16.4–25 and AGSL on Android 13+, and Glacia's layered fallback everywhere else. The fill is a solid tint.",
    props: [
      { name: "value", type: "number", description: "Progress from 0 to 100." },
      { name: "variant", type: '"bar" | "linear" | "track" | "ring" | "indeterminate"', default: '"linear"', description: "Bar shape. track and ring also print the percentage under the bar." },
      { name: "tint", type: "string", description: "Fill colour. Defaults to the scheme's fill." },
      { name: "accessibilityLabel", type: "string", default: '"Progress"', description: "Accessible name of the progress bar." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The track's style." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the progress bar so it is testable." },
    ],
    codeSnippet: `import { Progress } from "glacia-native";

<Progress value={62} accessibilityLabel="Upload progress" />`,
  },
  {
    slug: "radio-group",
    name: "RadioGroup",
    description:
      "A radiogroup where every option is a radio with a selected state, disabled options are skipped, and the value can be controlled or internal.",
    category: "Text & Forms",
    glass:
      "No glass surface: the rings and dots are drawn with solid fills and borders in the theme's colours.",
    props: [
      { name: "value", type: "string", description: "Controlled selected value. Omit it and the group keeps its own." },
      { name: "defaultValue", type: "string", description: "Starting value for uncontrolled use." },
      { name: "onValueChange", type: "(value: string) => void", description: "Fires with the chosen option's value." },
      { name: "options", type: "RadioOption[]", description: "The options: each has a value, a label, and optional description and disabled flag." },
      { name: "horizontal", type: "boolean", default: "false", description: "Lays the options out in a wrapping row instead of a column." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables every option." },
      { name: "accessibilityLabel", type: "string", default: '"Options"', description: "Announced as the group's name." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "testID", type: "string", description: "Passed to the group so it is testable." },
    ],
    codeSnippet: `import { useState } from "react";
import { RadioGroup } from "glacia-native";

const [value, setValue] = useState("a");
<RadioGroup
  value={value}
  onValueChange={setValue}
  options={[
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ]}
/>`,
  },
  {
    slug: "select",
    name: "Select",
    description:
      "A single-choice field: a trigger showing the chosen label, opening an anchored listbox where each option is selectable and the chosen one is marked. Controlled or internal, with a placeholder and disabled options.",
    category: "Text & Forms",
    glass:
      "The trigger is a Glass control surface and the list is the family's shared overlay panel: native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+, layered fallback elsewhere.",
    props: [
      { name: "value", type: "string", description: "Controlled selected value. Omit it and the select keeps its own." },
      { name: "defaultValue", type: "string", description: "Starting value for uncontrolled use." },
      { name: "onValueChange", type: "(value: string) => void", description: "Fires with the chosen option's value." },
      { name: "options", type: "SelectOption[]", description: "The options: each has a value, a label and an optional disabled flag." },
      { name: "placeholder", type: "string", default: '"Select…"', description: "Shown while nothing is chosen." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
      { name: "accessibilityLabel", type: "string", default: '"Select"', description: "Accessible name of the field." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "testID", type: "string", description: "Passed to the trigger so it is testable." },
    ],
    codeSnippet: `import { useState } from "react";
import { Select } from "glacia-native";

const [value, setValue] = useState("a");
<Select
  value={value}
  onValueChange={setValue}
  options={[
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ]}
/>`,
  },
  {
    slug: "separator",
    name: "Separator",
    description:
      "A semantic separator at the family's hairline — horizontal by default, decorative when it carries no label.",
    category: "Showing Things",
    glass: "No glass: a 1pt hairline in the theme's separator colour.",
    props: [
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Rule direction." },
      { name: "inset", type: "number", default: "0", description: "Leading inset for a horizontal rule inside a list, dp." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "testID", type: "string", description: "Passed to the separator so it is testable." },
    ],
    codeSnippet: `import { Separator } from "glacia-native";

<Separator inset={16} />`,
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    description:
      "A loading placeholder that hides itself from screen readers and announces a busy state on the container instead; its shimmer is the family's motion and disappears under Reduce Motion.",
    category: "Showing Things",
    glass: "No glass: a solid block in the theme's skeleton colour, pulsing unless Reduce Motion is on.",
    props: [
      { name: "shape", type: '"rect" | "circle" | "line"', default: '"rect"', description: "Placeholder shape. line is a 12dp text line; circle takes its diameter from height." },
      { name: "width", type: "number | string", description: "Width; defaults to filling the parent for rect and line." },
      { name: "height", type: "number", description: "Height, dp. Defaults to 12 for line and 20 otherwise." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "testID", type: "string", description: "Passed to the placeholder so it is testable." },
    ],
    codeSnippet: `import { Skeleton } from "glacia-native";

<Skeleton shape="line" width="60%" />`,
  },
  {
    slug: "tabs",
    name: "Tabs",
    description:
      "A row of tabs on a glass rail where the selected tab is a lifted inner pane — a lens — rather than a flat highlight.",
    category: "Navigation & Layout",
    glass:
      "The rail is a Glass surface: Apple's real glass on iOS 26+, the engine's Metal renderer on iOS 16.4–25 and AGSL on Android 13+, and Glacia's translucent fallback of the same shape elsewhere, so the layout never shifts between platforms.",
    props: [
      { name: "items", type: "TabItem[]", description: "The tabs: each item has a stable id, a label and an optional icon element." },
      { name: "activeId", type: "string", description: "The active tab's id. Leave undefined and the component keeps it itself." },
      { name: "defaultActiveId", type: "string", description: "Starting active tab for uncontrolled use." },
      { name: "onTabChange", type: "(id: string) => void", description: "Fires with the newly selected tab's id." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed through to the rail so it is testable." },
    ],
    codeSnippet: `import { Tabs } from "glacia-native";

<Tabs
  items={[
    { id: "day", label: "Day" },
    { id: "week", label: "Week" },
    { id: "month", label: "Month" },
  ]}
  defaultActiveId="day"
  onTabChange={(id) => {}}
/>`,
  },
  {
    slug: "text",
    name: "Text",
    description:
      "Themed text. Every Glacia component that renders words uses this, so type, colour and contrast come from one place — the package's type scale.",
    category: "Text & Forms",
    glass: "Plain text, no surface.",
    props: [
      { name: "variant", type: '"title" | "heading" | "body" | "caption" | "label"', default: '"body"', description: "The type step. Title and heading announce themselves as headings to screen readers." },
      { name: "muted", type: "boolean", default: "false", description: "Secondary text: descriptions, hints, timestamps." },
      { name: "destructive", type: "boolean", default: "false", description: "Renders the text in the destructive tone (errors, danger)." },
      { name: "numberOfLines", type: "number", description: "Number of lines before truncating." },
      { name: "children", type: "ReactNode", description: "The text content." },
      { name: "style", type: "StyleProp<TextStyle>", description: "Standard React Native text style." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the text so it is testable." },
    ],
    codeSnippet: `import { Text } from "glacia-native";

<Text variant="title">Good morning</Text>`,
  },
  {
    slug: "textarea",
    name: "Textarea",
    description:
      "The multiline field: it is the family's Input with multiline set — top-aligned text and a height derived from rows — with the same label, description and error contract. It accepts Input's props (except multiline) plus rows.",
    category: "Text & Forms",
    glass:
      "Same surface as Input: the engine's control where a glass renderer exists (native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+), and the same capsule on the fallback material elsewhere.",
    props: [
      { name: "rows", type: "number", default: "4", description: "Visible height in text lines." },
      { name: "value", type: "string", description: "Controlled text (from Input)." },
      { name: "defaultValue", type: "string", description: "Starting text for uncontrolled use (from Input)." },
      { name: "onChangeText", type: "(text: string) => void", description: "Fires with the next text (from Input)." },
      { name: "placeholder", type: "string", description: "Hint shown while the field is empty (from Input)." },
      { name: "invalid", type: "boolean", default: "false", description: "Renders the field in an error state (from Input)." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents editing (from Input)." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Field height preset (from Input)." },
      { name: "accessibilityLabel", type: "string", description: "Accessible name of the field (from Input)." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The capsule's style." },
      { name: "testID", type: "string", description: "Passed through to the text field so it is testable." },
    ],
    codeSnippet: `import { Textarea } from "glacia-native";

<Textarea placeholder="Tell us more" rows={4} />`,
  },
  {
    slug: "toggle",
    name: "Toggle",
    description:
      "A two-state button that reports pressed — it is not a checkbox — dressed as a glass control at the 28 / 34 / 44 button scale. State can be controlled or internal.",
    category: "Buttons & Actions",
    glass:
      "The button body is a Glass control surface: Apple's UIGlassEffect on iOS 26+, the engine's Metal renderer on iOS 16.4–25 and AGSL on Android 13+, and Glacia's layered fallback everywhere else. The ghost variant drops the glass effect and shows a wash when pressed.",
    props: [
      { name: "pressed", type: "boolean", description: "Controlled pressed state." },
      { name: "defaultPressed", type: "boolean", default: "false", description: "Starting state for uncontrolled use." },
      { name: "onPressedChange", type: "(pressed: boolean) => void", description: "Fires with the next pressed state." },
      { name: "selected", type: "boolean", description: "Read-only alias of pressed, matching the web package's naming." },
      { name: "icon", type: "ReactNode", description: "Icon before the label." },
      { name: "children", type: "ReactNode", description: "The label." },
      { name: "variant", type: '"glass" | "ghost"', default: '"glass"', description: "Glass surface or bare control." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Control height preset: 28, 34 or 44." },
      { name: "disabled", type: "boolean", default: "false", description: "Prevents interaction." },
      { name: "accessibilityLabel", type: "string", description: "Accessible name of the button." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "textStyle", type: "StyleProp<TextStyle>", description: "Applied to a string label." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the button so it is testable." },
    ],
    codeSnippet: `import { useState } from "react";
import { Toggle } from "glacia-native";

const [pressed, setPressed] = useState(false);
<Toggle pressed={pressed} onPressedChange={setPressed} accessibilityLabel="Bold">
  B
</Toggle>`,
  },
  {
    slug: "toggle-group",
    name: "ToggleGroup",
    description:
      "Grouped toggle buttons, single- or multi-select: each item is a toggle button reporting selected, and the group reports one value (or an array). Controlled or internal.",
    category: "Buttons & Actions",
    glass:
      "Each item is a Glass control surface: Apple's UIGlassEffect on iOS 26+, the engine's Metal renderer on iOS 16.4–25 and AGSL on Android 13+, and Glacia's layered fallback everywhere else. Selected items wear the glass-active tint.",
    props: [
      { name: "items", type: "ToggleGroupItem[]", description: "The items: each has a value, an optional label and icon, and an optional disabled flag." },
      { name: "multiple", type: "boolean", default: "false", description: "Allow several items selected at once; the value is then an array." },
      { name: "value", type: "string | string[]", description: "Controlled selection. Omit it and the group keeps its own." },
      { name: "defaultValue", type: "string | string[]", description: "Starting selection for uncontrolled use." },
      { name: "onValueChange", type: "(value: string | string[]) => void", description: "Fires with the next selection." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Item height preset: 28, 34 or 44." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables every item." },
      { name: "accessibilityLabel", type: "string", default: '"Toggle group"', description: "Announced as the group's name; the group has a toolbar role." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed to the group so it is testable." },
    ],
    codeSnippet: `import { ToggleGroup } from "glacia-native";

<ToggleGroup
  items={[
    { value: "bold", label: "Bold" },
    { value: "italic", label: "Italic" },
  ]}
  multiple
  defaultValue={[]}
  onValueChange={(value) => {}}
/>`,
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    description:
      "A supplementary hint: it appears on a long press on touch (a press toggles it), never traps focus, and is dismissible without closing the app.",
    category: "Popups & Menus",
    glass:
      "The hint is the family's smallest glass capsule, rendered through the shared overlay panel: native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+, layered fallback elsewhere.",
    props: [
      { name: "label", type: "string", description: "The hint text." },
      { name: "children", type: "ReactNode", description: "The control the tooltip describes." },
      { name: "open", type: "boolean", description: "Controlled open state. Omit it and the tooltip keeps its own." },
      { name: "defaultOpen", type: "boolean", default: "false", description: "Starting state for uncontrolled use." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Fires when the open state changes." },
      { name: "side", type: '"top" | "bottom"', description: "Which side of the control the capsule anchors to." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "The wrapper's style." },
      { name: "testID", type: "string", description: "Passed to the tooltip so it is testable." },
    ],
    codeSnippet: `import { Text } from "react-native";
import { Tooltip } from "glacia-native";

<Tooltip label="Add to favourites">
  <Text>★</Text>
</Tooltip>`,
  },
  {
    slug: "action-sheet",
    name: "ActionSheet",
    description:
      "A list of choices attached to the bottom of the screen — not one panel but a stack of separate glass pills — with a separate Cancel row so a mis-tap is always reversible.",
    category: "Popups & Menus",
    glass:
      "Each row — the title block, every option and the Cancel row — is its own Glass overlay pill above a scrim: native UIGlassEffect on iOS 26+, Metal on iOS 16.4–25, AGSL on Android 13+, layered fallback elsewhere.",
    props: [
      { name: "open", type: "boolean", description: "Controlled open state. Omit it and the sheet keeps its own." },
      { name: "onOpenChange", type: "(open: boolean) => void", description: "Fires when the open state changes." },
      { name: "title", type: "string", description: "Heading in the top pill." },
      { name: "message", type: "string", description: "Supporting text under the title." },
      { name: "options", type: "ActionSheetOption[]", description: "The choices: each has a label, an optional onPress, and a destructive flag that tints the row red." },
      { name: "cancelLabel", type: "string", default: '"Cancel"', description: "The cancel row's label." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "testID", type: "string", description: "Passed through to the sheet so it is testable." },
    ],
    codeSnippet: `import { useState } from "react";
import { ActionSheet } from "glacia-native";

const [open, setOpen] = useState(false);
<ActionSheet
  open={open}
  onOpenChange={setOpen}
  title="Photo"
  options={[
    { label: "Take photo", onPress: () => {} },
    { label: "Choose from library", onPress: () => {} },
    { label: "Delete", destructive: true, onPress: () => {} },
  ]}
/>`,
  },
  {
    slug: "field",
    name: "Field",
    description:
      "Label, control and message stacked in the order assistive tech announces them, so a caller never has to place these three by hand.",
    category: "Text & Forms",
    glass:
      "Plain layout; the control inside carries its own surface. An error message is announced as an alert and tints the label destructive.",
    props: [
      { name: "label", type: "string", description: "The field's label, rendered through Label." },
      { name: "description", type: "string", description: "Helper text shown under the control." },
      { name: "error", type: "string", description: "Error text. Overrides description and tints the label." },
      { name: "required", type: "boolean", default: "false", description: "Marks the label required." },
      { name: "disabled", type: "boolean", default: "false", description: "Dims the label and reports the disabled state." },
      { name: "isDark", type: "boolean", description: "Dark-mode override." },
      { name: "children", type: "ReactNode", description: "The control itself." },
      { name: "style", type: "StyleProp<ViewStyle>", description: "Standard React Native style." },
    ],
    codeSnippet: `import { Field, Input } from "glacia-native";

<Field label="Email" description="We never share it." required>
  <Input placeholder="Email address" keyboardType="email-address" />
</Field>`,
  },
];

export const nativeComponentCount = NATIVE_COMPONENTS.length;
export const webComponentCount = COMPONENTS_DATA.length;
