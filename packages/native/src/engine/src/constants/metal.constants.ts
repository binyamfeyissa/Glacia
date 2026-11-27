import { Platform } from "react-native";

import type { GlassMetalOptions } from "../core";

/**
 * The reference's glass recipes, one per surface, in the base view's `metal` vocabulary.
 *
 * Translation table between the two APIs:
 *
 * | Kyant `backdrop`                  | `expo-liquid-glass-ui`                       |
 * |-----------------------------------|----------------------------------------------|
 * | `vibrancy()`                      | `saturation: 1.5` (it *is* `saturation=1.5`)  |
 * | `blur(Ndp)`                       | `blurRadius: N`                               |
 * | `lens(height, amount)`            | `refraction: { width: h, height: h, amount }` |
 * | `chromaticAberration = true`      | `dispersion: { amount, reach, quadrant: 1 }`  |
 * | `Highlight.Default`               | `highlight: { intensity, angle, width, falloff }` |
 *
 * Three constraints have no counterpart in the reference and bite if ignored:
 *
 * - **Effect order is fixed** in the shader as colour filter → blur → lens, which happens to be
 *   the order the reference declares them in anyway.
 * - **Dispersion is a magnitude here, not a boolean.** Below ~2dp of spread the shader skips it
 *   entirely; above the tap budget it bands. `quality: "medium"` spaces its 8 taps one *point*
 *   apart (clean to ~8dp) while `"high"` spaces its 16 one *pixel* apart, so a wide fringe wants
 *   the expensive tier and a narrow one does not care.
 * - **`quadrant` is what makes it read as the reference's aberration rather than a rim fringe.**
 *   Kyant scales the split by `(cx·cy)/(hx·hy)`: nothing along either centre line, everything at
 *   the corners, and the sign flipping between neighbours so the hue order reverses with it. On a
 *   capsule that puts all the colour at the two rounded ends and leaves the long flanks clean —
 *   which is exactly the "edge dispersion" the bar is recognised for. At `quadrant: 0` (the
 *   default, and iOS's behaviour) the same amount rings the whole rim evenly and reads as a
 *   chromatic *defect* instead.
 *
 * `dispersion.reach` is always set explicitly: left unset it falls back to the *variant's* default
 * refraction height (20), not to the height in the same object.
 */

const CURVE = { power: 1, bias: 0 } as const;

/**
 * The bottom bar: `vibrancy() -> blur(1dp) -> lens(24dp, 24dp)`, permanently on.
 *
 * 0.6.6: blur 8 -> 1 — the owner wants the glass almost clear, "like 1 px": the
 * tint and rim still mark the surface, but the frosting is gone.
 *
 * `refractionAmount == refractionHeight` is deliberate — where they are equal the band samples the
 * same source range twice, mirrored, which is the inverted sliver seen at a thick glass rim. This
 * ratio is the single biggest driver of the look.
 *
 * Keeping this material *on* is also what makes a resting pill read as "extra clear": the clarity
 * is relative. Flatten the bar and the pill has nothing to contrast against.
 */
const GLASS_BAR_METAL: GlassMetalOptions = {
  refraction: {
    amount: 24,
    width: 24,
    height: 24,
    depth: 0,
    swirl: 0,
    curve: CURVE,
  },
  dispersion: { amount: 0, reach: 24 },
  blurRadius: 1,
  frost: 0,
  saturation: 1.5,
  noise: 0,
  light: 0,
  opacity: 1,
  // 0.6.6: glossy highlight (0.3 -> 0.6, wider) — the target (Revolut) bar carries
  // a bright specular band across its top; with the blur gone, the highlight is
  // what still says "glass" at a glance. Shared with panels (Card/Sheet).
  highlight: { intensity: 0.6, angle: 45, width: 0.75, falloff: 1 },
  border: { width: 1, opacity: 0.28 },
  android: { quality: "medium" },
};

/** `LiquidButton`: `vibrancy() -> blur(1dp) -> lens(12dp, 24dp)`. Static — nothing here animates. (0.6.6: blur was 2dp.) */
const GLASS_BUTTON_METAL: GlassMetalOptions = {
  refraction: {
    amount: 24,
    width: 12,
    height: 12,
    depth: 0,
    swirl: 0,
    curve: CURVE,
  },
  dispersion: { amount: 0, reach: 12 },
  blurRadius: 1,
  frost: 0,
  saturation: 1.5,
  noise: 0,
  light: 0,
  opacity: 1,
  highlight: { intensity: 0.3, angle: 45, width: 0.5, falloff: 1 },
  border: { width: 1, opacity: 0.28 },
  android: { quality: "medium" },
};

