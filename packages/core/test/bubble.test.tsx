import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Bubble, BubbleGroup } from "../src/bubble";

describe("Bubble", () => {
  it("renders its children inside the bubble body", () => {
    render(<Bubble>Hello there</Bubble>);
    expect(screen.getByText("Hello there")).toBeTruthy();
  });

  it("takes the side it is told, so it sits on the right of a conversation", () => {
    const { container } = render(<Bubble side="user">Mine</Bubble>);
    const bubble = container.querySelector(".gl-bubble")!;
    expect(bubble.classList.contains("gl-bubble-user")).toBe(true);
    expect(bubble.getAttribute("data-side")).toBe("user");
  });

  it("defaults to an assistant bubble in glass", () => {
    const { container } = render(<Bubble>Supplied</Bubble>);
    const bubble = container.querySelector(".gl-bubble")!;
    expect(bubble.classList.contains("gl-bubble-assistant")).toBe(true);
    expect(bubble.classList.contains("gl-bubble-glass")).toBe(true);
  });

  it("switches material without changing anything else", () => {
    const { container } = render(<Bubble variant="gradient">Graded</Bubble>);
    expect(container.querySelector(".gl-bubble")!.classList.contains("gl-bubble-gradient")).toBe(true);
  });

  it("points the corner it is given, and drops the point when asked", () => {
    const { container, rerender } = render(<Bubble tail="start">Tailed</Bubble>);
    expect(container.querySelector(".gl-bubble")!.classList.contains("gl-bubble-tail-start")).toBe(true);
    rerender(<Bubble tail="none">Tailed</Bubble>);
    const classes = container.querySelector(".gl-bubble")!.className;
    expect(classes).not.toContain("gl-bubble-tail-");
  });

  it("shows a timestamp only when given one", () => {
    const { container, rerender } = render(<Bubble time="9:41 AM">Timed</Bubble>);
    expect(container.querySelector(".gl-bubble-time")!.textContent).toBe("9:41 AM");
    rerender(<Bubble>Timed</Bubble>);
    expect(container.querySelector(".gl-bubble-time")).toBeNull();
  });

  it("grows to the full wrap width when asked", () => {
    const { container } = render(<Bubble full>Wide</Bubble>);
    expect(container.querySelector(".gl-bubble")!.classList.contains("gl-bubble-full")).toBe(true);
  });

  it("keeps a run of bubbles on one edge in a group", () => {
    const { container } = render(
      <BubbleGroup side="user">
        <Bubble side="user">One</Bubble>
        <Bubble side="user">Two</Bubble>
      </BubbleGroup>,
    );
    const group = container.querySelector(".gl-bubble-group")!;
    expect(group.classList.contains("gl-bubble-group-user")).toBe(true);
    expect(container.querySelectorAll(".gl-bubble").length).toBe(2);
  });
});
