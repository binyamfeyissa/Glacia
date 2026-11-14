import * as React from "react";

import { cx } from "./internal/cx";

interface CarouselContextValue {
  currentIndex: number;
  totalItems: number;
  count: number;
  scrollPrev: () => void;
  scrollNext: () => void;
  goTo: (index: number) => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** How many slides share the viewport, 1 unless `slidesPerView` says more. */
  perView: number;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

export function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }
  return context;
}

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Slide shown first, uncontrolled. */
  defaultIndex?: number;
  /** Orientation of the track. `horizontal` by default. */
  orientation?: "horizontal" | "vertical";
  /** How many slides are visible at once. */
  slidesPerView?: number;
  /** Space between slides, in pixels. Written to the track's gap. */
  gap?: number;
}

/**
 * A scroll-snap carousel.
 *
 * Movement is driven by the track's own scroll position rather than by an
 * index the component nudges alongside it: the old version added the viewport
 * width to `scrollLeft` while CSS also added a gap between slides, so after
 * the first slide every dot and arrow disagreed with what was on screen.
 */
export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      defaultIndex = 0,
      orientation = "horizontal",
      slidesPerView = 1,
      gap = 16,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(defaultIndex);
    const [totalItems, setTotalItems] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const perView = Math.max(1, Math.round(slidesPerView));

    const horizontal = orientation === "horizontal";
    const maxIndex = Math.max(0, totalItems - perView);

    // One slide's travel: its width plus the gap between neighbours.
    const step = React.useCallback(() => {
      const el = containerRef.current;
      if (!el) return 0;
      const first = el.querySelector<HTMLElement>(".gl-carousel-item");
      if (!first) return 0;
      return horizontal
        ? first.offsetWidth + gap
        : first.offsetHeight + gap;
    }, [horizontal, gap]);

    const goTo = React.useCallback(
      (index: number) => {
        const el = containerRef.current;
        if (!el) return;
        const target = Math.max(0, Math.min(maxIndex, index));
        const distance = step() * target;
        el.scrollTo(
          horizontal
            ? { left: distance, behavior: "smooth" }
            : { top: distance, behavior: "smooth" },
        );
        // The scroll handler confirms this once the glide finishes; setting it
        // now keeps the dots responsive on a slow device.
        setCurrentIndex(target);
      },
      [horizontal, maxIndex, step],
    );

    const scrollPrev = React.useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
    const scrollNext = React.useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

    const canScrollPrev = currentIndex > 0;
    const canScrollNext = currentIndex < maxIndex;

    const contextValue = React.useMemo(
      () => ({
        currentIndex,
        totalItems,
        count: totalItems,
        scrollPrev,
        scrollNext,
        goTo,
        canScrollPrev,
        canScrollNext,
        setTotalItems,
        setCurrentIndex,
        containerRef,
        perView,
      }),
      [
        currentIndex,
        totalItems,
        scrollPrev,
        scrollNext,
        goTo,
        canScrollPrev,
        canScrollNext,
        perView,
      ],
    );

    return (
      <CarouselContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="region"
          aria-roledescription="carousel"
          data-orientation={orientation}
          className={cx("gl-carousel-root", className)}
          style={{ "--gl-carousel-gap": `${gap}px`, ...style } as React.CSSProperties}
          onKeyDown={(event) => {
            // Arrow keys move the carousel only when focus is on the track or
            // its controls, so the page's own scrolling is untouched.
            if (!horizontal) return;
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              scrollPrev();
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              scrollNext();
            }
          }}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  },
);
Carousel.displayName = "Carousel";

/**
 * A glass viewport around the track.
 *
 * The glass lives on the viewport, which has the slides' rounded shape, and
 * the track scrolls inside it, so the material has an edge to bend at rather
 * than floating behind square content.
 */
export interface CarouselViewportProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselViewport = React.forwardRef<HTMLDivElement, CarouselViewportProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cx("gl-glass gl-carousel-viewport", className)}
      {...props}
    >
      {children}
    </div>
  ),
);
CarouselViewport.displayName = "CarouselViewport";

export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, children, ...props }, ref) => {
    const { containerRef, setTotalItems, setCurrentIndex, perView } = useCarousel();

    const count = React.Children.count(children);
    React.useEffect(() => {
      setTotalItems((prev) => (prev !== count ? count : prev));
    }, [count, setTotalItems]);

    // The track reports where it actually is. Reading the first slide's width
    // (rather than the viewport's) is what keeps the index true once a gap
    // separates the slides.
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
      const el = event.currentTarget;
      const first = el.querySelector<HTMLElement>(".gl-carousel-item");
      if (!el || !first) return;
      // Orientation comes from the root, not from comparing scroll extents:
      // a horizontal carousel narrower than its content is exactly the case
      // that must scroll horizontally, and the comparison cannot tell them
      // apart reliably.
      const horizontal =
        el.closest<HTMLElement>(".gl-carousel-root")?.dataset.orientation !== "vertical";
      // The gap is read from the root's own variable. `getComputedStyle` can
      // report `normal` before the stylesheet applies, and a NaN stride would
      // silently freeze every dot at the first slide.
      const root = el.closest<HTMLElement>(".gl-carousel-root");
      const gap = parseFloat(root?.style.getPropertyValue("--gl-carousel-gap") || "0") || 0;
      const stride = horizontal ? first.offsetWidth + gap : first.offsetHeight + gap;
      if (!(stride > 0)) return;
      const position = horizontal ? el.scrollLeft : el.scrollTop;
      const index = Math.round(position / stride);
      // Slides are the track's element children, not React children.
      const max = Math.max(0, el.children.length - perView);
      setCurrentIndex(Math.max(0, Math.min(max, index)));
    };

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onScroll={handleScroll}
        tabIndex={0}
        className={cx("gl-carousel-content", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CarouselContent.displayName = "CarouselContent";

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, children, ...props }, ref) => {
    const { perView } = useCarousel();
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        style={{ flexBasis: `calc((100% - (${perView} - 1) * var(--gl-carousel-gap, 16px)) / ${perView})` }}
        className={cx("gl-carousel-item", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CarouselItem.displayName = "CarouselItem";

export interface CarouselPreviousProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  CarouselPreviousProps
>(({ className, ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <button
      ref={ref}
      type="button"
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      className={cx("gl-carousel-arrow gl-carousel-prev gl-glass", className)}
      aria-label="Previous slide"
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="15 18 9 12 15 6" />
      </svg>
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

export interface CarouselNextProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
  ({ className, ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel();

    return (
      <button
        ref={ref}
        type="button"
        disabled={!canScrollNext}
        onClick={scrollNext}
        className={cx("gl-carousel-arrow gl-carousel-next gl-glass", className)}
        aria-label="Next slide"
        {...props}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    );
  },
);
CarouselNext.displayName = "CarouselNext";

export interface CarouselDotsProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Page dots, one per reachable position rather than one per slide: with more
 * than one slide in view the last slides are reached before the last dot.
 */
export const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(
  ({ className, ...props }, ref) => {
    const { currentIndex, totalItems, perView, goTo } = useCarousel();
    const pages = Math.max(1, totalItems - perView + 1);

    return (
      <div
        ref={ref}
        className={cx("gl-carousel-dots", className)}
        role="tablist"
        aria-label="Slides"
        {...props}
      >
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`Go to slide ${i + 1}`}
            className={cx("gl-carousel-dot", i === currentIndex && "gl-active")}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    );
  },
);
CarouselDots.displayName = "CarouselDots";