/**
 * The bar in **clear** dress: the scrim mostly gone, the glass doing the work.
 *
 * The regular bar reads through a 42% container fill, which is what guarantees a label stays
 * legible over anything. Take that away and legibility has to come from the material itself, so
 * this leans the other way from `GLASS_BAR_METAL` on every axis the base library's own
 * `CLEAR_DEFAULTS` does: no frost at all (0.6.6), saturation pulled back toward life,
 * dispersion raised so the rim actually reads, and a brighter border and highlight because with no
 * fill behind it the edge is the only thing left saying "this is a surface".
 *
 * The blur is 1dp on purpose (0.6.6: was 3dp). Blurring hard is how you fake a scrim; a clear bar that blurs its
 * backdrop into mush is just a scrim with extra steps.
 */
const GLASS_BAR_CLEAR_METAL: GlassMetalOptions = {
  // The lens is unchanged from the regular bar, including the 1:1 amount-to-depth ratio that
  // drives its look. Borrowing `CLEAR_DEFAULTS`' 30-over-10 was a mistake: that ratio is tuned for
  // a small control, and on a 64dp bar a 30dp pull over a 10dp band drags the dark gap above the
  // bar into a hard stripe across its top edge. Clear means less scrim, not a different lens.
  refraction: {
    amount: 24,
    width: 24,
    height: 24,
    depth: 0,
    swirl: 0,
    curve: CURVE,
  },
  dispersion: { amount: 10, reach: 24, quadrant: 0 },
  blurRadius: 1,
  frost: 0,
  saturation: 1.15,
  noise: 0,
  light: 0,
  opacity: 1,
  highlight: { intensity: 0.5, angle: 45, width: 0.75, falloff: 1 },
  border: { width: 1, opacity: 0.4 },
  android: { quality: "medium" },
};

/**
 * The tab pill at rest: a mild lens, not an effect-off window. The reference's `lens()`
 * early-returns when both arguments are zero, so no render effect is attached at all and the
 * pill becomes a literal clipped window onto its backdrop — and on device that read as a solid
 * grey chip: two solid fills (the 30%-white resting wash under the glyph, the bar's own surface
 * behind it) over a blur-only glass. The resting pill now bends a little — amount 8 over an
 * 18dp band (0.6.6: was 5 over 14dp — the target pill bends the background visibly at rest), a
 * cubic profile (`power: 3`) and `depth: 1` exactly matching the dragged metal, so the
 * `lerpMetal` rest→dragged blend stays smooth and the lens is already there as the grab lands —
 * with a small dispersion (amount 5, reach 18, riding the lens's own band) so the rim reads.
 *
 * This is the `from` end of a blend, not a state to be swapped to — see {@link lerpMetal} and the
 * tab bar's `pillProps`. Every field it names is a field the grab animates, and it names them at
 * their resting value rather than omitting them, so the blend has both ends of every channel.
 */
const GLASS_PILL_METAL: GlassMetalOptions = {
  // 0.6.6: stronger rest lens (5/14 -> 8/18) — the target pill bends the
  // background visibly at rest, like the bar; the glyphs sit above the glass,
  // so the wider band does not distort them.
  refraction: {
    amount: 8,
    width: 18,
    height: 18,
    depth: 1,
    swirl: 0,
    curve: { power: 3, bias: 0 },
  },
  dispersion: { amount: 5, reach: 18, quadrant: 0 },
  // The mild lens does not carry the bar's blur: on Android the accent clone it reads through
  // *is* the bar's recipe (lens, blur, vibrancy), so the pill adds nothing; on iOS the window
  // capture excludes every glass view, so the pill would otherwise be a sharp, unwashed hole in
  // a blurred bar. There it carries the bar's blur and vibrancy itself (its lens cannot follow:
  // it would bend at the pill's rim, not the bar's) and melts them away as the grab lands.
  // (0.6.6: the bar's blur is 1dp, so the pill carries 1dp on iOS.)
  blurRadius: Platform.OS === "ios" ? 1 : 0,
  frost: 0,
  saturation: Platform.OS === "ios" ? 1.5 : 1,
  noise: 0,
  light: 0,
  opacity: 1,
  // 0.6.6: a glossy sheen (was 0) — the target pill carries the same bright
  // top highlight as the bar, so it reads as glass, not a solid chip.
  highlight: { intensity: 0.4, angle: 45, width: 0.5, falloff: 1 },
  border: { width: 1, opacity: 0 },
  innerShadow: { radius: 0, opacity: 0 },
  android: { quality: "high" },
};

