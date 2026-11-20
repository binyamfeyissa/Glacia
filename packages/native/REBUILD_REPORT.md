# `glacia-native` rebuild — final report

Branch `rebuild/native-v1`. Master prompt §8 order: deviations, renderer verdicts,
component table, token mapping, §6 results, builds, then the §9 checklist.
Every claim below is true of the **pushed** tree. The checks in §7 were run in a
clean checkout of the pushed commit (`git worktree` of `f0ac73b`, no uncommitted
files, no build output, fresh `pnpm install`). A network clone of the repository
was attempted first and failed twice with `Recv failure: Connection reset by
peer` — the checkout method, not the result, is what changed.

## 1. Deviations first (Law 6)

1. **The strip cache is implemented but has never run.** Session 5's brief arrived
   as prompt text; the file it named (`iOS_Below_26_Strip_Cache_Build_Brief.md`)
   does not exist in `~/Downloads` or the repo, so that text is the design of
   record. Everything in §2 of the brief is written and typechecks against the
   iOS 16.4 simulator SDK; nothing in it has executed on a device or a simulator,
   so this report makes no tracking, alignment or cost claim (§5).
   *Restore path:* Binyam's iOS 17 device run on the proof app's Scroll tab.
2. **The §3 prototype order could not be followed.** Step 1 (profile with
   `os_signpost` around the capture and the draw-request build) was not run: this
   machine has Xcode 14.3.1 with the iOS 16.4 SDK only, no connected device, and
   the proof app targets an SDK newer than that toolchain carries. The signposts
   are in the code so the profile can be taken on a device in one run, but a
   profile without numbers is not a step-1 result, and steps 2–3 were written
   anyway. That is a deviation from "report each step before starting the next".
3. **Rigid-unit tracking and the live-interior experiment are not started**
   (step 4). Both are experimentation with a verdict to earn, and neither can be
   judged without the step-1 numbers.
4. **The old sheet's snap-point behaviour is still gone, not ported.**
   `Pickers.tsx` was culled in this session (deviation 5), so the engine `Sheet`
   is the only sheet. Behaviours only the old sheet had: multiple `snapPoints`,
   `onSnapIndexChange`, `dismissOnSnapToBottom`, and the haptic tick when crossing
   a snap point. The engine sheet is single-height and dismisses by drag or dim
   tap.
   *Restore path:* reintroduce a snap layer in `src/Sheet.tsx` — deliberate work,
   not a rename.
5. **The never-rebuilt components were culled in this session, and the cull list
   is larger than the prompt's.** Deleted: `src/Forms2.tsx`
   (`InputOTP`, `ButtonGroup`, `ColorPicker`, `Combobox`), `src/Pickers.tsx`
   (`Calendar`, `DatePicker`, `TimePicker`), `src/Overlays.tsx` (`Menu`,
   `Drawer`), `src/Feedback.tsx` (`Banner`, `List`, `ListSection`, `ListItem`,
   `ToastViewport`) and the `src/Form.tsx` compatibility shim.
   `src/Bars.tsx` kept only the rebuild's `Chip`, `IconButton` and `Toolbar`
   re-exports; `SearchBar`, `FAB` and `FABGroup` are gone. `ToastViewport` needed
   nothing kept: the ported `Toast` (`src/Toast.tsx`) is self-contained and never
   imported it. `src/index.ts` lost 17 exports; the README catalog now lists 49.
   Tests were trimmed per component, not per file: `test/new-components.test.tsx`
   keeps 15 describes and drops 11, `test/glass-routing-new.test.tsx` drops the
   FAB/Drawer/Menu/DatePicker/TimePicker/List routing blocks,
   `test/interactions.test.tsx` drops Drawer/ListItem-swipe/FABGroup/Toast-stack,
   `test/selected-states.test.tsx` drops the culled rows,
   `test/part-c.test.tsx` is deleted (its only two components were culled), and
   `test/style-conformance.test.ts` no longer lists the deleted files.
   *Nothing culled was load-bearing for a ported component; the build and the
   tests prove it.*
6. **Neither device build produced an artifact.** Unchanged from session 4:
   - *Android:* EAS build `eb55e5ff` failed with `EAS_BUILD_UNKNOWN_GRADLE_ERROR`;
     the local reproduction reached Gradle and died on `No space left on device`.
   - *iOS:* Codemagic is not bound to this repository and no token exists; EAS iOS
     signing needs an Apple Developer account. The new strip-cache code makes this
     gap sharper: it is the one part of the package that cannot even be
     typecheck-substituted by jsdom tests.
   *Restore path:* the same two routes as before (§6), plus a real iOS 17 device.
