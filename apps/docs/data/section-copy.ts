import type { Platform } from "./platforms";

// Written copy for the platform documentation pages.
//
// Every entry is authored twice — once for the browser, once for React Native —
// because the two platforms genuinely differ: import paths, install commands,
// styling mechanism and, most importantly, what the glass actually does. This
// file is the single place those differences are stated.

export interface DocCode {
  label: string;
  language: string;
  code: string;
}

export interface DocFaq {
  question: string;
  answer: string;
}

export interface SectionCopy {
  title: string;
  kicker: string;
  description: string;
  /** Short statements rendered as a definition list. */
  facts?: { term: string; detail: string }[];
  codes?: DocCode[];
  /** Paragraphs of prose. */
  body?: string[];
  faq?: DocFaq[];
  /** Notes rendered as small callouts, used for honest platform caveats. */
  notes?: { title: string; text: string }[];
}

type Copy = Record<Platform, Record<string, SectionCopy>>;

export const SECTION_COPY: Copy = {
  web: {
    "getting-started": {
      title: "Getting started",
      kicker: "Web · glacia",
      description: "Render a Liquid Glass surface in a React app in about a minute.",
      codes: [
        {
          label: "terminal",
          language: "bash",
          code: `npm install glacia\n# then import the stylesheet once, at your app root:\n# import "glacia/styles.css";`,
        },
        {
          label: "app.tsx",
          language: "tsx",
          code: `import "glacia/styles.css";\nimport { Glass, Button } from "glacia";\n\nexport default function App() {\n  return (\n    <Glass surface="panel" className="rounded-2xl p-6">\n      <p>Liquid Glass, refracted in the browser.</p>\n      <Button variant="filled">Continue</Button>\n    </Glass>\n  );\n}`,
        },
      ],
      body: [
        "Glacia renders refraction with an SVG displacement lens that is fitted to each element's exact size and corner radius. That means the glass bends whatever is behind it — text, imagery, a moving background — rather than blurring a flat colour.",
        "Because the lens follows the element's geometry, glass looks right at any size. A 34px button and a full-width panel each get their own map, so corners stay circular and edges stay crisp.",
      ],
      notes: [
        {
          title: "Browser support",
          text: "Refraction uses backdrop-filter: url(), which needs Chrome 111+, Safari 18+ or Firefox 113+. Where it is unsupported the glass falls back to a frosted blur with the same layout and rim.",
        },
      ],
    },

    installation: {
      title: "Installation",
      kicker: "Web · glacia",
      description: "The package, its peer dependencies and its stylesheet.",
      facts: [
        { term: "Package", detail: "glacia" },
        { term: "Peer dependency", detail: "react >= 18, react-dom >= 18" },
        { term: "Bundled dependency", detail: "radix-ui (behaviour primitives only)" },
        { term: "Stylesheet", detail: "glacia/styles.css — import once at your app root" },
      ],
      codes: [
        {
          label: "npm",
          language: "bash",
          code: "npm install glacia",
        },
        {
          label: "pnpm",
          language: "bash",
          code: "pnpm add glacia",
        },
        {
          label: "styles",
          language: "tsx",
          code: `// app/layout.tsx (Next.js) or your entry file\nimport "glacia/styles.css";`,
        },
      ],
      body: [
        "Glacia ships one stylesheet containing its design tokens and component rules. Import it once; every component reads the shared --gl-* custom properties from it.",
        "Overlays are built on Radix primitives for focus trapping, dismiss behaviour and portalling. Radix has no visual identity of its own, so nothing competes with the Glacia material.",
      ],
    },

    components: {
      title: "Components",
      kicker: "Web · glacia",
      description: "Every React web component in the library, grouped by what it does.",
    },

    blocks: {
      title: "Blocks",
      kicker: "Web · glacia",
      description: "Composed page sections assembled from Glacia components.",
      body: [
        "Blocks are larger than components: a finished section you can drop into a page and then restyle. They are built entirely from the same components and tokens documented here, so anything you learn about a component applies inside a block.",
      ],
      notes: [
        {
          title: "Blocks are starting points",
          text: "A block gives you structure and behaviour, not a locked design. Every block accepts its content as props or children so you can replace the data without editing internals.",
        },
      ],
    },

    charts: {
      title: "Charts",
      kicker: "Web · glacia",
      description: "Data visualization rendered with the same glass material as the rest of the library.",
      body: [
        "The charting layer is built on shared primitives — scales, axes, and a glass tooltip surface — so every chart shares geometry conventions and formatting. Charts prioritise legibility: glass is used for containers, tooltips and legends, never over the data marks themselves.",
      ],
    },

    theming: {
      title: "Theming",
      kicker: "Web · glacia",
      description: "Light, dark and custom themes through shared custom properties.",
      codes: [
        {
          label: "css",
          language: "css",
          code: `:root {\n  --gl-glass-bend: 0.45;        /* how far the glass bends */\n  --gl-glass-dispersion: 0.4;   /* chromatic split */\n  --gl-glass-frost: 1;          /* frost multiplier */\n  --gl-rim-shine: 0.3;          /* light on the rim */\n}`,
        },
        {
          label: "tsx",
          language: "tsx",
          code: `<div data-theme="dark">\n  <Glass>Dark glass</Glass>\n</div>`,
        },
      ],
      body: [
        "Themes are custom properties, not a provider. Set them on :root for the whole page, or on any element to rescope a subtree. Setting data-theme=\"light\" or \"dark\" switches the palette below it.",
        "The four optical dials — bend, dispersion, frost and rim shine — are read live by the lens, so changing one refits the displacement map immediately rather than requiring a rebuild.",
      ],
    },

    styling: {
      title: "Styling",
      kicker: "Web · glacia",
      description: "ClassName, CSS variables and the stylesheet contract.",
      body: [
        "Every component accepts className. Glacia does not use CSS-in-JS or a styling runtime, so your own stylesheet, Tailwind or CSS Modules all apply normally.",
        "Component geometry is exposed as custom properties, which means you can change a control's height or radius without overriding its rules.",
      ],
      codes: [
        {
          label: "css",
          language: "css",
          code: `.my-button {\n  --gl-control-md: 40px;\n}\n\n/* or scope a whole panel */\n.my-panel {\n  --gl-glass-bend: 0.7;\n}`,
        },
      ],
    },

    sizing: {
      title: "Sizing",
      kicker: "Web · glacia",
      description: "Control heights, icon sizes and radii, shared across the library.",
      facts: [
        { term: "Small control", detail: "--gl-control-sm · 28px" },
        { term: "Medium control", detail: "--gl-control-md · 34px" },
        { term: "Large control", detail: "--gl-control-lg · 44px" },
        { term: "List row", detail: "--gl-row-list · 44px" },
        { term: "Menu row", detail: "--gl-row-menu · 40px" },
        { term: "Overlay radius", detail: "--gl-overlay-radius · 28px" },
      ],
      body: [
        "One scale governs every control so a button, a toggle, a field and a toolbar item always stand the same height. Components read these variables rather than hardcoding values, so changing one var resizes the whole family consistently.",
      ],
    },

    performance: {
      title: "Performance",
      kicker: "Web · glacia",
      description: "Keeping refraction cheap on large pages.",
      body: [
        "Each glass element owns a displacement map drawn for its exact size. The work happens once per size change and is cached, so scrolling and hover cost nothing extra. Still, a page with hundreds of distinct glass sizes does more work than one with a few.",
        "Where a surface is decorative and already sits on a contrasting backdrop, set flat to keep the frosted layer without a lens.",
      ],
      codes: [
        {
          label: "tsx",
          language: "tsx",
          code: `<Glass flat>Frosted only — no lens is fitted.</Glass>`,
        },
      ],
    },

    accessibility: {
      title: "Accessibility",
      kicker: "Web · glacia",
      description: "Focus, keyboard and screen-reader behaviour on the web.",
      body: [
        "Interactive components are real buttons, inputs and links, so keyboard behaviour is the browser's own. Focus is always visible and overlays return focus to the element that opened them.",
        "Glass is decoration: the material never carries meaning, so nothing in the library depends on distinguishing an effect visually. Colour tokens are chosen to keep text contrast in both themes.",
      ],
      faq: [
        {
          question: "Does refraction break screen readers?",
          answer: "No. The lens is a backdrop-filter on a decorative layer; the accessibility tree is unaffected.",
        },
        {
          question: "Can I reduce motion?",
          answer: "Yes. Animations respect prefers-reduced-motion, which shortens or removes transitions.",
        },
      ],
    },

    troubleshooting: {
      title: "Troubleshooting",
      kicker: "Web · glacia",
      description: "When refraction does not appear.",
      faq: [
        {
          question: "The glass looks like plain blur.",
          answer:
            "That is the fallback. It means backdrop-filter: url() is unsupported in the browser, or the element is inside an ancestor with filter, transform or will-change that creates a containing block the filter cannot sample through.",
        },
        {
          question: "Styles are missing entirely.",
          answer: "The stylesheet has not been imported. Add import \"glacia/styles.css\"; at your app root.",
        },
        {
          question: "Glass is invisible over a plain background.",
          answer:
            "Refraction bends what is behind the element. Over a flat colour there is nothing to bend, so put glass over content, imagery or a gradient.",
        },
      ],
    },

    upgrading: {
      title: "Upgrading",
      kicker: "Web · glacia",
      description: "Moving between glacia versions.",
      body: [
        "Component props and exports are stable within a major version. The stylesheet is additive: new tokens are introduced without renaming existing ones, so overriding a custom property continues to work across minor upgrades.",
      ],
      codes: [
        { label: "check", language: "bash", code: "npm outdated glacia && npm install glacia@latest" },
      ],
    },
  },

  mobile: {
    "getting-started": {
      title: "Getting started",
      kicker: "Mobile · glacia-native",
      description: "Render a Liquid Glass surface in an Expo app.",
      codes: [
        {
          label: "terminal",
          language: "bash",
          code: `npx expo install glacia-native\n# iOS 26 native glass needs the optional peer:\nnpx expo install @callstack/liquid-glass`,
        },
        {
          label: "App.tsx",
          language: "tsx",
          code: `import { SafeAreaView } from "react-native";\nimport { Glass, Text, Button } from "glacia-native";\n\nexport default function App() {\n  return (\n    <SafeAreaView style={{ flex: 1, justifyContent: "center", padding: 24 }}>\n      <Glass style={{ padding: 20, borderRadius: 20 }}>\n        <Text>Liquid Glass, on device.</Text>\n        <Button title="Continue" onPress={() => {}} />\n      </Glass>\n    </SafeAreaView>\n  );\n}`,
        },
      ],
      body: [
        "Glacia Native renders through the platform's own material. On iOS 26 and later that is a real UIGlassEffect, supplied by the @callstack/liquid-glass peer — the same material the system uses, including its blur, saturation and edge lighting.",
        "On older iOS, on Android, and inside Expo Go, the same components render a translucent tinted surface of identical layout. Nothing breaks; the optical layer is simply absent.",
      ],
      notes: [
        {
          title: "Be precise about the difference",
          text: "Native glass is the system material. It does not perform per-element backdrop displacement the way the web package does. This is a platform capability difference, not a bug, and the library does not pretend otherwise.",
        },
      ],
    },

    installation: {
      title: "Installation",
      kicker: "Mobile · glacia-native",
      description: "The package, Expo compatibility and required peers.",
      facts: [
        { term: "Package", detail: "glacia-native" },
        { term: "Peer dependencies", detail: "react >= 18, react-native >= 0.80" },
        { term: "Optional peer", detail: "@callstack/liquid-glass >= 0.7.0 — iOS 26 native glass" },
        { term: "Expo", detail: "SDK with React Native 0.80+; works in Expo Go with the tint fallback" },
        { term: "Bundled dependency", detail: "glacia-tokens (shared design tokens)" },
      ],
      codes: [
        {
          label: "expo",
          language: "bash",
          code: "npx expo install glacia-native @callstack/liquid-glass",
        },
        {
          label: "bare react native",
          language: "bash",
          code: "npm install glacia-native @callstack/liquid-glass\nnpx pod-install",
        },
      ],
      body: [
        "@callstack/liquid-glass is optional. Without it, or on a device that does not support the material, Glacia Native falls back automatically — it does not throw, and layout is identical.",
        "There is no stylesheet to import on native: styling is done with React Native style objects and the shared token module.",
      ],
    },

    components: {
      title: "Components",
      kicker: "Mobile · glacia-native",
      description: "Every React Native component in glacia-native.",
    },

    blocks: {
      title: "Blocks",
      kicker: "Mobile · glacia-native",
      description: "Composed app sections assembled from Glacia Native components.",
      body: [
        "Blocks are larger than components: a finished section you can drop into a screen. They are built from the same components documented here.",
      ],
      notes: [
        {
          title: "In progress",
          text: "Native blocks are being built alongside the web blocks. Until a block exists in glacia-native it is not listed, rather than documented as if it shipped.",
        },
      ],
    },

    charts: {
      title: "Charts",
      kicker: "Mobile · glacia-native",
      description: "Data visualization sized for touch.",
      codes: [
        {
          label: "tsx",
          language: "tsx",
          code: `import { NativeLineChart, NativeBarChart, NativeRingChart } from "glacia-native";

<NativeLineChart
  labels={["Jan", "Feb", "Mar", "Apr"]}
  series={[{ name: "Revenue", values: [42, 58, 51, 74] }]}
  width={320}
  height={200}
/>`,
        },
      ],
      body: [
        "All twenty-one web charts now have a native counterpart: line, area and mirrored area, bar, ring, pie, scatter, bubble, funnel, heatmap, radar, waterfall, polar area, pyramid, candlestick, treemap, sankey, bump, hex, plot and live line. They share their scale maths and colour ramp with the web charts, so the same series produces the same axis values on both platforms.",
        "Hover does not exist on a phone, so every chart is tappable: touching a column, category or slice selects it and reveals its values. The Ring chart shows its legend by default because a slice cannot be identified by colour alone without hover.",
      ],
      notes: [
        {
          title: "These are SVG marks, not glass",
          text: "The chart surface itself is plain SVG. It does not refract like a Glass surface, and it is not claimed to. Wrap a chart in Glass if you want the material around it; the marks stay ordinary vector shapes.",
        },
        {
          title: "Variants share one implementation",
          text: "Pie is Ring with the hole closed, Bubble is Scatter with sized marks, and Mirror Area is Area with the lower series negated. They are documented as separate charts because that is how you reach for them, but each pair is one code path, so they cannot drift apart.",
        },
      ],
    },

    theming: {
      title: "Theming",
      kicker: "Mobile · glacia-native",
      description: "Light, dark and custom themes on native.",
      codes: [
        {
          label: "tsx",
          language: "tsx",
          code: `import { colors } from "glacia-native";\n\n// tokens ship as plain objects, so they compose with any theme provider\nconst palette = colors.light;`,
        },
      ],
      body: [
        "glacia-native exports its colour, radius and spring tokens as plain objects. There is no provider to install and no global state: pass the tokens where you need them, or map them through your own theme library.",
        "Because the native material is drawn by the OS, the glass picks up the device appearance automatically. Your token overrides affect layout, labels and tints rather than the material itself.",
      ],
    },

    styling: {
      title: "Styling",
      kicker: "Mobile · glacia-native",
      description: "Style props and the shared token contract.",
      body: [
        "Every Glacia Native component accepts a style prop that merges with its defaults, so React Native styling applies normally. Tokens come from glacia-tokens, the same source the web package reads, which keeps both platforms visually aligned.",
      ],
      codes: [
        {
          label: "tsx",
          language: "tsx",
          code: `import { radii } from "glacia-native";\n\n<Glass style={{ borderRadius: radii.lg, padding: 16 }} />`,
        },
      ],
    },

    sizing: {
      title: "Sizing",
      kicker: "Mobile · glacia-native",
      description: "Touch targets, control heights and radii.",
      facts: [
        { term: "Small control", detail: "32pt" },
        { term: "Medium control", detail: "44pt — the platform minimum touch target" },
        { term: "Large control", detail: "52pt" },
        { term: "Radii", detail: "radii.sm 8 · md 14 · lg 20 · xl 28" },
      ],
      body: [
        "Native control sizes start at 44pt for anything tappable, following platform guidance rather than the denser web scale. Radii come from the shared token module so corners match the web package at equivalent sizes.",
      ],
    },

    performance: {
      title: "Performance",
      kicker: "Mobile · glacia-native",
      description: "Keeping glass cheap on device.",
      body: [
        "The native material is composited by the OS, so it costs nothing extra in JavaScript. Deeply nested glass, however, forces additional offscreen passes — prefer one glass container with plain children over glass inside glass.",
      ],
    },

    accessibility: {
      title: "Accessibility",
      kicker: "Mobile · glacia-native",
      description: "VoiceOver, TalkBack and touch target behaviour.",
      body: [
        "Components forward accessibility props to the underlying native view. Interactive components expose their role and label so VoiceOver and TalkBack announce them correctly, and touch targets meet the platform minimum.",
      ],
      faq: [
        {
          question: "Does the fallback affect accessibility?",
          answer: "No. The fallback changes only the material; roles, labels and focus order are identical.",
        },
      ],
    },

    troubleshooting: {
      title: "Troubleshooting",
      kicker: "Mobile · glacia-native",
      description: "When glass falls back to a tint.",
      faq: [
        {
          question: "The glass is flat and translucent, not glassy.",
          answer:
            "The native material is unavailable: the device is below iOS 26, the build is Android, or you are in Expo Go. Install @callstack/liquid-glass and run a development build on an iOS 26 device to see the real material.",
        },
        {
          question: "Layout differs from the web package.",
          answer:
            "Native control heights follow the platform's 44pt touch minimum, while web uses a denser 34px default. Sizes match in intent, not in points.",
        },
      ],
    },

    upgrading: {
      title: "Upgrading",
      kicker: "Mobile · glacia-native",
      description: "Moving between glacia-native versions.",
      body: [
        "Exported components and their props are stable within a major version. The fallback behaviour is guaranteed: a component never throws because the material is unavailable.",
      ],
      codes: [
        { label: "expo", language: "bash", code: "npx expo install glacia-native@latest" },
      ],
    },
  },
};

export const sectionCopy = (platform: Platform, slug: string): SectionCopy | undefined =>
  SECTION_COPY[platform]?.[slug];
