import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { LessonListRow } from "../src/lesson-list-row";

test("renders like a ListItem row: index, title, duration", () => {
  render(<LessonListRow index={3} title="Refraction basics" duration="12:04" />);
  const row = screen.getByText("Refraction basics").closest(".gl-list-item");
  expect(row).toBeTruthy();
  expect(screen.getByText("3")).toBeTruthy();
  expect(screen.getByText("12:04")).toBeTruthy();
  expect(row?.className).toContain("gl-lesson-list-row");
});

test("shows a check when completed and a lock when locked", () => {
  render(
    <>
      <LessonListRow index={1} title="Done lesson" completed />
      <LessonListRow index={2} title="Locked lesson" locked />
    </>,
  );
  const done = screen.getByText("Done lesson").closest(".gl-lesson-list-row") as HTMLElement;
  const locked = screen.getByText("Locked lesson").closest(".gl-lesson-list-row") as HTMLElement;
  expect(done.dataset.completed).toBe("");
  expect(done.querySelector(".gl-lesson-list-row-check")).toBeTruthy();
  expect(done.querySelector(".gl-lesson-list-row-index")).toBeNull();
  expect(locked.dataset.locked).toBe("");
  expect(locked.querySelector(".gl-lesson-list-row-lock")).toBeTruthy();
  expect(locked.getAttribute("aria-disabled")).toBe("true");
});

test("is interactive like ListItem: click and keyboard call onSelect, locked does not", () => {
  const onSelect = vi.fn();
  render(
    <>
      <LessonListRow index={1} title="Open lesson" onSelect={onSelect} />
      <LessonListRow index={2} title="Locked lesson" locked onSelect={onSelect} />
    </>,
  );
  const open = screen.getByRole("button", { name: "Open lesson" });
  expect(open.getAttribute("tabindex")).toBe("0");
  fireEvent.click(open);
  fireEvent.keyDown(open, { key: "Enter" });
  fireEvent.keyDown(open, { key: " " });
  expect(onSelect).toHaveBeenCalledTimes(3);
  const lockedRow = screen.getByText("Locked lesson").closest(".gl-lesson-list-row")!;
  expect(lockedRow.getAttribute("role")).toBe("button");
  expect(lockedRow.hasAttribute("tabindex")).toBe(false);
  fireEvent.click(lockedRow);
  expect(onSelect).toHaveBeenCalledTimes(3);
});

test("a row without onSelect is not a button", () => {
  render(<LessonListRow index={1} title="Plain lesson" />);
  const row = screen.getByText("Plain lesson").closest(".gl-lesson-list-row")!;
  expect(row.hasAttribute("role")).toBe(false);
});

test("forwards its ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <LessonListRow ref={ref} index={1} title="Ref lesson" className="extra" />,
  );
  expect(ref.current).toBe(
    screen.getByText("Ref lesson").closest(".gl-lesson-list-row"),
  );
  expect(ref.current?.className).toContain("gl-lesson-list-row extra");
});
