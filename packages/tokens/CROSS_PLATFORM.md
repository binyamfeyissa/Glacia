# Cross-Platform Prop & Behavior Mapping

This document specifies the unified API design across Web (`glacia`) and React Native (`glacia-native`), noting deliberate platform differences.

## Shared Primitives

| Prop / Concept | Web (`glacia`) | React Native (`glacia-native`) | Notes |
|---|---|---|---|
| `effect` | `'clear' \| 'regular' \| 'none'` | `'clear' \| 'regular' \| 'none'` | Maps to Callstack's `effect` on iOS and CSS variables on web. |
| `tintColor` | `string` (CSS color) | `string` (ColorValue) | Tints the glass material substrate. |
| `interactive` | `boolean` (dynamic) | `boolean` (mount-only on native) | On iOS `UIGlassEffect`, interaction cannot change dynamically after mount due to UIKit constraints. |
| `variant` (Button) | `'filled' \| 'glass' \| 'ghost'` | `'filled' \| 'glass' \| 'ghost'` | Unified visual hierarchy across platforms. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm' \| 'md' \| 'lg'` | Standardized heights: 32px / 40px / 48px. |
| `radii` | CSS px values (`8px`, `14px`, `20px`, `28px`, `9999px`) | Numeric point values (`8`, `14`, `20`, `28`, `9999`) | Shared scale from `glacia-tokens`. |
| Reduced Motion | `prefers-reduced-motion` | `AccessibilityInfo.isReduceMotionEnabled` | Disables spring physics and transitions instantly. |

## Platform Specifics

1. **Backdrop Refraction (Web):**
   - Web engine calculates dynamic SVG displacement maps in Chromium.
   - Safari & Firefox use Layer 1 fallback (frosted blur + specular rim + soft shadow) via `@supports`.

2. **Native Liquid Glass (iOS 26+):**
   - Native engine uses Apple's official `UIGlassEffect` via `@callstack/liquid-glass`.
   - Android and older iOS fall back gracefully to translucent tint + backdrop blur with identical geometry.
