"use client";

import {
  AIInput,
  Panelside,
  Plan,
  Response,
  Shimmer,
} from "glacia";

// Each AI demo shows the component doing its actual job, with state it owns,
// rather than a static mock that would hide whether it works.

const aiCases: Record<string, () => React.ReactNode> = {
  shimmer: () => (
    <div style={{ width: "100%", maxWidth: 380 }}>
      <Shimmer lines={4} label="Loading answer" />
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
  response: () => (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <Response
        text="Liquid Glass works by refracting what sits behind a surface rather than blurring it. The displacement comes from a map, and the rim light is painted on top of the result."
        revealed={94}
      />
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
};

export function AIDemo({ slug }: { slug: string }) {
  const render = aiCases[slug];
  if (!render) return <div>Component Demo</div>;
  return <div className="ai-demo">{render()}</div>;
}

export const AI_SLUGS = Object.keys(aiCases);
