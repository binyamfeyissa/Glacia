import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  NativeAIInput,
  NativeImageGeneration,
  NativePanelside,
  NativePlan,
  NativeResponse,
  NativeSoundwave,
  NativeSources,
  NativeTask,
} from "../src";

describe("NativePlan", () => {
  const steps = [
    { id: "1", title: "Read the file", status: "done" as const },
    { id: "2", title: "Patch the bug", status: "running" as const },
    { id: "3", title: "Run tests", status: "pending" as const },
  ];

  it("counts completed steps", () => {
    render(<NativePlan steps={steps} />);
    expect(screen.getByText("1/3")).toBeTruthy();
  });

  it("states each step's status for assistive tech", () => {
    const { container } = render(<NativePlan steps={steps} />);
    const labels = Array.from(container.querySelectorAll("[aria-label]")).map((el) =>
      el.getAttribute("aria-label"),
    );
    expect(labels).toContain("Patch the bug: running");
  });

  it("shows a custom title", () => {
    render(<NativePlan title="Approach" steps={steps} />);
    expect(screen.getByText("Approach")).toBeTruthy();
  });
});

describe("NativeSources", () => {
  const sources = [
    { id: "a", title: "Spec", url: "https://x.dev/a", domain: "x.dev" },
    { id: "b", title: "Notes", url: "https://x.dev/b", snippet: "A short excerpt" },
  ];

  it("renders nothing without sources", () => {
    const { container } = render(<NativeSources sources={[]} />);
    expect(container.textContent).toBe("");
  });

  it("lists every source", () => {
    const { container } = render(<NativeSources sources={sources} />);
    const links = Array.from(container.querySelectorAll('[role="link"]'));
    expect(links.map((l) => l.getAttribute("aria-label"))).toEqual(["Spec", "Notes"]);
  });

  it("hands the source to the caller on press", () => {
    const picked: string[] = [];
    const { container } = render(
      <NativeSources sources={sources} onSourcePress={(s) => picked.push(s.id)} />,
    );
    fireEvent.click(container.querySelectorAll('[role="link"]')[1]!);
    expect(picked).toEqual(["b"]);
  });
});

describe("NativeResponse", () => {
  it("shows the full text when nothing is revealed yet", () => {
    render(<NativeResponse text="Full answer" />);
    expect(screen.getByText("Full answer")).toBeTruthy();
  });

  it("reveals only the requested characters", () => {
    const { container } = render(<NativeResponse text="Streaming answer" revealed={9} />);
    // A caret is appended while streaming, so match on the prefix.
    const body = container.querySelector("[aria-label]")!;
    expect(body.textContent?.startsWith("Streaming")).toBe(true);
    expect(body.textContent).not.toContain("answer");
  });

  it("announces that a response is still arriving", () => {
    const { container } = render(<NativeResponse text="Streaming answer" revealed={9} />);
    expect(container.textContent).toContain("Response streaming");
  });

  it("announces completion once fully revealed", () => {
    const { container } = render(<NativeResponse text="Done" revealed={4} />);
    expect(container.textContent).toContain("Response complete");
  });
});

describe("NativeTask", () => {
  it("reports a percentage", () => {
    render(<NativeTask task={{ progress: 0.62, label: "Indexing" }} />);
    expect(screen.getByText("62%")).toBeTruthy();
  });

  it("shows an ellipsis for an indeterminate task", () => {
    render(<NativeTask task={{ label: "Indexing" }} />);
    expect(screen.getByText("…")).toBeTruthy();
  });

  it("exposes a progressbar role with the task label", () => {
    const { container } = render(<NativeTask task={{ progress: 0.5, label: "Indexing" }} />);
    const bar = container.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute("aria-label")).toBe("Indexing");
  });
});

