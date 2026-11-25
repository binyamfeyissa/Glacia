import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { Kanban, KanbanCard, KanbanColumn } from "../src/kanban";

const columns = [
  {
    id: "todo",
    title: "To do",
    cards: [
      { id: "a", title: "Design the board", description: "Sketch the layout", meta: "2d" },
      { id: "b", title: "Write the copy" },
    ],
  },
  { id: "done", title: "Done", cards: [{ id: "c", title: "Ship 0.5.2" }] },
];

test("renders columns with derived counts and their cards", () => {
  render(<Kanban columns={columns} />);
  expect(screen.getByText("To do")).toBeTruthy();
  expect(screen.getByText("Done")).toBeTruthy();
  expect(screen.getByText("Design the board")).toBeTruthy();
  expect(screen.getByText("Sketch the layout")).toBeTruthy();
  expect(screen.getByText("2d")).toBeTruthy();
  const counts = screen.getAllByText(/^[0-9]$/);
  expect(counts.map((el) => el.textContent)).toEqual(["2", "1"]);
});

test("uses an explicit count when given", () => {
  render(<Kanban columns={[{ id: "x", title: "Backlog", count: 9, cards: [] }]} />);
  expect(screen.getByText("9")).toBeTruthy();
});

test("selects a card and reports it", () => {
  const onSelectCard = vi.fn();
  render(<Kanban columns={columns} onSelectCard={onSelectCard} selectedCardId="b" />);
  const selected = screen.getByText("Write the copy").closest(".gl-kanban-card") as HTMLElement;
  expect(selected.dataset.selected).toBe("");
  expect(selected.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getByText("Design the board").closest(".gl-kanban-card") as HTMLElement);
  expect(onSelectCard).toHaveBeenCalledWith(
    "a",
    expect.objectContaining({ id: "a", title: "Design the board" }),
  );
});

test("also composes from KanbanColumn and KanbanCard children", () => {
  render(
    <Kanban>
      <KanbanColumn title="Review">
        <KanbanCard title="Check the copy" description="Proofread once" />
      </KanbanColumn>
    </Kanban>,
  );
  expect(screen.getByText("Review")).toBeTruthy();
  expect(screen.getByText("Check the copy")).toBeTruthy();
  expect(screen.getByText("Proofread once")).toBeTruthy();
  expect(screen.getByText("1")).toBeTruthy();
});

test("forwards refs on the board, a column and a card", () => {
  const boardRef = createRef<HTMLDivElement>();
  const columnRef = createRef<HTMLDivElement>();
  const cardRef = createRef<HTMLDivElement>();
  render(
    <Kanban ref={boardRef} className="extra">
      <KanbanColumn ref={columnRef} title="Review">
        <KanbanCard ref={cardRef} title="Check the copy" />
      </KanbanColumn>
    </Kanban>,
  );
  expect(boardRef.current?.className).toBe("gl-kanban extra");
  expect(columnRef.current?.className).toContain("gl-kanban-column");
  expect(columnRef.current?.className).toContain("gl-glass");
  expect(cardRef.current?.className).toContain("gl-kanban-card");
});
