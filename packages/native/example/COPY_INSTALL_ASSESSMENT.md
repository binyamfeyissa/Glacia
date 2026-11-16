# Part D — native copy-install: assessment

**Recommendation: do not ship it. The npm import path is the right one for native.**

The web package offers two install paths: `npm i glacia` and `npx glacia add <component>`,
which copies the component's source into the user's project so it can be edited freely.
The question was whether native can have the second one. It cannot land cleanly, and
the reasons are properties of the code, not of effort.

## What was checked

The existing CLI (`packages/core/bin/cli.js`) resolves a component by name from
`registry/new-york/<name>.json`, reads its `files[].content`, and writes each file into
the user's project. The registry item format is shadcn's `registry-item.json`: a list of
files, each a complete source string, plus `dependencies` and `registryDependencies`.

Nothing about that format is web-specific. **The format is not the problem.** The problem
is the content.

## Why native components cannot be copied

**1. A core component is not one file.** Tracing `import` from `Bars.tsx` (the file holding
FAB, FABGroup, AppBar, SearchBar, Chip, IconButton) reaches seven files:

```
Bars.tsx
Button.tsx
Glass.tsx
Text.tsx
internal/motion.ts
internal/primitives.ts
internal/tokens.ts
```

A web component is copied with its `glacia/internal/*` helpers imported from the package
(`useControllable`, `cx`, `createSpring`). Native's shared layer — the primitives resolver,
the theme tokens, the motion helpers — is the machinery that makes the whole doctrine work:
the platform switch, the token system, the fallbacks. It is exactly what must stay
identical between components and must keep receiving fixes.

Copying it means every user's project holds its own fork of the platform switch. When
`@callstack/liquid-glass` changes, or `AccessibilityInfo` needs another preference, or a
token is corrected, every fork drifts separately and no update reaches them. That is the
failure mode copy-install exists to enable on the web (where a user *wants* to own the
markup) and it is the failure mode that breaks a native library, where correctness is
defined by the platform switch rather than by the user's CSS.

**2. The imports would not resolve.** The copied files import `./internal/primitives`,
`./internal/tokens`, and (transitively) the `glacia-tokens` package. Written into a
user's `components/glacia/` directory those relative specifiers point at files that do
not exist there unless the whole internal tree is copied too — see (1). The web registry
avoids this by rewriting those imports to `glacia/internal/...`, i.e. back to the npm
package. Doing the same for native means the copied component is no longer self-contained,
so copy-install has delivered nothing it promised.

**3. The whole reason to edit a native component is the thing that must not be edited.**
On the web, a user copies `switch.tsx` because they want different markup and a different
lens. On native, the parts a user might want to change (colour, radius, spring, type size)
are already props and tokens; the parts they cannot change without breaking the doctrine
are the platform switch, the fallback shape and the resolver. There is no valuable middle.
The component is already editable where editing is safe.

**4. It would double the proof obligations forever.** Every item in this library's
verification suite — the no-DOM guard, the token conformance grep, the both-branch routing
tests, the mount smoke test over all 86 components, the Android and iOS bundle checks —
proves things about *these* sources. Copied sources live outside that surface and are
never verified again by the project. The suite would be proving a claim about files the
user no longer runs.

## What would be honest if the feature were wanted anyway

Not a copy. A **codemod**: `npx glacia native add <component>` writes a small wrapper in the
user's project that re-exports the component and pins its props, leaving the implementation
in the package. That gives a stable, editable call site without forking the switch. It is a
genuinely different feature from copy-install, and it is not what was asked for, so it is
recorded here rather than built.

## Outcome

No code was written for Part D. The registry format would have accepted native items; the
components cannot be copied without forking the platform switch and the token system, and
that is worse than the single npm path Glacia already has. **The npm import path is
unchanged and remains the only install path for `glacia-native`.**
