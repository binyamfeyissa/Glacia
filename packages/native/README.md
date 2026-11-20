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

- **Native iOS 26 Material:** Uses the vendored glass engine (`expo-liquid-glass-ui`) to render Apple's authentic native `UIGlassEffect` on supported devices, the engine's Metal renderer on iOS 16.4–25 and its AGSL renderer on Android 13+.
- **Graceful Fallback Ladder:** On older iOS versions and Android, falls back to a tuned visual hierarchy with frosted translucency, matching layout geometry, and zero runtime crashes.
- **Physical Spring Animations:** Native spring interactions for presses, toggles, slider scrubbing, and tab transitions.
- **Human Interface Guidelines (HIG):** Designed to match Apple's native tactile controls, radii, and typography scales.

---

## Installation

Install `glacia-native` and its peer dependencies:

```bash
npm install glacia-native glacia-tokens react-native-reanimated react-native-gesture-handler
# or
pnpm add glacia-native glacia-tokens react-native-reanimated react-native-gesture-handler
```

The glass engine is vendored inside this package (see `NOTICE`); there is no
second glass dependency to install.

### Expo Projects

Use a development build (`npx expo run:ios` / `npx expo run:android`): the
renderers are native. **In Expo Go every component renders the fallback floor** —
the solid, fully designed surface described under
[The fallback material](#the-fallback-material). That is expected, not a bug.

Wrap the app root in `GestureHandlerRootView`, as the engine requires:

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* your app */}
    </GestureHandlerRootView>
  );
}
```

### The Android provider rule

On Android the backdrop is recorded by `GlassProvider`, so the glass views must
be its **siblings**, never its descendants — a glass view inside the provider it
reads would refract its own output. The provider takes **one direct child**: the
content whose pixels the glass samples. Put the page background inside it.

```tsx
<View style={{ flex: 1 }}>
  {/* One direct child: the content and its background. */}
  <GlassProvider style={StyleSheet.absoluteFill}>
    <ScrollView>{content}</ScrollView>
  </GlassProvider>

  {/* Glass views are siblings, drawn after the provider. */}
  <TabBar items={items} />
</View>
```

On iOS the provider is a plain view and the whole-window backdrop is the
default, so the same tree works unchanged there.

### Name clash

The vendored engine registers the native views `LiquidGlassView`,
`LiquidGlassContainer` and `LiquidGlassProvider`. An app that also installs
`expo-liquid-glass-view` (which registers the same names) will collide at
runtime. Use one or the other.

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
          <Slider value={sliderVal} onValueChange={setSliderVal} min={0} max={100} accessibilityLabel="Transmission" />
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

The package exports 49 components. Everything below is part of this rebuild; the old charts, AI
surfaces, forms, pickers, overlays and bar pieces are not — they survive in published 0.5.2 and in
git history.

**Surfaces** — the material and its containers

| Component | Description |
| :--- | :--- |
| **`<Glass />`** / **`<GlassView />`** | The one surface every component is built on. Routes to Apple's `UIGlassEffect` on iOS 26+, the Metal renderer below it, AGSL on Android 13+, and the fallback floor elsewhere. |
| **`<GlassContainer />`** | Groups several glass views so their optics agree. |
| **`<GlassProvider />`** | The Android backdrop provider. One direct child; glass views are its siblings. |
| **`<GlassStack />`** | Stacked glass layers with `GlassStack.Layer` markers. |
| **`<GlassBackdrop />`** | A bounded backdrop scope for iOS 16.4–25: glass inside it photographs scroll content in content coordinates, so a pane dragged over a list keeps refracting the right rows. A plain wrapper on every other tier, and a hint rather than a guarantee — sticky headers, parallax and nested scrollers fall back to fresh window captures. |

**Wave 1 — the engine's controls** (Apple geometry and behaviour)

`TabBar` · `Button` · `IconButton` · `Chip` · `Switch` · `Slider` · `Stepper` ·
`SegmentedControl` · `Input` · `Card` (with `CardHeader`, `CardTitle`,
`CardDescription`, `CardContent`, `CardBody`, `CardFooter`) · `Toolbar` ·
`Toast` · `Sheet` · `Group` · `MorphGroup` · `Scrim`

**Wave 2 — donor behaviour, Apple dress**

`Accordion` · `Alert` · `AlertDialog` · `Avatar` · `Badge` · `Checkbox` ·
`Collapsible` · `ContextMenu` · `Dialog` (with `DialogTrigger`) ·
`DropdownMenu` · `Label` · `Popover` · `Progress` · `RadioGroup` · `Select` ·
`Separator` · `Skeleton` · `Tabs` · `Text` · `Textarea` · `Toggle` ·
`ToggleGroup` · `Tooltip`

**Supporting components**

`ActionSheet` · `Field`

---

## The fallback material

On iOS 26+ every glass surface is Apple's `UIGlassEffect`. On iOS below 26, on
Android and in Expo Go, the fallback renders the same design in layers, so it
reads as glass rather than as a translucent rectangle:

1. **Backdrop blur** — a real native blur view, when one is installed:
   `expo-blur` (Expo apps) or `@react-native-community/blur` (bare React Native).
   Both are optional peer dependencies; without either, the surface degrades to
   tint + rim + edge + shadow instead of failing.
2. **Tint** — the `glass` token (or your `tintColor`, or 0.35 alpha for `clear`).
3. **Rim light** — a gradient stroke painted on the edge, brightest along the
   top, so rounded corners read as lit curves.
4. **Top highlight** — a soft white falloff just inside the top edge.
5. **Edge** — the 0.5px hairline in the `edge` token.
6. **Drop shadow** — the surface lifts off the page behind it.

`Glass` accepts two optional props for this branch: `surface` picks one of the
web's six lenses (`"panel"`, `"control"`, `"field"`, `"overlay"`, `"hint"`,
`"rail"`), and `pressed` fades the specular press glow in. Neither is forwarded
to Apple's view — on iOS 26 the real material replaces the whole stack.

Reduce Transparency is honoured exactly as before: the layered material is
replaced by one solid colour.

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
