# Glacia Build Report

**Verified Release Date:** 2026-11-09  
**Version:** v0.2.0 (Wave 1 + Wave 2 Complete)

This report provides an honest, verified account of all components, blocks, packages, and test suites shipped in Glacia, along with tested browser capabilities and future roadmap items.

---

## Executive Summary

| Category | Shipped Count | Status |
| :--- | :--- | :--- |
| **Shipped Web Components** | **54** (33 Wave 1 + 21 Wave 2) | Built, tested, and verified |
| **React Native Components** | 7 | Shipped with iOS 26+ `UIGlassEffect` & fallback ladder |
| **Production Ready-Made Blocks** | **5** | Login Page, Admin Dashboard, Settings, Profile, Signup |
| **Passing Automated Unit Tests** | **118 / 118** | 110 `glacia` (core) + 8 `glacia-native` |
| **Design Tokens** | Complete | Cross-platform JSON, CSS, and React Native maps |
| **CLI & Registry Distribution** | Functional | `npx glacia add <comp>`, `npx glacia add all`, npm packages |

---

## Shipped Wave 2 Web Components (21 New)

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

## Shipped Ready-Made Blocks (5)

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
| **Chromium** (Chrome, Edge, Arc, Brave) | Supported | Supported | Full dynamic SVG refraction bend behind `@supports` |
| **Safari** (macOS & iOS) | Supported | Graceful Fallback | Layer 1 frosted blur, border highlight, and elevation |
| **Firefox** (macOS, Windows, Linux) | Supported | Graceful Fallback | Layer 1 frosted blur, border highlight, and elevation |
| **Reduced Motion** (`prefers-reduced-motion`) | Respected | Disabled | Removes shimmer and dynamic movement |

---

## Roadmap: Remaining (Wave 3)

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
