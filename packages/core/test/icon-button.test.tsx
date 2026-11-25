import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { IconButton } from "../src/icon-button";

test("renders a circle with only an icon", () => {
  render(<IconButton icon={<svg />} aria-label="Share" />);
  const button = screen.getByRole("button", { name: "Share" });
  expect(button.dataset.icon).toBe("only");
  expect(button.className).toBe("gl-glass gl-button");
});

test("forwards its ref and props", () => {
  const ref = createRef<HTMLButtonElement>();
  render(
    <IconButton ref={ref} icon={<svg />} aria-label="Save" className="extra" disabled />,
  );
  expect(ref.current).toBe(screen.getByRole("button"));
  expect(ref.current?.className).toBe("gl-glass gl-button extra");
  expect(ref.current?.disabled).toBe(true);
});

test("marks its variant, size and destructive role", () => {
  render(
    <>
      <IconButton icon={<svg />} aria-label="Glass" />
      <IconButton icon={<svg />} aria-label="Delete" variant="filled" size="lg" destructive />
    </>,
  );
  const glass = screen.getByRole("button", { name: "Glass" });
  const remove = screen.getByRole("button", { name: "Delete" });
  expect(glass.hasAttribute("data-variant")).toBe(false);
  expect(glass.hasAttribute("data-size")).toBe(false);
  expect(glass.hasAttribute("data-destructive")).toBe(false);
  expect(remove.dataset.variant).toBe("filled");
  expect(remove.dataset.size).toBe("lg");
  expect(remove.dataset.destructive).toBe("");
});

test("takes a custom tint", () => {
  render(<IconButton icon={<svg />} aria-label="Order" variant="filled" tint="#ff8d28" />);
  const button = screen.getByRole("button", { name: "Order" });
  expect(button.hasAttribute("data-tint")).toBe(true);
  expect(button.style.getPropertyValue("--gl-tint")).toBe("#ff8d28");
});
