# Part 5 — Fallback material rebuild: implementation report

Scope: everything here is inside the **fallback branch** (`FallbackGlassView`: iOS
below 26, Android, Expo Go). The iOS 26 branch (`LiquidGlassView` / `UIGlassEffect`)
was not modified, and the new props are deliberately **not forwarded** to it
(pinned by `test/fallback-material.test.tsx`).

Baseline: `glacia-native@0.5.1` in this repo. Verification: `packages/native`
typecheck clean, **384 tests / 19 files pass**, the web package's suite unaffected,
and the `native-proof` web export bundles.

---

## 1. What changed, file by file

| File | Change |
|---|---|
| `src/internal/material.ts` **(new)** | The six web surface profiles (`panel`, `control`, `field`, `overlay`, `hint`, `rail`) mapped to fallback parameters: blur strength from `bend`, rim brightness from `dome`, top highlight from `depth`, plus the default surface shadow. `clear` thins the whole lens (×0.55). |
| `src/internal/blur.ts` **(new)** | Lazy runtime resolver: `expo-blur` first, then `@react-native-community/blur`; returns null when neither is installed (jsdom, bare apps). Maps one intensity onto each backend's own prop names. |
| `src/internal/rim.tsx` **(new)** | SVG rim: a rounded-rect stroke with a vertical gradient (bright top → nearly gone at the bottom) plus an inner top highlight. This is the layer that makes corners read as curved. |
| `src/internal/glow.tsx` **(new)** | Specular press glow (radial white at 0.035, the web overlay alpha), faded in with the package's spring tokens; respects Reduce Motion. |
| `src/internal/fallback.tsx` | Rebuilt as a layered stack: outer View keeps the caller's style, radius, 0.5px edge and shadow; an absolutely-positioned clipped layer behind the children holds blur → tint → rim → glow (each with a derived `testID`, `-material` / `-tint`). Solid (Reduce Transparency) and `effect="none"` keep the old flat path. |
| `src/internal/GlassView.tsx`, `src/Glass.tsx` | New optional `surface` and `pressed` props, forwarded to the fallback only. `SurfaceProfile` exported from the package index. |
| `src/internal/primitives.ts` | `RadialGradient` added (the press glow). |
| `src/internal/tokens.ts` | `material` (rim 0.30/0.13, highlight 0.10, glow 0.035, shadow 0.06/0, rim colour), `surface` (the web's 0.86 near-solid), `stack` radius, and the light separator aligned to the web's **0.15**. |
| `packages/tokens/src/tokens.json`, `src/index.ts` | Light separator `0.15` (one agreed value across tokens/CSS/native); `radii.stack: 26` added (the web's `--gl-radius-stack`). |
| `packages/native/package.json` | `expo-blur` and `@react-native-community/blur` as **optional** peer dependencies. |
| `apps/native-proof/package.json` | `expo-blur ~15.0.7` installed so the proof app can show a real backdrop blur. |
| `packages/native/README.md` | New "The fallback material" section documenting the layers and the two props. |

Test changes (`packages/native/test/`): a new `fallback-material.test.tsx`, and small
updates to `glass-routing`, `fixes` and `new-components` where the assertions pinned
the old single flat View (tint now lives on `-tint`), the old 0.5px separator (now
1px, web value) and child-index lookups that the new material layer shifted.

---

## 2. §5.1 — the material, layer by layer

| Layer | Status |
|---|---|
| Backdrop blur | **Implemented**, real `UIVisualEffectView` on iOS 17 via expo-blur / community-blur. Integer intensity per profile (control 24 at base, field ~15, hint ~12, overlay ~22, rail ~17, panel 24 at profile scale). No blur backend installed ⇒ the rest of the stack still renders. |
| Tint | Token unchanged (0.60 / 0.62); `clear` → 0.35; opaque caller backgrounds are treated as filled controls (no blur tint, fainter rim). |
| Saturation | **Not possible.** Neither backend exposes a saturation control. Reported, not faked with a coloured overlay (per the brief). |
| Rim light | **Implemented** (SVG gradient stroke, profile-scaled). `hint` is the faintest, `control` the brightest. |
| Edge line | Kept at 0.5px in the `edge` token; a caller that asked for a 1px box border is brought back to the hairline; single-edge components (AppBar's scroll edge) keep their own widths. |
| Drop shadow | **Implemented** on the outer (unclipped) View: default `0 1px 3px` black 0.06 light / none dark, suppressed for the `hint` family; overlays supply their own deeper shadow through `style`. |
| Press glow | **Implemented** for Button, Toggle, Chip, SegmentedControl, TabBar, Tabs (a held segment/tab lights the control). |
| Surface profiles | **Implemented** and routed: control → Button/Switch/Checkbox/Radio/Toggle/Chip/FAB/Stepper/ToggleGroup; field → Input/Textarea/Select/Combobox/InputOTP/AIInput; overlay → Dialog/AlertDialog/ActionSheet/Menu/Sheet/Toast/Select panel/Combobox dropdown; rail → TabBar/Tabs/SegmentedControl; panel → Card/List/Accordion/Message; hint → rule available for Badge (see exceptions). |
| Reduce Transparency | Unchanged: solid swap, all layers bypassed. |

True refraction (the backdrop visibly bending at the rim) is still impossible in RN
views; that remains the separate native-shader research item.

---

## 3. §5.2 — components routed through the glass

| Component | Before | Now |
|---|---|---|
| `Input` | `backgroundColor: theme.glass` + 1px border | `Glass surface="field"`, pill radius, 0.5px edge |
| `Textarea` (same component, multiline) | raw glass colour | `Glass surface="field"`, radius 18, min height 84, 10×14 padding |
| `Select` trigger | raw glass, radius 14, 1px border | `Glass surface="field"`, pill, height 34; panel `surface="overlay"` + shadow |
| `Combobox` trigger / dropdown | raw `fieldWash` / raw glass panel | `Glass surface="field"` pill / `surface="overlay"` + 0 12 32 shadow |
| `MessageBubble` | flat `glassActive` / `wash` | `Glass surface="panel"`; outgoing keeps the selected tint |
| `MessageAttachment` | flat wash | Flat wash kept (it sits *inside* a bubble — glass in glass is not allowed), metrics aligned to web 8×12 |
| `NativeAIInput` field | raw glass + 1px border | `Glass surface="field"`, pill, padding 6/6/6/16 |

Grep proof: no component file paints `theme.glass` / `theme.fieldWash` as a surface
any more (only `glassActive` for selection states, which is the web's own tint).

---

## 4. §5.3 — geometry adopted (per component)

| Component | Adopted from the web | Kept / exception |
|---|---|---|
| Button | heights 28/34/44, padding 14 at every size, font 14, weight 400, icon gap 7, control profile, press glow | — |
| Switch | track 60×25, thumb 21 | thumb is a white lens with the shadow stack and 1.06 lift on hold; inset highlights are not expressible in RN |
| Slider | track 6 / radius 3, thumb 36×24 lens with shadow | — |
| SegmentedControl | segment 32 (container 36), container pill, thumb pill, labels 500 / 400, rail profile | — |
| TabBar | bar 40, radius 20, 4pt inset, indicator pill, label 13, 500 / 400, rail profile | — |
| Tabs | rail profile on the list | list metrics were already the web's |
| Card | padding 24 (from 20), inner gap 16 (from 12) | — |
| Input / Textarea | single-line pill (999), textarea radius 18 / min 84 / padding 10×14, horizontal 14 | **the `size` prop stays** (`sm`/`md`/`lg` = 28/34/44). The web has one field height; dropping the prop would be a breaking API change, so `md` (the default) matches the web exactly |
| Field | gap 7, description 12 | — |
| Label | weight 500 (Field label remains 600, as on the web) | — |
| Checkbox | unchecked = glass control, checked = fill + glass, 0.5px edge | — |
| RadioGroup | selected = 8px white dot on the fill; unselected = glass circle | — |
| Toggle | `md` height 34, font 14, control profile, press glow | `sm` 30 / `lg` 44 kept as the size API (the web has one size) |
| ToggleGroup | near-solid surface 0.86, shadow 0 2 8, padding 3, pill | item radius follows the pill, not the web's 11 |
| Stepper | height 34, buttons 46 wide, glyph 17, control profile | — |
| Badge | height 24, padding 0×10, font 12/500 | **tone colours kept**: the badge's public API is tone-based (fill / destructive / success / muted); making it translucent would destroy the contrast that is its job. The `hint` profile is available on `Glass` for a future tone-neutral badge |
| Separator | 1px (was 0.5), one agreed token value 0.15 / 0.16 | — |
| List | row min-height 44 (was 48), section header 12/600, padding 16/5, panel profile | selection still `glassActive` (the web's 0.03 wash has no token yet) |
| Accordion | item radius 26 (`radii.stack`), trigger 16×20, body 20/16, panel profile | — |
| NativeTable | cell padding 12×16, header 12/600, caption 12 | **no frame change**: this component draws rows, not a bordered frame, so there is no 26-radius wrapper to change |
| Dialog / AlertDialog | panel radius 28 (was 20), overlay profile, shadow 0 20 50 at 0.12, description 14/20 | — |
| Menu | radius 20 (was 14), near-solid surface, overlay profile, shadow 0 12 40 at 0.12, row min-height 40 | — |
| ActionSheet | **separate glass pill rows** (radius 999), 17pt blue items, destructive red, its own cancel pill, title block as its own card | — |
| Sheet | radius 28 top, padding 24, overlay profile, shadow 0 0 40 at 0.5 | — |
| Toast | padding 12×16, min 280 / max 400, title 13, overlay profile, shadow 0 10 30 at 0.12 | radius 20 (`radii.lg`) instead of the web's 18 — 18 is not on the token scale and one component should not invent a radius |
| Chip | height 34 (was 30), font 14 | selected weight 600 kept (web 500) for touch legibility |
| Message bubble | padding 10×14, panel profile, shadow | radius 20 (`radii.lg`) instead of 18 — same token-scale reason |
| Message attachment | padding 8×12 | — |

Charts: untouched. They are data drawings, not glass; they now inherit the new
material from their container. The web's gradient bar fill is still a follow-up.

AI family (`NativePlan`, `NativeResponse`, `NativeTask`, `NativeSources`,
`NativePanelside`, `NativeSoundwave`, `NativeThinkingOrb`, `NativeImageGeneration`):
untouched apart from `NativeAIInput`. Their active rows already use the selected
tint; routing each one is the next wave.

---

## 5. What is **not** verified

Nothing in this list was checked on hardware — the sandbox has no simulator or
device, and no screenshot pair was produced.

- Blur intensity, rim brightness, highlight and shadow **against the web** over the
  same busy photo, light and dark, on a real iOS 17 device.
- The press glow's feel (spring timing) on device; off-device only the settled state
  is asserted.
- Reduce Transparency on device (unit-tested through the preference probe only).
- Android: elevation shadow, and the blur backend (community-blur / expo-blur's
  Dimezis method), which behave differently from iOS.
- The fallback with **no** blur package installed (the intended graceful
  degradation) has only been exercised in jsdom, not on a phone.
- `expo-blur ~15.0.7` was installed and the **web** export bundles, but the iOS
  project was not rebuilt, so the native blur path was not run at all.
- Saturation parity: accepted as impossible; not measured.
- Layout parity between branches is preserved structurally (same style on the outer
  View) and covered by the existing both-branch tests, but not eyeballed on device.

---

## 6. Commands run

```
packages/native        npx tsc --noEmit            clean
packages/tokens        npx tsc --noEmit            clean
packages/native        npx vitest run              384 passed (19 files)
packages/core          pnpm test                    pass (one pre-existing 5s
                                                   Calendar timeout, green on re-run)
apps/native-proof      expo export --platform web  bundled (dist-web)
```

---

## 7. Second pass — routing, lenses, charts, AI

| Area | Change |
|---|---|
| Profile routing | `AppBar` → `rail`; `FAB`, `FABGroup` (label pill, icon circle, main button) and `IconButton` → `control`; `SearchBar` → `field`; `Drawer` → `overlay`; `ButtonGroup` → `control`; `Banner` → `overlay`; `Avatar` → `panel`; `Progress` → `rail`. Every `Glass` in `Bars`, `Display`, `Overlays`, `Forms2`, `Feedback` now names its profile; none falls through to the default. |
| Selected lenses **(new `src/internal/lens.tsx`)** | `SelectedLens` paints the selected tint, a soft 0 2 8 shadow and the same rim gradient as a surface — the web's lens, without nesting glass inside glass. `LensRim` exposes just the painted rim for indicators that must keep their own animated view. Applied to: `ListItem` (selected row, `…-lens` testID), Select options, ToggleGroup selected item, Combobox options, Calendar day (circle, today keeps its ring), TimePicker AM/PM and drum rows, `NativePanelside` active row. |
| SegmentedControl / TabBar indicators | Keep their sliding `Animated.View` (no nested `Glass`), but gain the lens shadow and a `LensRim` child, so the thumb reads as a lifted lens rather than a flat tint. |
| Charts — `NativeBarChart` | One `LinearGradient` per series (stop 1 → 0.62 → 0.04, top to bottom, i.e. colour → transparent) inside `<Defs>`; every bar is filled by `url(#bar-…)` and stroked with its series colour at 0.35 alpha and 0.5px, the web's inset edge. `strokeWidth` is pinned at ≤ 1px by test. Axis, labels, stacking and hit targets are unchanged. |
| AI family | `NativePlan`, `NativeResponse`, `NativeTask`, `NativeSources`, `NativePanelside` roots are now `Glass surface="panel"` (padding 14 × 12, `radii.lg`); `NativeTask`'s `progressbar` accessibility props moved onto that surface so screen readers still announce progress. `NativePanelside`'s active row is the lens. `NativeSoundwave`, `NativeThinkingOrb` and `NativeImageGeneration` have **no surface of their own** (bars, orb and image frame respectively) — confirmed; they inherit the panel material of whatever card holds them. |

Remaining, deliberately: the AI family's inner rows other than the panelside's
selection, and the 18 other charts (only the bar chart has the web's gradient
fill; the rest stay flat series colours as agreed).

## 8. Second-pass verification

- `npx tsc --noEmit` clean.
- `npx vitest run`: **393 tests / 20 files**, including the new
  `test/selected-states.test.tsx` (9 tests) which pins the lens rim on a
  selected row and its absence when unselected, the two-rim presence in
  ToggleGroup / NativePanelside, the rim on both sliding indicators, the bar
  gradient's three stops and ≤ 1px edge, and the five AI roots plus the
  second-pass surfaces rendering the fallback material.
- One guard was amended rather than the code: `style-conformance`'s
  "uses glassActive for selected states" now accepts `SelectedLens` as well as
  the raw token, because the lens is the shared selection language and the
  component files no longer carry the colour themselves (the lens module does).

Not verified on hardware, additionally: the lens shadow on real Android
(elevation differences), whether the rim at 0.66 of a panel's alpha is visible
enough on a bright photo, the feel of the animated indicator with the added rim
(everything above is the settled state off-device), and `Drawer`'s overlay
profile — jsdom renders no `Modal`, so only the unit-level surface was checked.
