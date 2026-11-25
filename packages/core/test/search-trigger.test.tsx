import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { SearchTrigger } from "../src/search-trigger";

test("renders a glass button with label and shortcut hint", () => {
  render(<SearchTrigger />);
  const button = screen.getByRole("button", { name: /Search/ });
  expect(button.className).toBe("gl-glass gl-button gl-search-trigger");
  expect(button.textContent).toContain("Search");
  expect(button.textContent).toContain("⌘K");
  expect(button.hasAttribute("data-size")).toBe(false);
});

test("takes a custom label, shortcut and size", () => {
  render(<SearchTrigger label="Find a command" shortcut="Ctrl K" size="lg" />);
  const button = screen.getByRole("button", { name: /Find a command/ });
  expect(button.dataset.size).toBe("lg");
  expect(button.textContent).toContain("Ctrl K");
});

test("forwards its ref and props, including disabled", () => {
  const ref = createRef<HTMLButtonElement>();
  render(<SearchTrigger ref={ref} className="extra" disabled onClick={() => {}} />);
  expect(ref.current).toBe(screen.getByRole("button"));
  expect(ref.current?.className).toBe("gl-glass gl-button gl-search-trigger extra");
  expect(ref.current?.disabled).toBe(true);
});
