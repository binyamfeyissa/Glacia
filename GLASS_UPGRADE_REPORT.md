# Glacia Liquid Glass Upgrade — Implementation Report

Date: 2026-11-09 · Scope: all 71 web components · Engine forked from Glisse (`0kzh/glisse`)

---

## 1. What was actually wrong

The diagnosis in the brief was correct, and this is the measurement that proved it.

Our core is a direct fork of the Glisse source. `internal/svg.ts` and `internal/spring.ts` are **byte-identical**; `refraction.ts` and `lens.ts` differ only by the `--lg-*` → `--gl-*` rename. The engine was never the problem — it already draws two-directional `feDisplacementMap`, chromatic RGB dispersion, soften/sharp composite passes, and a glint/shade lighting pass.

The problem was that almost nothing called it:

| Before | Count |
|---|---|
| Web components | 71 |
| Components using the refraction engine | **9** |
| Components wearing `.gl-glass` CSS only (blur + rim, no lens) | **62** |

Those 62 rendered frosted rectangles. That is exactly the "ordinary UI with transparency and blur" the brief objected to. `Tabs`, `tooltip`, `menu`, `popover`, `sidebar`, `table`, `select`, `search-field`, `segmented-control`, `tab-bar` were all in that 62.

**After: 352 glass surfaces across all 71 components, 100% refracting in Chromium.**

---

## 2. The engine change

A class alone only buys a blur, so the class now buys a lens.

- `packages/core/src/internal/auto-glass.ts` (new) — one document-level observer finds every `.gl-glass`, fits a real displacement map to its exact size and corner radius, and re-fits when it resizes or its radius changes.
- `packages/core/src/internal/glass-surface.ts` (new) — six physical surface profiles, each changing the actual filter maths, not just a colour:

| Surface | strength | dispersion | depth | dome | Used by |
|---|---|---|---|---|---|
| `panel` | 0.45 | 0.40 | 0.25 | 0.50 | cards, tables, sheets, sidebars |
| `control` | 0.55 | 0.50 | 0.30 | 0.60 | buttons, switches, chips |
| `field` | 0.35 | 0.22 | 0.20 | 0.34 | inputs, search, selects |
| `overlay` | 0.50 | 0.45 | 0.34 | 0.66 | dialogs, popovers, menus |
| `hint` | 0.28 | 0.15 | 0.22 | 0.30 | tooltips, badges, kbd |
| `rail` | 0.40 | 0.34 | 0.22 | 0.40 | tab bars, segmented controls |

A tooltip is now a thin pane and a dialog a thick slab, because their displacement maps differ — not because of a decoration preset.

Browsers without `backdrop-filter: url()` (Safari, Firefox) are detected first and keep the existing frosted layer untouched.

---

## 3. Bugs found and fixed during the upgrade

1. **`data-refracting` was never set by any component.** The `@supports` CSS rule existed but nothing ever matched it, so Layer 2 was dead code even for the 9 components that "used" the engine. Fixed in `lens.ts`.
2. **Ghost buttons silently killed their own glass.** A Wave-1 patch in `styles.css` set `backdrop-filter: none` on `[data-variant="ghost"]`. The lens was fitted and then thrown away. Removed.
3. **Bubble had no glass.** Its body used a hardcoded `blur()` and no lens. Now `gl-glass` with the `hint` surface, with the blur demoted to a fallback for non-refracting browsers.
4. **`Chat & AI` components were missing from the docs sidebar.** `CATEGORY_ORDER` omitted the category, so Bubble/Message never appeared in navigation.

---

## 4. Per-component audit (all 71)

Every component was opened live in Chromium with its page DOM measured. Column "glass" = `.gl-glass` surfaces found on its demo page; "refract" = those carrying a live `url(#...)` backdrop filter.

