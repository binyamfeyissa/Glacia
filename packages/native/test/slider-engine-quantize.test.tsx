// Slider — the engine branch quantizes before it reports.
//
// The owner saw "26.350059737156517%" on a device: the engine slider's raw
// continuous value went straight to the template's onValueChange, bypassing
// the quantize/report path the fallback floor uses, so `step` was ignored on
// the engine path. These tests pin the engine branch to the same contract:
// every value the template sees is snapped to the step.
//
// Each test fails if the engine branch passes the callbacks straight through.

import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

import { Slider } from "../src";
import { resetGlassRouter } from "../src/internal/GlassView";

/**
 * Which branch the real Slider takes.
 *
 * vi.mock is hoisted above every top-level binding, so the flag lives on the
 * global object: the factory reads it at call time, and a test can flip it
 * between renders. The fake engine control captures the props the library
 * hands over, on the global object for the same reason.
 */
declare global {
  // eslint-disable-next-line no-var
  var __glaciaSliderSupported: boolean;
  // eslint-disable-next-line no-var
  var __lastEngineSliderProps: any;
}
globalThis.__glaciaSliderSupported = false;
globalThis.__lastEngineSliderProps = null;

/** The fake engine Slider: captures the props, renders a plain host. */
function FakeEngineSlider(props: any) {
  globalThis.__lastEngineSliderProps = props;
  return createElement("div", { "data-engine-slider": "true" });
}

vi.mock("../src/internal/glass-routing", async () => {
  const actual = await vi.importActual<any>("../src/internal/glass-routing");
  return {
    ...actual,
    defaultRouter: () =>
      globalThis.__glaciaSliderSupported
        ? { supported: true, LiquidGlassView: null }
        : { supported: false, LiquidGlassView: null },
    loadEngineControl: () => FakeEngineSlider,
  };
});

beforeEach(() => {
  globalThis.__glaciaSliderSupported = true;
  globalThis.__lastEngineSliderProps = null;
  resetGlassRouter();
});

/** The raw continuous value the engine reports for the reported case. */
const RAW = 26.350059737156517;

/** Renders on the engine branch and returns the captured engine props. */
function renderOnEngine(element: any) {
  globalThis.__glaciaSliderSupported = true;
  resetGlassRouter();
  const rendered = render(element);
  expect(rendered.container.querySelector("[data-engine-slider]")).toBeTruthy();
  expect(globalThis.__lastEngineSliderProps).not.toBeNull();
  return rendered;
}

describe("Slider engine branch — values are quantized to the step", () => {
  it("snaps the engine's raw value to step 1 (the reported case)", () => {
    const onValueChange = vi.fn();
    renderOnEngine(
      <Slider
        accessibilityLabel="Volume"
        min={0}
        max={100}
        step={1}
        defaultValue={50}
        onValueChange={onValueChange}
      />,
    );
    globalThis.__lastEngineSliderProps.onValueChange(RAW);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(26);
  });

  it("snaps the engine's raw value to step 0.5", () => {
    const onValueChange = vi.fn();
    renderOnEngine(
      <Slider
        accessibilityLabel="Volume"
        min={0}
        max={100}
        step={0.5}
        defaultValue={50}
        onValueChange={onValueChange}
      />,
    );
    globalThis.__lastEngineSliderProps.onValueChange(RAW);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(26.5);
  });

  it("quantizes onSlidingComplete the same way", () => {
    const onSlidingComplete = vi.fn();
    renderOnEngine(
      <Slider
        accessibilityLabel="Volume"
        min={0}
        max={100}
        step={1}
        defaultValue={50}
        onSlidingComplete={onSlidingComplete}
      />,
    );
    globalThis.__lastEngineSliderProps.onSlidingComplete(RAW);
    expect(onSlidingComplete).toHaveBeenCalledTimes(1);
    expect(onSlidingComplete).toHaveBeenCalledWith(26);
  });

  it("routes through report: two raw values inside one step fire once", () => {
    // This is what distinguishes routing through `report` from merely
    // wrapping onValueChange in quantize: report dedupes a step that has
    // already been reported, so a drag that stays inside one step ticks once.
    const onValueChange = vi.fn();
    renderOnEngine(
      <Slider
        accessibilityLabel="Volume"
        min={0}
        max={100}
        step={1}
        defaultValue={50}
        onValueChange={onValueChange}
      />,
    );
    globalThis.__lastEngineSliderProps.onValueChange(26.1);
    globalThis.__lastEngineSliderProps.onValueChange(26.4);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(26);
  });

  it("still reports without a template onValueChange (uncontrolled)", () => {
    renderOnEngine(
      <Slider accessibilityLabel="Volume" min={0} max={100} step={1} defaultValue={50} />,
    );
    // No template callback: the old code passed `report` itself here, so this
    // must not throw — and the engine must still receive a handler.
    expect(typeof globalThis.__lastEngineSliderProps.onValueChange).toBe("function");
    expect(() => globalThis.__lastEngineSliderProps.onValueChange(RAW)).not.toThrow();
  });

  it("passes no handlers when disabled", () => {
    renderOnEngine(
      <Slider
        accessibilityLabel="Volume"
        min={0}
        max={100}
        step={1}
        defaultValue={50}
        disabled
        onValueChange={() => {}}
        onSlidingComplete={() => {}}
      />,
    );
    expect(globalThis.__lastEngineSliderProps.onValueChange).toBeUndefined();
    expect(globalThis.__lastEngineSliderProps.onSlidingComplete).toBeUndefined();
  });
});
