# Glacia Build Report

**Verified Release Date:** 2026-11-09  
**Version:** v0.3.0 (Waves 1, 2, and 3 Complete — Full Catalog Shipped)

This report provides an honest, verified account of all components, blocks, packages, and test suites shipped in Glacia, along with tested browser capabilities and technical notes.

---

## Executive Summary

| Category | Shipped Count | Status |
| :--- | :--- | :--- |
| **Shipped Web Components** | **71** (33 Wave 1 + 21 Wave 2 + 17 Wave 3) | Built, tested, and verified |
| **React Native Components** | 7 | Shipped with iOS 26+ `UIGlassEffect` & fallback ladder |
| **Production Ready-Made Blocks** | **10** | 10 Complete Production Blocks |
| **Passing Automated Unit Tests** | **147 / 147** | 139 `glacia` (core) + 8 `glacia-native` |
| **Design Tokens** | Complete | Cross-platform JSON, CSS, and React Native maps |
| **CLI & Registry Distribution** | Functional (not yet hosted) | `npx glacia add <comp>` copies real component source; registry files ship in-repo and on the docs site |

---

## Shipped Wave 3 Web Components (17 New)

| # | Component | Category | Apple HIG Classification | React Native Support |
| :- | :--- | :--- | :--- | :--- |
| 55 | **ToggleGroup** | Buttons & Actions | Apple-faithful | Web first |
| 56 | **InputOTP** | Text & Forms | Apple-faithful | Web first |
| 57 | **Command** | Popups & Menus | Apple-faithful | Web first |
| 58 | **Carousel** | Showing Things | Apple-faithful | Web first |
| 59 | **AspectRatio** | Showing Things | Apple-faithful | Web first |
| 60 | **Kbd** | Showing Things | Apple-faithful | Web only |
| 61 | **CodeBlock** | Showing Things | Apple-faithful | Web only |
| 62 | **Marker** | Showing Things | Apple-faithful | Web first |
| 63 | **Menubar** | Popups & Menus | Apple-faithful | Web only |
| 64 | **Resizable** | Navigation & Layout | Apple-faithful | Web only |
| 65 | **Message** | Chat & AI | Apple-faithful | Web first |
| 66 | **Bubble** | Chat & AI | Apple-faithful | Web first |
| 67 | **MessageScroller** | Chat & AI | Apple-faithful | Web first |
| 68 | **Attachment** | Chat & AI | Apple-faithful | Web first |
| 69 | **Questionnaire** | Chat & AI | Apple-faithful | Web first |
| 70 | **Trace** | Chat & AI | Apple-faithful | Web only |
| 71 | **Direction** | Navigation & Layout | Apple-faithful | Web first |

---

## Shipped Wave 2 Web Components (21)

| # | Component | Category | Apple HIG Classification | React Native Support |
| :- | :--- | :--- | :--- | :--- |
| 34 | **ButtonGroup** | Buttons & Actions | Apple-faithful | Web first |
| 35 | **Toggle** | Buttons & Actions | Apple-faithful | Web first |
| 36 | **InputGroup** | Text & Forms | Apple-faithful | Web first |
| 37 | **Field** | Text & Forms | Apple-faithful | Web first |
| 38 | **Form** | Text & Forms | Glacia extension | Web first |
| 39 | **Combobox** | Text & Forms | Apple-faithful | Web first |
| 40 | **Calendar** | Text & Forms | Apple-faithful | Web first |
| 41 | **Chart** | Showing Things | Apple-faithful | Web first |
| 42 | **Empty** | Showing Things | Apple-faithful | Web first |
| 43 | **Item** | Showing Things | Apple-faithful | Web first |
| 44 | **HoverCard** | Popups & Menus | Apple-faithful | Web only |
| 45 | **ContextMenu** | Popups & Menus | Apple-faithful | Web only |
| 46 | **Drawer** | Popups & Menus | Apple-faithful | Web first |
| 47 | **Sheet** | Popups & Menus | Apple-faithful | Web first |
| 48 | **Toast** | Popups & Menus | Apple-faithful | Web first |
| 49 | **Breadcrumb** | Navigation & Layout | Apple-faithful | Web first |
| 50 | **NavigationMenu** | Navigation & Layout | Apple-faithful | Web only |
| 51 | **Pagination** | Navigation & Layout | Apple-faithful | Web first |
| 52 | **Collapsible** | Navigation & Layout | Apple-faithful | Web first |
| 53 | **DataTable** | Navigation & Layout | Glacia extension | Web first |
| 54 | **NativeSelect** | Text & Forms | Apple-faithful | Yes (`glacia-native`) |