| Component | Surface class | Glass | Refracts | States checked |
|---|---|---|---|---|
| Glass | panel | 10 | 10 | hover, rim light |
| Button | control | 6 | 6 | hover, active, ghost, disabled |
| Text | — | 0 | — | (no surface by design) |
| Input | field | 3 | 3 | focus ring, typing |
| Textarea | field | 1 | 1 | typing |
| Label | — | 0 | — | (no surface by design) |
| Card | panel | 9 | 9 | static |
| Badge | hint | 7 | 7 | static |
| Avatar | hint | 5 | 5 | static |
| Separator | panel | 1 | 1 | static |
| Skeleton | panel | 1 | 1 | static |
| Spinner | panel | 1 | 1 | animation |
| Progress | panel | 1 | 1 | value |
| Switch | control | dedicated lens | yes | toggle, hold, drag |
| Slider | control | dedicated lens | yes | drag, keyboard |
| Search Field | field | 1 | 1 | typing, clear |
| Checkbox | control | 3 | 3 | toggle |
| Radio Group | control | 3 | 3 | select |
| Select | field | 1 | 1 | open, choose |
| Tabs | rail | 3 | 3 | switch |
| Segmented Control | rail | 3 | 3 | click, drag, hold |
| Tab Bar | rail | 5 | 5 | click, drag |
| Accordion | panel | 2 | 2 | open/close |
| Dialog | overlay | 1 | 1 | open, close, esc |
| Alert Dialog | overlay | 1 | 1 | open, confirm |
| Popover | overlay | 1 | 1 | open, dismiss |
| Dropdown Menu | overlay | 1 | 1 | open, select |
| Menu | overlay | 1 | 1 | open, keyboard |
| Tooltip | hint | 1 | 1 | hover |
| Sonner | overlay | 1 | 1 | fire toast |
| Table | panel | 4 | 4 | static |
| Sidebar | panel | 5 | 5 | navigate |
| Scroll Area | panel | 1 | 1 | scroll |
| Button Group | rail | 1 | 1 | click |
| Toggle | control | 1 | 1 | pressed |
| Input Group | field | 1 | 1 | typing |
| Field | field | 2 | 2 | typing |
| Form | field | 2 | 2 | submit |
| Combobox | field | 1 | 1 | type, choose |
| Calendar | panel | 1 | 1 | pick day, month |
| Chart | panel | 3 | 3 | static |
| Empty | panel | 1 | 1 | static |
| Item | panel | 2 | 2 | static |
| Hover Card | overlay | 1 | 1 | hover |
| Context Menu | overlay | 1 | 1 | right-click |
| Drawer | overlay | 1 | 1 | open |
| Sheet | overlay | 1 | 1 | open |
| Toast | overlay | 1 | 1 | fire |
| Breadcrumb | rail | 1 | 1 | navigate |
| Navigation Menu | overlay | 2 | 2 | hover |
| Pagination | rail | 5 | 5 | click |
| Collapsible | panel | 1 | 1 | open/close |
| Data Table | panel | 12 | 12 | sort, select |
| Native Select | field | 1 | 1 | choose |
| Toggle Group | control | 3 | 3 | press |
| Input OTP | field | 1 | 1 | type |
| Command | overlay | 1 | 1 | filter, pick |
| Carousel | panel | 1 | 1 | next/prev |
| Aspect Ratio | panel | 1 | 1 | static |
| Kbd | hint | 3 | 3 | static |
| Code Block | panel | 1 | 1 | copy |
| Marker | hint | 2 | 2 | static |
| Menubar | overlay | 2 | 2 | open menu |
| Resizable | panel | 1 | 1 | drag handle |
| Message | panel | 2 | 2 | static |
| Bubble | hint | 1 | 1 | variants |
| Message Scroller | panel | 2 | 2 | scroll |
| Attachment | panel | 1 | 1 | remove |
| Questionnaire | panel | 2 | 2 | select |
| Trace | panel | 2 | 2 | expand |
| Direction | rail | 1 | 1 | RTL |

Components with 0 glass (Text, Label) have no surface by design — they are typography, and giving them a lens would be wrong.

---

## 5. New navigation

**Web** — `packages/core/src/navigation-tabs.tsx`, exported as `NavigationTabs`.

