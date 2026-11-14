import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { AIInput } from "../src";

const css = readFileSync(resolve(__dirname, "../src/styles.css"), "utf-8");

function fieldRule(): string {
  const start = css.indexOf("\n.gl-ai-input-field {");
  return css.slice(start, css.indexOf("}", start));
}

describe("AIInput", () => {
  it("calls onSubmit with the trimmed prompt on Enter", () => {
    const onSubmit = vi.fn();
    render(<AIInput onSubmit={onSubmit} />);
    const box = screen.getByPlaceholderText("Ask anything…");

    fireEvent.change(box, { target: { value: "  hello  " } });
    fireEvent.keyDown(box, { key: "Enter" });

    expect(onSubmit).toHaveBeenCalledWith("hello");
  });

  it("inserts a newline on Shift+Enter instead of submitting", () => {
    const onSubmit = vi.fn();
    render(<AIInput onSubmit={onSubmit} />);
    const box = screen.getByPlaceholderText("Ask anything…");

    fireEvent.change(box, { target: { value: "hi" } });
    fireEvent.keyDown(box, { key: "Enter", shiftKey: true });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("refuses to send an empty prompt", () => {
    const onSubmit = vi.fn();
    render(<AIInput onSubmit={onSubmit} />);
    fireEvent.change(screen.getByPlaceholderText("Ask anything…"), {
      target: { value: "   " },
    });
    fireEvent.click(screen.getByLabelText("Send prompt"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("will not send while a request is in flight", () => {
    const onSubmit = vi.fn();
    render(<AIInput onSubmit={onSubmit} busy value="hello" />);
    fireEvent.click(screen.getByLabelText("Sending"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("is a pill at rest", () => {
    const { container } = render(<AIInput />);
    const field = container.querySelector<HTMLElement>(".gl-ai-input-field")!;
    expect(field.getAttribute("data-grown")).toBeNull();
    expect(field.style.getPropertyValue("--gl-ai-input-lines")).toBe("1");
    // A single line keeps the full capsule.
    expect(fieldRule()).toContain("var(--gl-pill)");
  });

  it("relaxes its curve as it grows into a paragraph", () => {
    // min(999px, 23px + (lines - 1) * 6px) caps the radius, so a tall field
    // is rounded rather than a stadium that bulges at the waist.
    expect(fieldRule()).toContain("--gl-ai-input-lines");
    expect(fieldRule()).toMatch(/border-radius:\s*min\(/);
  });

  it("wears the glass material rather than a flat surface", () => {
    expect(fieldRule()).toContain("var(--gl-glass)");
    expect(fieldRule()).not.toContain("var(--gl-surface)");
  });
});
