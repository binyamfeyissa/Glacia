import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { ColorPicker } from "../src";

describe("ColorPicker", () => {
  it("calls onChange when a swatch is clicked", () => {
    const onChange = vi.fn();
    render(<ColorPicker value="#007AFF" onChange={onChange} />);
    fireEvent.click(screen.getByLabelText("#FF3B30"));
    expect(onChange).toHaveBeenCalledWith("#FF3B30");
  });

  it("offers an eyedropper when the browser supports one", () => {
    (window as unknown as { EyeDropper: unknown }).EyeDropper = class {
      open() {
        return Promise.resolve({ sRGBHex: "#abcdef" });
      }
    };
    render(<ColorPicker value="#007AFF" onChange={vi.fn()} />);
    expect(screen.getByLabelText("Pick a colour from the screen")).toBeTruthy();
    delete (window as unknown as { EyeDropper?: unknown }).EyeDropper;
  });

  it("hides the eyedropper when the browser cannot sample", () => {
    delete (window as unknown as { EyeDropper?: unknown }).EyeDropper;
    render(<ColorPicker value="#007AFF" onChange={vi.fn()} />);
    expect(screen.queryByLabelText("Pick a colour from the screen")).toBeNull();
  });

  it("reports the sampled colour in upper case", async () => {
    (window as unknown as { EyeDropper: unknown }).EyeDropper = class {
      open() {
        return Promise.resolve({ sRGBHex: "#abcdef" });
      }
    };
    const onChange = vi.fn();
    render(<ColorPicker value="#007AFF" onChange={onChange} />);
    await fireEvent.click(screen.getByLabelText("Pick a colour from the screen"));
    await Promise.resolve();
    expect(onChange).toHaveBeenCalledWith("#ABCDEF");
    delete (window as unknown as { EyeDropper?: unknown }).EyeDropper;
  });

  it("stays put when the user cancels the eyedropper", async () => {
    (window as unknown as { EyeDropper: unknown }).EyeDropper = class {
      open() {
        return Promise.reject(new Error("cancelled"));
      }
    };
    const onChange = vi.fn();
    render(<ColorPicker value="#007AFF" onChange={onChange} />);
    await fireEvent.click(screen.getByLabelText("Pick a colour from the screen"));
    await Promise.resolve();
    expect(onChange).not.toHaveBeenCalled();
    delete (window as unknown as { EyeDropper?: unknown }).EyeDropper;
  });

  it("can be told to hide the eyedropper", () => {
    (window as unknown as { EyeDropper: unknown }).EyeDropper = class {
      open() {
        return Promise.resolve({ sRGBHex: "#000000" });
      }
    };
    render(<ColorPicker value="#007AFF" hideEyedropper />);
    expect(screen.queryByLabelText("Pick a colour from the screen")).toBeNull();
    delete (window as unknown as { EyeDropper?: unknown }).EyeDropper;
  });
});
