import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { OrgChart } from "../src/org-chart";

const nodes = [
  {
    name: "Bezawit",
    role: "CEO",
    avatar: <span>B</span>,
    children: [
      { name: "Binyam", role: "CTO", avatar: <span>BF</span> },
      {
        name: "Sara",
        role: "Design Lead",
        children: [{ name: "Miki", role: "Designer" }],
      },
    ],
  },
];

test("renders nested nodes with name, role and avatar", () => {
  render(<OrgChart nodes={nodes} />);
  expect(screen.getByText("Bezawit")).toBeTruthy();
  expect(screen.getByText("CEO")).toBeTruthy();
  expect(screen.getByText("Binyam")).toBeTruthy();
  expect(screen.getByText("CTO")).toBeTruthy();
  expect(screen.getByText("Sara")).toBeTruthy();
  expect(screen.getByText("Miki")).toBeTruthy();
  expect(screen.getByText("Designer")).toBeTruthy();
  expect(screen.getByText("B")).toBeTruthy();
  expect(screen.getByText("BF")).toBeTruthy();
});

test("renders one node card per person, nested in levels", () => {
  const { container } = render(<OrgChart nodes={nodes} />);
  expect(container.querySelectorAll(".gl-org-chart-node")).toHaveLength(4);
  expect(container.querySelectorAll(".gl-org-chart-card")).toHaveLength(4);
  expect(container.querySelectorAll(".gl-org-chart-level")).toHaveLength(3);
  // Every card is glass.
  container.querySelectorAll(".gl-org-chart-card").forEach((card) => {
    expect(card.className).toContain("gl-glass");
  });
});

test("renders a node without avatar or role", () => {
  render(<OrgChart nodes={[{ name: "Solo" }]} />);
  expect(screen.getByText("Solo")).toBeTruthy();
  expect(document.querySelector(".gl-org-chart-avatar")).toBeNull();
  expect(document.querySelector(".gl-org-chart-role")).toBeNull();
});

test("forwards its ref and props", () => {
  const ref = createRef<HTMLDivElement>();
  render(<OrgChart ref={ref} nodes={nodes} className="extra" />);
  expect(ref.current).toBe(document.querySelector(".gl-org-chart"));
  expect(ref.current?.className).toBe("gl-org-chart extra");
});
