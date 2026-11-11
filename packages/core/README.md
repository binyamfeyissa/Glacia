# Glacia (`glacia`)

> **Apple's Liquid Glass UI kit for React.**  
> Real optical refraction, specular highlights, and authentic depth across 80+ components.

[![npm version](https://img.shields.io/npm/v/glacia.svg)](https://www.npmjs.com/package/glacia)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/binyamfeyissa/Glacia/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/Docs-glacia.binyamfeyissa.dev-teal.svg)](https://glacia.binyamfeyissa.dev)
[![GitHub](https://img.shields.io/badge/GitHub-binyamfeyissa%2FGlacia-black.svg)](https://github.com/binyamfeyissa/Glacia)

---

## Overview

**Glacia** brings Apple's iOS 26 Liquid Glass material to the modern web:

- **Real Optical Physics:** Not merely flat `backdrop-filter: blur(10px)`. Glacia uses live SVG displacement mapping and dynamic chromatic dispersion to bend background pixels behind floating UI elements.
- **Two-Layer Rendering Engine:** 
  - *Layer 1:* Universal frosted glass fallback for all browsers (Safari, Firefox, Mobile WebKit).
  - *Layer 2:* High-performance SVG refraction displacement gated safely behind CSS `@supports` for Chromium browsers.
- **80+ Interactive Components:** Accessible, polished, production-ready components ranging from Buttons, Sliders, and Switches to Calendars, Data Tables, Charts, Modals, and Navigation Bars.
- **Tailwind & CSS Agnostic:** Ships with lightweight pre-compiled styles (`glacia/styles.css`) or can be added modularly via the CLI.
- **Cross-Platform Ecosystem:** Designed alongside `glacia-tokens` (shared token engine) and `glacia-native` (React Native & Expo).

---

## Installation

Install the package from npm:

```bash
npm install glacia
# or
pnpm add glacia
# or
yarn add glacia
# or
bun add glacia
```

### Import Styles

Add the stylesheet to the root of your application (e.g. `layout.tsx`, `_app.tsx`, or `main.tsx`):

```tsx
import "glacia/styles.css";
```

---

## Quickstart

```tsx
import React from "react";
import { Glass, Button, Slider, Switch, Tabs, TabsList, TabsTrigger, TabsContent } from "glacia";

export function App() {
  const [sliderVal, setSliderVal] = React.useState(65);
  const [active, setActive] = React.useState(true);

  return (
    <div style={{ background: "linear-gradient(135deg, #1e3a8a, #0f172a)", minHeight: "100vh", padding: 32 }}>
      {/* Base Liquid Glass Panel */}
      <Glass refraction={0.8} specular={0.9} style={{ padding: 24, borderRadius: 24, maxWidth: 480 }}>
        <h2>Liquid Glass Material</h2>
        <p>Hardware-accelerated optical refraction.</p>

        <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
          <Button variant="primary">Primary Action</Button>
          <Button variant="glass">Glass Button</Button>
        </div>

        <div style={{ margin: "16px 0" }}>
          <label>Transmission: {sliderVal}%</label>
          <Slider value={[sliderVal]} onValueChange={([v]) => setSliderVal(v)} max={100} step={1} />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>Enable Optics</span>
          <Switch checked={active} onCheckedChange={setActive} />
        </div>
      </Glass>
    </div>
  );
}
```

---

## CLI Workflow

If you prefer copying components directly into your codebase for complete control, use the Glacia CLI:

```bash
# Initialize Glacia in your project
npx glacia init

# Add specific components
npx glacia add button slider switch tabs calendar

# Add all components
npx glacia add --all
```

---

## Component Catalog

| Category | Components Included |
| :--- | :--- |
| **Foundations** | `Glass`, `Button`, `ButtonGroup`, `Text`, `Badge`, `Separator`, `Kbd`, `Skeleton`, `Spinner` |
| **Form & Inputs** | `Input`, `InputGroup`, `InputOTP`, `Textarea`, `SearchField`, `Slider`, `Switch`, `Checkbox`, `RadioGroup`, `Select`, `NativeSelect`, `Combobox`, `Form`, `Field` |
| **Navigation** | `Tabs`, `TabBar`, `SegmentedControl`, `NavigationMenu`, `Menubar`, `Breadcrumb`, `Pagination`, `Sidebar` |
| **Overlays & Feedback** | `Dialog`, `AlertDialog`, `Sheet`, `Drawer`, `Popover`, `Tooltip`, `HoverCard`, `ContextMenu`, `DropdownMenu`, `Sonner`, `Toast` |
| **Data & Presentation** | `Table`, `DataTable`, `Card`, `Accordion`, `Collapsible`, `Carousel`, `Chart`, `Calendar`, `TimePicker`, `CodeBlock`, `Avatar` |

---

## Optical Properties (`<Glass />`)

The core `<Glass />` component accepts fine-grained optical parameters:

```tsx
<Glass
  refraction={0.85}       // Optical refraction displacement magnitude (0.0 to 1.0)
  specular={0.90}         // Top specular highlight opacity (0.0 to 1.0)
  blur="24px"             // Backdrop blur radius
  tint="rgba(255,255,255,0.06)" // Surface tint color
  glow="#38bdf8"          // Ambient specular glow tint
  refractImage="/path/to/texture.jpg" // Optional refraction normal map
>
  {/* Content */}
</Glass>
```

---

## Ecosystem

- **`glacia`**: Core React web component library with CLI support.
- **[`glacia-tokens`](https://www.npmjs.com/package/glacia-tokens)**: Shared cross-platform design tokens and optical formulas.
- **[`glacia-native`](https://www.npmjs.com/package/glacia-native)**: Liquid Glass for React Native & Expo with iOS 26 `UIGlassEffect`.

---

## Links

- **Documentation**: [https://glacia.binyamfeyissa.dev/](https://glacia.binyamfeyissa.dev/)
- **GitHub**: [https://github.com/binyamfeyissa/Glacia](https://github.com/binyamfeyissa/Glacia)
- **License**: MIT
