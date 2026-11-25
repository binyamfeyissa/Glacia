import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { UptimeStrip } from "../src/uptime-strip";

const segments = Array.from({ length: 45 }, (_, i) => ({
  status: (i === 44 ? "down" : i === 43 ? "degraded" : "up") as
    | "up"
    | "degraded"
    | "down",
  label: `Day ${i + 1}`,
}));

test("renders one segment per day with its status and label", () => {
  const { container } = render(<UptimeStrip segments={segments} />);
  const bars = container.querySelectorAll(".gl-uptime-strip-segment");
  expect(bars).toHaveLength(45);
  expect((bars[0] as HTMLElement).dataset.status).toBe("up");
  expect((bars[43] as HTMLElement).dataset.status).toBe("degraded");
  expect((bars[44] as HTMLElement).dataset.status).toBe("down");
  expect(bars[0]!.getAttribute("title")).toBe("Day 1");
});

test("computes the overall percentage from the segments when not given", () => {
  render(<UptimeStrip segments={segments} />);
  // 43 of 45 up = 95.6%.
  expect(screen.getByText("95.6%")).toBeTruthy();
  expect(screen.getByText("uptime", { exact: false })).toBeTruthy();
});

test("uses an explicit overall percentage and label", () => {
  render(
    <UptimeStrip segments={segments} overall={99.9} overallLabel="uptime (90 days)" />,
  );
  expect(screen.getByText("99.9%")).toBeTruthy();
  expect(screen.getByText("uptime (90 days)", { exact: false })).toBeTruthy();
  expect(screen.getByRole("img").getAttribute("aria-label")).toBe(
    "99.9% uptime (90 days) over 45 days",
  );
});

test("forwards its ref and props", () => {
  const ref = createRef<HTMLDivElement>();
  render(<UptimeStrip ref={ref} segments={segments} className="extra" />);
  expect(ref.current).toBe(screen.getByRole("img"));
  expect(ref.current?.className).toBe("gl-glass gl-uptime-strip extra");
});

test("segments carry no interaction of their own", () => {
  const { container } = render(<UptimeStrip segments={segments} />);
  const bar = container.querySelector(".gl-uptime-strip-bar") as HTMLElement;
  expect(bar.getAttribute("aria-hidden")).toBe("true");
  fireEvent.click(container.querySelector(".gl-uptime-strip-segment")!);
});
