import { fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test, vi } from "vitest";

import { Banner } from "../src/banner";

test("renders title and description on the card glass", () => {
  render(<Banner title="Update available" description="Version 0.6.0 is ready." />);
  const banner = screen.getByRole("status");
  expect(banner.className).toContain("gl-glass");
  expect(banner.className).toContain("gl-banner");
  expect(screen.getByText("Update available")).toBeTruthy();
  expect(screen.getByText("Version 0.6.0 is ready.")).toBeTruthy();
  expect(banner.hasAttribute("data-tone")).toBe(false);
});

test("marks its tone and uses an alert role for warning and danger", () => {
  render(
    <>
      <Banner tone="success" title="Saved" />
      <Banner tone="warning" title="Storage almost full" />
      <Banner tone="danger" title="Payment failed" />
    </>,
  );
  expect(
    (screen.getByText("Saved").closest(".gl-banner") as HTMLElement | null)?.dataset
      .tone,
  ).toBe("success");
  // Live-region roles (`alert` / `status`) compute an empty accessible name,
  // so the alerts are told apart by data-tone and their heading text.
  const alerts = screen.getAllByRole("alert");
  expect(alerts).toHaveLength(2);
  expect(alerts.map((alert) => (alert as HTMLElement).dataset.tone)).toEqual([
    "warning",
    "danger",
  ]);
  expect(alerts[0]!.textContent).toContain("Storage almost full");
  expect(alerts[1]!.textContent).toContain("Payment failed");
});

test("renders icon, action and a working dismiss button", () => {
  const onDismiss = vi.fn();
  render(
    <Banner
      icon={<svg data-testid="banner-icon" />}
      title="New feature"
      action={<button>Try it</button>}
      dismissible
      onDismiss={onDismiss}
    />,
  );
  expect(screen.getByTestId("banner-icon")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Try it" })).toBeTruthy();
  fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

test("shows no dismiss button unless dismissible", () => {
  render(<Banner title="Heads up" />);
  expect(screen.queryByRole("button", { name: "Dismiss" })).toBeNull();
});

test("forwards its ref", () => {
  const ref = createRef<HTMLDivElement>();
  render(<Banner ref={ref} title="Hello" className="extra" />);
  expect(ref.current).toBe(screen.getByRole("status"));
  expect(ref.current?.className).toBe("gl-glass gl-banner extra");
});
