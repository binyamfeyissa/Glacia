import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { Drawer, DrawerContent, DrawerTitle, DrawerDescription } from "../src";

const css = readFileSync(resolve(__dirname, "../src/styles.css"), "utf-8");

// The reported bug: the drawer showed a grab handle but could not be dragged.

function sheet() {
  return document.querySelector(".gl-drawer-content") as HTMLElement;
}

function open(ui: React.ReactNode) {
  return render(
    <Drawer open>
      {ui}
    </Drawer>,
  );
}

describe("Drawer drag to dismiss", () => {
  it("is marked draggable by default", () => {
    open(
      <DrawerContent>
        <DrawerTitle>Sheet</DrawerTitle>
        <DrawerDescription>Body</DrawerDescription>
      </DrawerContent>,
    );
    expect(sheet().hasAttribute("data-draggable")).toBe(true);
  });

  it("can be opted out of", () => {
    open(
      <DrawerContent draggable={false}>
        <DrawerTitle>Sheet</DrawerTitle>
        <DrawerDescription>Body</DrawerDescription>
      </DrawerContent>,
    );
    expect(sheet().hasAttribute("data-draggable")).toBe(false);
  });

  it("follows the finger while dragging down", () => {
    open(
      <DrawerContent>
        <DrawerTitle>Sheet</DrawerTitle>
      </DrawerContent>,
    );
    const el = sheet();
    Object.defineProperty(el, "offsetHeight", { value: 400, configurable: true });

    fireEvent.pointerDown(el, { pointerId: 1, isPrimary: true, button: 0, clientY: 100 });
    fireEvent.pointerMove(el, { pointerId: 1, clientY: 180 });

    expect(el.style.transform).toBe("translateY(80px)");
    expect(el.hasAttribute("data-dragging")).toBe(true);
  });

  it("resists dragging upward instead of lifting the sheet", () => {
    open(
      <DrawerContent>
        <DrawerTitle>Sheet</DrawerTitle>
      </DrawerContent>,
    );
    const el = sheet();
    Object.defineProperty(el, "offsetHeight", { value: 400, configurable: true });

    fireEvent.pointerDown(el, { pointerId: 1, isPrimary: true, button: 0, clientY: 300 });
    fireEvent.pointerMove(el, { pointerId: 1, clientY: 100 });

    // -200 raw becomes a small negative offset, not a 200px lift.
    const translateY = parseFloat(/translateY\((-?[\d.]+)px\)/.exec(el.style.transform)?.[1] ?? "0");
    expect(translateY).toBeLessThan(0);
    expect(Math.abs(translateY)).toBeLessThan(60);
  });

  it("dismisses after a long enough drag", () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerTitle>Sheet</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    const el = sheet();
    Object.defineProperty(el, "offsetHeight", { value: 400, configurable: true });

    fireEvent.pointerDown(el, { pointerId: 1, isPrimary: true, button: 0, clientY: 100 });
    fireEvent.pointerMove(el, { pointerId: 1, clientY: 260 });
    fireEvent.pointerUp(el, { pointerId: 1, clientY: 260 });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("settles back when the drag is too short", () => {
    const onOpenChange = vi.fn();
    render(
      <Drawer open onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerTitle>Sheet</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    const el = sheet();
    Object.defineProperty(el, "offsetHeight", { value: 400, configurable: true });

    fireEvent.pointerDown(el, { pointerId: 1, isPrimary: true, button: 0, clientY: 100 });
    fireEvent.pointerMove(el, { pointerId: 1, clientY: 130 });
    fireEvent.pointerUp(el, { pointerId: 1, clientY: 130 });

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(el.hasAttribute("data-dragging")).toBe(false);
  });

  it("does not hijack a scroll inside the sheet content", () => {
    open(
      <DrawerContent>
        <DrawerTitle>Sheet</DrawerTitle>
      </DrawerContent>,
    );
    const el = sheet();
    Object.defineProperty(el, "offsetHeight", { value: 400, configurable: true });
    // A scrolled body means the gesture belongs to the list, not the sheet.
    Object.defineProperty(el, "scrollTop", { value: 40, configurable: true });

    fireEvent.pointerDown(el, { pointerId: 1, isPrimary: true, button: 0, clientY: 100 });
    fireEvent.pointerMove(el, { pointerId: 1, clientY: 200 });

    expect(el.style.transform).toBe("");
  });

  it("declares the touch behaviour a drag needs", () => {
    const block = css.slice(
      css.indexOf("\n.gl-drawer-content {"),
      css.indexOf("}", css.indexOf("\n.gl-drawer-content {")),
    );
    expect(block).toContain("touch-action: none");
    expect(block).toContain("user-select: none");
  });
});
