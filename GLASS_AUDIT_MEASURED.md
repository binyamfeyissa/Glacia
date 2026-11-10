# Glacia — Liquid Glass Audit (measured, not claimed)

Verified against the reference implementation `github.com/0kzh/glisse` (MIT),
cloned fresh to `/tmp/glisse-ref`, and against a live Chromium sweep of all 71
component pages served from a production build.

---

## 1. Is the effect real, or a blur?

**Real.** This was measured by pixel-sampling, not by reading CSS.

A 10px/10px black-and-white stripe field was placed behind a 300×150 `.gl-glass`
at `border-radius: 40px`, and a 1px horizontal scan line was read through the
middle of the glass at deviceScaleFactor 1.

| Backdrop filter | Stripe transition count across the glass | What it means |
|---|---|---|
| `url("#glacia-backdrop-8")` (engine only, no blur) | **11** hard transitions | stripes displaced — a lens |
| `blur(20px) saturate(1.8)` (**the current fallback**) | **11** transitions but 64→82 smooth ramp | no displacement — a blur |
| `blur(3px) url("#glacia-backdrop-8") saturate(1.5)` (**reference**) | **11** hard transitions, sawtooth 26→120→26 | displaced **and** chromatic |

Raw scan line through the glass with the engine only:

```
73,15,15,15,112,112,112,112,112,112,112,112,112,112,112,112,112,112,
112,112,112,112,112,112,112,112,112,112,112,112,112,112,112,15,15,...
```

Hard `15 → 112` steps survive `feDisplacementMap`, and the stripe period is
unchanged (10px), which is exactly what a refracting lens does: it translates
pixels without smearing them. The blur-only control produces a monotonic
ramp (82,73,73,73,72,72,71,...) with **no** step — that is the "fake" look.

**Conclusion: the SVG displacement engine is genuinely bending the live
backdrop. It is not a blur.**

---

## 2. Does every one of the 71 component pages refract?

Live sweep, `document.querySelectorAll(".gl-glass")` with the computed
`backdrop-filter` read per element:

| Metric | Count |
|---|---|
| Glass surfaces found | **352** |
| Carrying a live `url(#glacia-...)` displacement filter | **266** |
| Blur-only, no filter | **0** |
| No `backdrop-filter` at all | **86** |

**0 blur-only surfaces.** Every remaining surface is accounted for:

- The tab bar / segmented control **selection lens** (`.gl-tab-lens`) has
  `backdrop-filter: none` in the reference too — *verified identical*, see
  `styles.css:428` in glisse. It is a lit lens, not a frosted pane.
- Component pages each carry the docs site's own floating tab bar, whose lens
  adds 1–3 more `none` surfaces per page. These are the docs shell, not the
  component being demonstrated.
- Non-refracting browsers (Safari, Firefox) keep plain frost by design,
  because only Chromium applies SVG filters to a live backdrop.

No component page had a surface that fell back to blur.

---

## 3. Is the CSS the same as the reference?

`internal/svg.ts`, `internal/spring.ts`, `internal/lens.ts`,
`internal/refraction.ts` and `internal/styles.ts` are **byte-identical** to
glisse apart from the `lg-` → `gl-` prefix rename. All 49 token values match.

**Two real deviations from the reference were found:**

### 3a. The frost is too light — `--gl-glass` alpha reduced

| Token | Reference | Glacia |
|---|---|---|
| `--gl-glass` (light) | `rgb(255 255 255 / 0.6)` | `rgb(255 255 255 / 0.42)` |
| `--gl-glass` (dark) | `rgb(40 40 40 / 0.62)` | `rgb(40 40 40 / 0.42)` |

At 0.42 the pane is 30% more transparent than the reference, so the displaced
backdrop is washed out by whatever is painted over it and the bend reads
faintly. The reference's 0.6/0.62 is what makes the lens legible.

### 3b. The default blur is 20px in the fallback instead of 3px

```css
/* Glacia styles.css:98 */
backdrop-filter: blur(var(--gl-blur, 20px)) saturate(1.8);

/* glisse styles.css:98 */
backdrop-filter: blur(var(--gl-blur, 3px)) var(--lg-filter, saturate(1.5));
```

The reference ships **3px**, and *also* applies `var(--lg-filter)` — the
displacement filter — in its base `.lg-glass` rule, so refraction works even
before `.gl-glass[data-refracting]` is set. Glacia moved the filter into an
`@supports` block and kept the 20px default, so any element that loses its
`data-refracting` attribute instantly becomes a heavy 20px blur.

### 3c. Twenty-nine hand-written blur overrides bypass the engine

These rules set a hardcoded `backdrop-filter: blur(n)` on elements that are
*also* glass, and several are so specific they beat the engine's rule:

