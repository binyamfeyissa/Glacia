import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NativeScrollArea, NativeTable } from "../src";

describe("NativeTable", () => {
  const columns = [
    { key: "name", header: "Name" },
    { key: "role", header: "Role" },
    { key: "seats", header: "Seats", align: "right" as const },
  ];
  const rows = [
    { id: "1", cells: { name: "Ada", role: "Engineer", seats: "12" } },
    { id: "2", cells: { name: "Grace", role: "Admiral", seats: "4" } },
  ];

  it("promotes the first column to a row title", () => {
    const { container } = render(<NativeTable columns={columns} rows={rows} />);
    expect(container.textContent).toContain("Ada");
    // Every value still renders, just as a labelled pair.
    expect(container.textContent).toContain("Admiral");
  });

  it("labels each detail column", () => {
    const { container } = render(<NativeTable columns={columns} rows={rows} />);
    expect(container.textContent).toContain("Role");
    expect(container.textContent).toContain("Seats");
  });

  it("honours a caller-chosen primary column", () => {
    const withPrimary = [{ key: "name", header: "Name" }, { key: "role", header: "Role", primary: true }];
    const { container } = render(<NativeTable columns={withPrimary} rows={rows} />);
    const title = container.querySelector('[role="text"]')!;
    expect(title.textContent).toContain("Engineer");
  });

  it("reports the pressed row", () => {
    const onRowPress = vi.fn();
    const { container } = render(
      <NativeTable columns={columns} rows={rows} onRowPress={onRowPress} />,
    );
    fireEvent.click(container.querySelectorAll('[role="button"]')[1]!);
    expect(onRowPress.mock.calls[0]![0].id).toBe("2");
  });

  it("is not interactive without a row handler", () => {
    const { container } = render(<NativeTable columns={columns} rows={rows} />);
    expect(container.querySelectorAll('[role="button"]')).toHaveLength(0);
  });

  it("shows an empty state with no rows", () => {
    render(<NativeTable columns={columns} rows={[]} />);
    expect(screen.getByText("No rows to display")).toBeTruthy();
  });

  it("renders a caption when given", () => {
    const { container } = render(<NativeTable columns={columns} rows={rows} caption="Team" />);
    expect(container.textContent).toContain("Team");
  });

  it("renders a missing cell as an empty string rather than undefined", () => {
    const sparse = [{ id: "1", cells: { name: "Ada" } }];
    const { container } = render(<NativeTable columns={columns} rows={sparse} />);
    expect(container.textContent).not.toContain("undefined");
  });
});

describe("NativeScrollArea", () => {
  it("renders its children", () => {
    const { container } = render(
      <NativeScrollArea>
        <span>Scrolled content</span>
      </NativeScrollArea>,
    );
    expect(container.textContent).toContain("Scrolled content");
  });

  it("applies a max height when given one", () => {
    const { container } = render(
      <NativeScrollArea maxHeight={120}>
        <span>Content</span>
      </NativeScrollArea>,
    );
    expect(container.firstElementChild!.getAttribute("style")).toContain("max-height");
  });

  it("exposes an accessibility label", () => {
    const { container } = render(
      <NativeScrollArea accessibilityLabel="Recent activity">
        <span>Content</span>
      </NativeScrollArea>,
    );
    expect(container.firstElementChild!.getAttribute("aria-label")).toBe("Recent activity");
  });

  it("draws a border only when bordered", () => {
    const plain = render(<NativeScrollArea><span>x</span></NativeScrollArea>);
    const plainStyle = plain.container.firstElementChild!.getAttribute("style") ?? "";
    plain.unmount();

    const framed = render(
      <NativeScrollArea bordered><span>x</span></NativeScrollArea>,
    );
    const framedStyle = framed.container.firstElementChild!.getAttribute("style") ?? "";

    expect(plainStyle).toContain("border-width: 0px");
    expect(framedStyle).toContain("border-width: 1px");
  });
});
