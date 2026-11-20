// Tab 4 — Scroll: 120 rows scrolling under a pinned glass bar.
//
// This is the strip-cache test bed (§6): a list that never stops moving under a
// surface that must keep its refraction current — no snap on release, no stale
// backdrop through a fling.

import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Glass, Toolbar } from "glacia-native";

import { Caption, Section } from "../ui";

const ROWS = Array.from({ length: 120 }, (_, index) => ({
  id: index,
  title: `Row ${index + 1}`,
  tone: ["#0A84FF", "#FF375F", "#30D158", "#FFD60A", "#AF52DE"][index % 5],
}));

export function ScrollScreen() {
  const [offset, setOffset] = useState(0);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.content}
        onScroll={(event) => setOffset(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        overScrollMode="never"
        testID="scroll-tab-list"
      >
        <Section title="100+ rows" note="Scroll hard and watch the pinned glass keep up.">
          {ROWS.map((row) => (
            <View key={row.id} style={styles.row}>
              <View style={[styles.swatch, { backgroundColor: row.tone }]} />
              <Text style={styles.rowTitle}>{row.title}</Text>
              <Text style={styles.rowMeta}>{row.id % 7 === 0 ? "glass row" : "content"}</Text>
            </View>
          ))}
        </Section>
      </ScrollView>

      {/* Pinned glass: a sibling of the scroll view, never a child of it. */}
      <View pointerEvents="box-none" style={styles.pinned}>
        <Toolbar title={`Offset ${Math.round(offset)}`} testID="scroll-pinned-toolbar" />
        <Glass effect="regular" style={styles.pill}>
          <Text style={styles.pillText}>{Math.round(offset)} dp</Text>
        </Glass>
      </View>

      <View style={styles.footer}>
        <Caption>
          The pinned bar is a sibling of the list — the provider topology the engine requires on Android.
        </Caption>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 20, paddingTop: 110, paddingBottom: 60 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(60,60,67,0.15)",
  },
  swatch: { width: 22, height: 22, borderRadius: 7 },
  rowTitle: { flex: 1, fontSize: 15, color: "#111827" },
  rowMeta: { fontSize: 11, color: "#8E8E93" },
  pinned: { position: "absolute", top: 8, left: 12, right: 12, gap: 8 },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pillText: { fontSize: 12, fontWeight: "700", color: "#111827" },
  footer: { paddingHorizontal: 20, paddingBottom: 96 },
});
