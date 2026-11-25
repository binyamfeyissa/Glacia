import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { Stepper } from "../src/stepper";

test("renders the current value between the − and + buttons", () => {
  const { container } = render(<Stepper value={3} min={0} max={10} />);
  const value = container.querySelector(".gl-stepper-value");
  expect(value?.textContent).toBe("3");
  // Order: decrease button, value, increase button.
  const children = [...container.querySelector(".gl-stepper")!.children].map(
    (el) => el.className,
  );
  expect(children[0]).toContain("gl-stepper-btn");
  expect(children).toContain("gl-stepper-value");
  expect(children[children.length - 1]).toContain("gl-stepper-btn");
  expect(children.indexOf("gl-stepper-value")).toBeGreaterThan(0);
  expect(children.indexOf("gl-stepper-value")).toBeLessThan(children.length - 1);
});

test("shows the value by default and updates it from the buttons", () => {
  const onValueChange = vi.fn();
  render(<Stepper value={2} min={0} max={5} onValueChange={onValueChange} />);
  expect(screen.getByText("2")).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Increase" }));
  expect(onValueChange).toHaveBeenCalledWith(3);
  fireEvent.click(screen.getByRole("button", { name: "Decrease" }));
  expect(onValueChange).toHaveBeenCalledWith(1);
});

test("showValue={false} hides the value but keeps the buttons working", () => {
  const onValueChange = vi.fn();
  const { container } = render(
    <Stepper value={4} min={0} max={10} showValue={false} onValueChange={onValueChange} />,
  );
  expect(container.querySelector(".gl-stepper-value")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Increase" }));
  expect(onValueChange).toHaveBeenCalledWith(5);
});

test("respects min, max, and disabled with the value shown", () => {
  const { container, rerender } = render(<Stepper value={0} min={0} max={10} />);
  expect((screen.getByRole("button", { name: "Decrease" }) as HTMLButtonElement).disabled).toBe(true);
  expect(container.querySelector(".gl-stepper-value")?.textContent).toBe("0");
  rerender(<Stepper value={10} min={0} max={10} disabled />);
  expect((screen.getByRole("button", { name: "Increase" }) as HTMLButtonElement).disabled).toBe(true);
  expect(container.querySelector(".gl-stepper-value")?.textContent).toBe("10");
});
