# Glacia

> **Apple's Liquid Glass UI kit for React and React Native.**  
> Real optical refraction, specular highlights, and authentic depth from a single unified design system.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-147%20passing-brightgreen.svg)](BUILD_REPORT.md)
[![Web](https://img.shields.io/badge/Web-71%20components-teal.svg)](https://glacia.dev)
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
Pick and choose only the components you need into your project repository. The command copies the component's **real source code** — not a re-export — so you own it and can edit it.

```bash
# Initialize or add a single component:
npx glacia add button

# Add multiple components:
npx glacia add dialog card tabs combobox calendar command carousel

# Add all 71 components:
npx glacia add all
```

Copied files import shared helpers and styles from the `glacia` package, so keep it installed. To point the command at your own registry host, set `GLACIA_REGISTRY_URL`.

---

## What Shipped: 71 Components & 10 Blocks

### 71 Web Components (`glacia`)
- **Surfaces & Layout:** `Glass`, `Card`, `Separator`, `ScrollArea`, `Collapsible`, `Empty`, `AspectRatio`, `Resizable`
- **Actions & Controls:** `Button`, `ButtonGroup`, `Toggle`, `ToggleGroup`, `Switch`, `Slider`, `SegmentedControl`, `TabBar`
- **Forms & Inputs:** `Input`, `InputGroup`, `InputOTP`, `Field`, `Form`, `Combobox`, `NativeSelect`, `Textarea`, `Label`, `Checkbox`, `RadioGroup`, `Select`, `SearchField`
- **Navigation & I18n:** `Tabs`, `Sidebar`, `Breadcrumb`, `NavigationMenu`, `Pagination`, `Direction`
- **Data & Pickers:** `Calendar`, `Chart`, `DataTable`, `Item`, `Table`
- **Overlays, Menus & Command:** `Dialog`, `AlertDialog`, `Drawer` (iOS sheet), `Sheet` (macOS slide-over), `Popover`, `DropdownMenu`, `ContextMenu`, `Menu`, `Tooltip`, `HoverCard`, `Command`, `Menubar`
- **Feedback & Display:** `Badge`, `Avatar`, `Skeleton`, `Spinner`, `Progress`, `Toast` (Dynamic Island HUD pill), `Sonner`, `Text`, `Kbd`, `CodeBlock`, `Marker`, `Carousel`
- **Chat & AI:** `Message` (Speech Bubbles), `Bubble`, `MessageScroller`, `Attachment`, `Questionnaire`, `Trace` (Reasoning Pipeline)

### 10 Ready-Made Blocks
- `LoginPage`: Complete authentication screen with centered or split layouts.
- `AdminDashboard`: Full administrative interface with floating glass sidebar, live KPI cards, and data table.
- `SettingsBlock`: Apple Preferences window with categorized glass sidebar, appearance mode, accent colors, True Tone toggle, and volume slider.
- `ProfileBlock`: Apple ID contact card with avatar hero, verified badge, personal details, and linked devices list.
- `SignupBlock`: Apple onboarding registration card with real-time animated password strength meter, passkey option, and terms agreement.
- `CalendarPageBlock`: Full Apple macOS Calendar window with mini-month picker, iCloud accounts, upcoming agenda, and 7-column month grid.
- `PricingBlock`: Apple-style subscription tier comparison with annual billing discount toggle, featured refractive Pro card, and feature checklists.
- `LandingBlock`: Apple keynote marketing page with floating glass pill navigation, glowing gradient headline, 3-column feature cards, and metrics banner.
- `ForgotPasswordBlock`: Apple ID password recovery with trusted email entry, 6-digit InputOTP code verification, resend countdown, and passkey support.
- `ErrorPageBlock`: Apple system error screen with floating glass status card, glowing 404 frosted typography, and recovery action buttons.

### 7 React Native Components (`glacia-native`)
- `Glass`, `Button`, `Switch`, `Slider`, `SegmentedControl`, `TabBar`, `Card`

See [BUILD_REPORT.md](BUILD_REPORT.md) for full verification details, HIG classifications, and wave breakdowns.

---

## Platform Support Matrix

| Platform / Engine | Support Level | Implementation Details |
| :--- | :--- | :--- |
| **Chromium** (Chrome, Edge, Brave, Arc) | Full Optical Glass | Layer 1 frosted blur + Layer 2 real SVG refraction bend — verified in Chromium |
| **Safari** (macOS & iOS) | Frosted Glass | Layer 1 frosted blur, specular edge highlight, soft elevation — not yet verified in a real browser |
| **Firefox** (macOS, Windows, Linux) | Frosted Glass | Layer 1 frosted blur, specular edge highlight, soft elevation — verified in Firefox
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
