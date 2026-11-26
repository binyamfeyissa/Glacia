// IconButton: the fallback renders its icon, and the engine branch speaks the
// engine's size names.
//
// Round 3 found the fallback rendering a self-closing circle — a solid blue
// circle with no glyph (social post actions, the Messages button, the bank
// avatar). The engine path renders the icon; the fallback did not. These
// tests pin the fallback icon (plain element and render function, colour and
// size, centred in the circle) and the engine branch's size map: the engine
// reads BUTTON_SIZES[size] with no fallback, so the library's sm/md/lg
// would resolve to undefined and throw the moment the engine mounts.

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import { IconButton, Text } from "../src";
import { resetGlassRouter } from "../src/internal/GlassView";

/**
 * Which branch the real IconButton takes.
 *
 * vi.mock is hoisted above every top-level binding, so the flag lives on the
 * global object: the factory reads it at call time, and a test can flip it
 * between renders. The fake engine control captures the props the library
 * hands over, on the global object for the same reason.
 */
declare global {
  // eslint-disable-next-line no-var
  var __glaciaIconButtonSupported: boolean;
  // eslint-disable-next-line no-var
  var __lastEngineIconButtonProps: any;
}
globalThis.__glaciaIconButtonSupported = false;
globalThis.__lastEngineIconButtonProps = null;

/** The fake engine IconButton: captures the props, renders a plain host. */
function FakeEngineIconButton(props: any) {
  globalThis.__lastEngineIconButtonProps = props;
  return createElement(
    "div",
    { "data-engine-icon-button": "true", "data-testid": props.testID },
    props.children,
  );
}

vi.mock("../src/internal/glass-routing", async () => {
  const actual = await vi.importActual<any>("../src/internal/glass-routing");
  return {
    ...actual,
    defaultRouter: () =>
      globalThis.__glaciaIconButtonSupported
        ? { supported: true, LiquidGlassView: null }
        : { supported: false, LiquidGlassView: null },
    loadEngineControl: () => FakeEngineIconButton,
  };
});

beforeEach(() => {
  globalThis.__glaciaIconButtonSupported = false;
  globalThis.__lastEngineIconButtonProps = null;
  resetGlassRouter();
});

describe("IconButton fallback — the icon renders", () => {
  it("renders a plain-element icon inside the circle (the reported case)", () => {
    const { container } = render(
      <IconButton accessibilityLabel="Messages" onPress={() => {}} icon={<Text>*</Text>} />,
    );
    expect(container.textContent).toContain("*");
  });

  it("hands a render-function icon the engine's { color, size }", () => {
    const seen: any[] = [];
    const { container } = render(
      <IconButton
        accessibilityLabel="Like"
        onPress={() => {}}
        icon={(state: any) => {
          seen.push(state);
          return <span data-testid="fn-icon">F</span>;
        }}
      />,
    );
    expect(container.textContent).toContain("F");
    expect(seen).toHaveLength(1);
    expect(seen[0].size).toBe(22); // md default
    expect(seen[0].color).toBe("#000000E0"); // light foreground, no tint
  });

  it("sizes the render-function glyph per button size", () => {
    const sizes: Record<string, number> = {};
    for (const size of ["sm", "md", "lg"] as const) {
      render(
        <IconButton
          accessibilityLabel="S"
          size={size}
          onPress={() => {}}
          icon={(state: any) => {
            sizes[size] = state.size;
            return <span>S</span>;
          }}
        />,
      );
    }
    expect(sizes).toEqual({ sm: 18, md: 22, lg: 24 });
  });

  it("hands a tinted button a white icon", () => {
    let color = "";
    render(
      <IconButton
        accessibilityLabel="T"
        tint="#FF0000"
        onPress={() => {}}
        icon={(state: any) => {
          color = state.color;
          return <span>T</span>;
        }}
      />,
    );
    expect(color).toBe("#FFFFFF");
  });

  it("centres the icon in the circle", () => {
    const { container } = render(
      <IconButton accessibilityLabel="C" onPress={() => {}} icon={<Text>*</Text>} />,
    );
    const circle = Array.from(container.querySelectorAll("div")).find(
      (el) => (el as HTMLElement).style.width === "38px",
    ) as HTMLElement;
    expect(circle).toBeTruthy();
    expect(circle.style.alignItems).toBe("center");
    expect(circle.style.justifyContent).toBe("center");
    expect(circle.textContent).toContain("*");
  });

  it("still shows the icon when disabled (dimmed)", () => {
    const { container } = render(
      <IconButton accessibilityLabel="D" disabled onPress={() => {}} icon={<Text>*</Text>} />,
    );
    expect(container.textContent).toContain("*");
  });
});

describe("IconButton engine branch — the engine's size names", () => {
  it("maps sm/md/lg to small/regular/large", () => {
    globalThis.__glaciaIconButtonSupported = true;
    const sizes: Record<string, string> = {};
    for (const size of ["sm", "md", "lg"] as const) {
      globalThis.__lastEngineIconButtonProps = null;
      render(
        <IconButton accessibilityLabel="E" size={size} onPress={() => {}} icon={<Text>*</Text>} />,
      );
      sizes[size] = globalThis.__lastEngineIconButtonProps?.size;
    }
    expect(sizes).toEqual({ sm: "small", md: "regular", lg: "large" });
  });

  it("passes the icon through to the engine", () => {
    globalThis.__glaciaIconButtonSupported = true;
    render(
      <IconButton accessibilityLabel="E" onPress={() => {}} icon={<Text>*</Text>} />,
    );
    expect(globalThis.__lastEngineIconButtonProps).toBeTruthy();
    expect(globalThis.__lastEngineIconButtonProps.icon).toBeTruthy();
  });
});
