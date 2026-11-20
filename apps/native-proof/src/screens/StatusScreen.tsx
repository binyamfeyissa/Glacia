// Tab 1 — Status: the renderer verdict, live.
//
// The lab app sat on "DETECTING…" forever on Android 7. This tab is the fix's
// proof: the verdict is read once, it resolves, and when it says unsupported it
// says what renders instead (the fallback floor) rather than leaving a spinner.

import { useEffect, useState } from "react";
import { AccessibilityInfo, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import {
  ENGINE_CONTROL_NAMES,
  Glass,
  loadEngineControl,
  readCapabilities,
  supportsGlass,
  supportsNativeGlass,
} from "glacia-native";

import { Caption, Section, Verdict } from "../ui";

type VerdictState = "reading" | "supported" | "unsupported";

export function StatusScreen() {
  const [verdict, setVerdict] = useState<VerdictState>("reading");
  const [reduceTransparency, setReduceTransparency] = useState<boolean | null>(null);
  const [reduceMotion, setReduceMotion] = useState<boolean | null>(null);

  const capabilities = readCapabilities();
  const available = ENGINE_CONTROL_NAMES.filter((name) => loadEngineControl(name) != null);

  useEffect(() => {
    let alive = true;
    // The promise is the mount gate itself: it always resolves, so the screen
    // can never be stuck on a reading state.
    supportsGlass()
      .then((supported) => {
        if (alive) setVerdict(supported ? "supported" : "unsupported");
      })
      .catch(() => {
        if (alive) setVerdict("unsupported");
      });
    AccessibilityInfo?.isReduceTransparencyEnabled?.().then((value: boolean) => {
      if (alive) setReduceTransparency(value);
    });
    AccessibilityInfo?.isReduceMotionEnabled?.().then((value: boolean) => {
      if (alive) setReduceMotion(value);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Section title="Renderer verdict" note="Exactly one definite answer, on every device.">
        <View style={styles.card}>
          <Verdict label="Platform" value={`${Platform.OS} ${String(Platform.Version)}`} />
          <Verdict
            label="Glass renderer"
            value={
              verdict === "reading"
                ? "reading… (resolves)"
                : verdict === "supported"
                  ? "supported"
                  : "unsupported → fallback floor"
            }
          />
          <Verdict label="Native UIGlassEffect (iOS 26+)" value={supportsNativeGlass() ? "yes" : "no"} />
          <Verdict label="Tier reported by the switch" value={capabilities.native ? "native" : "engine / floor"} />
          <Verdict
            label="Reduce Transparency"
            value={reduceTransparency == null ? "unknown" : reduceTransparency ? "on → floor" : "off"}
          />
          <Verdict
            label="Reduce Motion"
            value={reduceMotion == null ? "unknown" : reduceMotion ? "on → no springs" : "off"}
          />
          <Verdict label="Snapshot (read at render)" value={capabilities.supported ? "supported" : "unsupported"} />
        </View>
        <Caption>
          Expo Go cannot load the native renderers: every component renders the fallback floor there, and
          the verdict above says so instead of failing.
        </Caption>
      </Section>

      <Section
        title="Engine controls"
        note={`${available.length} of ${ENGINE_CONTROL_NAMES.length} engine controls loaded in this build.`}
      >
        <View style={styles.card}>
          {ENGINE_CONTROL_NAMES.map((name) => (
            <Verdict key={name} label={name} value={loadEngineControl(name) ? "engine design" : "fallback floor"} />
          ))}
        </View>
      </Section>

      <Section title="A surface, on the floor" note="If this is solid rather than glassy, the floor is what you are seeing.">
        <Glass effect="regular" style={styles.sample}>
          <Text style={styles.sampleText}>Glass surface</Text>
        </Glass>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 120 },
  card: { backgroundColor: "rgba(255,255,255,0.7)", borderRadius: 16, paddingHorizontal: 14, paddingVertical: 4 },
  sample: { height: 96, alignItems: "center", justifyContent: "center" },
  sampleText: { fontSize: 14, fontWeight: "600", color: "#111827" },
});
