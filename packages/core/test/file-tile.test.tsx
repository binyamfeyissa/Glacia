import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { FileTile } from "../src/file-tile";

test("renders name, meta and icon on the card glass", () => {
  render(<FileTile icon={<span>📄</span>} name="Resume.pdf" meta="2.1 MB · Today" />);
  expect(screen.getByText("Resume.pdf")).toBeTruthy();
  expect(screen.getByText("2.1 MB · Today")).toBeTruthy();
  const tile = screen.getByText("Resume.pdf").closest(".gl-file-tile") as HTMLElement;
  expect(tile.className).toContain("gl-glass");
  expect(tile.className).toContain("gl-card");
  expect(tile.hasAttribute("data-selected")).toBe(false);
});

test("prefers a thumb over the icon", () => {
  render(
    <FileTile icon={<span>📄</span>} thumb={<img alt="Preview" src="x.png" />} name="Photo.jpg" />,
  );
  expect(screen.getByAltText("Preview")).toBeTruthy();
  expect(screen.queryByText("📄")).toBeNull();
});

test("selects on click and marks itself selected", () => {
  const onSelect = vi.fn();
  render(<FileTile name="Notes.txt" selected onSelect={onSelect} />);
  const tile = screen.getByRole("button");
  expect(tile.dataset.selected).toBe("");
  expect(tile.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(tile);
  expect(onSelect).toHaveBeenCalledTimes(1);
  fireEvent.keyDown(tile, { key: "Enter" });
  expect(onSelect).toHaveBeenCalledTimes(2);
});

test("action clicks do not select the tile", () => {
  const onSelect = vi.fn();
  const onAction = vi.fn();
  render(
    <FileTile
      name="Notes.txt"
      onSelect={onSelect}
      actions={<button onClick={onAction}>More</button>}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "More" }));
  expect(onAction).toHaveBeenCalledTimes(1);
  expect(onSelect).not.toHaveBeenCalled();
});

test("forwards its ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<FileTile ref={ref} name="A.txt" className="extra" />);
  expect(ref.current).toBe(screen.getByText("A.txt").closest(".gl-file-tile"));
  expect(ref.current?.className).toBe("gl-glass gl-card gl-file-tile extra");
});