describe("NativeSoundwave", () => {
  it("draws one bar per level", () => {
    const { container } = render(<NativeSoundwave levels={[0.1, 0.5, 0.9]} />);
    const bars = Array.from(container.querySelectorAll("div")).filter(
      (el) => el.getAttribute("style")?.includes("width: 3px"),
    );
    expect(bars.length).toBeGreaterThanOrEqual(3);
  });

  it("uses the requested bar count when no levels are given", () => {
    const { container } = render(<NativeSoundwave bars={12} />);
    const bars = Array.from(container.querySelectorAll("div")).filter(
      (el) => el.getAttribute("style")?.includes("width: 3px"),
    );
    expect(bars).toHaveLength(12);
  });

  it("labels the waveform for screen readers", () => {
    const { container } = render(<NativeSoundwave label="Microphone input" />);
    expect(container.querySelector('[role="img"]')!.getAttribute("aria-label")).toBe(
      "Microphone input",
    );
  });
});

describe("NativePanelside", () => {
  const items = [
    { id: "chats", label: "Chats", count: 12 },
    { id: "prompts", label: "Prompts", count: 3 },
  ];

  it("marks the active item", () => {
    const { container } = render(<NativePanelside items={items} value="prompts" />);
    const buttons = Array.from(container.querySelectorAll('[role="button"]'));
    expect(buttons[1]!.getAttribute("aria-selected")).toBe("true");
    expect(buttons[0]!.getAttribute("aria-selected")).toBe("false");
  });

  it("reports a selection", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <NativePanelside items={items} value="chats" onValueChange={onValueChange} />,
    );
    fireEvent.click(container.querySelectorAll('[role="button"]')[1]!);
    expect(onValueChange).toHaveBeenCalledWith("prompts");
  });
});

describe("NativeAIInput", () => {
  it("disables send while the field is empty", () => {
    const { container } = render(<NativeAIInput value="" />);
    const send = container.querySelector('[aria-label="Send"]')!;
    expect(send.getAttribute("aria-disabled")).toBe("true");
  });

  it("disables send for whitespace only", () => {
    const { container } = render(<NativeAIInput value="   " />);
    expect(container.querySelector('[aria-label="Send"]')!.getAttribute("aria-disabled")).toBe(
      "true",
    );
  });

  it("enables send once there is content", () => {
    const { container } = render(<NativeAIInput value="Hello" />);
    expect(container.querySelector('[aria-label="Send"]')!.getAttribute("aria-disabled")).toBe(
      "false",
    );
  });

  it("submits on press", () => {
    const onSubmit = vi.fn();
    const { container } = render(<NativeAIInput value="Hello" onSubmit={onSubmit} />);
    fireEvent.click(container.querySelector('[aria-label="Send"]')!);
    expect(onSubmit).toHaveBeenCalled();
  });

  it("does not submit while busy", () => {
    const onSubmit = vi.fn();
    const { container } = render(<NativeAIInput value="Hello" busy onSubmit={onSubmit} />);
    fireEvent.click(container.querySelector('[aria-label="Send"]')!);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("reports typed text", () => {
    const onChangeText = vi.fn();
    const { container } = render(<NativeAIInput value="" onChangeText={onChangeText} />);
    fireEvent.change(container.querySelector("textarea")!, { target: { value: "Hi" } });
    expect(onChangeText).toHaveBeenCalledWith("Hi");
  });
});

describe("NativeImageGeneration", () => {
  it("holds a placeholder while generating", () => {
    const { container } = render(<NativeImageGeneration status="generating" prompt="A glacier" />);
    expect(container.textContent).toContain("Generating…");
    expect(container.textContent).toContain("A glacier");
  });

  it("reports failure", () => {
    const { container } = render(<NativeImageGeneration status="failed" />);
    expect(container.textContent).toContain("Generation failed");
  });

  it("renders the image once done", () => {
    const { container } = render(
      <NativeImageGeneration
        status="done"
        image={{ url: "https://x.dev/a.png", alt: "A glacier" }}
      />,
    );
    const img = container.querySelector("img")!;
    expect(img.getAttribute("src")).toBe("https://x.dev/a.png");
    expect(img.getAttribute("alt")).toBe("A glacier");
  });
});
