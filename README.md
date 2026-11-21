# Glacia

<p align="center">
  <img src="apps/docs/public/glacia-logo.png" alt="Glacia Logo" width="120" height="120" style="border-radius: 28px;" />
</p>

<h1 align="center">Glacia</h1>

<p align="center">
  <strong>Apple's Liquid Glass UI kit for React and React Native.</strong><br>
  Real optical refraction, specular highlights, and authentic depth from a single unified design system.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/glacia"><img src="https://img.shields.io/npm/v/glacia.svg?label=glacia&color=0284c7" alt="glacia npm version"></a>
  <a href="https://www.npmjs.com/package/glacia-native"><img src="https://img.shields.io/npm/v/glacia-native.svg?label=glacia-native&color=6366f1" alt="glacia-native npm version"></a>
  <a href="https://www.npmjs.com/package/glacia-tokens"><img src="https://img.shields.io/npm/v/glacia-tokens.svg?label=glacia-tokens&color=059669" alt="glacia-tokens npm version"></a>
  <a href="https://github.com/binyamfeyissa"><img src="https://img.shields.io/badge/Author-Binyam%20Feyissa-blueviolet.svg" alt="Author: Binyam Feyissa"></a>
  <a href="https://github.com/binyamfeyissa/Glacia/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://glacia.binyamfeyissa.dev"><img src="https://img.shields.io/badge/Tests-501%20passing-brightgreen.svg" alt="Tests"></a>
  <a href="https://glacia.binyamfeyissa.dev"><img src="https://img.shields.io/badge/Registry-97%20components-teal.svg" alt="Registry"></a>
  <a href="https://glacia.binyamfeyissa.dev"><img src="https://img.shields.io/badge/Docs-glacia.binyamfeyissa.dev-black.svg" alt="Documentation"></a>
</p>

---

### [Documentation & Interactive Demos](https://glacia.binyamfeyissa.dev) | [Web Components](https://glacia.binyamfeyissa.dev/platform/web) | [React Native](https://glacia.binyamfeyissa.dev/platform/mobile) | [Guides](https://glacia.binyamfeyissa.dev/guides) | [Blocks](https://glacia.binyamfeyissa.dev/blocks/dashboard)

---

## Disclaimer

**Not affiliated with Apple Inc.** Liquid Glass is Apple's design material introduced for iOS 26 and macOS Tahoe; Glacia is an independent, open-source cross-platform implementation for the web and mobile ecosystems.

---

## Why Glacia?

Most "glassmorphism" libraries merely apply a flat `backdrop-filter: blur(12px)`. Glacia is different:

- **True Optical Refraction:** Simulates physical ray optics. As users move elements or content scrolls underneath, the background visibly bends and distorts along the rounded edges and specular facets of the glass surface.
- **Two-Layer Rendering Engine:**
  - *Layer 1 (Universal):* Frosted backdrop blur, delicate specular border highlight, inner glow, and ambient soft elevation across every browser (Safari, Firefox, Mobile WebKit).
  - *Layer 2 (Chromium Optic):* Hardware-accelerated SVG refraction displacement filter (`feDisplacementMap`) dynamically tracking element boundaries, active on Chromium engines (Chrome, Edge, Brave, Arc).
- **First-Class React Native & Expo:** On iOS 26+, Glacia renders Apple's true native `UIGlassEffect` via `@callstack/liquid-glass`. On earlier iOS versions and Android, a calibrated fallback ladder maintains identical geometry, typography, and contrast with zero runtime crashes or layout shifts.
- **Three Ways to Consume:** Complete web bundle (`glacia`), native mobile companion (`glacia-native`), or direct component source copying via CLI (`npx glacia add <component>`).

---

## Platform Support Matrix

