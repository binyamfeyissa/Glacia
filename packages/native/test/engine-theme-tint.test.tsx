// Engine-branch theme tint: the engine must get the template's theme.
//
// On a real device (iOS 17, Metal tier) a light-mode template rendered dark
// cards: the template threads `isDark` and the text was correct, but the
// engine branches passed no tint at all, so the engine fell back to the
// phone's dark system scheme and painted dark glass on a light background.
// The fix follows TabBar's proven pattern — per-component theme tint, an
// explicit caller tint still wins — and these tests pin it for Card and for
// Glass (which is GlassView's public face).
//
// Each test fails on the old code (engine receives `tint: undefined`).

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import { Card, Glass } from "../src";
import { resetGlassRouter } from "../src/internal/GlassView";

/**
 * Which branch the components take.
 *
 * vi.mock is hoisted above every top-level binding, so the flag lives on the
 * global object: the factory reads it at call time, and a test can flip it
 * between renders. The fake engine controls capture the props the library
 * hands over, on the global object for the same reason.
 */
declare global {
  // eslint-disable-next-line no-var
  var __glaciaThemeTintSupported: boolean;
  // eslint-disable-next-line no-var
  var __lastEngineCardProps: any;
  // eslint-disable-next-line no-var
  var __lastEngineGlassProps: any;
}
globalThis.__glaciaThemeTintSupported = false;
globalThis.__lastEngineCardProps = null;
globalThis.__lastEngineGlassProps = null;

/** The fake engine Card: captures the props, renders a plain host. */
function FakeEngineCard(props: any) {
  globalThis.__lastEngineCardProps = props;
  return createElement("div", { "data-engine-card": "true", "data-testid": props.testID }, props.children);
}

/** The fake engine glass view: captures the props, renders a plain host. */
function FakeLiquidGlassView(props: any) {
  globalThis.__lastEngineGlassProps = props;
  const { children, testID, style } = props;
  return createElement("div", { "data-liquid-glass": "true", "data-testid": testID, style }, children);
}

vi.mock("../src/internal/glass-routing", async () => {
  const actual = await vi.importActual<any>("../src/internal/glass-routing");
  return {
    ...actual,
    defaultRouter: () =>
      globalThis.__glaciaThemeTintSupported
        ? { supported: true, LiquidGlassView: FakeLiquidGlassView }
        : { supported: false, LiquidGlassView: null },
    loadEngineControl: () => FakeEngineCard,
  };
});

beforeEach(() => {
  globalThis.__glaciaThemeTintSupported = true;
  globalThis.__lastEngineCardProps = null;
  globalThis.__lastEngineGlassProps = null;
  resetGlassRouter();
});

const LIGHT_GLASS = "rgba(255, 255, 255, 0.6)";
const DARK_GLASS = "rgba(40, 40, 40, 0.62)";

describe("Card — the engine gets the theme tint", () => {
  it("passes the light glass tint in light mode", () => {
    render(
      <Card isDark={false} testID="c">
        x
      </Card>,
    );
    expect(globalThis.__lastEngineCardProps).not.toBeNull();
    expect(globalThis.__lastEngineCardProps.tint).toBe(LIGHT_GLASS);
  });

  it("passes the dark glass tint in dark mode", () => {
    render(
      <Card isDark testID="c">
        x
      </Card>,
    );
    expect(globalThis.__lastEngineCardProps.tint).toBe(DARK_GLASS);
  });

  it("lets an explicit tint win over the theme default", () => {
    render(
      <Card isDark={false} tint="rgba(255, 0, 0, 0.5)" testID="c">
        x
      </Card>,
    );
    expect(globalThis.__lastEngineCardProps.tint).toBe("rgba(255, 0, 0, 0.5)");
  });
});

describe("Glass — the engine gets the theme tint", () => {
  it("passes the light glass tint in light mode", () => {
    render(
      <Glass isDark={false} testID="g">
        x
      </Glass>,
    );
    expect(globalThis.__lastEngineGlassProps).not.toBeNull();
    expect(globalThis.__lastEngineGlassProps.tint).toBe(LIGHT_GLASS);
  });

  it("passes the dark glass tint in dark mode", () => {
    render(
      <Glass isDark testID="g">
        x
      </Glass>,
    );
    expect(globalThis.__lastEngineGlassProps.tint).toBe(DARK_GLASS);
  });

  it("lets an explicit tintColor win over the theme default", () => {
    render(
      <Glass isDark={false} tintColor="rgba(0, 0, 255, 0.5)" testID="g">
        x
      </Glass>,
    );
    expect(globalThis.__lastEngineGlassProps.tint).toBe("rgba(0, 0, 255, 0.5)");
  });
});
