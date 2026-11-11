# Glacia Tokens (`glacia-tokens`)

> **Shared design tokens, optical formulas, and cross-platform types for the Glacia Liquid Glass design system.**

[![npm version](https://img.shields.io/npm/v/glacia-tokens.svg)](https://www.npmjs.com/package/glacia-tokens)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/binyamfeyissa/Glacia/blob/main/LICENSE)
[![Docs](https://img.shields.io/badge/Docs-glacia.binyamfeyissa.dev-teal.svg)](https://glacia.binyamfeyissa.dev)
[![GitHub](https://img.shields.io/badge/GitHub-binyamfeyissa%2FGlacia-black.svg)](https://github.com/binyamfeyissa/Glacia)

---

## Overview

`glacia-tokens` is the shared single source of truth for the Glacia design system, providing unified design values across both web ([`glacia`](https://www.npmjs.com/package/glacia)) and mobile ([`glacia-native`](https://www.npmjs.com/package/glacia-native)).

It packages:
- **Optical Formulas & Tints**: Refraction parameters, blur steps, specular rim highlights, and ambient glow values.
- **Color Palettes**: Dynamic dark/light system colors mapped to Apple's Human Interface Guidelines.
- **Physical Radii & Spacing**: Standardized pixel values and numeric scales for cross-platform layout symmetry.
- **Spring Physics**: Physics constants (`stiffness`, `damping`, `mass`) compatible with Framer Motion, React Spring, and React Native Reanimated.
- **TypeScript Interfaces**: Unified props and variant typings.
- **Raw JSON Artifacts**: Pre-packaged `tokens.json` consumable by styling engines, Figma plugins, Tailwind configs, and native iOS/Android pipelines.

---

## Installation

```bash
npm install glacia-tokens
# or
pnpm add glacia-tokens
# or
yarn add glacia-tokens
# or
bun add glacia-tokens
```

---

## Usage

### 1. Import in TypeScript / JavaScript

```ts
import { tokens, colors, radii, springs, type Effect, type GlassPropsBase } from "glacia-tokens";

// Access color and material values
console.log(colors.dark.glass.regular);
// => { background: "rgba(255, 255, 255, 0.08)", border: "rgba(255, 255, 255, 0.16)", ... }

// Access standard border radii
console.log(radii.lg.px);     // "20px" (Web)
console.log(radii.lg.number); // 20 (React Native)

// Access spring animation presets
console.log(springs.snappy);
// => { stiffness: 300, damping: 28, mass: 1 }
```

### 2. Import Raw JSON

```ts
import tokensJson from "glacia-tokens/tokens.json";

// Or in tailwind.config.js / postcss.config.js
const { colors } = require("glacia-tokens/tokens.json");
```

---

## Exported API

| Export | Type | Description |
| :--- | :--- | :--- |
| `tokens` | `object` | Full token tree containing materials, optics, colors, and layout metrics |
| `colors` | `object` | Semantic color palette with light and dark mode configurations |
| `radii` | `object` | Corner radii scales (`sm`, `md`, `lg`, `xl`, `pill`) with `{ px, number }` |
| `springs` | `object` | Spring physics constants (`gentle`, `snappy`, `bouncy`) |
| `Effect` | `type` | Material mode: `"regular" \| "clear" \| "none"` |
| `Variant` | `type` | Surface style: `"filled" \| "glass" \| "ghost"` |
| `Size` | `type` | Component scale: `"sm" \| "md" \| "lg"` |
| `Radius` | `type` | Corner scale: `"sm" \| "md" \| "lg" \| "xl" \| "pill"` |
| `GlassPropsBase`| `interface`| Base interface for cross-platform glass props |

---

## Ecosystem

- **[`glacia`](https://www.npmjs.com/package/glacia)**: Core React web component library with CLI support.
- **`glacia-tokens`**: Shared cross-platform design tokens and optical formulas.
- **[`glacia-native`](https://www.npmjs.com/package/glacia-native)**: Liquid Glass for React Native & Expo with iOS 26 `UIGlassEffect`.

---

## Links

- **Documentation**: [https://glacia.binyamfeyissa.dev/](https://glacia.binyamfeyissa.dev/)
- **GitHub**: [https://github.com/binyamfeyissa/Glacia](https://github.com/binyamfeyissa/Glacia)
- **License**: MIT