---

## Shipped Wave 1 Web Components (33)

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

---

## Shipped Ready-Made Blocks (10)

1. **Login Page (`LoginPage`):**
   - Centered and split layouts.
   - Glass authentication card with email, password, OAuth buttons, and remember-me checkbox.
2. **Admin Dashboard (`AdminDashboard`):**
   - Floating iPad-style glass sidebar.
   - Live revenue and KPI metric cards.
   - Responsive orders table and trend analytics visualization.
3. **Settings Block (`SettingsBlock`):**
   - Apple macOS / iPadOS Preferences window with categorized glass sidebar.
   - Appearance mode switch, accent colors, True Tone toggle, and haptic volume slider.
4. **Profile Block (`ProfileBlock`):**
   - Apple ID contact card with avatar hero, verified badge, personal information, and linked devices list.
5. **Signup Block (`SignupBlock`):**
   - Clean Apple onboarding registration card with real-time animated password strength meter, passkey option, and terms agreement.
6. **Calendar Page Block (`CalendarPageBlock`):**
   - Full Apple macOS Calendar window with mini-month picker, iCloud accounts, upcoming agenda, and 7-column month grid with interactive event pills.
7. **Pricing Block (`PricingBlock`):**
   - Apple-style subscription tier comparison with annual billing discount toggle, featured refractive Pro card, and feature checklists.
8. **Landing Page Block (`LandingBlock`):**
   - Apple keynote marketing page with floating glass pill navigation, glowing gradient headline, 3-column feature cards, and metrics banner.
9. **Forgot Password Block (`ForgotPasswordBlock`):**
   - Apple ID password recovery with trusted email entry, 6-digit InputOTP code verification, resend countdown, and passkey support.
10. **Error Page Block (`ErrorPageBlock`):**
    - Apple system error screen with floating glass status card, glowing 404 frosted typography, and recovery action buttons.

---

## React Native Components (`glacia-native`) (7)

1. `Glass` — Core surface with native `UIGlassEffect` wrapper
2. `Button` — Touch-responsive glass action button
3. `Switch` — Glass toggle with spring physics
4. `Slider` — Glass track with tactile thumb indicator
5. `SegmentedControl` — Floating glass segment switcher
6. `TabBar` — Bottom floating glass navigation bar
7. `Card` — Elevation glass container for iOS and fallback Android

---

## Browser Support Matrix & Technical Verification

Glacia web uses a two-layer rendering architecture designed to avoid WebKit bug 245510 while providing genuine optical physics:

| Platform / Browser | Layer 1 (Frosted Glass) | Layer 2 (Optical Refraction) | Notes |
| :--- | :--- | :--- | :--- |
| **Chromium** (Chrome, Edge, Arc, Brave) | Supported | Supported | Verified in Chromium: `backdrop-filter: blur(3px) url("#glacia-backdrop-N") saturate(1.5)` |
| **Safari** (macOS & iOS) | Supported | Graceful Fallback | Layer 1 only. **Not verified in a real browser yet** — no WebKit runner available on the build machine. |
| **Firefox** (macOS, Windows, Linux) | Supported | Graceful Fallback | Verified in Firefox: frosted blur present, no SVG bend, zero console errors |
| **Reduced Motion** (`prefers-reduced-motion`) | Respected | Disabled | Removes shimmer and dynamic movement |

---

## Catalog Status: All 3 Waves Complete

All 71 components in the full catalog and 10 production blocks are implemented and render live in Chromium and Firefox. The CLI copy command copies real component source. The packages are not yet published to npm and the registry is not yet served from a public domain, so `npm install glacia` and `npx glacia add` will not work for outside users until they are hosted.

---

## Attributions & Disclaimer

- **Web Glass Engine:** Based on Glisse by Kelvin Zhang (MIT License).
- **React Native Engine:** Powered by `@callstack/liquid-glass` (MIT License).
- **Disclaimer:** Not affiliated with Apple. Liquid Glass is Apple's design material for iOS 26; Glacia is an independent implementation.
