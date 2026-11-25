import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { Timeline } from "../src/timeline";

const items = [
  { title: "Order placed", time: "09:30", description: "Payment confirmed.", state: "done" as const },
  { title: "Shipped", time: "12:15", description: "On its way to Addis Ababa.", state: "current" as const },
  { title: "Delivered", time: "Tomorrow", state: "upcoming" as const },
];

test("renders items vertically with title, time and description", () => {
  render(<Timeline items={items} />);
  const list = screen.getByRole("list");
  expect(list.className).toContain("gl-timeline");
  expect(list.querySelectorAll(".gl-timeline-item")).toHaveLength(3);
  expect(screen.getByText("Order placed")).toBeTruthy();
  expect(screen.getByText("09:30")).toBeTruthy();
  expect(screen.getByText("Payment confirmed.")).toBeTruthy();
  expect(screen.getByText("Delivered")).toBeTruthy();
});

test("marks each item's state and defaults to upcoming", () => {
  render(
    <Timeline
      items={[
        { title: "Done", state: "done" },
        { title: "Now", state: "current" },
        { title: "Later" },
      ]}
    />,
  );
  const rows = document.querySelectorAll(".gl-timeline-item");
  expect((rows[0] as HTMLElement).dataset.state).toBe("done");
  expect((rows[1] as HTMLElement).dataset.state).toBe("current");
  expect((rows[2] as HTMLElement).dataset.state).toBe("upcoming");
});

test("renders no description element when none is given", () => {
  render(<Timeline items={[{ title: "Only title" }]} />);
  expect(document.querySelector(".gl-timeline-description")).toBeNull();
  expect(document.querySelector(".gl-timeline-time")).toBeNull();
});

test("forwards its ref and props", () => {
  const ref = createRef<HTMLOListElement>();
  render(<Timeline ref={ref} items={items} className="extra" />);
  expect(ref.current).toBe(screen.getByRole("list"));
  expect(ref.current?.className).toBe("gl-timeline extra");
});