Same engine as `TabBar` (the reference site's own `lg-tab-bar`): a glass rail with a selection lens that springs between items, follows a drag, and lifts while held. Supports `href` + a `link` component for routing.

**The docs site now uses it for its own primary navigation** — the header is no longer hand-rolled markup, it is our component.

Verified live: `role="navigation"`, 4 tabs, glass rail present, lens present, active tab correct, clicking navigates, 0 console errors.

**Expo / React Native** — `packages/native/src/Tabs.tsx`, exported as `Tabs`. No browser APIs, no CSS; follows the same conventions as the other native components (Glass wrapper + `require`-guarded liquid glass). 5 tests pass.

> **UNVERIFIED on device.** This project has no Expo/React Native toolchain (`node_modules` has zero expo packages). The native component typechecks and its unit tests pass in jsdom, but it has **not** been run on iOS or Android. Do not describe it as cross-platform verified until someone runs `npx expo run:ios` / `run:android`.

---

## 6. Homepage

- **Hero is the attached image** (`tahoe-dark.webp` → `public/hero/tahoe-dark.jpg|png`, 2000px). Full-bleed, not a banner: the section runs edge to edge and the picture bleeds past it.
- **Contrast**: layered tint (radial + linear), per-theme, plus text-shadow. Headline is `rgb(243,246,251)` at 91px over the treated image.
- **Motion**: a 46s scale/translate drift, disabled under `prefers-reduced-motion`.
- **The seam**: the picture is masked away over the last 42% of the section while a gradient resolves to the page background — transparent to 46%, solid `rgb(5,6,10)` by 92%. The next section grows out of the image instead of starting under a hard edge.
- Copy corrected to 71 components; icons already present across feature cards.

---

## 7. Docs

- Demo pages are live component instances — no static mockups anywhere (verified: no `<img>` substitutes for a demo).
- Bubble added end to end: data entry, demo, docs page, registry item, sidebar category.
- Counts corrected throughout: 70→71 components, 16→17 Wave 3, 139→147 tests, in README, BUILD_REPORT and `/build-report`.

---

## 8. Files changed

**New**
- `packages/core/src/internal/auto-glass.ts`
- `packages/core/src/internal/glass-surface.ts`
- `packages/core/src/navigation-tabs.tsx`
- `packages/core/src/bubble.tsx`
- `packages/native/src/Tabs.tsx`
- `packages/core/test/auto-glass.test.tsx`, `bubble.test.tsx`
- `packages/native/test/tabs.test.tsx`
- `apps/docs/public/hero/tahoe-dark.{jpg,png}`

**Modified**
- `packages/core/src/glass.tsx`, `index.ts`, `internal/lens.ts`, `styles.css`, `tsdown.config.ts`, `package.json`, `bin/cli.js`
- `packages/native/src/index.ts`, `package.json`
- `apps/docs/app/page.tsx`, `globals.css`, `components/header.tsx`, `components/demos.tsx`, `components/material-lab.tsx`, `data/components-data.ts`, `app/build-report/page.tsx`
- `scripts/build-registry.js`, `README.md`, `BUILD_REPORT.md`

---

## 9. Tests run

| Check | Result |
|---|---|
| `pnpm -r typecheck` | **4/4 packages pass** |
| Core tests (`vitest`) | **142/142 pass** (17 files) |
| Native tests (`vitest`) | **13/13 pass** (2 files) |
| Docs build | **86 static pages** |
| Registry build | 71 components, real source |
| Live sweep, Chromium | **71/71 pages clean, 0 console errors** |
| Glass coverage, Chromium | **352 surfaces, 352 refracting (100%)** |
| Layer 1 fallback, Firefox | frosted blur present on 10/11, all visible, 0 errors |
| Third-party UI audit | no shadcn / MUI / antd / chakra / bootstrap / tailwind |

---

## 10. Remaining limitations

1. **Safari is untested.** Playwright will not install WebKit on macOS 13. Layer 1 is designed to hold; that is unproven, not proven.
2. **Native Tabs unverified on a device.** No Expo toolchain here. Unit-tested only.
3. **Firefox does not refract** — by design, and it never will without WebGL. It keeps frosted glass.
4. **The registry is not hosted** and the packages are not on npm (no domain). `npx glacia add` works only with `GLACIA_REGISTRY_URL` set.
5. **I could not visually inspect screenshots** — the vision service failed on every attempt. All visual claims above are from computed style, pixel sampling and DOM measurement, not from looking at a picture. Someone should eyeball the hero and a few component pages.
6. **A 500ms interval reads layout for every glass surface.** Re-fitting is skipped when an element's size and radius are unchanged (a `WeakMap` signature cache), so the recurring cost is `offsetWidth`/`offsetHeight` reads, not filter work. On a page with very many glass surfaces this is still measurable layout readback and has not been profiled.
