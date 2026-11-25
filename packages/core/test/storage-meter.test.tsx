import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { StorageMeter } from "../src/storage-meter";

const segments = [
  { label: "Photos", value: 25, tint: "fill" as const },
  { label: "Videos", value: 50, tint: "on" as const },
  { label: "Other", value: 10, tint: "muted" as const },
];

test("renders a meter whose segments are sized by value over total", () => {
  render(<StorageMeter segments={segments} total={100} />);
  const meter = screen.getByRole("meter", { name: "Storage used" });
  expect(meter.getAttribute("aria-valuemax")).toBe("100");
  expect(meter.getAttribute("aria-valuenow")).toBe("85");
  expect(meter.className).toContain("gl-progress");
  const bars = meter.querySelectorAll(".gl-storage-meter-segment");
  expect(bars).toHaveLength(3);
  expect((bars[0] as HTMLElement).style.width).toBe("25%");
  expect((bars[1] as HTMLElement).style.width).toBe("50%");
  expect((bars[2] as HTMLElement).style.width).toBe("10%");
});

test("marks segment tints with data attributes", () => {
  render(<StorageMeter segments={segments} total={100} />);
  const meter = screen.getByRole("meter");
  const bars = meter.querySelectorAll(".gl-storage-meter-segment");
  expect((bars[0] as HTMLElement).dataset.tint).toBe("fill");
  expect((bars[1] as HTMLElement).dataset.tint).toBe("on");
  expect((bars[2] as HTMLElement).dataset.tint).toBe("muted");
});

test("shows a legend by default and hides it on request", () => {
  const { rerender } = render(<StorageMeter segments={segments} total={100} />);
  expect(screen.getByText("Photos")).toBeTruthy();
  expect(screen.getByText("Videos")).toBeTruthy();
  expect(screen.getByText("25 / 100")).toBeTruthy();
  expect(screen.getByText("50 / 100")).toBeTruthy();
  rerender(<StorageMeter segments={segments} total={100} showLegend={false} />);
  expect(screen.queryByText("Photos")).toBeNull();
});

test("renders duplicate labels without dropping a segment or legend row", () => {
  const dupes = [
    { label: "Photos", value: 25, tint: "fill" as const },
    { label: "Photos", value: 10, tint: "on" as const },
  ];
  render(<StorageMeter segments={dupes} total={100} />);
  const meter = screen.getByRole("meter", { name: "Storage used" });
  expect(meter.querySelectorAll(".gl-storage-meter-segment")).toHaveLength(2);
  expect(screen.getAllByText("Photos")).toHaveLength(2);
  expect(screen.getByText("25 / 100")).toBeTruthy();
  expect(screen.getByText("10 / 100")).toBeTruthy();
});

test("defaults a segment tint to fill", () => {
  render(<StorageMeter segments={[{ label: "Docs", value: 5 }]} total={10} />);
  const bar = screen.getByRole("meter").querySelector(".gl-storage-meter-segment") as HTMLElement;
  expect(bar.dataset.tint).toBe("fill");
  expect(bar.style.width).toBe("50%");
});

test("forwards its ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<StorageMeter ref={ref} segments={segments} total={100} className="extra" />);
  expect(ref.current?.className).toBe("gl-storage-meter extra");
  expect(ref.current).toBe(screen.getByRole("meter").parentElement);
});
