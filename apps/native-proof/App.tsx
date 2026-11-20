// The proof app — five tabs, one per thing this rebuild must prove.
//
// Status    live renderer verdicts, never an endless "detecting"
// Refraction glass over stripes and a photo
// Controls  every Wave 1 control, interactive, failures labelled in-app
// Scroll    120 rows under pinned glass (the §6 strip-cache test bed)
// Adaptive  glass over light and dark bands
//
// Android topology: the screen content is the GlassProvider's one direct child
// and the tab bar is its sibling, never its descendant. On iOS the provider is a
// plain view and the whole-window backdrop is the default.

import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { GlassProvider, TabBar } from "glacia-native";

import { ComponentProbe } from "./src/ErrorBoundary";
import { AdaptiveScreen } from "./src/screens/AdaptiveScreen";
import { ControlsScreen } from "./src/screens/ControlsScreen";
import { RefractionScreen } from "./src/screens/RefractionScreen";
import { ScrollScreen } from "./src/screens/ScrollScreen";
import { StatusScreen } from "./src/screens/StatusScreen";

const TABS = [
  { id: "status", label: "Status" },
  { id: "refraction", label: "Refraction" },
  { id: "controls", label: "Controls" },
  { id: "scroll", label: "Scroll" },
  { id: "adaptive", label: "Adaptive" },
];

export default function App() {
  const [tab, setTab] = useState("status");

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="auto" />
      <View style={styles.root}>
        {/* One backdrop source for every glass surface on Android. */}
        <GlassProvider style={StyleSheet.absoluteFill}>
          <View style={styles.backdrop}>
            <ComponentProbe name={`Screen: ${tab}`}>
              {tab === "status" ? <StatusScreen /> : null}
              {tab === "refraction" ? <RefractionScreen /> : null}
              {tab === "controls" ? <ControlsScreen /> : null}
              {tab === "scroll" ? <ScrollScreen /> : null}
              {tab === "adaptive" ? <AdaptiveScreen /> : null}
            </ComponentProbe>
          </View>
        </GlassProvider>

        {/* Sibling glass: the bar floats above every screen, above the inset. */}
        <View pointerEvents="box-none" style={styles.barLayer}>
          <TabBar items={TABS} activeId={tab} onTabChange={setTab} testID="proof-tab-bar" />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F2F2F7" },
  backdrop: { flex: 1 },
  barLayer: { position: "absolute", left: 0, right: 0, bottom: 0 },
});