/**
 * The tab pill fully grabbed: a lens across its whole face, with the colour split riding it.
 * No blur and no saturation boost — those belong to the bar, and withholding them here keeps the
 * pill sharper than its surroundings even while it refracts.
 *
 * The reference's `lens(10dp, 14dp, chromaticAberration = true)` is a rim band: 14dp of bend
 * over the outer 10dp, the fringe quadrant-weighted onto the capsule's ends. iOS 26's grabbed
 * pill is not that — held beside it on an iPhone 14 Pro Max (2026-09-07), the glyph at the
 * pill's *centre* is displaced and colour-split, and the fringe runs evenly all the way round.
 * So the band here reaches 40dp in from every edge, past the held pill's 39dp half-height, and
 * the split runs 12dp over a 24dp reach with `quadrant` 0 (Kyant's weighting dies along both
 * centre lines, which is exactly where iOS shows it most). The reach is deliberately short of
 * the glyph's top and bottom — they sit ~27dp in from the pill's rim, and a 42dp reach put a
 * faint fringe on them at every hold, which the user called out at once — while a glyph
 * carried toward the pill's *side* by the drag, as in the iPhone frame, is well inside 24dp of
 * that rim and splits as it should.
 * The split walks the lens's own displacement, so the two must widen together — the shader
 * disperses nothing outside the band. Two things keep a band that wide from wrecking the face:
 * a cubic profile (`curve.power: 3`), so the bend is the reference's at the rim and gone by
 * the centre — with the linear profile the nearest-edge direction flipping across the centre
 * line tore the glyph in two and swirled the ends — and `depth: 1`, the radial direction, so
 * what bend remains reads as one lens ball. `pillDraggedMetal` is the dial if an app wants the
 * reference's quieter rim instead.
 *
 * `quality: "high"` earns its cost here and nowhere else: 16 taps one pixel apart keep a 12dp
 * spread continuous, where `"medium"`'s 8 would step it. The pill is small, and it is the only
 * surface in the kit whose fringe is ever this wide.
 */
const GLASS_PILL_DRAGGED_METAL: GlassMetalOptions = {
  refraction: {
    amount: 14,
    width: 40,
    height: 40,
    depth: 1,
    swirl: 0,
    curve: { power: 3, bias: 0 },
  },
  dispersion: { amount: 12, reach: 24, quadrant: 0 },
  blurRadius: 0,
  frost: 0,
  saturation: 1,
  noise: 0,
  light: 0,
  opacity: 1,
  highlight: { intensity: 0.5, angle: 45, width: 0.5, falloff: 1 },
  border: { width: 1, opacity: 0.28 },
  // None. The reference lifts its pill with `InnerShadow(radius = 8dp * progress, alpha =
  // progress)`; iOS 26's dragged pill carries no inset shadow at all (iPhone 14 Pro Max,
  // 2026-09-07). Named at zero rather than omitted so the blend has both ends of the channel.
  innerShadow: { radius: 0, opacity: 0 },
  android: { quality: "high" },
};

/**
 * The toggle thumb at rest: a clear lens — no white fill, no frost to lift. (0.6.7: the fill is
 * gone — it covered the lens at rest, so the thumb read as a solid lozenge and the refraction
 * was invisible on device. The target, iOS Settings' Wi-Fi thumb, is a clear lens: the green
 * track refracts through it at rest.) The rest lens is now a real lens: amount 8 over a 12dp
 * band, `depth: 1` (the radial term that makes it read as a lens ball, not just an edge bend),
 * cubic profile, and a 0.4 highlight so the lens carries the bright glossy top edge the target
 * shows. The small dispersion (amount 4, reach 12) rides the lens's own band.
 */
const GLASS_THUMB_METAL: GlassMetalOptions = {
  refraction: {
    amount: 8,
    width: 12,
    height: 12,
    depth: 1,
    swirl: 0,
    curve: { power: 3, bias: 0 },
  },
  dispersion: { amount: 4, reach: 12 },
  blurRadius: 1,
  frost: 0,
  saturation: 1,
  noise: 0,
  light: 0,
  opacity: 1,
  highlight: { intensity: 0.4, angle: 45, width: 0.33, falloff: 1 },
  border: { width: 1, opacity: 0 },
  innerShadow: { radius: 0, opacity: 0 },
  android: { quality: "medium" },
};

