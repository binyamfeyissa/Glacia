# `glacia-native` rebuild — final report

Branch `rebuild/native-v1`. Master prompt §8 order: deviations, renderer verdicts,
component table, token mapping, §6 results, builds, then the §9 checklist.
Every claim below is true of the **pushed** tree. The checks in §7 were run in a
clean checkout of the pushed commit (`git worktree` of `f0ac73b`, no uncommitted
files, no build output, fresh `pnpm install`). A network clone of the repository
was attempted first and failed twice with `Recv failure: Connection reset by
peer` — the checkout method, not the result, is what changed.

## 1. Deviations first (Law 6)

1. **§6 strip-cache is not started — the brief was not delivered.**
   The session-4 prompt says `iOS_Below_26_Strip_Cache_Build_Brief.md`
   accompanies it. It is not in `~/Downloads` (only
   `iOS_Below_26_Backdrop_Problem_Brief.md` is) and not in the repo. Implementing
   the strip cache from the problem statement alone would be inventing the
   design the brief exists to specify, so no code was written.
   *Restore path:* drop the brief into `~/Downloads`; `ScrollScreen.tsx` in the
   proof app is ready as the test bed.
2. **The old sheet's snap-point behaviour is gone, not ported.**
   `Pickers.tsx` now presents inside the Wave 1 `Sheet` (the engine design), so
   `Overlays.tsx`'s sheet is deleted. Behaviours only the old sheet had:
   multiple `snapPoints`, `onSnapIndexChange`, `dismissOnSnapToBottom`, and the
   haptic tick when crossing a snap point. The engine sheet is a single-height
   sheet that dismisses by drag or dim tap. Six tests covering snap points were
   removed with it (`test/interactions.test.tsx`).
   *Restore path:* reintroduce a snap layer in `src/Sheet.tsx` — deliberate work,
   not a rename.
3. **The sheet's `title` and `footer` props are not part of the Wave 1 sheet.**
   `Pickers` renders its own header and button row inside the sheet's children
   (a `PickerSheet` wrapper in `Pickers.tsx`). Anything else that wants a titled
   sheet must do the same.