7. **Out-of-scope files were removed beyond the ones the earlier prompt named.**
   `src/charts/`, the AI family, `Display.tsx`, `Table.tsx`, `Carousel.tsx` and
   four test files went in session 4. `src/index.ts` lost 37 exports then, 17 more
   now.
8. **The proof app did not bundle for web before session 4.** Fixed by isolating
   the optional `@react-native-community/blur` backend in
   `src/internal/blur-community.ts` with a `.web.ts` twin.
9. **No donor source was vendored.** §2.2 asks for React Native Reusables /
   `@rn-primitives` source with its MIT notice. The Wave 2 components are written
   against the behaviour, not copied and re-dressed, so there is no donor notice.
   The engine's MIT NOTICE is at `src/engine/NOTICE`.
10. **The Xcode on this machine cannot build the proof app.** 14.3.1 / iOS 16.4 is
    the floor of the target range and below the Expo SDK's minimum; every
    "simulator" label that would otherwise be available is therefore "not run".
    Any future simulator claim needs a newer Xcode.

## 2. Renderer verdict table

No device or simulator run happened in this session: no iOS 26 phone, iOS 17
phone, Android 16 or Android 7 device was attached, and the app was not launched
in a simulator. The proof app's Status tab reports live verdicts when it is run.

| Platform | Verdict | Evidence |
| --- | --- | --- |
| iOS 26+ | not run on device | Routing test mounts the native path with the engine control mocked (`test/glass-routing-new.test.tsx`); no hardware |
| iOS 16.4–25 (Metal) | not run on device | Same routing test; Metal renderer not executed off-device |
| Android 13+ (AGSL) | not run on device | Same routing test; AGSL path not executed off-device |
| Android 10–12 | not run on device | Fallback tier selected by capability stub only |
| Android 7 / Expo Go / no verdict | fallback floor | `test/fallback-material.test.tsx` asserts the floor renders for every component; capability test asserts "no verdict → unsupported" |

## 3. Component table — Waves 1–2

Renders and interacts are asserted by the tests named. "Errors" is the count of
component-level errors the proof app's `ComponentProbe` would surface; none are
known, and the mount-all smoke test mounts every export.

| Component | Renders | Interacts | Evidence |
| --- | --- | --- | --- |
| Glass / GlassView / GlassContainer / GlassProvider / GlassStack | yes | yes | `glass-rebuild`, `glass-routing`, `fallback-material` |
| TabBar | yes | yes | `glass-routing-new`, `selected-states` |
| Button, IconButton | yes | yes | `native`, `fixes`, `fallback-material` |
| Chip, Switch, Slider | yes | yes | `native`, `interactions`, `fixes` |
| Stepper | yes | yes | `wave2` (increment, hold-repeat, clamp, a11y actions) |
| SegmentedControl | yes | yes | `selected-states`, `fixes` |
| Input | yes | yes | `forms`, `fixes` |
| Card (+ 6 pieces) | yes | n/a | `native`, `glass-routing-new` |
| Toolbar | yes | yes | `interactions` |
| Toast | yes | yes | `new-components` |
| Sheet | yes | yes (dim tap, dismiss) | `glass-routing-new`, `new-components` |
| Group, MorphGroup, Scrim | yes | yes | `glass-routing-new`, `wave2` |
| Accordion, Collapsible | yes | yes | `wave2`, `new-components` |
| Alert | yes | n/a (static, dismissible) | `wave2` |
| AlertDialog, Dialog (+ trigger) | yes | yes (confirm/cancel, back) | `dialogs`, `android-back`, `wave2` |
| Avatar, Badge, Separator, Skeleton | yes | n/a | `wave2`, `selected-states` |
| Checkbox, RadioGroup, Select | yes | yes | `forms`, `wave2` |
| ContextMenu, DropdownMenu, Popover, Tooltip | yes | yes (open, select, dismiss) | `wave2` |
| Label, Field | yes | n/a | `forms`, `wave2` |
| Progress | yes | n/a | `wave2`, `glass-routing-new` |
| Tabs | yes | yes | `tabs` |
| Text, Textarea | yes | yes (typing) | `native`, `forms` |
| Toggle, ToggleGroup | yes | yes | `selected-states`, `wave2` |

No Wave 1/2 component is known-broken on any tier; the native tiers are
unverified (§2).

## 4. Token mapping (§4.3)

All component colours, radii and springs come from `src/internal/tokens`, which
re-exports `glacia-tokens` in React Native's colour format. The source-level
guard `test/style-conformance.test.ts` now covers every Wave 1–2 file and fails
on a raw colour literal or a bare radius.

