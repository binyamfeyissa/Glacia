import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { Dropzone } from "../src/dropzone";

test("renders label and description on the card glass", () => {
  render(<Dropzone label="Drop files here" description="or click to browse" />);
  const zone = screen.getByRole("button", { name: /Drop files here/ });
  expect(zone.className).toContain("gl-glass");
  expect(zone.className).toContain("gl-card");
  expect(zone.className).toContain("gl-dropzone");
  expect(screen.getByText("or click to browse")).toBeTruthy();
  expect(zone.hasAttribute("data-dragging")).toBe(false);
});

test("marks the drag-over state while a file is dragged over it", () => {
  render(<Dropzone label="Drop files here" />);
  const zone = screen.getByRole("button", { name: /Drop files here/ });
  fireEvent.dragEnter(zone);
  expect(zone.dataset.dragging).toBe("");
  fireEvent.dragLeave(zone);
  expect(zone.hasAttribute("data-dragging")).toBe(false);
});

test("reports dropped files to onDrop and onFiles", () => {
  const onDrop = vi.fn();
  const onFiles = vi.fn();
  const { container } = render(
    <Dropzone label="Drop files here" onDrop={onDrop} onFiles={onFiles} />,
  );
  const zone = screen.getByRole("button", { name: /Drop files here/ });
  const file = new File(["hello"], "hello.txt", { type: "text/plain" });
  fireEvent.drop(zone, { dataTransfer: { files: [file] } });
  expect(onDrop).toHaveBeenCalledWith([file]);
  expect(onFiles).toHaveBeenCalledWith([file]);
  expect(zone.hasAttribute("data-dragging")).toBe(false);
  expect(container.querySelector("input[type='file']")).toBeTruthy();
});

test("reports picked files to onFiles only", () => {
  const onDrop = vi.fn();
  const onFiles = vi.fn();
  const { container } = render(
    <Dropzone label="Drop files here" accept="image/*" multiple onDrop={onDrop} onFiles={onFiles} />,
  );
  const input = container.querySelector("input[type='file']") as HTMLInputElement;
  expect(input.getAttribute("accept")).toBe("image/*");
  expect(input.multiple).toBe(true);
  const file = new File(["x"], "pic.png", { type: "image/png" });
  fireEvent.change(input, { target: { files: [file] } });
  expect(onFiles).toHaveBeenCalledWith([file]);
  expect(onDrop).not.toHaveBeenCalled();
});

test("does nothing while disabled", () => {
  const onFiles = vi.fn();
  render(<Dropzone label="Drop files here" disabled onFiles={onFiles} />);
  const zone = screen.getByRole("button", { name: /Drop files here/ });
  expect(zone.getAttribute("aria-disabled")).toBe("true");
  fireEvent.dragEnter(zone);
  expect(zone.hasAttribute("data-dragging")).toBe(false);
  fireEvent.drop(zone, { dataTransfer: { files: [new File(["x"], "a.txt")] } });
  expect(onFiles).not.toHaveBeenCalled();
});

test("forwards its ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<Dropzone ref={ref} label="Drop files here" className="extra" />);
  expect(ref.current).toBe(screen.getByRole("button", { name: /Drop files here/ }));
  expect(ref.current?.className).toBe("gl-glass gl-card gl-dropzone extra");
});
