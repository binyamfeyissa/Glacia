// Android's hardware back button, exercised through the real code path.
//
// The dialog subscribes to BackHandler while open, and the listener it
// registers is what the OS invokes. That listener is stubbed here so the test
// can call it exactly as Android would, rather than assuming the wiring.
//
// It matters for #17: a back-press on an AlertDialog must count as a cancel,
// so onCancel has to fire, not just onOpenChange.

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

type BackListener = () => boolean | null | undefined;

const listeners: BackListener[] = [];

vi.mock("../src/internal/primitives", async () => {
  const actual = await vi.importActual<any>("../src/internal/primitives");
  return {
    ...actual,
    primitives: () => ({
      ...actual.primitives(),
      getBackHandler: () => ({
        addEventListener: (_event: string, handler: BackListener) => {
          listeners.push(handler);
          return { remove: () => {} };
        },
      }),
    }),
  };
});

import { AlertDialog, Dialog } from "../src";

beforeEach(() => {
  listeners.length = 0;
});

describe("Android back button (#17)", () => {
  it("closes an AlertDialog and calls onCancel", () => {
    const onCancel = vi.fn();
    const onOpenChange = vi.fn();
    render(<AlertDialog open title="Delete?" onCancel={onCancel} onOpenChange={onOpenChange} />);

    expect(listeners.length).toBeGreaterThan(0);
    const handled = listeners[0]!();

    // Returning true keeps Android from also popping the screen behind it.
    expect(handled).toBe(true);
    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not cancel when the confirm action is taken instead", () => {
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    const { container } = render(
      <AlertDialog open title="Delete?" onCancel={onCancel} onConfirm={onConfirm} />,
    );
    container.querySelector<HTMLElement>('[aria-label="Confirm"]')!.click();
    expect(onConfirm).toHaveBeenCalled();
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("closes a plain Dialog on back without inventing a cancel", () => {
    const onOpenChange = vi.fn();
    render(<Dialog open title="Settings" onOpenChange={onOpenChange} />);
    expect(listeners.length).toBeGreaterThan(0);
    expect(listeners[0]!()).toBe(true);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
