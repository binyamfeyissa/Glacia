// Expo proof app: mounts every one of glacia-native's 49 components.
//
// The point is not a pretty screen — it is that each component can be mounted
// by a real app bundler (Metro, for Android and iOS) and by react-native-web,
// with React Native's primitives actually present. A component that reached
// for a DOM element would fail here, which is exactly the audit's finding.
//
// The components are grouped in the review's numbering so a reviewer can
// compare this list against the report's platform table row by row.

import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

import {
  // Core (1-8)
  Glass,
  Button,
  Switch,
  Slider,
  SegmentedControl,
  TabBar,
  Tabs,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardBody,
  CardFooter,
  // Forms (9-15)
  Input,
  Textarea,
  Label,
  Field,
  Checkbox,
  RadioGroup,
  Select,
  // Overlays (16-18)
  Dialog,
  DialogTrigger,
  AlertDialog,
  ActionSheet,
  // Data (19-20)
  NativeTable,
  NativeScrollArea,
  // AI (21-29)
  NativeAIInput,
  NativeImageGeneration,
  NativePanelside,
  NativePlan,
  NativeResponse,
  NativeSoundwave,
  NativeSources,
  NativeTask,
  NativeThinkingOrb,
  // Charts (30-49)
  NativeAreaChart,
  NativeBarChart,
  NativeBubbleChart,
  NativeBumpChart,
  NativeCandlestickChart,
  NativeFunnelChart,
  NativeHeatmapChart,
  NativeHexChart,
  NativeLineChart,
  NativeLiveLineChart,
  NativeMirrorAreaChart,
  NativePlotChart,
  NativePolarAreaChart,
  NativePyramidChart,
  NativeRadarChart,
  NativeRingChart,
  NativeSankeyChart,
  NativeScatterChart,
  NativeTreemapChart,
  NativeWaterfallChart,
  // Diagnostics
  isGlassSupported,
} from "glacia-native";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 22 }}>
      <Text style={{ fontSize: 12, fontWeight: "700", marginBottom: 8 }}>{title}</Text>
      <View style={{ gap: 12 }}>{children}</View>
    </View>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [on, setOn] = useState(false);
  const [volume, setVolume] = useState(40);
  const [segment, setSegment] = useState(0);
  const [rail, setRail] = useState("a");
  const [text, setText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 60, gap: 4 }}
    >
      <StatusBar style="auto" />
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 4 }}>Glacia Native proof</Text>
      <Text style={{ fontSize: 12, marginBottom: 20 }}>
        Glass: {isGlassSupported ? "Apple Liquid Glass (iOS 26+)" : "Glacia fallback (this platform)"}
      </Text>

      <Section title="1-8 · core">
        <Glass style={{ padding: 16, borderRadius: 14 }}>
          <Text>Glass</Text>
        </Glass>
        <Button accessibilityLabel="Button" onPress={() => {}}>
          Button
        </Button>
        <Switch accessibilityLabel="Switch" checked={on} onCheckedChange={setOn} />
        <Slider accessibilityLabel="Slider" value={volume} onValueChange={setVolume} />
        <SegmentedControl
          values={["Day", "Week", "Month"]}
          selectedIndex={segment}
          onValueChange={(_value: string, index: number) => setSegment(index)}
        />
        <TabBar
          items={[
            { id: "home", label: "Home" },
            { id: "search", label: "Search" },
            { id: "profile", label: "Profile" },
          ]}
          activeId={tab}
          onTabChange={setTab}
        />
        <Tabs
          items={[
            { id: "a", label: "Components" },
            { id: "b", label: "Blocks" },
          ]}
          activeId={rail}
          onTabChange={setRail}
        />
        <Card>
          <CardHeader>
            <CardTitle>Card</CardTitle>
            <CardDescription>With every slot</CardDescription>
          </CardHeader>
          <CardContent>
            <CardBody>
              <Text>CardBody</Text>
            </CardBody>
          </CardContent>
          <CardFooter>
            <Button accessibilityLabel="Footer action" variant="ghost" onPress={() => {}}>
              Footer
            </Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="9-15 · forms">
        <Input placeholder="Input" value={text} onChangeText={setText} />
        <Textarea placeholder="Textarea" />
        <Label nativeID="proof-label">Label</Label>
        <Field label="Field" description="With a description">
          <Input placeholder="Inside a field" />
        </Field>
        <Checkbox label="Checkbox" />
        <RadioGroup
          options={[
            { value: "sm", label: "Small" },
            { value: "lg", label: "Large" },
          ]}
        />
        <Select
          options={[
            { value: "a", label: "Alpha" },
            { value: "b", label: "Beta" },
          ]}
        />
      </Section>

      <Section title="16-18 · overlays">
        <Button accessibilityLabel="Open dialog" onPress={() => setDialogOpen(true)}>
          Dialog
        </Button>
        <DialogTrigger label="DialogTrigger" title="DialogTrigger" description="Opened by a button." />
        <Button accessibilityLabel="Open alert" onPress={() => setAlertOpen(true)}>
          AlertDialog
        </Button>
        <Button accessibilityLabel="Open sheet" onPress={() => setSheetOpen(true)}>
          ActionSheet
        </Button>
      </Section>

      <Section title="19-20 · data">
        <NativeTable
          caption="A caption"
          columns={[
            { key: "name", header: "Name" },
            { key: "role", header: "Role" },
          ]}
          rows={[
            { id: "1", cells: { name: "Ada", role: "Engineer" } },
            { id: "2", cells: { name: "Grace", role: "Admiral" } },
          ]}
        />
        <NativeScrollArea maxHeight={120} bordered accessibilityLabel="Scroll area">
          <Text>NativeScrollArea</Text>
          <Text>with content</Text>
        </NativeScrollArea>
      </Section>

      <Section title="21-29 · AI">
        <NativeAIInput placeholder="NativeAIInput" />
        <NativeImageGeneration status="generating" prompt="NativeImageGeneration" />
        <NativePanelside
          title="NativePanelside"
          items={[
            { id: "c", label: "Chats", count: 2 },
            { id: "p", label: "Prompts", count: 1 },
          ]}
        />
        <NativePlan
          steps={[
            { id: "1", title: "NativePlan", status: "done" },
            { id: "2", title: "step two", status: "running" },
          ]}
        />
        <NativeResponse text="NativeResponse" />
        <NativeSoundwave label="NativeSoundwave" />
        <NativeSources sources={[{ id: "a", title: "NativeSources", url: "https://example.com" }]} />
        <NativeTask task={{ progress: 0.4, label: "NativeTask" }} />
        <NativeThinkingOrb />
      </Section>

      <Section title="30-49 · charts">
        <NativeAreaChart labels={["a", "b"]} series={[{ name: "s", values: [1, 2] }]} />
        <NativeBarChart labels={["a", "b"]} series={[{ name: "s", values: [1, 2] }]} />
        <NativeBubbleChart series={[{ name: "s", points: [{ x: 1, y: 2, size: 3 }] }]} />
        <NativeBumpChart labels={["a"]} series={[{ name: "s", ranks: [1] }]} />
        <NativeCandlestickChart candles={[{ label: "a", open: 1, high: 3, low: 0, close: 2 }]} />
        <NativeFunnelChart stages={[{ label: "a", value: 10 }]} />
        <NativeHeatmapChart rows={[{ label: "a", values: [1] }]} columns={["x"]} />
        <NativeHexChart points={[{ x: 1, y: 1, value: 1 }]} />
        <NativeLineChart labels={["a", "b"]} series={[{ name: "s", values: [1, 2] }]} />
        <NativeLiveLineChart labels={["a"]} series={[{ name: "s", values: [1] }]} />
        <NativeMirrorAreaChart labels={["a"]} series={{ name: "s", above: [1], below: [2] }} />
        <NativePlotChart points={[{ x: 1, y: 1 }]} />
        <NativePolarAreaChart segments={[{ label: "a", value: 1 }]} />
        <NativePyramidChart levels={[{ label: "a", value: 1 }]} />
        <NativeRadarChart
          axes={["a", "b", "c"]}
          series={[{ name: "s", values: [1, 2, 3] }]}
        />
        <NativeRingChart data={[{ label: "a", value: 1 }]} />
        <NativeSankeyChart
          nodes={[
            { id: "a", label: "A" },
            { id: "b", label: "B" },
          ]}
          links={[{ from: "a", to: "b", value: 1 }]}
        />
        <NativeScatterChart series={[{ name: "s", points: [{ x: 1, y: 2 }] }]} />
        <NativeTreemapChart items={[{ label: "a", value: 1 }]} />
        <NativeWaterfallChart steps={[{ label: "a", value: 1 }]} />
      </Section>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Dialog"
        description="A glass panel."
      />
      <AlertDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        title="AlertDialog"
        onConfirm={() => {}}
      />
      <ActionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="ActionSheet"
        options={[{ label: "Share" }]}
      />
    </ScrollView>
  );
}