| Platform / Engine | Support Level | Technical Architecture |
| :--- | :--- | :--- |
| **Chromium** (Chrome, Edge, Brave, Arc) | **Full Optical Glass** | Layer 1 Frosted blur + Layer 2 live SVG `feDisplacementMap` refraction. |
| **Safari** (macOS & iOS) | **Frosted Glass** | Layer 1 Backdrop blur, specular edge highlight, soft ambient shadows. |
| **Firefox** (macOS, Windows, Linux) | **Frosted Glass** | Layer 1 Backdrop blur, specular highlights, and clean contrast. |
| **iOS 26+ (Native)** | **True Apple Glass** | Native `UIGlassEffect` via `@callstack/liquid-glass`. |
| **iOS <26 (Native)** | **Calibrated Tint** | Translucent tinted surface matching geometry with zero layout shifts. |
| **Android (Native)** | **Calibrated Tint** | Semi-transparent surface tint matching exact layout metrics. |
| **Expo Go** | **Calibrated Tint** | Operates safely in Expo Go without native build steps. |

---

## Three Ways to Install

### 1. Web NPM Package (`glacia`)

Install the full React component library:

```bash
npm install glacia
# or
pnpm add glacia
# or
yarn add glacia
# or
bun add glacia
```

Import global glass stylesheets once in your root layout (`layout.tsx`, `_app.tsx`, or `main.tsx`):

```tsx
import "glacia/styles.css";
```

#### Quick Start:

```tsx
import { Glass, Button, Card, CardHeader, CardTitle, CardContent, Slider, Switch } from "glacia";

export default function GlassCardDemo() {
  return (
    <div style={{ background: "url('/wallpaper.jpg') center/cover", minHeight: "100vh", padding: 48 }}>
      <Card style={{ maxWidth: 460 }}>
        <CardHeader>
          <CardTitle>Liquid Glass Surface</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm opacity-80 mb-6">
            Watch the background image refract and bend along this card's edges.
          </p>
          <div className="flex items-center gap-4 mb-4">
            <Slider defaultValue={[65]} max={100} step={1} />
            <Switch defaultChecked />
          </div>
          <Button variant="filled">Confirm Action</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 2. React Native & Expo Package (`glacia-native`)

Install into your React Native or Expo project (Expo SDK 54+ development builds or bare React Native):

```bash
npx expo install glacia-native @callstack/liquid-glass react-native-svg
# or bare React Native:
npm install glacia-native @callstack/liquid-glass react-native-svg
```

#### Quick Start:

```tsx
import React, { useState } from "react";
import { StyleSheet, View, ImageBackground, Text } from "react-native";
import { Glass, Button, Switch, Slider, SegmentedControl } from "glacia-native";

export default function MobileApp() {
  const [enabled, setEnabled] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <ImageBackground source={require("./wallpaper.jpg")} style={styles.container}>
      <Glass effect="regular" style={styles.card}>
        <Text style={styles.title}>Native Liquid Glass</Text>
        <SegmentedControl
          values={["Day", "Week", "Month"]}
          selectedIndex={tabIndex}
          onChange={setTabIndex}
          style={styles.segmented}
        />
        <View style={styles.row}>
          <Text style={styles.label}>Real-time Refraction</Text>
          <Switch value={enabled} onValueChange={setEnabled} />
        </View>
        <Button title="Continue" variant="filled" onPress={() => {}} />
      </Glass>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: { width: "100%", maxWidth: 380, padding: 24, borderRadius: 24, gap: 16 },
  title: { fontSize: 20, fontWeight: "600", color: "#111" },
  segmented: { marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 15, color: "#333" },
});
```

---

### 3. Component CLI Copy Command (`npx glacia add`)

Pick and choose components into your project repository. Glacia places the **actual source code** directly into your repository (similar to shadcn/ui) so you have 100% control over design, styling, and behavior:

```bash
# Add a single component:
npx glacia add button

# Add multiple components at once:
npx glacia add dialog card tabs combobox calendar carousel chart