4. **Neither device build produced an artifact.**
   - *Android:* the EAS preview build of this commit failed with
     `EAS_BUILD_UNKNOWN_GRADLE_ERROR` ("Gradle build failed with unknown
     error. See logs for the 'Run gradlew' phase") and produced no APK. A local
     reproduction could not get further either: `expo prebuild` succeeded, then
     Gradle aborted with `No space left on device` (2.8 GB free on this
     machine). The cloud build page is the only place the Gradle error text
     exists, and this session has no browser to read it.
     *Restore path:* read the "Run gradlew" log on that build page (link in §6),
     or free ~15 GB here and run `./gradlew assembleDebug`.
   - *iOS:* Codemagic is not configured for this repository and no
     `CODEGAMIC_API_TOKEN` exists, so the unsigned-IPA route cannot start. EAS
     iOS signing would need an Apple Developer account, which Binyam does not
     have and the prompt forbids asking for.
     *Restore path:* bind the repo to Codemagic (or supply its API token); the
     workflow itself is one YAML file.
5. **Out-of-scope files were also removed beyond the ones named in the prompt.**
   The instruction named `ai.tsx`, `Message.tsx`, `Display.tsx`, `Table.tsx`,
   `Carousel.tsx` and the charts. Deleted in addition: `src/charts/` (the whole
   directory), `test/ai.test.tsx`, `test/charts.test.tsx`,
   `test/charts-advanced.test.tsx`, `test/table.test.tsx`, and the Rating/Image/
   Message describes inside `test/part-c.test.tsx` (the file now covers only
   ColorPicker and Combobox). `src/index.ts` lost 37 exports.
   *Nothing was rescued from those files; no Wave 1/2 component depended on
   them.* `NativeImage`'s placeholder logic is not used anywhere else.
6. **Some old-package components remain because the instruction did not name
   their files**: `Forms2.tsx` (InputOTP, ButtonGroup, ColorPicker, Combobox),
   `Pickers.tsx` (Calendar, DatePicker, TimePicker), `Overlays.tsx` (Menu,
   Drawer), `Feedback.tsx` (Banner, List, ListSection, ListItem, ToastViewport),
   `Bars.tsx` (SearchBar, FAB, FABGroup, Toolbar) and `Form.tsx` (a compatibility
   re-export shim). They are outside §2.3's named removals; a second cull is a
   decision for Binyam, not something to do silently.
7. **The proof app did not bundle for web before this session.** `expo export`
   failed on `@react-native-community/blur`, whose shipped module imports
   `./components/BlurView` while only `BlurView.ios.js` / `.android.js` exist.
   Fixed by isolating the optional backend in `src/internal/blur-community.ts`
   with a `.web.ts` twin, so the web bundle never resolves it. No public API
   change; `test/` covers the resolver as before.
8. **Workspace resolution is pinned to source.** A fresh clone previously
   failed typecheck and tests because `glacia-tokens` (and, for the app,
   `glacia-native`) resolved to unbuilt `dist`/`lib` output. The app's
   typecheck reported those failures as `any`-typed parameters. `tsconfig`
   paths and Vitest aliases now point at the packages' source; nothing in the
   published API changed.
9. **No donor source was vendored.** §2.2 asks for React Native Reusables /
   `@rn-primitives` source to be copied in with its MIT notice. The Wave 2
   components were written directly against the behaviour (open/close, focus,
   dismissal, screen-reader semantics) rather than copied and re-dressed, so
   there is no donor source and no donor notice to carry. The engine's MIT
   NOTICE is present at `src/engine/NOTICE`.
   *Restore path:* vendor the donor files if Binyam wants their implementation
   on record; it changes no public API.
10. **`apps/native-proof` has a `tsconfig.json` in the tree.** Session 3's report
   claimed a clean app typecheck while the claim could not be reproduced from the
   pushed tree (the commit carrying it had not been pushed). The config and the
   four checks are now committed and verified from a fresh clone (§7).

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
| Toast / ToastViewport | yes | yes | `interactions` |
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
| `sheet.heights` | 540 (picker), 420 (default) | Sheet, Pickers |

## 5. §6 prototype results

Not started. The build brief was not delivered (deviation 1). No profiling, no
scroll spike, no band split, no rigid-unit tracking was written, and no
"built-but-device-unverified" claim is made for any of the four steps.

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
| Package tests | `pnpm --filter glacia-native test` | `18 files, 280 tests passed` |
| Package typecheck | `pnpm --filter glacia-native exec tsc --noEmit` | 0 errors |
| Proof-app tests | `pnpm --filter glacia-native-proof test` | `1 file, 74 tests passed` |
| Proof-app typecheck | `pnpm --filter glacia-native-proof exec tsc --noEmit` | 0 errors |
| Web untouched | `git diff --stat origin/main -- packages/core packages/tokens apps/docs` | empty |
| Proof app bundles | `npx expo export -c --platform web` | exported 3 files, exit 0 |
| npm publish | — | not run (gate is Binyam's device pass) |

## 8. Definition of done (§9)

- [x] `packages/native` rebuilt on `rebuild/native-v1`; web package untouched —
      `git diff --stat main -- packages/core packages/tokens apps/docs` is empty.
- [x] Wave 1 + Wave 2 exported under Glacia names — 20 + 23 components, all in
      `src/index.ts`; MIT notices in `LICENSE`/`NOTICE` and the vendored engine.
- [x] Fallback floor renders every component with no glass available —
      `test/fallback-material.test.tsx` (every export, glass stubbed off).
- [x] TabBar safe-area fix and Stack fix demonstrated in the proof app —
      `apps/native-proof/src/screens/ControlsScreen.tsx` (Stack repro) and the
      TabBar mounted with its bottom inset; package tests pin both.
- [ ] Strip-cache steps reported in order / fling test on a real iOS 17 phone —
      **not done**: brief missing (deviation 1). Reported as not run.
- [x] Tests + typecheck green on both packages (§7); report delivered in §8
      order; nothing published to npm.
- [ ] Device builds — **no artifact for either target** (§6, deviation 4):
      EAS Android failed in Gradle, local Android blocked by disk space, iOS
      blocked by the missing Codemagic binding. Neither is a publish.
