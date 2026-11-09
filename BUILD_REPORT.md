# Glacia Build Report

**Verified Release Date:** 2026-11-09  
**Version:** v0.1.0 (Wave 1)

This report provides an honest, verified account of all components, blocks, packages, and test suites shipped in Glacia v0.1.0, along with tested browser capabilities and future roadmap items.

---

## Executive Summary

| Category | Shipped Count | Status |
| :--- | :--- | :--- |
| **Wave 1 Web Components** | 33 | Built, tested, and verified |
| **React Native Components** | 7 | Shipped with iOS 26+ `UIGlassEffect` & fallback ladder |
| **Production Ready-Made Blocks** | 2 | Login Page, Admin Dashboard |
| **Passing Automated Unit Tests** | 100 / 100 | 92 `glacia` (core) + 8 `glacia-native` |
| **Design Tokens** | Complete | Cross-platform JSON, CSS, and React Native maps |
| **CLI & Registry Distribution** | Functional | `npx glacia add <comp>`, `npx glacia add all`, npm packages |

---

## Shipped Wave 1 Web Components (33)

Every component listed below is fully implemented in `packages/core`, interactive, accessible (WAI-ARIA compliant), responsive to light/dark themes, and available via npm (`glacia`) and the copy-command registry.

| # | Component | Category | Apple HIG Classification | React Native Support |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Glass** | Surface | Apple-faithful | Yes (`glacia-native`) |
| 2 | **Button** | Control | Apple-faithful | Yes (`glacia-native`) |
| 3 | **Text** | Typography | Apple-faithful | Web first |
| 4 | **Input** | Form | Glacia extension | Web first |
| 5 | **Textarea** | Form | Glacia extension | Web only |
| 6 | **Label** | Form | Apple-faithful | Web first |
| 7 | **Card** | Layout | Glacia extension | Yes (`glacia-native`) |
| 8 | **Badge** | Display | Glacia extension | Web first |
| 9 | **Avatar** | Display | Glacia extension | Web first |
| 10 | **Separator** | Layout | Apple-faithful | Web only |
| 11 | **Skeleton** | Feedback | Glacia extension | Web only |
| 12 | **Spinner** | Feedback | Apple-faithful | Web only |
| 13 | **Progress** | Feedback | Apple-faithful | Web first |
| 14 | **Switch** | Control | Apple-faithful | Yes (`glacia-native`) |
| 15 | **Slider** | Control | Apple-faithful | Yes (`glacia-native`) |
| 16 | **SearchField** | Form | Apple-faithful | Web first |
| 17 | **Checkbox** | Form | Glacia extension | Web first |
| 18 | **RadioGroup** | Form | Glacia extension | Web first |
| 19 | **Select** | Form | Glacia extension | Web only |
| 20 | **Tabs** | Navigation | Apple-faithful | Web only |
| 21 | **SegmentedControl** | Control | Apple-faithful | Yes (`glacia-native`) |
| 22 | **TabBar** | Navigation | Apple-faithful | Yes (`glacia-native`) |
| 23 | **Accordion** | Disclosure | Glacia extension | Web only |
| 24 | **Dialog** | Overlay | Apple-faithful | Web first |
| 25 | **AlertDialog** | Overlay | Apple-faithful | Web first |
| 26 | **Popover** | Overlay | Apple-faithful | Web only |
| 27 | **DropdownMenu** | Overlay | Apple-faithful | Web only |
| 28 | **Menu** | Overlay | Apple-faithful | Web only |
| 29 | **Tooltip** | Overlay | Apple-faithful | Web only |
| 30 | **Sonner (Toast)** | Feedback | Apple-faithful | Web only |
| 31 | **Table** | Data | Glacia extension | Web only |
| 32 | **Sidebar** | Navigation | Apple-faithful | Web only |
| 33 | **ScrollArea** | Layout | Glacia extension | Web only |

*Note on Apple HIG classification:* Apple restricts Liquid Glass primarily to floating controls, sheets, tab bars, sidebars, and alerts. Where Glacia applies glass to content surfaces (such as Cards, Tables, and Form inputs), it is explicitly marked as a **Glacia extension**.

---

## React Native Components (`glacia-native`) (7)

1. `Glass` — Core surface with native `UIGlassEffect` wrapper
2. `Button` — Touch-responsive glass action button
3. `Switch` — Glass toggle with spring physics
4. `Slider` — Glass track with tactile thumb indicator
5. `SegmentedControl` — Floating glass segment switcher
6. `TabBar` — Bottom floating glass navigation bar
7. `Card` — Elevation glass container for iOS and fallback Android

### Native Platform Fallback Ladder
- **iOS 26+:** Real Apple `UIGlassEffect` via `@callstack/liquid-glass`.
- **iOS <26:** Semi-transparent frosted glass approximation via `react-native-blur` or translucency with identical metrics.
- **Android:** Semi-transparent surface tint matching exact layout and elevation with zero layout shift.
- **Expo Go:** Gracefully runs using the non-native fallback ladder without throwing native module linking errors.

---

## Shipped Blocks (2)

1. **Login Page (`LoginPage`):**
   - Centered and split layouts.
   - Glass authentication card with email, password, OAuth buttons, and remember-me checkbox.
2. **Admin Dashboard (`AdminDashboard`):**
   - Floating iPad-style glass sidebar.
   - Live revenue and KPI metric cards.
   - Responsive orders table and trend analytics visualization.

---

## Browser Support Matrix & Technical Verification

Glacia web uses a two-layer rendering architecture designed to avoid WebKit bug 245510 while providing genuine optical physics:

| Platform / Browser | Layer 1 (Frosted Glass) | Layer 2 (Optical Refraction) | Notes |
| :--- | :--- | :--- | :--- |
| **Chromium** (Chrome, Edge, Arc, Brave) | Supported | Supported | Full dynamic SVG refraction bend behind `@supports` |
| **Safari** (macOS & iOS) | Supported | Graceful Fallback | Layer 1 frosted blur, border highlight, and elevation |
| **Firefox** (macOS, Windows, Linux) | Supported | Graceful Fallback | Layer 1 frosted blur, border highlight, and elevation |
| **Reduced Motion** (`prefers-reduced-motion`) | Respected | Disabled | Removes shimmer and dynamic movement |

---

## Roadmap: What is NOT in V1

### Wave 2 Roadmap (24 components & blocks)
- **Controls & Forms:** Button Group, Toggle, Input Group, Field, Form, Combobox, Native Select
- **Data & Display:** Calendar, Chart, Empty, Item, Hover Card, Context Menu, Collapsible, Data Table
- **Navigation & Overlays:** Drawer, Sheet, Toast, Breadcrumb, Navigation Menu, Pagination
- **Blocks:** Settings Block, Profile Block, Signup Block

### Wave 3 Roadmap (22 components & blocks)
- **Advanced Controls:** Toggle Group, Input OTP, Command, Carousel, Aspect Ratio, Kbd, Code Block, Marker
- **Complex Overlays:** Menubar, Resizable
- **Chat & AI:** Message, Bubble, Message Scroller, Attachment, Questionnaire, Trace, Direction
- **Blocks:** Calendar Page Block, Pricing Block, Landing Page Block, Forgot Password Block, Error Pages Block

---

## Attributions & Disclaimer

- **Web Glass Engine:** Based on Glisse by Kelvin Zhang (MIT License).
- **React Native Engine:** Powered by `@callstack/liquid-glass` (MIT License).
- **Disclaimer:** Not affiliated with Apple. Liquid Glass is Apple's design material for iOS 26; Glacia is an independent implementation.
