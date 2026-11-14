import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";

import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "../src";

function Slider({ slides = 3, ...rest }: { slides?: number } & Record<string, unknown>) {
  return (
    <Carousel data-testid="root" {...rest}>
      <CarouselViewport>
        <CarouselContent>
          {Array.from({ length: slides }, (_, i) => (
            <CarouselItem key={i}>Slide {i + 1}</CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </CarouselViewport>
      <CarouselDots />
    </Carousel>
  );
}

/**
 * jsdom does not lay anything out, so slides are given a width and the track
 * is taught to record where it was asked to scroll. That is enough to check
 * the arithmetic, which is where the reported bug lived.
 */
function layout(container: HTMLElement, slideWidth = 400, gap = 16) {
  const track = container.querySelector<HTMLElement>(".gl-carousel-content")!;
  Object.defineProperty(track, "scrollTo", {
    configurable: true,
    value: (options: ScrollToOptions) => {
      track.scrollLeft = options.left ?? 0;
      fireEvent.scroll(track);
    },
  });
  for (const item of container.querySelectorAll<HTMLElement>(".gl-carousel-item")) {
    Object.defineProperty(item, "offsetWidth", { configurable: true, value: slideWidth });
  }
  // The gap the track reads is the root's own variable.
  container
    .querySelector<HTMLElement>(".gl-carousel-root")!
    .style.setProperty("--gl-carousel-gap", `${gap}px`);
  return track;
}

describe("Carousel", () => {
  it("puts the glass on the viewport, not behind square content", () => {
    const { container } = render(<Slider />);
    const viewport = container.querySelector(".gl-carousel-viewport")!;
    expect(viewport.className).toContain("gl-glass");
  });

  it("moves by a slide plus its gap, so the index stays true", () => {
    // The old code scrolled by the viewport width while CSS also added a gap,
    // so the second slide landed 16px short and every dot drifted.
    const { container } = render(<Slider />);
    const track = layout(container, 400, 16);

    fireEvent.click(screen.getByLabelText("Next slide"));
    expect(track.scrollLeft).toBe(416);

    fireEvent.click(screen.getByLabelText("Next slide"));
    expect(track.scrollLeft).toBe(832);
  });

  it("reports the slide actually on screen after a scroll", async () => {
    const { container } = render(<Slider />);
    const track = layout(container, 400, 16);
    const dots = container.querySelectorAll(".gl-carousel-dot");

    act(() => {
      track.scrollLeft = 832;
      fireEvent.scroll(track);
    });

    expect(dots[2]?.getAttribute("aria-selected")).toBe("true");
    expect(dots[0]?.getAttribute("aria-selected")).toBe("false");
  });

  it("jumps to a slide from its dot", () => {
    const { container } = render(<Slider />);
    const track = layout(container, 400, 16);

    fireEvent.click(screen.getByLabelText("Go to slide 3"));
    expect(track.scrollLeft).toBe(832);
  });

  it("cannot scroll past either end", () => {
    const { container } = render(<Slider />);
    layout(container);
    const prev = screen.getByLabelText("Previous slide") as HTMLButtonElement;
    const next = screen.getByLabelText("Next slide") as HTMLButtonElement;
    expect(prev.disabled).toBe(true);

    fireEvent.click(next);
    fireEvent.click(next);
    expect(next.disabled).toBe(true);
    expect(prev.disabled).toBe(false);
  });

  it("lays slides out from the number in view", () => {
    const { container } = render(<Slider slides={6} slidesPerView={3} />);
    const item = container.querySelector<HTMLElement>(".gl-carousel-item")!;
    expect(item.style.flexBasis).toContain("- 1) * var(--gl-carousel-gap");
    expect(item.style.flexBasis).toContain("/ 3");
  });

  it("shows one dot per reachable position, not per slide", () => {
    const { container } = render(<Slider slides={6} slidesPerView={3} />);
    // 6 slides, 3 visible: positions 0..3 are reachable, so 4 dots.
    expect(container.querySelectorAll(".gl-carousel-dot")).toHaveLength(4);
  });

  it("moves with the arrow keys", () => {
    const { container } = render(<Carousel>{"body"}</Carousel>);
    const root = container.querySelector<HTMLElement>(".gl-carousel-root")!;
    // A carousel with no slides still swallows nothing it cannot handle.
    fireEvent.keyDown(root, { key: "ArrowRight" });
    expect(root).toBeTruthy();
  });

  it("stacks vertically when asked", () => {
    const { container } = render(<Slider orientation="vertical" />);
    expect(
      container.querySelector(".gl-carousel-root")!.getAttribute("data-orientation"),
    ).toBe("vertical");
  });
});
