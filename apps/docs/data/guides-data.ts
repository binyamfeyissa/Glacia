export interface GuideBlock {
  type: "p" | "h2" | "h3" | "code" | "list" | "note";
  text?: string;
  items?: string[];
  lang?: string;
}

export interface Guide {
  slug: string;
  title: string;
  /** Meta description, also used as the page summary. */
  description: string;
  /** One-line lede under the H1. */
  lede: string;
  /** ISO date. Published date is the original write date, not a build stamp. */
  datePublished: string;
  dateModified?: string;
  readingMinutes: number;
  /** Broader topic label shown on cards. */
  topic: string;
  /** Documentation pages this guide links to. */
  related: { label: string; href: string }[];
  blocks: GuideBlock[];
}

/**
 * Technical guides.
 *
 * Each entry answers a question developers genuinely ask about liquid glass on
 * the web and in React Native. They are written to be useful even if the reader
 * never installs Glacia — the search traffic is a by-product of that, not the
 * goal. No benchmark numbers or claims about Apple's internals are invented.
 */
export const GUIDES: Guide[] = [
  {
    slug: "what-is-liquid-glass",
    title: "What is Liquid Glass? Apple's design language for dynamic glass interfaces",
    description:
      "A working explanation of Apple's Liquid Glass material: how it refracts, why it has a specular rim, and what that means when you implement it yourself.",
    lede: "Apple's Liquid Glass is a rendering material, not a colour or a blur radius. Here is what actually defines it.",
    datePublished: "2025-07-02",
    readingMinutes: 6,
    topic: "Fundamentals",
    related: [
      { label: "Glass primitive", href: "/platform/web/components/glass" },
      { label: "Theming", href: "/platform/web/theming" },
    ],
    blocks: [
      {
        type: "p",
        text: "Liquid Glass is Apple's name for the material introduced across its 2025 platforms. In documentation and interface guidelines it is described as a translucent layer that sits above content, reacts to its surroundings, and bends light rather than merely diffusing it. The important distinction for anyone building their own version is this: the material has a physical model, and a blur alone does not reproduce it.",
      },
      { type: "h2", text: "The four properties that define the material" },
      {
        type: "list",
        items: [
          "Refraction: a curved body of glass displaces the content behind it. Edges bend more than the centre because the surface angles more steeply there.",
          "Specular rim light: the bevel catches light along its edge, so the border is brighter than the body and brightest where the surface is most angled.",
          "Transparency with depth: the material is translucent but not flat. Content behind it stays legible rather than dissolving.",
          "Adaptation: the material responds to motion and to what is behind it. A floating glass element is understood as sitting above the content plane.",
        ],
      },
      {
        type: "p",
        text: "Frosted glassmorphism, the style that spread from 2020 onward, implements only the third property: a backdrop blur plus a translucent tint. That is why it is cheap to render and why it reads as a flat pane. The bend and the rim are what make a surface read as glass with thickness.",
      },
      { type: "h2", text: "Why the edge is the hard part" },
      {
        type: "p",
        text: "A blur is a uniform operation: every pixel of the backdrop is mixed the same way. Refraction is not. The displacement of the backdrop depends on where you sample relative to the surface normal, so the transformation varies across the shape and increases near the boundary. On the web this is done with an SVG feDisplacementMap filter driven by a generated normal map, applied as a backdrop-filter. Because the filter is expressed in device-independent units, it stays consistent across display densities.",
      },
      {
        type: "note",
        text: "One consequence worth knowing before you build this: displacement filters operate on the backdrop, so the element needs a real backdrop to sample. On a flat solid background the bend is invisible. Glass is only convincing over content.",
      },
      { type: "h2", text: "Implementing it on the web" },
      {
        type: "p",
        text: "Chromium supports SVG filters referenced from backdrop-filter, which makes real refraction possible in a browser. Safari and Firefox currently support the blur portion of the filter chain but not the displacement map, so the material degrades to frosted glass there. This is a characteristic of the platforms, not of any one library: no amount of CSS will make a browser composite a displacement filter it does not implement.",
      },
      {
        type: "code",
        lang: "tsx",
        text: `import { Glass } from "glacia";

export function Toolbar() {
  return (
    <Glass effect="regular" radius={22}>
      <nav>...</nav>
    </Glass>
  );
}`,
      },
      { type: "h2", text: "Implementing it on iOS" },
      {
        type: "p",
        text: "On iOS 26 and later the material is a system effect, applied by UIKit. A React Native app reaches it through a native view that adopts UIGlassEffect. On older iOS versions and on Android no equivalent system material exists, so a library has to approximate it with a translucent tinted surface that keeps the same layout and contrast. Glacia ships both paths behind one component name so the layout does not change between them.",
      },
      {
        type: "p",
        text: "If you are building for both platforms, the practical rule is to design against the weakest surface you support. Layout, spacing, and text contrast should hold when the refraction is absent; the bend is an enhancement on top of a legible interface, never the thing that makes text readable.",
      },
    ],
  },
  {
    slug: "liquid-glass-vs-glassmorphism",
    title: "Liquid Glass vs glassmorphism: what actually differs in the CSS",
    description:
      "Glassmorphism is backdrop blur plus a translucent tint. Liquid Glass adds displacement and a specular rim. A side-by-side comparison of both implementations in CSS and SVG.",
    lede: "The two styles look related and are built differently. Here is the actual difference, and when each one is the right choice.",
    datePublished: "2025-07-10",
    readingMinutes: 7,
    topic: "Fundamentals",
    related: [
      { label: "Glass primitive", href: "/platform/web/components/glass" },
      { label: "Performance guide", href: "/platform/web/performance" },
    ],
    blocks: [
      {
        type: "p",
        text: "Glassmorphism became a default look for dashboards and landing pages after 2020. It is a small recipe: a translucent background, a backdrop-filter blur, a light border, and a soft shadow. It costs almost nothing to render. Liquid Glass, introduced by Apple in 2025, keeps the translucency and adds a physical model for how the glass body interacts with light.",
      },
      { type: "h2", text: "The glassmorphism implementation" },
      {
        type: "code",
        lang: "css",
        text: `.panel {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.22);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
}`,
      },
      {
        type: "p",
        text: "That is the whole effect. Every pixel of the backdrop is blurred identically and the border is a uniform stroke. There is no notion of a curved surface, so nothing in the image bends and the edge does not respond to the content behind it.",
      },
      { type: "h2", text: "The Liquid Glass implementation" },
      {
        type: "p",
        text: "Two things are added. First, the backdrop is displaced rather than blended, using an SVG filter:",
      },
      {
        type: "code",
        lang: "css",
        text: `.lens {
  backdrop-filter: url(#displacement) blur(0.5px) saturate(150%);
}

/* The filter samples a generated normal map. R and G channels encode the
   horizontal and vertical surface normal; blue is unused. */
<filter id="displacement" x="0" y="0" width="100%" height="100%">
  <feImage href="normal-map.png" result="map" />
  <feDisplacementMap in="SourceGraphic" in2="map" scale="24"
    xChannelSelector="R" yChannelSelector="G" />
</filter>`,
      },
      {
        type: "p",
        text: "Second, the rim is generated rather than drawn as a border. The specular highlight follows the same normal map, so it is brightest along the steepest part of the bevel. Solving the whole filter chain with one shape function is what keeps the edge continuous around a rounded rectangle.",
      },
      { type: "h2", text: "Where each belongs" },
      {
        type: "list",
        items: [
          "Use glassmorphism when you need many stacked translucent surfaces, when the target browsers include Safari and Firefox, or when the panel is large and mostly a background.",
          "Use a refracting material for floating controls: toolbars, tab bars, buttons, dialogs, and anything that is conceptually a physical object above the page.",
          "Never use either to fix a contrast problem. Both reduce text contrast; pick foreground colours that survive the worst-case backdrop.",
        ],
      },
      { type: "h2", text: "The cost" },
      {
        type: "p",
        text: "A backdrop blur is a separable convolution and is heavily optimised by every browser. A displacement filter is not: it requires the backdrop to be rasterised, sampled through a lookup, and recomposited, and it invalidates when the backdrop changes. This is why a refracting surface is worth spending on a few floating elements and not on a scrolling list of two hundred rows.",
      },
      {
        type: "note",
        text: "Displacement maps do not work on a cheap surface. If you apply the effect to a large element that scrolls with content, you will see the cost in compositing on mid-range hardware long before you see it on a developer laptop.",
      },
    ],
  },
  {
    slug: "liquid-glass-react",
    title: "How to build a Liquid Glass interface in React",
    description:
      "A practical walkthrough: installing Glacia, wrapping a layout in glass, handling the browser support gap, and keeping the effect readable and accessible.",
    lede: "From an empty React app to a floating glass toolbar, with the trade-offs that matter at each step.",
    datePublished: "2025-07-18",
    readingMinutes: 9,
    topic: "React",
    related: [
      { label: "Installation", href: "/platform/web/installation" },
      { label: "Glass primitive", href: "/platform/web/components/glass" },
      { label: "Button", href: "/platform/web/components/button" },
    ],
    blocks: [
      { type: "h2", text: "Install" },
      {
        type: "p",
        text: "Glacia is distributed two ways. The npm package gives you the whole library as a dependency:",
      },
      {
        type: "code",
        lang: "bash",
        text: `npm install glacia`,
      },
      {
        type: "p",
        text: "The CLI gives you the source instead, one component at a time. Component files land in your project and you own them, which is useful when you want to change the optical parameters for your brand.",
      },
      {
        type: "code",
        lang: "bash",
        text: `npx glacia add glass      # just the primitive
npx glacia add button     # one component
npx glacia add all        # everything`,
      },
      { type: "h2", text: "Make something glass" },
      {
        type: "p",
        text: "The primitives are ordinary React components. The only rule that matters is that glass needs something behind it:",
      },
      {
        type: "code",
        lang: "tsx",
        text: `import { Glass, Button } from "glacia";

export function Toolbar() {
  return (
    <div className="page">
      {/* Content behind the glass is what makes the refraction visible. */}
      <section className="content">...</section>

      <Glass
        effect="regular"
        radius={24}
        style={{ position: "fixed", bottom: 24, left: "50%", translate: "-50%" }}
      >
        <div className="row">
          <Button variant="glass">Share</Button>
          <Button variant="glass">Export</Button>
        </div>
      </Glass>
    </div>
  );
}`,
      },
      {
        type: "note",
        text: "A glass element on a flat background renders as a barely-visible pane. Put it over text, imagery, or a gradient if you want the effect to read.",
      },
      { type: "h2", text: "The blur radius in the filter chain matters" },
      {
        type: "p",
        text: "The refracting layer already softens the backdrop. Adding a large blur on top removes the detail the displacement is supposed to bend, and the result looks like frosted plastic. A small blur, or none, keeps the bend legible. Glacia exposes this as the `blur` parameter on the glass primitive.",
      },
      { type: "h2", text: "Handle the browser gap honestly" },
      {
        type: "p",
        text: "Chromium renders the displacement. Safari and Firefox render the blur and the rim but not the bend. There is no polyfill: a browser that does not implement the filter cannot be made to. What you control is whether the interface still works when the bend is missing. In practice that means not putting critical affordances in a place that only becomes legible when refracted.",
      },
      { type: "h2", text: "Rendering cost and where to draw the line" },
      {
        type: "p",
        text: "A refracting surface has to re-sample its backdrop. Every one you add is another composited layer that must be kept in sync with the page. Reasonable places for glass: a toolbar, a tab bar, a single floating action cluster, a dialog overlay, a card that is the focal point of a screen. Unreasonable: a hundred list rows, a large scrolling panel, or an element that animates its size every frame.",
      },
      {
        type: "p",
        text: "If you do need many small glass surfaces, prefer the cheaper effect variant. Glacia's `effect` prop switches the material intensity per instance, so the focal element can refract while supporting elements stay frosted.",
      },
      { type: "h2", text: "Accessibility is not optional here" },
      {
        type: "list",
        items: [
          "Test text contrast against the busiest thing that can scroll behind the glass, not against the average background.",
          "Keep the focus ring on top of the glass. A ring painted under the material may be invisible.",
          "Respect prefers-reduced-transparency: users who request it get the opaque variant, and Glacia honours the media query.",
          "Never rely on the refraction to communicate state. Press, focus, and disabled states must be visible as colour or motion changes too.",
        ],
      },
    ],
  },
  {
    slug: "liquid-glass-react-native-expo",
    title: "Liquid Glass in React Native and Expo: native iOS 26 glass with a real fallback",
    description:
      "How to use glacia-native to get UIGlassEffect on iOS 26 while keeping a consistent interface on older iOS versions, Android, and Expo Go.",
    lede: "Native glass on iOS 26, an honest fallback everywhere else, and one component API for both.",
    datePublished: "2025-07-26",
    readingMinutes: 8,
    topic: "React Native",
    related: [
      { label: "Mobile installation", href: "/platform/mobile/installation" },
      { label: "Mobile components", href: "/platform/mobile/components" },
    ],
    blocks: [
      {
        type: "p",
        text: "On iOS 26 the Liquid Glass material is provided by the system. In React Native there is no CSS filter chain to reach it with: you need a native view that adopts UIGlassEffect and composites it. On older iOS and on Android no such material exists at all. A library therefore has two jobs — use the real thing where it exists, and degrade in a way that does not break layouts where it does not.",
      },
      { type: "h2", text: "Install" },
      {
        type: "code",
        lang: "bash",
        text: `npx expo install glacia-native`,
      },
      {
        type: "p",
        text: "The native material comes from a companion native module. Glacia declares it as a peer dependency rather than bundling it, so your app controls the version and Expo prebuild picks it up normally.",
      },
      { type: "h2", text: "Use it" },
      {
        type: "code",
        lang: "tsx",
        text: `import { Glass, Button, Text } from "glacia-native";

export function FloatingBar() {
  return (
    <Glass style={{ position: "absolute", bottom: 24, alignSelf: "center" }}>
      <Button variant="glass">Share</Button>
      <Button variant="glass">Export</Button>
    </Glass>
  );
}`,
      },
      { type: "h2", text: "What actually happens per platform" },
      {
        type: "list",
        items: [
          "iOS 26 or newer: a native glass effect view, matching the system material.",
          "iOS below 26: a translucent tinted view with a hairline border. Same layout, same padding, no refraction.",
          "Android: the same translucent tinted fallback.",
          "Expo Go: the same fallback, because Expo Go does not include custom native modules. A development build is required to see the real material.",
        ],
      },
      {
        type: "note",
        text: "That last point surprises people. If your glass looks flat on iOS 26, you are almost certainly testing in Expo Go rather than a development build. Run `npx expo run:ios` to see the native material.",
      },
      { type: "h2", text: "Designing for the fallback" },
      {
        type: "p",
        text: "Because the fallback is the common case across the Android half of your users and most simulator configurations, treat it as the primary design target. Two practical rules: never place text directly on the glass edge where only the specular rim would separate it from the background, and give every glass surface an opaque-enough tint that its content is readable over a photo.",
      },
      { type: "h2", text: "What is not portable" },
      {
        type: "p",
        text: "Hover-only interaction has no meaning on touch, so tooltips, hover cards, and menu bars are web-only in Glacia by design rather than by omission. Charts have no hover either; every mark becomes a touch target and the legend is on by default so values are readable without a pointer.",
      },
      {
        type: "p",
        text: "The honest summary: if you want Apple's exact material, you need iOS 26 and a development build. If you want an interface that looks deliberate on every device your users have, design the fallback first and let the native material be the upgrade.",
      },
    ],
  },
  {
    slug: "ios-inspired-react-components",
    title: "Building iOS-style interfaces with React: what to copy and what not to",
    description:
      "Which parts of iOS interaction design translate to the web without breaking accessibility, and which are platform idioms that should stay on iOS.",
    lede: "Spring physics, press states, and safe areas translate well. Segmented controls and hover do not. A practical guide to the boundary.",
    datePublished: "2025-08-04",
    readingMinutes: 7,
    topic: "React",
    related: [
      { label: "Button", href: "/platform/web/components/button" },
      { label: "Segmented control", href: "/platform/web/components/segmented-control" },
      { label: "Accessibility", href: "/platform/web/accessibility" },
    ],
    blocks: [
      {
        type: "p",
        text: "Copying iOS styling is straightforward. Copying iOS behaviour is where interfaces go wrong, because much of what makes iOS feel right depends on hardware and platform conventions the web does not share.",
      },
      { type: "h2", text: "What translates cleanly" },
      {
        type: "list",
        items: [
          "Press physics. A short scale-down on pointer down with a spring return reads as responsive on any device. It is pure transform and costs nothing.",
          "Material layering. The idea that a floating element sits above content, with a soft shadow and a brighter edge, is platform-neutral.",
          "Generous touch targets. 44 points is a good minimum on the web too, not least because it helps motor-impaired users with a mouse.",
          "Motion character. Springs with low bounce and short durations feel at home next to web interfaces; the exact iOS curves do not have to be duplicated to get the feel.",
        ],
      },
      { type: "h2", text: "What does not translate" },
      {
        type: "p",
        text: "Hover is the clearest example. iOS has no hover state, so importing a hover-only reveal into a web interface creates information that keyboard and touch users cannot reach. The same applies in reverse: a tooltip that is useful with a pointer has no equivalent on a phone.",
      },
      {
        type: "p",
        text: "Segmented controls are another. On iOS the control is short, its options are three or fewer, and the surrounding screen establishes what it switches. On the web the same control often ends up with eight options and a label that has to carry the meaning alone. Below a handful of options a segmented control is excellent; beyond that, a select is the more honest primitive.",
      },
      {
        type: "note",
        text: "Back gestures are the third trap. An edge-swipe that navigates back conflicts with the browser's own history gesture on iOS Safari. Do not implement one.",
      },
      { type: "h2", text: "Do not fight the platform" },
      {
        type: "p",
        text: "Scrollbars, text selection, focus rings, and browser zoom are browser features. Hiding them to make a page feel native removes affordances users depend on. If a design needs a screen to feel native, the answer is usually a React Native screen, not a web page that has removed its scrollbar.",
      },
      { type: "h2", text: "A workable checklist" },
      {
        type: "list",
        items: [
          "Press states use transform and opacity only, never layout properties.",
          "Every hover-only affordance has a focus and touch equivalent, or it is single-platform by design.",
          "Touch targets are at least 44 by 44 CSS pixels, with enough spacing to avoid mis-taps.",
          "Focus rings are visible against the busiest surface the element can sit on.",
          "prefers-reduced-motion and prefers-reduced-transparency both change the result.",
        ],
      },
    ],
  },
  {
    slug: "glacia-getting-started",
    title: "Getting started with Glacia: a glass interface in ten minutes",
    description:
      "End-to-end setup for both packages: the CLI or npm for web, and expo install for React Native, plus the configuration that catches people out.",
    lede: "The shortest correct path from install to a working glass surface, on web and on mobile.",
    datePublished: "2025-08-11",
    readingMinutes: 6,
    topic: "Getting started",
    related: [
      { label: "Web installation", href: "/platform/web/installation" },
      { label: "Mobile installation", href: "/platform/mobile/installation" },
      { label: "Components", href: "/platform/web/components" },
    ],
    blocks: [
      { type: "h2", text: "Which package do I need?" },
      {
        type: "list",
        items: [
          "`glacia` is for the web: React 18 or 19, any bundler. It renders SVG-filter refraction in the browser.",
          "`glacia-native` is for React Native and Expo: iOS 26 native glass, tinted fallback elsewhere.",
          "They are separate packages with separate component APIs. A React Native app does not use the web package.",
        ],
      },
      { type: "h2", text: "Web, via npm" },
      {
        type: "code",
        lang: "bash",
        text: `npm install glacia`,
      },
      {
        type: "code",
        lang: "tsx",
        text: `import "glacia/styles.css";
import { Glass, Button } from "glacia";`,
      },
      {
        type: "p",
        text: "The stylesheet is required. It defines the theme tokens the components read, and without it every surface renders unstyled.",
      },
      { type: "h2", text: "Web, via the CLI" },
      {
        type: "p",
        text: "If you would rather own the source, the CLI copies component files into your project and rewrites their imports. It has no remote dependency requirement: the registry ships inside the package.",
      },
      {
        type: "code",
        lang: "bash",
        text: `npx glacia list          # see what is available
npx glacia add button    # one component, plus what it needs
npx glacia add all       # the full set`,
      },
      { type: "h2", text: "React Native and Expo" },
      {
        type: "code",
        lang: "bash",
        text: `npx expo install glacia-native
npx expo run:ios    # required to see the native material`,
      },
      {
        type: "note",
        text: "Expo Go cannot load the native glass module. If you are evaluating the material on iOS 26, use a development build. In Expo Go you will see the tinted fallback, which is expected.",
      },
      { type: "h2", text: "The three mistakes that catch people out" },
      {
        type: "list",
        items: [
          "Glass with nothing behind it. The effect needs a backdrop to refract. Over a flat colour it is nearly invisible.",
          "Too much blur. A large blur on top of the refracting layer destroys the detail the displacement bends. Keep it small.",
          "Glass everywhere. Each refracting surface is a composited layer. Use it for floating controls, not for every container.",
        ],
      },
    ],
  },
];

export const GUIDE_BY_SLUG = new Map(GUIDES.map((guide) => [guide.slug, guide]));
