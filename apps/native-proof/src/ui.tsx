// Shared chrome for the proof app's five tabs.
//
// Nothing here is library code: it is the background art and the labels the
// proof screens use, kept out of the screens so each tab reads as a checklist.

import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

export function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {note ? <Text style={styles.note}>{note}</Text> : null}
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <View style={styles.row}>{children}</View>;
}

export function Caption({ children }: { children: ReactNode }) {
  return <Text style={styles.caption}>{children}</Text>;
}

/** A label/value pair, used by the Status tab's renderer table. */
export function Verdict({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.verdict}>
      <Text style={styles.verdictLabel}>{label}</Text>
      <Text style={styles.verdictValue}>{value}</Text>
    </View>
  );
}

/**
 * The stripes the refraction tab samples: alternating high-contrast bands, which
 * is the fastest way to see whether a surface is actually bending the backdrop.
 */
export function StripeBackground() {
  const bands = ["#0A84FF", "#FFFFFF", "#FF375F", "#FFD60A", "#30D158", "#0A0A0A"];
  return (
    <View style={StyleSheet.absoluteFill}>
      {Array.from({ length: 24 }).map((_, index) => (
        <View
          key={index}
          style={{ flex: 1, backgroundColor: bands[index % bands.length] }}
        />
      ))}
    </View>
  );
}

/**
 * A "photo" drawn without an asset: a sky-to-sand gradient with a few bands, so
 * the proof app has no binary dependency and still shows colour under the glass.
 */
export function PhotoBand({ height = 220 }: { height?: number }) {
  const layers = ["#7FD1FF", "#B8E6FF", "#FFE2A8", "#F6C177", "#2E7D5B"];
  return (
    <View style={{ height, borderRadius: 24, overflow: "hidden" }}>
      {layers.map((color, index) => (
        <View key={color} style={{ flex: 1, backgroundColor: color }} />
      ))}
      <View style={styles.photoSun} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 28 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#6B7280",
    marginBottom: 6,
  },
  note: { fontSize: 12, color: "#8E8E93", marginBottom: 10 },
  sectionBody: { gap: 12 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  caption: { fontSize: 12, color: "#6B7280" },
  verdict: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(60,60,67,0.15)",
  },
  verdictLabel: { fontSize: 14, color: "#3C3C43" },
  verdictValue: { fontSize: 14, fontWeight: "600", color: "#111827" },
  photoSun: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFF6D8",
    top: 26,
    right: 34,
    opacity: 0.9,
  },
});
