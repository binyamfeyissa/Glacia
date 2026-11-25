import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { SlotCell } from "../src/slot-cell";

test("renders label and time", () => {
  render(<SlotCell label="Morning" time="09:30" />);
  expect(screen.getByText("Morning")).toBeTruthy();
  expect(screen.getByText("09:30")).toBeTruthy();
});

test("marks the selected state with aria-pressed and data-selected", () => {
  render(
    <>
      <SlotCell label="09:30" selected />
      <SlotCell label="10:00" />
    </>,
  );
  const chosen = screen.getByRole("button", { name: "09:30" });
  const other = screen.getByRole("button", { name: "10:00" });
  expect(chosen.getAttribute("aria-pressed")).toBe("true");
  expect(chosen.dataset.selected).toBe("");
  expect(other.hasAttribute("aria-pressed")).toBe(false);
  expect(other.hasAttribute("data-selected")).toBe(false);
});

test("calls onSelect when tapped and stays silent when disabled", () => {
  const onSelect = vi.fn();
  render(
    <>
      <SlotCell label="09:30" onSelect={onSelect} />
      <SlotCell label="10:00" disabled onSelect={onSelect} />
    </>,
  );
  fireEvent.click(screen.getByRole("button", { name: "09:30" }));
  expect(onSelect).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByRole("button", { name: "10:00" }));
  expect(onSelect).toHaveBeenCalledTimes(1);
});

test("uses Button's size scale and marks only non-default sizes", () => {
  render(
    <>
      <SlotCell label="md" />
      <SlotCell label="sm" size="sm" />
      <SlotCell label="lg" size="lg" />
    </>,
  );
  expect(screen.getByRole("button", { name: "md" }).hasAttribute("data-size")).toBe(
    false,
  );
  expect(screen.getByRole("button", { name: "sm" }).dataset.size).toBe("sm");
  expect(screen.getByRole("button", { name: "lg" }).dataset.size).toBe("lg");
});

test("forwards its ref and props", () => {
  const ref = createRef<HTMLButtonElement>();
  render(<SlotCell ref={ref} label="09:30" className="extra" />);
  expect(ref.current).toBe(screen.getByRole("button", { name: "09:30" }));
  expect(ref.current?.className).toBe("gl-glass gl-slot-cell extra");
  expect(ref.current?.getAttribute("type")).toBe("button");
});
