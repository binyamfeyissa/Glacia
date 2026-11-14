import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import { Chart } from "../src";

const A = [
  { label: "Jan", value: 10 },
  { label: "Feb", value: 20 },
];
const B = [
  { label: "Mar", value: 99 },
  { label: "Apr", value: 1 },
  { label: "May", value: 50 },
];

const bars = (c: HTMLElement) =>
  Array.from(c.querySelectorAll(".gl-chart-bar")) as SVGRectElement[];

describe("Chart", () => {
  it("draws no background surface", () => {
    const { container } = render(<Chart data={A} />);
    const root = container.querySelector(".gl-chart")!;
    expect(root.className).not.toContain("gl-glass");
    expect(root.className).not.toContain("gl-chart-card");
  });

  it("renders one bar per point", () => {
    const { container } = render(<Chart data={A} />);
    expect(bars(container)).toHaveLength(2);
  });

  it("follows new data instead of freezing the first render", () => {
    const { container, rerender } = render(<Chart data={A} />);
    expect(bars(container)).toHaveLength(2);
    rerender(<Chart data={B} />);
    expect(bars(container)).toHaveLength(3);
    const labels = Array.from(container.querySelectorAll(".gl-chart-label")).map(
      (el) => el.textContent,
    );
    expect(labels).toEqual(["Mar", "Apr", "May"]);
  });

  it("rescales when the values change", () => {
    const { container, rerender } = render(<Chart data={A} />);
    const before = Number(bars(container)[1]!.getAttribute("height"));
    rerender(
      <Chart
        data={[
          { label: "Jan", value: 10 },
          { label: "Feb", value: 60 },
        ]}
      />,
    );
    const after = Number(bars(container)[1]!.getAttribute("height"));
    // The tallest bar fills the plot in both cases, so the plot height is the
    // same; the *other* bar must shrink relative to it.
    expect(after).toBe(before);
    const first = Number(bars(container)[0]!.getAttribute("height"));
    expect(first).toBeLessThan(Number(bars(container)[1]!.getAttribute("height")));
  });

  it("uses a unique gradient per instance", () => {
    const { container } = render(
      <div>
        <Chart data={A} type="area" />
        <Chart data={A} type="area" />
      </div>,
    );
    const ids = Array.from(container.querySelectorAll("linearGradient")).map((g) => g.id);
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it("renders no NaN geometry for an empty series", () => {
    const { container } = render(<Chart data={[]} />);
    expect(container.innerHTML).not.toContain("NaN");
  });

  it("renders line and area marks", () => {
    const { container: line } = render(<Chart data={A} type="line" />);
    expect(line.querySelectorAll(".gl-chart-point")).toHaveLength(2);
    expect(line.querySelector("path")).not.toBeNull();

    const { container: area } = render(<Chart data={A} type="area" />);
    const paths = area.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });
});
