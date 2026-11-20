// Tab 2 — Refraction: glass over stripes and a photo.
//
// Stripes make a fake glass obvious: a surface that is not bending the backdrop
// shows flat colour bands through it, while a real renderer shows them displaced
// at the rim. The photo band proves colour and luminance handling.

import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Button, Card, Glass, IconButton, Sheet, Slider, Toolbar } from "glacia-native";

import { Caption, PhotoBand, Section, StripeBackground } from "../ui";

export function RefractionScreen() {
  const [radius, setRadius] = useState(28);
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.root}>
      <StripeBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Glass over stripes" note="Watch the bands bend at the capsule's rim.">
          <Glass effect="regular" style={[styles.panel, { borderRadius: radius }]}>
            <Text style={styles.panelTitle}>Regular glass</Text>
            <Text style={styles.panelBody}>A panel sampling the stripes behind it.</Text>
          </Glass>
          <Glass effect="clear" style={[styles.panel, { borderRadius: radius }]}>
            <Text style={styles.panelTitle}>Clear glass</Text>
          </Glass>
          <Slider
            accessibilityLabel="Corner radius"
            value={radius}
            min={4}
            max={44}
            onValueChange={setRadius}
          />
          <Caption>Corner radius: {Math.round(radius)}dp</Caption>
        </Section>

        <Section title="Glass over a photo" note="Colour, luminance and a bright spot for the highlight.">
          <View>
            <PhotoBand height={220} />
            <Glass effect="regular" style={styles.photoOverlay}>
              <Text style={styles.photoTitle}>Mountain glass</Text>
              <Text style={styles.photoBody}>The same panel, over colour.</Text>
            </Glass>
          </View>
        </Section>

        <Section title="Toolbar over the backdrop" note="A pinned bar merging its own controls.">
          <Toolbar
            title="Library"
            leading={<IconButton accessibilityLabel="Back" icon={null} />}
            trailing={<IconButton accessibilityLabel="Share" icon={null} />}
            testID="refraction-toolbar"
          />
        </Section>

        <Section title="Sheet" note="Drag/tap to dismiss; the scrim is the library's own.">
          <Button accessibilityLabel="Open sheet" onPress={() => setOpen(true)}>
            Open sheet
          </Button>
          <Card padding={18}>
            <Text style={styles.panelBody}>A card behind the sheet, so the sheet has glass to re-refract.</Text>
          </Card>
        </Section>
      </ScrollView>

      <Sheet visible={open} onDismiss={() => setOpen(false)} testID="refraction-sheet">
        <View style={styles.sheetBody}>
          <Text style={styles.panelTitle}>Sheet over the stripes</Text>
          <Text style={styles.panelBody}>Its backdrop is everything behind it, including the card.</Text>
          <Button accessibilityLabel="Close sheet" onPress={() => setOpen(false)}>
            Close
          </Button>
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { padding: 20, paddingBottom: 140 },
  panel: { padding: 18, overflow: "hidden" },
  panelTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
  panelBody: { fontSize: 13, color: "#374151", marginTop: 4 },
  photoOverlay: { position: "absolute", left: 16, right: 16, bottom: 16, padding: 16 },
  photoTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  photoBody: { fontSize: 12, color: "#374151", marginTop: 2 },
  sheetBody: { padding: 20, gap: 12 },
});
