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

test("roving tabindex: exactly one row is tabbable, and focus moves the tab stop", () => {
  render(<FolderTree items={items} defaultExpandedIds={["docs"]} />);
  const rows = screen.getAllByRole("treeitem");
  expect(rows).toHaveLength(4);
  expect(rows.filter((row) => row.getAttribute("tabindex") === "0")).toHaveLength(1);
  expect(rows[0]!.getAttribute("tabindex")).toBe("0");
  expect(rows.slice(1).map((row) => row.getAttribute("tabindex"))).toEqual([
    "-1",
    "-1",
    "-1",
  ]);
  // Focusing another row moves the tab stop to it.
  fireEvent.focus(rows[2]!);
  expect(rows[0]!.getAttribute("tabindex")).toBe("-1");
  expect(rows[2]!.getAttribute("tabindex")).toBe("0");
  expect(rows.filter((row) => row.getAttribute("tabindex") === "0")).toHaveLength(1);
});

test("arrow keys move focus between visible rows", () => {
  render(<FolderTree items={items} defaultExpandedIds={["docs"]} />);
  const rows = screen.getAllByRole("treeitem");
  fireEvent.keyDown(rows[0]!, { key: "ArrowDown" });
  expect(document.activeElement).toBe(rows[1]);
  expect(rows[1]!.getAttribute("tabindex")).toBe("0");
  fireEvent.keyDown(rows[1]!, { key: "ArrowUp" });
  expect(document.activeElement).toBe(rows[0]);
});

test("each row carries its nesting level and the tree has an accessible name", () => {
  render(<FolderTree items={items} defaultExpandedIds={["docs"]} />);
  expect(screen.getByRole("tree", { name: "Folder tree" })).toBeTruthy();
  const rows = screen.getAllByRole("treeitem");
  expect(rows.map((row) => row.getAttribute("aria-level"))).toEqual([
    "1",
    "2",
    "2",
    "1",
  ]);
});

test("a caller-provided aria-label overrides the default tree name", () => {
  render(<FolderTree items={items} aria-label="Project files" />);
  expect(screen.getByRole("tree", { name: "Project files" })).toBeTruthy();
});
