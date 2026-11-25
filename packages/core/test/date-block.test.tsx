import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { DateBlock } from "../src/date-block";

test("derives day, month and weekday from a Date", () => {
  // 2026-11-25 is a Wednesday.
  render(<DateBlock date={new Date(2026, 10, 25)} />);
  expect(screen.getByText("25")).toBeTruthy();
  expect(screen.getByText("Nov")).toBeTruthy();
  expect(screen.getByText("Wed")).toBeTruthy();
});

test("takes day/month/weekday parts instead of a Date", () => {
  render(<DateBlock day={1} month="Jan" weekday="Thu" />);
  expect(screen.getByText("1")).toBeTruthy();
  expect(screen.getByText("Jan")).toBeTruthy();
  expect(screen.getByText("Thu")).toBeTruthy();
});

test("part overrides win over the Date", () => {
  render(<DateBlock date={new Date(2026, 10, 25)} day={9} month="Dec" />);
  expect(screen.getByText("9")).toBeTruthy();
  expect(screen.getByText("Dec")).toBeTruthy();
  expect(screen.getByText("Wed")).toBeTruthy();
});

test("marks only non-default sizes", () => {
  render(
    <>
      <DateBlock date={new Date(2026, 10, 25)} />
      <DateBlock date={new Date(2026, 10, 25)} size="sm" />
      <DateBlock date={new Date(2026, 10, 25)} size="lg" />
    </>,
  );
  const blocks = document.querySelectorAll(".gl-date-block");
  expect(blocks[0]!.hasAttribute("data-size")).toBe(false);
  expect((blocks[1] as HTMLElement).dataset.size).toBe("sm");
  expect((blocks[2] as HTMLElement).dataset.size).toBe("lg");
});

test("forwards its ref and props", () => {
  const ref = createRef<HTMLDivElement>();
  render(<DateBlock ref={ref} date={new Date(2026, 10, 25)} className="extra" />);
  expect(ref.current).toBe(screen.getByText("25").closest(".gl-date-block"));
  expect(ref.current?.className).toBe("gl-glass gl-date-block extra");
});