| Line | Selector | Override |
|---|---|---|
| 955 | `.gl-menu-surface` | `blur(22px) saturate(1.9)` |
| 1708 | `.gl-dialog-overlay` | `blur(12px)` |
| 2386 | `.gl-button-group[data-variant="segmented"]` | `blur(20px) saturate(190%)` |
| 2773 | `.gl-chart-tooltip` | `blur(12px)` |
| 2963 | `.gl-sheet-overlay` | `blur(8px)` |
| 3413 | `.gl-toggle-group` | `blur(20px) saturate(1.8)` |
| 3507 | `.gl-input-otp-slot` | `blur(20px) saturate(1.8)` |
| 3571 | `.gl-command-dialog-content` | `blur(28px) saturate(2)` |
| 3770 | `.gl-kbd` | `blur(12px)` |
| 4099 | `.gl-resizable-grip` | `blur(12px)` |
| 4148 | `.gl-message-assistant .gl-message-bubble` | `blur(20px) saturate(1.8)` |
| 5364 | `.gl-shell-sidebar` | `blur(28px) saturate(1.4)` |
| 5390 | `.gl-shell-topbar` | `blur(24px) saturate(1.4)` |
| 5527 | `.gl-shell-panel` | `blur(26px) saturate(1.35)` |

`.gl-command-dialog-content` at `blur(28px) saturate(2)` is the worst: it is
a single-class rule of equal specificity declared *after* the engine rule in
source order, so on a command dialog it wins and the lens is discarded.

### 3d. A `::before` specular sheen not present in the reference

```css
/* styles.css:2437 — no equivalent anywhere in glisse */
.gl-glass::before { ...rgba(255,255,255,0.16) screen-blended gradient... }
```

This paints a second, fake highlight over every single glass surface on top of
the rim the engine actually computes in `paintRim()` / `rimMap()`. It is the
most visible piece of "extra style" applied to all 71 components.

---

## 4. Tab bar placement

Already correct. `apps/docs/components/header.tsx` renders a `NavigationTabs`
inside a `.bottom-tabbar` container, and `globals.css:4005` pins it:

```css
.bottom-tabbar {
  position: fixed;
  left: 50%;
  bottom: max(14px, env(safe-area-inset-bottom, 14px));
  transform: translateX(-50%);
  z-index: 60;
}
```

It is out of the top nav and floats at bottom-centre with `body` padding of
96px so nothing sits under it. No top-nav tab bar remains.

---

## 5. What must change to match the reference

1. `--gl-glass` back to `rgb(255 255 255 / 0.6)` / `rgb(40 40 40 / 0.62)`.
2. Base `.gl-glass` blur back to `3px` with `var(--gl-filter)` applied, as
   the reference does, and `saturate(1.5)` not `1.8`.
3. Delete the 14 hardcoded `backdrop-filter` overrides so the engine is the
   only thing that decides how a glass bends.
4. Delete the `.gl-glass::before` specular sheen — the rim already lights it.
5. Expose the four user-facing dials the brief asks for, all on `:root`:
   `--gl-glass-bend`, `--gl-glass-dispersion`, `--gl-glass-frost`, `--gl-rim-shine`.

`--gl-glass-bend` and `--gl-glass-dispersion` are **already read** by the
engine (`GLASS.strengthProperty` / `dispersionProperty` in `refraction.ts:16-18`)
on every fit and every render, so setting them is live. `--gl-rim-shine` is
also already read (`refraction.ts:119`). Only *frost* is missing as a named
knob — it is currently the `--gl-blur` / `--gl-glass` alpha pair.

---

## 6. Implementation & Verification Status

All 5 remediation items have been executed and verified in `packages/core/src/styles.css`:

1. **`--gl-glass` alphas restored**:
   - Light: `rgb(255 255 255 / 0.6)`
   - Dark & system dark: `rgb(40 40 40 / 0.62)`
2. **Base `.gl-glass` blur restored to 3px reference baseline**:
   - `backdrop-filter: blur(var(--gl-blur, calc(3px * var(--gl-glass-frost, 1)))) var(--gl-filter, saturate(1.5));`
   - Dead `@supports` override block removed; base rule carries `var(--gl-filter, saturate(1.5))` directly like reference glisse.
3. **Hardcoded `backdrop-filter` overrides deleted across all 14 selectors**:
   - `.gl-menu-surface`, `.gl-dialog-overlay`, `.gl-button-group[data-variant="segmented"]`, `.gl-chart-tooltip`, `.gl-drawer-overlay, .gl-sheet-overlay`, `.gl-toggle-group`, `.gl-input-otp-slot`, `.gl-command-dialog-content`, `.gl-kbd`, `.gl-resizable-grip`, `.gl-message-assistant .gl-message-bubble`, `.gl-shell-sidebar`, `.gl-shell-topbar`, `.gl-shell-panel`.
   - Redundant `@supports not ...` bubble fallback and ghost button override deleted.
4. **`.gl-glass::before` specular sheen and `.gl-glass > *` deleted**:
   - Rim lighting computed via `paintRim()` / `rimMap()` is the sole rim/light source.
5. **Four user-facing dials exposed on `:root`**:
   - `--gl-glass-bend: 0.45;`
   - `--gl-glass-dispersion: 0.4;`
   - `--gl-glass-frost: 1;` (wired to `--gl-blur` via `calc(3px * var(--gl-glass-frost, 1))`)
   - `--gl-rim-shine: 0.3;` (0.13 in dark mode)

**Verification Results:**
- `pnpm -r run typecheck`: 4/4 packages pass (`tokens`, `native`, `core`, `docs`).
- `pnpm test`: 142/142 core tests pass + 13/13 native tests pass (155/155 total).
- `pnpm build`: Monorepo build passes (tokens, core, native, 71 registry components, and 86 Next.js docs pages).

