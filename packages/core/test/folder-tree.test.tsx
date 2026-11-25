import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { FolderTree, type FolderTreeItemData } from "../src/folder-tree";

const items: FolderTreeItemData[] = [
  {
    id: "docs",
    label: "Documents",
    icon: <span>📁</span>,
    children: [
      { id: "resume", label: "Resume.pdf", icon: <span>📄</span> },
      { id: "notes", label: "Notes.txt", icon: <span>📄</span> },
    ],
  },
  { id: "photo", label: "Photo.jpg", icon: <span>🖼️</span> },
];

test("renders top-level rows and hides children until expanded", () => {
  render(<FolderTree items={items} />);
  expect(screen.getByText("Documents")).toBeTruthy();
  expect(screen.getByText("Photo.jpg")).toBeTruthy();
  expect(screen.queryByText("Resume.pdf")).toBeNull();
  expect(screen.getByRole("tree").className).toContain("gl-glass");
  expect(screen.getByRole("tree").className).toContain("gl-folder-tree");
});

test("expands a folder from its chevron and collapses it again", () => {
  const onToggle = vi.fn();
  render(<FolderTree items={items} onToggle={onToggle} />);
  fireEvent.click(screen.getByRole("button", { name: "Expand Documents" }));
  expect(screen.getByText("Resume.pdf")).toBeTruthy();
  expect(onToggle).toHaveBeenCalledWith("docs", true, expect.objectContaining({ id: "docs" }));
  fireEvent.click(screen.getByRole("button", { name: "Collapse Documents" }));
  expect(screen.queryByText("Resume.pdf")).toBeNull();
  expect(onToggle).toHaveBeenCalledWith("docs", false, expect.objectContaining({ id: "docs" }));
});

test("respects defaultExpanded on a folder", () => {
  const expanded = [{ ...items[0]!, defaultExpanded: true }, items[1]!];
  render(<FolderTree items={expanded} />);
  expect(screen.getByText("Notes.txt")).toBeTruthy();
});

test("expands a folder with the arrow key", () => {
  render(<FolderTree items={items} />);
  expect(screen.queryByText("Resume.pdf")).toBeNull();
  const row = screen.getByText("Documents").closest("[role='treeitem']") as HTMLElement;
  fireEvent.keyDown(row, { key: "ArrowRight" });
  expect(screen.getByText("Resume.pdf")).toBeTruthy();
});

test("selects a nested item and reports it", () => {
  const onSelect = vi.fn();
  render(<FolderTree items={items} onSelect={onSelect} defaultExpandedIds={["docs"]} />);
  fireEvent.click(screen.getByText("Resume.pdf"));
  expect(onSelect).toHaveBeenCalledWith("resume", expect.objectContaining({ id: "resume" }));
  const row = screen.getByText("Resume.pdf").closest("[role='treeitem']") as HTMLElement;
  expect(row.getAttribute("aria-selected")).toBe("true");
});

test("forwards its ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<FolderTree ref={ref} items={items} className="extra" />);
  expect(ref.current).toBe(screen.getByRole("tree"));
  expect(ref.current?.className).toBe("gl-glass gl-list gl-folder-tree extra");
});
