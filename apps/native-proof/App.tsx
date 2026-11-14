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
  // Basics (50-56)
  Text as GlaciaText,
  Avatar,
  Badge,
  Separator,
  Skeleton,
  Spinner,
  Progress,
  // Feedback and display (57-59, 65)
  Toast,
  Banner,
  List,
  ListItem,
  ListSection,
  Accordion,
  // Bars, buttons and navigation (60-64, 66-68)
  SearchBar,
  Chip,
  FAB,
  IconButton,
  AppBar,
  Menu,
  Sheet,
  Drawer,
  // Carousel (70-71)
  Carousel,
  PageControl,
  // Forms and pickers (69, 72-78)
  Stepper,
  Toggle,
  ToggleGroup,
  InputOTP,
  ButtonGroup,
  Calendar,
  DatePicker,
  TimePicker,
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
  const [generalSheetOpen, setGeneralSheetOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(true);
  const [guestCount, setGuestCount] = useState(2);
  const [otp, setOtp] = useState("");
  const [page, setPage] = useState(0);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [date, setDate] = useState(new Date(2025, 0, 15));
  const [time, setTime] = useState("09:30");

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


      {/* ------------------------------------------------------------------
          The glass proof.
          Glass that is never seen over content has not been shown to be
          glass. This section puts the same surfaces over a busy, colourful
          backdrop so the material is visible for what it is: on iOS 26 the
          real UIGlassEffect refracts this image; on other platforms Glacia's
          fallback sits over it with the identical shape.
          ------------------------------------------------------------------ */}
      <Section title="Glass over a busy backdrop (the material, visible)">
        <View
          style={{
            borderRadius: 16,
            overflow: "hidden",
            height: 260,
            justifyContent: "center",
            alignItems: "center",
            // A deliberately busy, high-contrast gradient built from Views:
            // no extra image asset, and it defeats a plain white screen.
            backgroundColor: "#2E1065",
          }}
        >
          <View style={{ position: "absolute", top: -40, left: -20, width: 220, height: 220, borderRadius: 110, backgroundColor: "#F0ABFC", opacity: 0.9 }} />
          <View style={{ position: "absolute", bottom: -60, right: -30, width: 240, height: 240, borderRadius: 120, backgroundColor: "#22D3EE", opacity: 0.9 }} />
          <View style={{ position: "absolute", top: 60, right: 40, width: 150, height: 150, borderRadius: 75, backgroundColor: "#FBBF24", opacity: 0.85 }} />
          <View style={{ position: "absolute", bottom: 20, left: 30, width: 160, height: 160, borderRadius: 80, backgroundColor: "#F43F5E", opacity: 0.8 }} />

          <Glass style={{ padding: 16, borderRadius: 14, marginBottom: 12, width: 240 }}>
            <GlaciaText variant="heading">Glass panel</GlaciaText>
            <GlaciaText variant="caption" muted>
              Over colour, not white.
            </GlaciaText>
          </Glass>

          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <FAB accessibilityLabel="Compose over colour" onPress={() => {}} />
            <Glass effect="clear" style={{ paddingHorizontal: 14, paddingVertical: 10, borderRadius: 9999 }}>
              <GlaciaText variant="label">clear</GlaciaText>
            </Glass>
            <Button accessibilityLabel="Glass button over colour" onPress={() => {}}>
              Glass
            </Button>
          </View>
        </View>
      </Section>

      <Section title="50-56 · basics">
        <GlaciaText variant="title">Title</GlaciaText>
        <GlaciaText variant="heading">Heading</GlaciaText>
        <GlaciaText variant="body">Body text, the default.</GlaciaText>
        <GlaciaText variant="label">Label</GlaciaText>
        <GlaciaText variant="caption" muted>
          Caption, muted.
        </GlaciaText>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <Avatar name="Ada Lovelace" status="online" />
          <Avatar name="Grace Hopper" size="lg" status="busy" />
          <Badge>3</Badge>
          <Badge tone="destructive">9+</Badge>
          <Badge tone="success" />
        </View>
        <Separator />
        <Separator orientation="vertical" style={{ height: 24 }} />
        <Skeleton />
        <Skeleton shape="circle" height={40} width={40} />
        <Skeleton shape="line" />
        <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
          <Spinner size="sm" />
          <Spinner />
          <Spinner size="lg" />
        </View>
        <Progress value={64} />
        <Progress variant="ring" value={40} />
      </Section>

      <Section title="57-59, 65 · feedback and display">
        <Toast
          visible={toastVisible}
          message="Presets synced"
          action={{ label: "Undo", onPress: () => setToastVisible(false) }}
          onDismiss={() => setToastVisible(false)}
        />
        {bannerVisible && (
          <Banner
            title="Banner"
            message="An inline alert that lives in the layout."
            tone="warning"
            onDismiss={() => setBannerVisible(false)}
            action={{ label: "Retry", onPress: () => {} }}
          />
        )}
        <ListSection header="A List section">
          <ListItem leading={<Avatar name="Ada Lovelace" size="sm" />} title="Account" description="Ada Lovelace" onPress={() => {}} />
          <ListItem title="Notifications" trailing={<GlaciaText variant="caption" muted>On</GlaciaText>} onPress={() => {}} />
          <ListItem title="Version" trailing={<GlaciaText variant="caption" muted>0.4.0</GlaciaText>} />
        </ListSection>
        <Accordion
          sections={[
            { value: "a", title: "Accordion section", description: "with a description", content: <GlaciaText>Expanded content.</GlaciaText> },
            { value: "b", title: "Another section", content: <GlaciaText>More content.</GlaciaText> },
          ]}
        />
      </Section>

      <Section title="60-64 · bars, buttons and navigation">
        <SearchBar placeholder="SearchBar" />
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Chip label="Chip" />
          <Chip label="Selected" selected />
          <Chip label="Closable" onClose={() => {}} />
        </View>
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <FAB accessibilityLabel="FAB" onPress={() => {}} />
          <FAB accessibilityLabel="Extended FAB" label="Extended" onPress={() => {}} />
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <IconButton accessibilityLabel="IconButton sm" size="sm" onPress={() => {}} icon={<GlaciaText variant="caption">*</GlaciaText>} />
          <IconButton accessibilityLabel="IconButton md" onPress={() => {}} icon={<GlaciaText variant="caption">*</GlaciaText>} />
          <IconButton accessibilityLabel="IconButton lg" size="lg" onPress={() => {}} icon={<GlaciaText variant="caption">*</GlaciaText>} />
        </View>
        <AppBar
          title="AppBar"
          subtitle="with a subtitle"
          leading={{ accessibilityLabel: "Back", icon: <GlaciaText>{"\u2039"}</GlaciaText>, onPress: () => {} }}
          actions={[{ accessibilityLabel: "Settings", icon: <GlaciaText>*</GlaciaText>, onPress: () => {} }]}
          topInset={0}
        />
      </Section>

      <Section title="66-68 · overlays">
        <Menu
          accessibilityLabel="Open menu"
          trigger={<Button accessibilityLabel="Menu trigger">Menu</Button>}
          items={[
            { label: "Rename", onPress: () => {} },
            { label: "Duplicate", onPress: () => {} },
            { label: "Delete", onPress: () => {}, destructive: true },
          ]}
        />
        <Button accessibilityLabel="Open Sheet" onPress={() => setGeneralSheetOpen(true)}>
          Sheet
        </Button>
        <Button accessibilityLabel="Open Drawer" onPress={() => setDrawerOpen(true)}>
          Drawer
        </Button>
      </Section>

      <Section title="70-71 · carousel">
        <Carousel
          slides={[
            <Glass key="1" style={{ height: 120, borderRadius: 14, alignItems: "center", justifyContent: "center" }}>
              <GlaciaText variant="heading">Slide one</GlaciaText>
            </Glass>,
            <Glass key="2" style={{ height: 120, borderRadius: 14, alignItems: "center", justifyContent: "center" }}>
              <GlaciaText variant="heading">Slide two</GlaciaText>
            </Glass>,
            <Glass key="3" style={{ height: 120, borderRadius: 14, alignItems: "center", justifyContent: "center" }}>
              <GlaciaText variant="heading">Slide three</GlaciaText>
            </Glass>,
          ]}
          index={page}
          onIndexChange={setPage}
        />
        <PageControl count={3} activeIndex={page} onChange={setPage} />
      </Section>

      <Section title="69, 72-78 · forms and pickers">
        <Stepper accessibilityLabel="Guests" value={guestCount} onValueChange={setGuestCount} min={0} max={10} />
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Toggle accessibilityLabel="Toggle">Toggle</Toggle>
          <Toggle accessibilityLabel="Pinned" defaultPressed>
            Pinned
          </Toggle>
        </View>
        <ToggleGroup
          items={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
          defaultValue="day"
        />
        <InputOTP length={6} value={otp} onChange={setOtp} />
        <ButtonGroup
          items={[
            { label: "Copy", onPress: () => {} },
            { label: "Move", onPress: () => {} },
            { label: "Delete", onPress: () => {} },
          ]}
        />
        <Glass style={{ padding: 12, borderRadius: 14 }}>
          <Calendar value={date} onChange={setDate} />
        </Glass>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
          <Button accessibilityLabel="Open DatePicker" onPress={() => setDatePickerOpen(true)}>
            DatePicker
          </Button>
          <Button accessibilityLabel="Open TimePicker" onPress={() => setTimePickerOpen(true)}>
            TimePicker
          </Button>
          <GlaciaText variant="caption" muted>
            {`picked: ${date.toDateString()} at ${time}`}
          </GlaciaText>
        </View>
      </Section>

      <Sheet
        open={generalSheetOpen}
        onOpenChange={setGeneralSheetOpen}
        title="Sheet"
        footer={<Button accessibilityLabel="Close Sheet" onPress={() => setGeneralSheetOpen(false)}>Close</Button>}
      >
        <GlaciaText>The general-purpose bottom sheet.</GlaciaText>
      </Sheet>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <List>
          <ListItem title="Drawer" onPress={() => setDrawerOpen(false)} />
          <ListItem title="Second row" onPress={() => setDrawerOpen(false)} />
        </List>
      </Drawer>

      <DatePicker
        open={datePickerOpen}
        onOpenChange={setDatePickerOpen}
        value={date}
        onConfirm={setDate}
      />

      <TimePicker
        open={timePickerOpen}
        onOpenChange={setTimePickerOpen}
        value={time}
        onConfirm={setTime}
      />

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
