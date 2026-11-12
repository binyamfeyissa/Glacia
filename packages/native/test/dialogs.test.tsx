import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ActionSheet, AlertDialog, Dialog, DialogTrigger } from "../src";

describe("Dialog", () => {
  it("renders nothing until opened", () => {
    const { container } = render(<Dialog title="Settings" open={false} />);
    expect(container.textContent).not.toContain("Settings");
  });

  it("shows its title and description when open", () => {
    const { container } = render(
      <Dialog open title="Settings" description="Adjust your preferences" />,
    );
    expect(container.textContent).toContain("Settings");
    expect(container.textContent).toContain("Adjust your preferences");
  });

  it("marks the title as a heading for screen readers", () => {
    const { container } = render(<Dialog open title="Settings" />);
    const heading = container.querySelector('[role="heading"]')!;
    expect(heading.textContent).toBe("Settings");
  });

  it("closes when the backdrop is pressed", () => {
    const onOpenChange = vi.fn();
    const { container } = render(<Dialog open title="Settings" onOpenChange={onOpenChange} />);
    fireEvent.click(container.querySelector('[aria-label="Close dialog"]')!);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("stays open when the backdrop is not dismissible", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Dialog open title="Settings" dismissOnBackdropPress={false} onOpenChange={onOpenChange} />,
    );
    fireEvent.click(container.querySelector('[aria-label="Close dialog"]')!);
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("renders a footer when given one", () => {
    const { container } = render(
      <Dialog open title="Settings" footer={<span>Footer content</span>} />,
    );
    expect(container.textContent).toContain("Footer content");
  });
});

describe("DialogTrigger", () => {
  it("opens the dialog on press", () => {
    const { container } = render(<DialogTrigger label="Open settings" title="Settings" />);
    expect(container.textContent).not.toContain("Adjust");
    fireEvent.click(container.querySelector('[aria-label="Open settings"]')!);
    expect(container.textContent).toContain("Settings");
  });
});

describe("AlertDialog", () => {
  it("shows a confirm and a cancel action", () => {
    const { container } = render(<AlertDialog open title="Delete file?" />);
    expect(container.querySelector('[aria-label="Confirm"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="Cancel"]')).toBeTruthy();
  });

  it("calls onConfirm and closes", () => {
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    const { container } = render(
      <AlertDialog open title="Delete file?" confirmLabel="Delete" onConfirm={onConfirm} onOpenChange={onOpenChange} />,
    );
    fireEvent.click(container.querySelector('[aria-label="Delete"]')!);
    expect(onConfirm).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onCancel and closes", () => {
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    const { container } = render(
      <AlertDialog open title="Delete file?" onCancel={onCancel} onOpenChange={onOpenChange} />,
    );
    fireEvent.click(container.querySelector('[aria-label="Cancel"]')!);
    expect(onCancel).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("cannot be dismissed by the backdrop", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <AlertDialog open title="Delete file?" onOpenChange={onOpenChange} />,
    );
    fireEvent.click(container.querySelector('[aria-label="Close dialog"]')!);
    expect(onOpenChange).not.toHaveBeenCalled();
  });
});

describe("ActionSheet", () => {
  const options = [
    { label: "Share" },
    { label: "Duplicate" },
    { label: "Delete", destructive: true },
  ];

  it("lists every option when open", () => {
    const { container } = render(<ActionSheet open options={options} />);
    const labels = Array.from(container.querySelectorAll('[role="button"]')).map((el) =>
      el.getAttribute("aria-label"),
    );
    expect(labels).toContain("Share");
    expect(labels).toContain("Delete");
  });

  it("runs the chosen option and closes", () => {
    const onPress = vi.fn();
    const onOpenChange = vi.fn();
    const { container } = render(
      <ActionSheet
        open
        options={[{ label: "Share", onPress }]}
        onOpenChange={onOpenChange}
      />,
    );
    fireEvent.click(container.querySelector('[aria-label="Share"]')!);
    expect(onPress).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("tints a destructive row", () => {
    const { container } = render(<ActionSheet open options={options} />);
    const deleteRow = container.querySelector('[aria-label="Delete"]')!;
    const shareRow = container.querySelector('[aria-label="Share"]')!;
    expect(deleteRow.textContent).toBe("Delete");
    expect(deleteRow.innerHTML).not.toBe(shareRow.innerHTML);
  });

  it("always offers a cancel row", () => {
    const { container } = render(<ActionSheet open options={options} />);
    expect(container.querySelector('[aria-label="Cancel"]')).toBeTruthy();
  });

  it("renders a title and message when given", () => {
    const { container } = render(
      <ActionSheet open title="File actions" message="Choose what to do" options={options} />,
    );
    expect(container.textContent).toContain("File actions");
    expect(container.textContent).toContain("Choose what to do");
  });
});