| Donor value (engine/web) | Where | Token used |
| --- | --- | --- |
| radius 10 | chips, badges, small cells | `radii.sm` (10) |
| radius 14 | Select trigger, Stepper capsule | `radii.md` (14) |
| radius 16 | Popover / DropdownMenu panel, Input | `radii.lg` (16) |
| radius 18 | multiline Input / Textarea | `radii.xl` (18) |
| radius 22 | Sheet corners (fallback floor) | `radii.stack` (22) |
| capsule `h / 2` | Stepper, Switch track, Badge | `radii.pill` |
| 0.5 dp hairline | Input, Select, ToggleGroup | `colors.edge` at `hairlineWidth` |
| `rgba(0,0,0,0.4)` dim | ActionSheet backdrop | `colors.scrim` |
| white avatar rim | Avatar | `colors.glassSolid` |
| spring `(1, 0.85, 0.02)` | panel/dialog entrance | `springs.gentle` |
| spring `(1, 0.92, 0)` | press feedback | `springs.snappy` |
| spring `(0.6, 0.9, 0.02)` | stepper pop, menu open | `springs.bouncy` |
| 17/22 semibold | control labels | `typeScale.body` |
| 13/18 semibold | field labels | `typeScale.label` |
| 12/16 regular | captions, badges | `typeScale.caption` |
| 20/26 semibold | dialog/sheet/menu titles | `typeScale.heading` |
| 28/34 semibold | screen titles | `typeScale.title` |

**No token exists, so the value stays an explicit dp constant in the component**
(proposed additions for `glacia-tokens`, not edited per Law 1):

| Proposed token | Value(s) | Used by |
| --- | --- | --- |
| `controlHeights.xs/sm/md/lg` | 28 / 34 / 40 / 44 | Button, Input, Select, Stepper, ToggleGroup, SegmentedControl |
| `controlHeights.xl` | 50 | Button (large), SearchBar |
| `tabBar.height` | 49 (+ safe-area inset) | TabBar |
| `durations.stepperRepeat` | 400 ms then 110 ms | Stepper |
| `scales.pop` | 1.18 | Stepper |
| `sheet.heights` | 540, 420 | Sheet |

## 5. §6 prototype results

**Step 1 — profile: not run, no numbers.** No iOS 17+ SDK on this machine
(Xcode 14.3.1, simulator SDK 16.4), no attached device, and the app was not
launched anywhere. What exists instead of numbers: `os_signpost` intervals named
`captureBackdrop` (window snapshot) and `stripSync` (ring update) under subsystem
`com.glacia.glass`, so one Instruments run separates tree-walk/CPU cost from pixel
cost. `MTLBuffer`-backed textures were already in the vendored capturer; the strip
ring is `.shared` storage and uploaded with `replace(region:)` because its rows
come from `CGContext`.

**Step 2 — vertical-scroll spike: written, not run.** New files
`src/engine/ios/Glass/GlassBackdrop.swift`, `StripCache.swift` and
`GlassFramePhase.swift`; public JS surface `GlassBackdrop`
(`src/internal/GlassBackdrop.tsx`, engine export `NativeGlassBackdropView`). The
proof app's Scroll tab wraps its list and pinned bar in `GlassBackdrop`.
Mechanics: a content-space ring of height
`viewport + 2 × (48 pt refraction headroom + 1/60 s lookahead)`, clamped to
512–4096 pt and to the content length; rows rasterised from the content
container's layer (not the scroll view, whose clip would photograph the window
band the cache exists to replace), uploaded at `fract(contentY / stripHeight)`;
each frame the visible band is blitted from the ring into the capturer's
window-space texture, so the lens shader and its `uvRect` are untouched.
Frame phase: `presentsWithTransaction` on for windows with a strip in service,
geometry read from `presentation()`, contents from model layers.
Success would be: no snap on release and tracking through a fling, checked
against a numbered grid in slow motion, on a real iOS 17 phone. **None of that was
observed**; the only evidence is that the code typechecks.

**Step 3 — three-band split, lookahead, validator: written, not run.**
Static bands above and below the scroller come from the window capture (its
movement gate is bypassed while a strip is active, since the content band no
longer depends on it); the content band is overwritten from the ring; the
lookahead is the 1/60 s term above. The validator compares mean luminance over a
12 × 12 grid of the band against a settle capture (tolerance 0.12, distrust for
1.0 s), and a structural fingerprint of the content subtree catches inserted
rows and transformed layers between captures. Per-frame rasterisation is capped
at 1,200 rows; past the cap only the visible band is redrawn, which is a cost
ceiling rather than a correctness hole. Oversized bands, content-size changes and
offset jumps larger than the ring force a re-seed and a window capture.

