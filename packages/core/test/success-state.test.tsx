import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { SuccessState } from "../src/success-state";

test("renders title, description, and action in the Empty layout", () => {
  render(
    <SuccessState
      icon={<span>✓</span>}
      title="Payment sent"
      description="Your invoice was paid."
      action={<button>View receipt</button>}
    />,
  );
  expect(screen.getByRole("heading", { name: "Payment sent" })).toBeTruthy();
  expect(screen.getByText("Your invoice was paid.")).toBeTruthy();
  expect(screen.getByRole("button", { name: "View receipt" })).toBeTruthy();
  expect(screen.getByText("✓")).toBeTruthy();
});

test("is a success state, not an empty state: success hook and status role", () => {
  const { container } = render(<SuccessState title="Done" />);
  const root = screen.getByRole("status");
  expect(root.className).toContain("gl-success-state");
  expect(root.className).toContain("gl-empty");
  expect(root.className).toContain("gl-glass");
  expect(container.querySelector(".gl-empty-title")?.textContent).toBe("Done");
});

test("omits optional slots when not given", () => {
  render(<SuccessState title="Done" />);
  expect(document.querySelector(".gl-empty-icon-plate")).toBeNull();
  expect(document.querySelector(".gl-empty-description")).toBeNull();
  expect(document.querySelector(".gl-empty-action")).toBeNull();
});

test("forwards its ref and props", () => {
  const ref = createRef<HTMLDivElement>();
  render(<SuccessState ref={ref} title="Done" className="extra" id="ok" />);
  expect(ref.current).toBe(screen.getByRole("status"));
  expect(ref.current?.className).toBe("gl-glass gl-empty gl-success-state extra");
  expect(ref.current?.id).toBe("ok");
});