# Add all 97 registry components:
npx glacia add all
```

*Note:* Copied components import shared tokens and helpers from `glacia`, so ensure `glacia` is installed in your `package.json`.

---

## Component Catalog (97 Items & 10 Blocks)

### 1. Primitives & Surfaces
- `Glass` — Base refractive lens surface with dynamic specular highlight and edge chromatic dispersion.
- `Card` — Elevation container (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
- `Separator` — Hairline frosted divider.
- `ScrollArea` — Custom glass scrollbar viewport.
- `Collapsible` — Smooth height-animated glass accordion surface.
- `Empty` — Polished empty state with glass icon pedestal.

### 2. Actions & Navigation
- `Button` — Refractive interactive button with physical press depression, haptic spring, and glass bevels.
- `ButtonGroup` — Joined multi-button control bar.
- `SegmentedControl` — Apple-authentic sliding pill selector.
- `TabBar` — Mobile-first bottom navigation bar with floating glass active indicator.
- `Tabs` — Tabbed navigation (`TabsList`, `TabsTrigger`, `TabsContent`).
- `NavigationMenu` — Desktop navigation bar with glass flyout panels.
- `Sidebar` — Complete collapsible application sidebar with header, content, and footer.
- `Breadcrumb` — Frosted breadcrumb trail.
- `Pagination` — Numbered page navigation controls.

### 3. Form Controls & Inputs
- `Input` — Glass text input field with active focus border glow.
- `InputGroup` — Prefixed/suffixed input container.
- `InputOTP` — Segmented one-time passcode pin input.
- `Textarea` — Auto-resizing glass multiline input.
- `Field` — Form field wrapper with label, description, and error message.
- `Form` — Integrated form container.
- `Checkbox` — Interactive checkbox with smooth check spring.
- `RadioGroup` — Radio selector group.
- `Switch` — Apple-styled fluid toggle switch.
- `Slider` — Glass track slider with interactive thumb.
- `Select` / `NativeSelect` — Custom glass dropdown and native fallback select.
- `Combobox` — Filterable autocomplete select.
- `SearchField` — Instant search input with clear button and shortcut indicator.

### 4. Overlays & Menus
- `Dialog` / `AlertDialog` — Modal window centered over a blurred backdrop lens.
- `Drawer` — iOS-style bottom sheet modal with drag-to-dismiss gesture.
- `Sheet` — macOS-style sliding side drawer.
- `Popover` — Floating contextual glass container.
- `DropdownMenu` — Contextual menu flyout.
- `ContextMenu` — Right-click glass contextual menu.
- `Menu` / `Menubar` — Application top bar menus.
- `ActionSheet` — iOS-style action list.
- `Tooltip` / `HoverCard` — Lightweight contextual hover previews.
- `Command` — Spotlight / Raycast-style command palette with fuzzy filtering.

### 5. Interactive Pickers
- `Calendar` — Full-month interactive date picker with range selection, min/max dates, and keyboard navigation.
- `ColorPicker` — Refractive color wheel and gradient swatch picker.
- `TimePicker` — Segmented 12h/24h glass clock picker with hours, minutes, and AM/PM controls.

### 6. High-Performance Glass Charts
Interactive SVG charts styled with liquid glass containers and live tooltips:
- `LineChart` & `LiveLineChart` — Real-time and static time-series lines.
- `AreaChart` & `MirrorAreaChart` — Filled gradient glass areas.
- `BarChart` — Vertical and horizontal comparative bars.
- `PieChart` — Glass donut and pie distribution.
- `RadarChart` — Multi-axis capability radar.
- `PolarAreaChart` — Segmented radial wedges.
- `RadialChart` — Concentric progress rings.
- `HeatmapChart` — Matrix density visualization.
- `CandlestickChart` — Financial OHLC stock chart.
- `BumpChart` — Ranking and flow chart.

### 7. Conversational AI Primitives
Apple Intelligence-style liquid conversational interface components:
- `AiInput` — Multimodal AI prompt input with voice microphone trigger, attachment pills, and submit button.
- `Message` & `Bubble` — User and assistant speech bubbles with authentic light transmission.
- `MessageScroller` — Auto-scrolling chat history stream.
- `Attachment` — File, image, and media card preview.
- `Response` — Formatted AI response container with markdown, code highlights, and token streaming.
- `Task` — Multi-step task execution progress item.
- `Plan` — Interactive agentic plan checklist with checkboxes and status chips.
- `Questionnaire` — Structured decision card with selectable options.

### 8. Feedback & Media
- `Toast` (Dynamic Island HUD pill) — Top-anchored floating feedback pill with spring transitions.
- `Sonner` — Stacked toast notifications.
- `Badge` / `Pill` — Accent status badges.
- `Avatar` — User photo with fallback initials.
- `Progress` / `Spinner` — Fluid progress bars and activity spinners.
- `Skeleton` — Shimmering glass placeholder.
- `Carousel` — Smooth touch-friendly carousel with indicator dots.
- `CodeBlock` — Syntax-highlighted code container with copy button.
- `Kbd` — Mac-style keyboard key caps (`⌘K`, `⇧P`).
- `Marker` — Highlighted text annotation.

### 9. 10 Ready-Made Blocks
Full-page application templates ready to copy into your project:
- **`LoginPage`** — Split-screen and centered authentication screens.
- **`AdminDashboard`** — Enterprise analytics dashboard with floating glass sidebar, live KPI charts, and data tables.
- **`SettingsBlock`** — macOS Preferences window with appearance modes, accent colors, and audio sliders.
- **`ProfileBlock`** — Apple ID user profile with verified badges, personal information, and linked devices.
- **`SignupBlock`** — Registration card with animated password strength meter and passkey integration.
- **`CalendarPageBlock`** — Full-month calendar view with mini-calendar picker, iCloud accounts, and agenda list.
- **`PricingBlock`** — Subscription pricing table with monthly/annual discount switch and featured refractive Pro card.
- **`LandingBlock`** — Keynote marketing landing page with glass pill navbar, hero glowing headline, and feature grid.
- **`ForgotPasswordBlock`** — Account recovery with 6-digit `InputOTP` code verification and countdown timer.
- **`ErrorPageBlock`** — System 404 / 500 error display with floating glass card and recovery buttons.

---


## Architecture & Design Tokens

Glacia tokens are centralized in `glacia-tokens`:
- `tokens.json`: Raw, platform-agnostic design metrics (blur radii, refractive indices, chromatic dispersion, edge tints, springs).
- `dist/index.css`: Pre-composed CSS variables mapped to light, dark, and system themes.
- `glacia-tokens`: JavaScript/TypeScript constants for React Native and web layout math:

```tsx
import { colors, radii, springs } from "glacia-tokens";

