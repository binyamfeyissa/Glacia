// Tab 5 — Adaptive: glass over light and dark bands.
//
// The engine's luminance system is what should keep a label readable as the
// backdrop changes under it. If a surface's text goes unreadable on one band,
// that is the regression this tab exists to catch.

import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Card, Chip, Glass, Switch } from "glacia-native";

import { ComponentProbe } from "../ErrorBoundary";
import { Caption, Section } from "../ui";

const BANDS = [
  { label: "Pure black", color: "#000000", dark: true },
  { label: "Deep navy", color: "#0B1F3A", dark: true },
  { label: "Signal red", color: "#C81E3A", dark: true },
  { label: "Paper white", color: "#FFFFFF", dark: false },
  { label: "Warm sand", color: "#F2E3C6", dark: false },
  { label: "Sky", color: "#8FD3FF", dark: false },
];

export function AdaptiveScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Section
        title="Luminance bands"
        note="Each card sits half on one band and half on the next."
      >
        {BANDS.map((band) => (
          <ComponentProbe key={band.label} name={`Adaptive card over ${band.label}`}>
            <View style={[styles.bandRow, { backgroundColor: band.color }]}>
              <View style={styles.bandText}>
                <Text style={[styles.bandLabel, { color: band.dark ? "#FFFFFF" : "#111827" }]}>
                  {band.label}
                </Text>
              </View>
              <Glass effect="regular" style={styles.bandCard}>
                <Text style={styles.cardTitle}>Readable label</Text>
                <Text style={styles.cardBody}>The surface should adapt to {band.label.toLowerCase()}.</Text>
                <View style={styles.cardRow}>
                  <Chip label="chip" onPress={() => {}} />
                  <Switch defaultValue={band.dark} accessibilityLabel={`Switch on ${band.label}`} />
                </View>
              </Glass>
            </View>
          </ComponentProbe>
        ))}
      </Section>

      <Section title="Half-and-half card" note="The hardest case: one surface over two luminances.">
        <View style={styles.split}>
          <View style={[styles.half, { backgroundColor: "#000000" }]} />
          <View style={[styles.half, { backgroundColor: "#FFFFFF" }]} />
          <Card style={styles.splitCard} padding={16}>
            <Text style={styles.cardTitle}>Spanning the seam</Text>
            <Text style={styles.cardBody}>If the text is unreadable on one half, the sensor is not adapting.</Text>
          </Card>
        </View>
      </Section>

      <Section title="Clear over dark" note="Clear glass has no frost to save legibility; it must refract.">
        <View style={styles.darkBox}>
          <Glass effect="clear" style={styles.clearPanel}>
            <Text style={styles.onDark}>Clear glass on black</Text>
          </Glass>
        </View>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 150 },
  bandRow: {
    height: 128,
    borderRadius: 20,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    justifyContent: "space-between",
  },
  bandText: { flex: 1 },
  bandLabel: { fontSize: 13, fontWeight: "700" },
  bandCard: { width: "62%", padding: 12 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  cardBody: { fontSize: 11, color: "#374151", marginTop: 2 },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  split: { height: 200, borderRadius: 20, overflow: "hidden", justifyContent: "center" },
  half: { ...StyleSheet.absoluteFillObject, width: "50%" },
  splitCard: { marginHorizontal: 24 },
  darkBox: {
    height: 160,
    borderRadius: 20,
    backgroundColor: "#000000",
    justifyContent: "center",
    padding: 20,
  },
  clearPanel: { padding: 18 },
  onDark: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
});
