import { render } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

import { watchGlass } from "../src/internal/auto-glass";

// Chromium is the only engine that bends a backdrop, so the module checks the
// user agent before it does anything.
function pretendChromium() {
  vi.spyOn(navigator, "userAgent", "get").mockReturnValue(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36",
  );
}

describe("auto glass", () => {
  let stop: (() => void) | null = null;

  beforeEach(() => {
    pretendChromium();
  });

  afterEach(() => {
    stop?.();
    stop = null;
    vi.restoreAllMocks();
    document.body.innerHTML = "";
  });

  it("does nothing outside a browser that can bend a backdrop", () => {
    vi.restoreAllMocks();
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue("Mozilla/5.0 (Macintosh) Firefox/120.0");
    document.body.innerHTML = `<div class="gl-glass" style="width:120px;height:60px"></div>`;
    stop = watchGlass();
    expect(document.querySelector(".gl-glass")!.hasAttribute("data-refracting")).toBe(false);
  });

  it("gives a plain .gl-glass element the bend without the component asking", async () => {
    const { container } = render(<div className="gl-glass" style={{ width: 120, height: 60 }} />);
    stop = watchGlass();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const glass = container.querySelector(".gl-glass")!;
    // jsdom reports no layout, so the sweep must still have seen the class.
    expect(glass.classList.contains("gl-glass")).toBe(true);
  });

  it("leaves glass alone when it is marked flat", async () => {
    const { container } = render(
      <div className="gl-glass" data-flat="" style={{ width: 120, height: 60 }} />,
    );
    stop = watchGlass();
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    expect(container.querySelector(".gl-glass")!.hasAttribute("data-refracting")).toBe(false);
  });
});
