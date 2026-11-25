import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { Gantt, GanttBar, GanttRow } from "../src/gantt";

const rows = [
  {
    label: "Design",
    bars: [
      { label: "Research", start: 0, end: 0.25 },
      { label: "Mockups", start: 0.3, end: 0.6, tint: "on" as const },
    ],
  },
  { label: "Build", bars: [{ label: "Code", start: 0.5, end: 1, tint: "destructive" as const }] },
];

test("positions bars by start and end fractions", () => {
  render(<Gantt rows={rows} />);
  const research = screen.getByRole("img", { name: "Research: 0% to 25%" });
  expect(research.style.left).toBe("0%");
  expect(research.style.width).toBe("25%");
  const code = screen.getByRole("img", { name: "Code: 50% to 100%" });
  expect(code.style.left).toBe("50%");
  expect(code.style.width).toBe("50%");
});

test("marks non-default tints and leaves the default unmarked", () => {
  render(<Gantt rows={rows} />);
  const research = screen.getByRole("img", { name: /Research/ });
  const mockups = screen.getByRole("img", { name: /Mockups/ });
  const code = screen.getByRole("img", { name: /Code/ });
  expect(research.hasAttribute("data-tint")).toBe(false);
  expect(mockups.dataset.tint).toBe("on");
  expect(code.dataset.tint).toBe("destructive");
});

test("clamps bars to the row", () => {
  render(<GanttBar label="Out of range" start={-0.2} end={1.5} />);
  const bar = screen.getByRole("img", { name: "Out of range: 0% to 100%" });
  expect(bar.style.left).toBe("0%");
  expect(bar.style.width).toBe("100%");
});

test("stacks one lane per bar in the workload variant", () => {
  render(<Gantt rows={rows} variant="workload" />);
  const gantt = screen.getByText("Design").closest(".gl-gantt") as HTMLElement;
  expect(gantt.dataset.variant).toBe("workload");
  const lanes = gantt.querySelectorAll(".gl-gantt-lane");
  expect(lanes).toHaveLength(3);
  // Each lane holds exactly one bar, so overlapping bars never collide.
  lanes.forEach((lane) => {
    expect(lane.querySelectorAll(".gl-gantt-bar")).toHaveLength(1);
  });
  expect(screen.queryByText("Design")?.closest(".gl-gantt-row")).toBeTruthy();
});

test("also composes from GanttRow and GanttBar children", () => {
  render(
    <Gantt rows={[]}>
      <GanttRow label="Launch">
        <GanttBar label="Release" start={0.75} end={1} />
      </GanttRow>
    </Gantt>,
  );
  expect(screen.getByText("Launch")).toBeTruthy();
  const bar = screen.getByRole("img", { name: "Release: 75% to 100%" });
  expect(bar.style.left).toBe("75%");
});

test("an explicit aria-label names a bar with a non-string label", () => {
  render(
    <GanttBar
      label={<span>Custom</span>}
      start={0}
      end={0.5}
      aria-label="Custom bar: 0% to 50%"
    />,
  );
  const bar = screen.getByRole("img", { name: "Custom bar: 0% to 50%" });
  expect(bar.style.left).toBe("0%");
  expect(bar.style.width).toBe("50%");
});

test("forwards refs on the chart, a row and a bar", () => {
  const ganttRef = createRef<HTMLDivElement>();
  const rowRef = createRef<HTMLDivElement>();
  const barRef = createRef<HTMLDivElement>();
  render(
    <Gantt ref={ganttRef} rows={[]} className="extra">
      <GanttRow ref={rowRef} label="Launch">
        <GanttBar ref={barRef} label="Release" start={0} end={0.5} />
      </GanttRow>
    </Gantt>,
  );
  expect(ganttRef.current?.className).toBe("gl-glass gl-card gl-gantt extra");
  expect(rowRef.current?.className).toContain("gl-gantt-row");
  expect(barRef.current?.className).toContain("gl-gantt-bar");
});