**Step 4 — rigid units and live interior: not started.** No verdict is offered for
the `UIVisualEffectView`-under-interior experiment, and the seam risk it carries
is untested.

## 6. Build links

| Target | Status | Link |
| --- | --- | --- |
| Android APK (EAS, preview profile) | **no artifact — Gradle failure** | https://expo.dev/accounts/binapluto/projects/glacia-native-proof/builds/eb55e5ff-5481-4574-b109-0e873a676ca7 |
| iOS unsigned IPA (Codemagic) | **blocked — no Codemagic project or token** | — |

**Android.** `eas-cli 16.11.0`, project `@binapluto/glacia-native-proof`
(created this session), profile `preview` (`distribution: internal`,
`buildType: apk`), keystore generated by EAS. Two builds were run:

1. `893f99e1…` (commit `d3532a4`) — errored in the Bundle JavaScript phase.
2. `eb55e5ff…` (commit `f0ac73b`, the code this report describes) — errored
   with `EAS_BUILD_UNKNOWN_GRADLE_ERROR`: *"Gradle build failed with unknown
   error. See logs for the 'Run gradlew' phase."* No artifact was produced.

The cloud logs are behind the Expo web UI; this session has no browser access
to them. A local reproduction was attempted instead: `expo prebuild --platform
android` **succeeded** (the native project generates), then
`./gradlew assembleDebug` aborted with `java.io.IOException: No space left on
device` — this machine has 2.8 GB free of 346 GB, and the build needs the NDK
plus Gradle transforms. The local build therefore did not reach the point where
it would show the EAS failure, and no APK exists.

*Restore path:* either free ~15 GB on this machine and run the local build, or
open the EAS build page linked above and read the "Run gradlew" log — the fix
depends on that error, which is not guessable from here.

**iOS.** Codemagic is not configured for this repository and no
`CODEGAMIC_API_TOKEN` is present, so the unsigned-IPA route could not be
started. EAS iOS signing would need an Apple Developer account, which Binyam
does not have and the prompt forbids asking for.

## 7. Checks (run from a fresh clone of the pushed commit)

A fresh clone needs only `pnpm install`: both packages resolve
`glacia-tokens` and the app resolves `glacia-native` from source through
`tsconfig` paths and Vitest aliases, so no package has to be built first.

| Check | Command | Result |
| --- | --- | --- |
| Package tests | `pnpm --filter glacia-native test` | `18 files, 210 tests passed` |
| Package typecheck | `pnpm --filter glacia-native exec tsc --noEmit` | 0 errors |
| Proof-app tests | `pnpm --filter glacia-native-proof test` | `1 file, 58 tests passed` |
| Proof-app typecheck | `pnpm --filter glacia-native-proof exec tsc --noEmit` | 0 errors |
| Web untouched | `git diff --stat origin/main -- packages/core packages/tokens apps/docs` | empty |
| Proof app bundles | `npx expo export -c --platform web` | exported 3 files, exit 0 |
| npm publish | — | not run (gate is Binyam's device pass) |

## 8. Definition of done (§9)

- [x] `packages/native` rebuilt on `rebuild/native-v1`; web package untouched —
      `git diff --stat main -- packages/core packages/tokens apps/docs` is empty.
- [x] Wave 1 + Wave 2 exported under Glacia names — 49 components including the
      four new surface pieces, all in `src/index.ts`; MIT notices in
      `LICENSE`/`NOTICE` and the vendored engine.
- [x] Fallback floor renders every component with no glass available —
      `test/fallback-material.test.tsx` (every export, glass stubbed off).
- [x] TabBar safe-area fix and Stack fix demonstrated in the proof app —
      `apps/native-proof/src/screens/ControlsScreen.tsx` (Stack repro) and the
      TabBar mounted with its bottom inset; package tests pin both.
- [x] Strip cache written for the Metal tier only: content-space ring, three-band
      composite, frame phase, lookahead, validator and honest fallbacks
      (deviations 1–3; §5).
- [ ] Strip-cache steps reported in order, and a fling verified on a real iOS 17
      phone — **not done**: no device, no newer SDK (deviations 1–2).
- [x] Never-rebuilt old exports culled per component, README updated, nothing
      load-bearing removed silently (deviation 5).
- [x] Tests + typecheck green on both packages (§7); report delivered in §8
      order; nothing published to npm.
- [ ] Device builds — **no artifact for either target** (§6, deviation 4):
      EAS Android failed in Gradle, local Android blocked by disk space, iOS
      blocked by the missing Codemagic binding. Neither is a publish.