console.log(radii.lg); // { px: "20px", number: 20 }
console.log(springs.snappy); // { stiffness: 300, damping: 28, mass: 1 }
```

### CSS Variables Example:

```css
:root {
  --gl-blur: 24px;
  --gl-saturation: 1.8;
  --gl-border-width: 1px;
  --gl-specular-opacity: 0.28;
  --gl-radius-lg: 20px;
}
```

---

## Verification & Testing

Glacia maintains a strict verification suite across both React and React Native:
- **501 automated unit & component tests** passing across Vitest and React Testing Library (32 web suites + 18 React Native suites).
- Full typecheck verification with `tsc --noEmit`.
- Production bundle verification via `tsdown` (Rolldown) and `next build` (Next.js 15).

To run tests locally:

```bash
pnpm test
```

To run a production build:

```bash
pnpm build
```

---

## Attribution & Acknowledgements

Glacia is created and maintained by **[Binyam Feyissa](https://github.com/binyamfeyissa)** and built with gratitude on the shoulders of giants:
- **Web Glass Engine:** Refractive optics architecture inspired by & incorporating research from [Glisse](https://github.com/0kzh/glisse) by Kelvin Zhang (MIT License).
- **React Native Engine:** Powered by [@callstack/liquid-glass](https://github.com/callstack/liquid-glass) by Callstack (MIT License).

---

## License & Acceptable Use Policy

Glacia is open-source software licensed under the [MIT License with Anti-Plagiarism & Brand Protection Terms](LICENSE).
Copyright © 2026 **Binyam Feyissa**. All rights reserved.

### Summary of Terms:
- **What You Can Do:** You are free to use, customize, and bundle Glacia components and packages (`glacia`, `glacia-native`, `glacia-tokens`) in your own personal, commercial, open-source, or client applications, websites, SaaS platforms, and mobile apps.
- **What You Cannot Do:** You may **not** copy, fork, re-host, re-brand, or redistribute this repository, source code, component registry, or design token suite as a competing standalone UI component library or package on npm, GitHub, or any other package registry. You may not claim original authorship or remove original author copyright notices.
- **Trademarks:** "Glacia" and associated logos are trademarks of Binyam Feyissa and cannot be used in derivative works without prior written consent.
