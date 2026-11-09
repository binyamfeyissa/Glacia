# Glacia

> **Apple's Liquid Glass UI kit for React and React Native.**  
> Real optical refraction, specular highlights, and authentic depth from a single unified design system.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-100%20passing-brightgreen.svg)](BUILD_REPORT.md)
[![Web](https://img.shields.io/badge/Web-33%20components-teal.svg)](https://glacia.dev)
[![React Native](https://img.shields.io/badge/React%20Native-7%20components-indigo.svg)](https://glacia.dev)

---

## Disclaimer

**Not affiliated with Apple.** Liquid Glass is Apple's design material for iOS 26; Glacia is an independent, open-source implementation.

---

## Why Glacia?

Glacia brings Apple's iOS 26 Liquid Glass material to the modern web and mobile apps:

- **Real Optical Physics:** Not merely flat `backdrop-filter: blur(10px)` glassmorphism. Glacia simulates true optical refraction bending live background details behind floating elements.
- **Two-Layer Rendering Engine:** Layer 1 provides universal frosted glass across all browsers (including Safari and Firefox); Layer 2 adds real Chromium SVG refraction displacement gated safely behind `@supports`.
- **First-Class React Native:** On iOS 26+, Glacia renders Apple's real native `UIGlassEffect` via `@callstack/liquid-glass`. On older iOS versions and Android, a graceful fallback ladder renders an identical visual layout with zero runtime crashes or layout shifts.
- **Three Ways to Install:** Full npm package, native mobile package, or per-component CLI copy command.

---

## Three Ways to Install

### 1. Web NPM Package (`glacia`)
Install the comprehensive web package:

```bash
npm install glacia
# or
pnpm add glacia
# or
yarn add glacia
# or
bun add glacia
```

Quick start in React / Next.js:

```tsx
import { Glass, Button, Card, CardHeader, CardTitle, CardContent } from "glacia";
import "glacia/styles.css";

export default function App() {
  return (
    <div style={{ background: "url('/wallpaper.jpg') center/cover", minHeight: "100vh", padding: 48 }}>
      <Card style={{ maxWidth: 420 }}>
        <CardHeader>
          <CardTitle>Liquid Glass Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-80 mb-4">
            Notice how live background elements refract and bend beneath this surface.
          </p>
          <Button variant="filled">Interact</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 2. React Native NPM Package (`glacia-native`)
Install into your React Native or Expo project (Expo SDK 54+ development builds):

```bash
npx expo install glacia-native @callstack/liquid-glass
```

Quick start in React Native:

```tsx
import { StyleSheet, View, ImageBackground } from "react-native";
import { Glass, Button, Switch } from "glacia-native";

export default function App() {
  return (
    <ImageBackground source={require("./wallpaper.jpg")} style={styles.container}>
      <Glass style={styles.glassContainer}>
        <Button title="Apple Action" onPress={() => console.log("Pressed")} />
        <Switch value={true} onValueChange={(val) => console.log(val)} />
      </Glass>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  glassContainer: { padding: 24, borderRadius: 20 },
});
```

### 3. Component Copy Command (CLI)
Pick and choose only the components you need into your project repository:

```bash
# Initialize or add a single component:
npx glacia add button

# Add multiple components:
npx glacia add dialog card tabs

# Add all 33 Wave 1 components:
npx glacia add all
```

---

## What Shipped in V1

### 33 Web Components (`glacia`)
- **Surfaces & Layout:** `Glass`, `Card`, `Separator`, `ScrollArea`
- **Actions & Controls:** `Button`, `Switch`, `Slider`, `SegmentedControl`, `TabBar`
- **Forms & Inputs:** `Input`, `Textarea`, `Label`, `Checkbox`, `RadioGroup`, `Select`, `SearchField`
- **Navigation:** `Tabs`, `Sidebar`
- **Overlays & Dialogs:** `Dialog`, `AlertDialog`, `Popover`, `DropdownMenu`, `Menu`, `Tooltip`
- **Feedback & Display:** `Badge`, `Avatar`, `Skeleton`, `Spinner`, `Progress`, `Sonner (Toast)`, `Text`, `Table`

### 2 Ready-Made Blocks
- `LoginPage`: Complete authentication screen with centered or split layouts.
- `AdminDashboard`: Full administrative interface with floating glass sidebar, live KPI cards, and data table.

### 7 React Native Components (`glacia-native`)
- `Glass`, `Button`, `Switch`, `Slider`, `SegmentedControl`, `TabBar`, `Card`

See [BUILD_REPORT.md](BUILD_REPORT.md) for full verification details, HIG classifications, and wave breakdowns.

---

## Platform Support Matrix

| Platform / Engine | Support Level | Implementation Details |
| :--- | :--- | :--- |
| **Chromium** (Chrome, Edge, Brave, Arc) | Full Optical Glass | Layer 1 frosted blur + Layer 2 real SVG refraction bend |
| **Safari** (macOS & iOS) | Frosted Glass | Layer 1 frosted blur, specular edge highlight, soft elevation |
| **Firefox** (macOS, Windows, Linux) | Frosted Glass | Layer 1 frosted blur, specular edge highlight, soft elevation |
| **iOS 26+ (Native)** | Real Apple Glass | Native `UIGlassEffect` via `@callstack/liquid-glass` |
| **iOS <26 (Native)** | Fallback Tint | Translucent tint matching geometry with zero layout shifts |
| **Android (Native)** | Fallback Tint | Semi-transparent surface tint matching exact layout metrics |
| **Expo Go** | Fallback Tint | Runs safely without requiring custom native module compilation |

---

## Architecture & Design Tokens

Glacia design tokens are centralized in `packages/tokens` (`glacia-tokens`) and exported in three forms:
- `tokens.json`: Raw, platform-agnostic design metrics (blur radii, refractive indices, chromatic dispersion, edge tints, springs).
- `dist/index.css`: Pre-composed CSS variables mapped to light, dark, and system themes.
- `glacia-tokens`: ESM/CJS exports with ready-to-use React Native style values.

---

## Attribution & Acknowledgements

Glacia is built with gratitude on the shoulders of giants:
- **Web Glass Engine:** Based on [Glisse](https://github.com/0kzh/glisse) by Kelvin Zhang (MIT License).
- **React Native Engine:** Powered by [@callstack/liquid-glass](https://github.com/callstack/liquid-glass) by Callstack (MIT License).

Glacia and its derivative code are released under the [MIT License](LICENSE).
