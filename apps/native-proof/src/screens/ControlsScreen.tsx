// Tab 3 — Controls: all 16 Wave 1 controls plus the stack, interactive.
//
// Every control here holds real state — no static lookalikes — and each one is
// wrapped in a probe that keeps a failure visible, labelled by component name.

import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import {
  Button,
  Card,
  Chip,
  Glass,
  GlassContainer,
  GlassStack,
  Group,
  IconButton,
  Input,
  MorphGroup,
  Scrim,
  SegmentedControl,
  Sheet,
  Slider,
  Stepper,
  Switch,
  TabBar,
  Toast,
  Toolbar,
} from "glacia-native";

import { ComponentProbe } from "../ErrorBoundary";
import { Caption, Row, Section } from "../ui";

function Probe({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <ComponentProbe name={name}>
      <View style={styles.probe}>{children}</View>
    </ComponentProbe>
  );
}

export function ControlsScreen() {
  const [switchOn, setSwitchOn] = useState(true);
  const [volume, setVolume] = useState(64);
  const [guests, setGuests] = useState(2);
  const [segment, setSegment] = useState(0);
  const [text, setText] = useState("glacia");
  const [pressed, setPressed] = useState(0);
  const [pressedCard, setPressedCard] = useState(0);
  const [selectedChip, setSelectedChip] = useState("sea");
  const [toastOpen, setToastOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tab, setTab] = useState("probes");

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Section title="Finger path" note="Every control below holds real state.">
        <Probe name="Button">
          <Row>
            <Button size="sm" accessibilityLabel="Small" onPress={() => setPressed((n) => n + 1)}>
              Small
            </Button>
            <Button accessibilityLabel="Medium" variant="filled" onPress={() => setPressed((n) => n + 1)}>
              +1
            </Button>
            <Button accessibilityLabel="Large" size="lg" variant="ghost" onPress={() => setPressed((n) => n + 1)}>
              Large
            </Button>
          </Row>
          <Caption>Pressed {pressed} ×</Caption>
        </Probe>

        <Probe name="IconButton">
          <Row>
            <IconButton accessibilityLabel="Plus" icon={null} onPress={() => setPressed((n) => n + 1)} />
            <IconButton accessibilityLabel="Disabled" icon={null} disabled />
          </Row>
        </Probe>

        <Probe name="Chip">
          <Row>
            {["sea", "land", "sky"].map((c) => (
              <Chip
                key={c}
                label={c}
                selected={selectedChip === c}
                onPress={() => setSelectedChip(c)}
              />
            ))}
          </Row>
        </Probe>

        <Probe name="Switch">
          <Row>
            <Text style={styles.label}>Airplane</Text>
            <Switch value={switchOn} onValueChange={setSwitchOn} accessibilityLabel="Airplane" />
          </Row>
        </Probe>

        <Probe name="Slider">
          <Slider accessibilityLabel="Volume" value={volume} onValueChange={setVolume} style={styles.slider} />
          <Caption>Volume: {Math.round(volume)}</Caption>
        </Probe>

        <Probe name="Stepper">
          <Stepper
            accessibilityLabel="Guests"
            value={guests}
            min={1}
            max={6}
            onValueChange={(next) => setGuests(Math.round(next))}
          />
          <Caption>{guests} guest{guests === 1 ? "" : "s"}</Caption>
        </Probe>

        <Probe name="SegmentedControl">
          <SegmentedControl
            segments={["Segments", "Split", "Segues"]}
            selectedIndex={segment}
            onChange={setSegment}
          />
        </Probe>

        <Probe name="Input">
          <Input value={text} onChangeText={setText} placeholder="Label" accessibilityLabel="Label" />
          <Caption>“{text}”</Caption>
        </Probe>

        <Probe name="Card">
          <Card onPress={() => setPressedCard((n) => n + 1)}>
            <Text style={styles.cardTitle}>Pressable card</Text>
            <Text style={styles.cardBody}>Pressed {pressedCard} ×</Text>
          </Card>
        </Probe>

        <Probe name="Toolbar">
          <Toolbar
            title="Sound settings"
            leading={<IconButton accessibilityLabel="Back" icon={null} />}
            trailing={<Button accessibilityLabel="Save" variant="filled" size="sm" onPress={() => {}}>Save</Button>}
          />
        </Probe>

        <Probe name="Toast">
          <Row>
            <Button accessibilityLabel="Show toast" onPress={() => setToastOpen(true)}>
              Show toast
            </Button>
          </Row>
        </Probe>

        <Probe name="Sheet">
          <Button accessibilityLabel="Open sheet" variant="ghost" onPress={() => setSheetOpen(true)}>
            Open sheet
          </Button>
        </Probe>

        <Probe name="Group">
          <Group>
            <Chip label="one" onPress={() => {}} />
            <Chip label="two" onPress={() => {}} />
            <Chip label="three" onPress={() => {}} />
          </Group>
          <Caption>Neighbouring controls merge into one surface while pressed.</Caption>
        </Probe>

        <Probe name="MorphGroup">
          <MorphGroup
            items={[
              { key: "one", label: "One" },
              { key: "two", label: "Two" },
              { key: "three", label: "Three" },
            ]}
          />
        </Probe>

        <Probe name="Scrim">
          <View style={styles.scrimBox}>
            <Scrim edge="bottom" size={64} radius={12}>
              <Text style={styles.scrimText}>Scroll-edge scrim</Text>
            </Scrim>
          </View>
        </Probe>

        <Probe name="TabBar">
          <TabBar
            items={[
              { id: "probes", label: "Probes" },
              { id: "stack", label: "Stack" },
              { id: "floor", label: "Floor" },
            ]}
            activeId={tab}
            onTabChange={setTab}
            bottomInset={0}
          />
        </Probe>

        {/* GlassStack — the §7.2 repro: three labelled layers on the same box. */}
        <Probe name="GlassStack">
          <GlassStack testID="wave1-stack" style={styles.stackBox}>
            <GlassStack.Layer>
              <Glass effect="regular" style={[StyleSheet.absoluteFill, styles.stackBase]}>
                <Text style={styles.stackTitle}>Base Stack Layer Content</Text>
              </Glass>
            </GlassStack.Layer>
            <GlassStack.Layer>
              <View style={styles.stackMid} />
            </GlassStack.Layer>
            <GlassStack.Layer>
              <Text style={styles.stackTop}>Top layer, explicit z-order</Text>
            </GlassStack.Layer>
          </GlassStack>
          <Caption>
            The top text must sit above one surface, not smear duplicates of the base layer.
          </Caption>
        </Probe>
      </Section>

      <Toast visible={toastOpen} message="Toast over the controls" onDismiss={() => setToastOpen(false)} />

      <Sheet visible={sheetOpen} onDismiss={() => setSheetOpen(false)} testID="controls-sheet">
        <View style={styles.sheetBody}>
          <Text style={styles.cardTitle}>Sheet</Text>
          <Text style={styles.cardBody}>Dismiss by tapping the scrim or dragging down.</Text>
          <Button accessibilityLabel="Close sheet" onPress={() => setSheetOpen(false)}>
            Close
          </Button>
        </View>
      </Sheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 150, gap: 4 },
  probe: { paddingVertical: 10 },
  label: { fontSize: 14, color: "#111827", minWidth: 80 },
  slider: { alignSelf: "stretch" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#111827" },
  cardBody: { fontSize: 12, color: "#374151", marginTop: 2 },
  scrimBox: {
    height: 96,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(120,120,128,0.2)",
    position: "relative",
  },
  scrimText: {
    position: "absolute",
    bottom: 8,
    left: 12,
    fontSize: 11,
    color: "#111827",
  },
  stackBox: { height: 160, borderRadius: 20, overflow: "hidden" },
  stackBase: { padding: 14, justifyContent: "center" },
  stackTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  stackMid: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 48,
    backgroundColor: "rgba(0,136,255,0.25)",
  },
  sheetBody: { padding: 20, gap: 10 },
  stackTop: {
    position: "absolute",
    top: 12,
    right: 12,
    fontSize: 12,
    fontWeight: "700",
    color: "#111827",
  },
});