/**
 * The toggle thumb held: `lens(14dp, 12dp, chromaticAberration = true)` with **zero** blur.
 *
 * That inversion — the moving element being the *least*-processed surface — is a deliberate,
 * repeated rule in the reference. The pill does it, the slider thumb does it, this does it.
 *
 * The band is wider than the reference's 5dp: a 5dp lens over the solid green track behind the
 * thumb had almost nothing to refract and read on device as a dark blurry blob. At 14dp the
 * band reaches past the thumb's 12dp half-height, so the lens covers the whole face and pulls
 * in the track's edge as well as its body. The lightened lens (`light` is the shader's
 * whole-surface brighten, `color * (1 + light)`) and the raised highlight keep the held thumb
 * from sinking into a dark backdrop.
 */
const GLASS_THUMB_PRESSED_METAL: GlassMetalOptions = {
  refraction: {
    amount: 12,
    width: 14,
    height: 14,
    // 0.6.7: depth 1 + cubic, like the rest lens — the held thumb is a lens too, and the
    // lerpMetal rest→held blend stays smooth when both ends share depth and curve.
    depth: 1,
    swirl: 0,
    curve: { power: 3, bias: 0 },
  },
  dispersion: { amount: 5, reach: 14 },
  blurRadius: 0,
  frost: 0,
  saturation: 1,
  noise: 0,
  light: 0.15,
  opacity: 1,
  // `Highlight.Ambient` scaled to 1/1.5 for the small thumb, raised from 0.38 so the held lens
  // reads against a dark backdrop.
  highlight: { intensity: 0.5, angle: 45, width: 0.33, falloff: 1 },
  border: { width: 1, opacity: 0.28 },
  // `InnerShadow(radius = 4dp * progress, alpha = progress)` — the thumbs' thinner lip.
  innerShadow: { radius: 4, opacity: 0.15 },
  android: { quality: "medium" },
};

/** The slider thumb at rest — a clear lens like the toggle's (0.6.7: no white fill, depth 1,
 *  cubic profile, 0.4 highlight). The rest lens is amount 8 over a 14dp band (wider than the
 *  toggle's 12dp: the slider thumb is dragged for seconds at a time, so its resting glass is
 *  on show longer), dispersion riding the band. */
const GLASS_SLIDER_THUMB_METAL: GlassMetalOptions = {
  ...GLASS_THUMB_METAL,
  refraction: {
    amount: 8,
    width: 14,
    height: 14,
    depth: 1,
    swirl: 0,
    curve: { power: 3, bias: 0 },
  },
  dispersion: { amount: 4, reach: 14 },
};

/**
 * The slider thumb held: `lens(16dp, 16dp)` — it bends harder than the toggle's 14/12 because
 * it has a whole track's worth of colour to pull through, and the band is wider than its 12dp
 * rest band for the same reason as the toggle's: a narrow lens over a solid track reads as a
 * dark blob. Highlight and `light` come from the toggle's pressed metal via the spread.
 */
const GLASS_SLIDER_THUMB_PRESSED_METAL: GlassMetalOptions = {
  ...GLASS_THUMB_PRESSED_METAL,
  refraction: {
    amount: 16,
    width: 16,
    height: 16,
    // 0.6.7: depth 1 + cubic, like the rest lens and the toggle's held lens.
    depth: 1,
    swirl: 0,
    curve: { power: 3, bias: 0 },
  },
  dispersion: { amount: 6, reach: 16 },
};

/**
 * A panel — `LiquidGlassCard`, `LiquidGlassSheet`: the bar's material, permanently on. A big
 * pane wants the bar's 24dp band rather than the button's 12dp — the rim reads at the scale of
 * the surface, and iOS 26's sheets carry a thick lip for the same reason.
 */
const GLASS_PANEL_METAL: GlassMetalOptions = GLASS_BAR_METAL;

/** A toast is a button-sized capsule and wears the button's glass. */
const GLASS_TOAST_METAL: GlassMetalOptions = GLASS_BUTTON_METAL;

export {
  GLASS_BAR_CLEAR_METAL,
  GLASS_PANEL_METAL,
  GLASS_TOAST_METAL,
  GLASS_BAR_METAL,
  GLASS_BUTTON_METAL,
  GLASS_PILL_METAL,
  GLASS_PILL_DRAGGED_METAL,
  GLASS_THUMB_METAL,
  GLASS_THUMB_PRESSED_METAL,
  GLASS_SLIDER_THUMB_METAL,
  GLASS_SLIDER_THUMB_PRESSED_METAL,
};
