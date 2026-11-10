# Glacia × Figma — Component Reconciliation

Source: your list of 25 iOS/iPadOS 26 components + `liquid glass.fig`
(community file "iOS and iPadOS 27"). Status: complete, measured.

---

## 1. Final scoreboard — all 25 of your components

| Your Figma component | Glacia component | On site | Refracts |
|---|---|---|---|
| Action Sheets | `ActionSheet` **(new)** | ✅ | ✅ 3/4 |
| Activity Views | `ActivityView` **(new)** | ✅ | ✅ 7/8 |
| Alerts | `AlertDialog` (existing) | ✅ | ✅ |
| Buttons | `Button` (Glisse engine) | ✅ | ✅ |
| Color Pickers | `ColorPicker` **(new)** | ✅ | ✅ 4/5 |
| Contextual Menus | `ContextMenu` (existing) | ✅ | ✅ |
| Date & Time Pickers | `Calendar` + `TimePicker` **(new)** | ✅ | ✅ 3/4 |
| Empty States | `Empty` (existing) | ✅ | ✅ |
| Lists | `List` + `ListItem` **(new)** | ✅ | ✅ 6/7 |
| Menus | `Menu` (Glisse engine) | ✅ | ✅ |
| Notifications | `Sonner` + `Toast` (existing) | ✅ | ✅ |
| Page Controls | `PageControl` + `PageDots` **(new)** | ✅ | ✅ 6/8 |
| Popovers | `Popover` (existing) | ✅ | ✅ |
| Pop-up Buttons | `PopupButton` **(new)** | ✅ | ✅ 5/6 |
| Progress Indicators | `Progress` (existing) | ✅ | ✅ |
| Segmented Controls | `SegmentedControl` (Glisse engine) | ✅ | ✅ |
| Sheets | `Sheet` (existing) | ✅ | ✅ |
| Sidebars | `Sidebar` (existing) | ✅ | ✅ |
| Sliders | `Slider` (Glisse engine) | ✅ | ✅ |
| Steppers | `Stepper` **(new)** | ✅ | ✅ 4/5 |
| Tab Bars | `TabBar` (Glisse engine) | ✅ | ✅ |
| Text Fields | `Input` / `SearchField` / `Textarea` | ✅ | ✅ |
| Toggles | `Switch` / `Toggle` / `ToggleGroup` | ✅ | ✅ |
| Toolbars | `Toolbar` **(new)** | ✅ | ✅ 5/7 |
| Widgets | `Widget` **(new)** | ✅ | ✅ 7/8 |

**25 / 25 covered. 10 built new this pass, 15 already existed.**

---

## 2. What was added

### New components (10 + 1 helper)

| File | Exports |
|---|---|
| `action-sheet.tsx` | `ActionSheet`, `ActionSheetItem`, `ActionSheetProps` |
| `activity-view.tsx` | `ActivityView`, `ActivityViewProps` |
| `color-picker.tsx` | `ColorPicker`, `ColorPickerProps` |
| `list.tsx` | `List`, `ListItem`, `ListProps`, `ListItemProps` |
| `page-control.tsx` | `PageControl`, `PageDots`, `PageControlProps`, `PageDotsProps` |
| `popup-button.tsx` | `PopupButton`, `PopupButtonProps` |
| `stepper.tsx` | `Stepper`, `StepperProps` |
| `time-picker.tsx` | `TimePicker`, `TimePickerProps` |
| `toolbar.tsx` | `Toolbar`, `ToolbarItem`, `ToolbarProps` |
| `widget.tsx` | `Widget`, `WidgetProps` |

### Docs wiring
- 10 entries added to `apps/docs/data/components-data.ts` (81 total, `wave: 4`)
- 10 live demos added to `apps/docs/components/demos.tsx`
- 5 stateful demo helpers: `ActionSheetDemo`, `ColorPickerDemo`,
  `PageControlDemo`, `StepperDemo`, `TimePickerDemo`
- Sidebar categories verified live:
  - **Buttons & Actions** → Pop-up Button
  - **Text & Forms** → Color Picker, Stepper, Time Picker
  - **Showing Things** → Activity View, List, Widget
  - **Navigation & Layout** → Page Control, Toolbar
  - **Popups & Menus** → Action Sheet
- Counts updated 71 → 81 on home page, header, and dials panel

### Registry
`scripts/build-registry.js` now emits **81** components. Ten new JSON files
written to `registry/new-york/`.

---

## 3. The four global dials (as you asked)

All four read live by the engine, settable on `:root` or per element:

| Dial | Property | Default | Effect |
|---|---|---|---|
| **Bend** | `--gl-glass-bend` | `0.45` | rim band width — how far the glass bends |
| **Dispersion** | `--gl-glass-dispersion` | `0.4` | chromatic split — red bends 8% further |
| **Frost** | `--gl-glass-frost` | `1` | frost multiplier (× 3px base blur) |
| **Rim** | `--gl-rim-shine` | `0.3` light / `0.13` dark | light caught on the rim |

The docs site ships a **Glass Optics** panel (`glass-dials.tsx`) exposing all
four as sliders with a Reset to Glisse defaults.

**Verified live:** setting `--gl-glass-bend` from `0.45` → `1.2` and
`--gl-glass-dispersion` → `1.0` changed the card's computed
`backdrop-filter` from `url("#glacia-backdrop-12")` and re-fitted the lens
(`FILTER CHANGED: true`).

---

## 4. Verification actually run

| Check | Result |
|---|---|
| `pnpm typecheck` | **exit 0**, all packages |
| `pnpm test` | **155/155 pass** (core 142, native 13) |
| Core build | **exit 0** |
| Docs build | **exit 0**, **96 static pages** |
| Registry build | **81 components** with real source |
| **81-page Chromium sweep** | **507 surfaces, 409 refracting, 0 blur-only** |
| Pages with zero refraction | **none** |
| Console errors | 1 hydration warning per page, **pre-existing on all pages** incl. `/components/button` — caused by the engine setting `data-rim`/`style` at mount, not by new code |
| New-component screenshots | `images/screens/*.png`, inspected via vision model |

---

## 5. Honest gaps

1. **I did not read your actual Figma pixels.** The `.fig` is a binary Kiwi
   file; the extracted PNGs were either unreadable thumbnails or dumps the
   vision model could not parse. So matching is against **your component
   names + Apple HIG conventions**, not against your specific frames. If you
   export the frames as PNGs I can tighten radii, spacing, and sizes to your
   exact spec.
2. **Widget sizing** — a vision check noted the `sm` widget is square and
   `lg` is large, but the demo pair reads as a square + narrow portrait rather
   than Apple's 2×2 / 4×2 footprints. Cosmetic, adjustable once I see the file.
3. **Time picker scrolling** is plain wheel/touch scroll with snap, not the
   inertial drum of UIKit. Functional, not identical.
4. **Action Sheet** does not yet implement the iPad popover presentation
   (it is bottom-sheet only).

---

## 6. How to run

```bash
cd apps/docs
pnpm dev -p 3000     # http://localhost:3000
```

Production:
```bash
pnpm --filter docs build
cd apps/docs && pnpm start -p 3000
```
