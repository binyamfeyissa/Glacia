import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { CoverPlate } from "../src/cover-plate";

test("renders media on top and title and description below", () => {
  render(
    <CoverPlate
      media={<img src="/tahoe.jpg" alt="Lake Tahoe at dusk" />}
      title="Tahoe"
      description="The image backdrop."
      action={<button>Use it</button>}
    />,
  );
  expect(screen.getByRole("img", { name: "Lake Tahoe at dusk" })).toBeTruthy();
  expect(screen.getByText("Tahoe")).toBeTruthy();
  expect(screen.getByText("The image backdrop.")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Use it" })).toBeTruthy();
});

test("renders without media or action", () => {
  const { container } = render(<CoverPlate title="Plain" />);
  expect(container.querySelector(".gl-cover-plate-media")).toBeNull();
  expect(container.querySelector(".gl-cover-plate-action")).toBeNull();
  expect(screen.getByText("Plain")).toBeTruthy();
});

test("forwards its ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<CoverPlate ref={ref} title="Hello" className="extra" />);
  expect(ref.current?.className).toBe("gl-glass gl-cover-plate extra");
  expect(ref.current?.textContent).toContain("Hello");
});
