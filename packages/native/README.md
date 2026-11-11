# Glacia Native (`glacia-native`)

> **Apple's Liquid Glass UI components for React Native & Expo.**  
> Real iOS 26 `UIGlassEffect` with authentic fallback on Android and older iOS.

[![npm version](https://img.shields.io/npm/v/glacia-native.svg)](https://www.npmjs.com/package/glacia-native)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/binyamfeyissa/Glacia/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/Docs-glacia.binyamfeyissa.dev-teal.svg)](https://glacia.binyamfeyissa.dev)
[![GitHub](https://img.shields.io/badge/GitHub-binyamfeyissa%2FGlacia-black.svg)](https://github.com/binyamfeyissa/Glacia)

---

## Overview

**`glacia-native`** brings the physical material of Apple's iOS 26 Liquid Glass to React Native applications:

- **Native iOS 26 Material:** Uses `@callstack/liquid-glass` to render Apple's authentic native `UIGlassEffect` on supported devices.
- **Graceful Fallback Ladder:** On older iOS versions and Android, falls back to a tuned visual hierarchy with frosted translucency, matching layout geometry, and zero runtime crashes.
- **Physical Spring Animations:** Native spring interactions for presses, toggles, slider scrubbing, and tab transitions.
- **Human Interface Guidelines (HIG):** Designed to match Apple's native tactile controls, radii, and typography scales.

---

## Installation

Install `glacia-native` and its peer dependencies:

```bash
npm install glacia-native glacia-tokens @callstack/liquid-glass
# or
pnpm add glacia-native glacia-tokens @callstack/liquid-glass
# or
yarn add glacia-native glacia-tokens @callstack/liquid-glass
# or
bun add glacia-native glacia-tokens @callstack/liquid-glass
```

### Expo Projects

If using Expo, ensure you are running in Expo Prebuild / Development Build (`npx expo run:ios` or `npx expo run:android`) to support the native iOS glass module.

---

## Quickstart

```tsx
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Glass, Button, Switch, Slider, SegmentedControl, Card } from "glacia-native";

export function App() {
  const [active, setActive] = useState(true);
  const [sliderVal, setSliderVal] = useState(65);
  const [segment, setSegment] = useState("overview");

  return (
    <View style={styles.container}>
      {/* Liquid Glass Card */}
      <Glass effect="regular" style={styles.glassCard}>
        <Text style={styles.title}>Apple Account</Text>
        <Text style={styles.subtitle}>Liquid Glass React Native</Text>

        <SegmentedControl
          segments={["Overview", "Optics", "Security"]}
          selectedIndex={["Overview", "Optics", "Security"].indexOf(segment)}
          onChange={(index) => setSegment(["Overview", "Optics", "Security"][index])}
          style={styles.segmented}
        />

        <View style={styles.row}>
          <Text style={styles.label}>Passkey Authentication</Text>
          <Switch value={active} onValueChange={setActive} />
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.label}>Transmission: {sliderVal}%</Text>
          <Slider value={sliderVal} onValueChange={setSliderVal} minimumValue={0} maximumValue={100} />
        </View>

        <Button variant="glass" onPress={() => console.log("Pressed!")}>
          Save Changes
        </Button>
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1d",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  glassCard: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 16,
  },
  segmented: {
    marginVertical: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  sliderContainer: {
    marginVertical: 12,
  },
  label: {
    color: "#ffffff",
    fontSize: 14,
    marginBottom: 8,
  },
});
```

---

## Component Catalog

| Component | Description |
| :--- | :--- |
| **`<Glass />`** | Core material view rendering native `UIGlassEffect` on iOS 26 and calibrated fallback on other platforms. |
| **`<Button />`** | Interactive button with `filled`, `glass`, and `ghost` variants with haptic and spring feedback. |
| **`<Card />`** | Liquid glass content container with `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, and `CardFooter`. |
| **`<SegmentedControl />`** | Apple-style segmented picker with animated sliding thumb indicator. |
| **`<Switch />`** | Physical toggle switch with specular lighting and smooth spring state transitions. |
| **`<Slider />`** | Continuous slider control with custom track lighting and glass thumb. |
| **`<TabBar />`** | Bottom navigation bar floating with real optical material. |
| **`<Tabs />`** | Tab switching layout with animated glass selector indicator. |

---

## Optical Diagnostics

You can check whether the running device supports Apple's native `UIGlassEffect` at runtime:

```tsx
import { isGlassSupported } from "glacia-native";

if (isGlassSupported()) {
  console.log("Hardware-accelerated iOS 26 UIGlassEffect active!");
} else {
  console.log("Using calibrated cross-platform fallback.");
}
```

---

## Ecosystem

- **[`glacia`](https://www.npmjs.com/package/glacia)**: Core React web component library with CLI support.
- **[`glacia-tokens`](https://www.npmjs.com/package/glacia-tokens)**: Shared cross-platform design tokens and optical formulas.
- **`glacia-native`**: Liquid Glass for React Native & Expo with iOS 26 `UIGlassEffect`.

---

## Links

- **Documentation**: [https://glacia.binyamfeyissa.dev/](https://glacia.binyamfeyissa.dev/)
- **GitHub**: [https://github.com/binyamfeyissa/Glacia](https://github.com/binyamfeyissa/Glacia)
- **License**: MIT
