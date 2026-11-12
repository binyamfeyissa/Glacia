"use client";

import {
  AIInput,
  ImageGeneration,
  Panelside,
  Plan,
  Response,
  Shimmer,
  Soundwave,
  Sources,
  Task,
  ThinkingOrb,
} from "glacia";

// Each AI demo shows the component doing its actual job, with state it owns,
// rather than a static mock that would hide whether it works.

const aiCases: Record<string, () => React.ReactNode> = {
  shimmer: () => (
    <div style={{ width: "100%", maxWidth: 380 }}>
      <Shimmer lines={4} label="Loading answer" />
    </div>
  ),
  "thinking-orb": () => (
    <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
      <ThinkingOrb size={18} />
      <ThinkingOrb size={26} label="Reasoning" />
      <ThinkingOrb size={34} label="Working" />
    </div>
  ),
  plan: () => (
    <Plan
      title="Plan"
      steps={[
        { id: "1", title: "Read the package manifest", status: "done" },
        { id: "2", title: "Add the chart primitives", status: "done", detail: "scales, frame, tooltip" },
        { id: "3", title: "Wire the docs routes", status: "running" },
        { id: "4", title: "Run the full test suite", status: "pending" },
        { id: "5", title: "Publish to npm", status: "failed", detail: "missing auth token" },
      ]}
    />
  ),
  sources: () => (
    <Sources
      sources={[
        {
          id: "s1",
          title: "Liquid Glass — Human Interface Guidelines",
          url: "https://developer.apple.com/design/",
          snippet: "Materials express hierarchy by blurring and tinting what lies behind a surface.",
          domain: "developer.apple.com",
        },
        {
          id: "s2",
          title: "SVG filter primitives: feDisplacementMap",
          url: "https://developer.mozilla.org/",
          snippet: "The displacement map filter uses pixel values to shift each pixel of the source.",
          domain: "developer.mozilla.org",
        },
      ]}
    />
  ),
  response: () => (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <Response
        text="Liquid Glass works by refracting what sits behind a surface rather than blurring it. The displacement comes from a map, and the rim light is painted on top of the result."
        revealed={94}
      />
    </div>
  ),
  soundwave: () => (
    <div style={{ width: "100%", maxWidth: 380, color: "var(--gl-chart-1, #0088ff)" }}>
      <Soundwave bars={32} height={44} label="Microphone level" />
    </div>
  ),
  task: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 380 }}>
      <Task task={{ label: "Indexing repository", progress: 0.62, detail: "4,120 of 6,640 files" }} />
      <Task task={{ label: "Uploading assets", status: "running" }} />
      <Task task={{ label: "Build docs", progress: 1, status: "done", detail: "263 pages" }} />
    </div>
  ),
  panelside: () => (
    <div style={{ width: 220 }}>
      <Panelside
        title="Workspace"
        items={[
          { id: "chat", label: "Conversations", count: 6 },
          { id: "prompts", label: "Saved prompts", count: 3 },
          { id: "tasks", label: "Running tasks" },
        ]}
        footer={<span style={{ fontSize: 11, opacity: 0.6 }}>Signed in as A. Rivera</span>}
      />
    </div>
  ),
  "ai-input": () => (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <AIInput
        hint="Glacia 1 · Enter to send, Shift+Enter for a new line"
        onSubmit={(prompt) => {
          // eslint-disable-next-line no-console
          console.log("prompt:", prompt);
        }}
      />
    </div>
  ),
  "image-generation": () => (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <ImageGeneration
        generating
        ratio={1}
        images={[
          { id: "1", src: "/hero/tahoe-dark.jpg", alt: "A lake at dusk", prompt: "A calm alpine lake at dusk" },
          { id: "2", src: "/glacia-icon-512.png", alt: "Glacia icon", prompt: "A glass app icon" },
        ]}
      />
    </div>
  ),
};

export function AIDemo({ slug }: { slug: string }) {
  const render = aiCases[slug];
  if (!render) return <div>Component Demo</div>;
  return <div className="ai-demo">{render()}</div>;
}

export const AI_SLUGS = Object.keys(aiCases);
