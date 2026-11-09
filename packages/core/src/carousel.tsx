import * as React from "react";

interface CarouselContextValue {
  currentIndex: number;
  totalItems: number;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  containerRef: React.RefObject<HTMLDivElement | null>;
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
  defaultIndex?: number;
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ defaultIndex = 0, className = "", children, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(defaultIndex);
    const [totalItems, setTotalItems] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const scrollPrev = React.useCallback(() => {
      if (containerRef.current) {
        const itemWidth = containerRef.current.clientWidth;
        containerRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    }, []);

    const scrollNext = React.useCallback(() => {
      if (containerRef.current) {
        const itemWidth = containerRef.current.clientWidth;
        containerRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
        setCurrentIndex((prev) => Math.min(totalItems - 1, prev + 1));
      }
    }, [totalItems]);

    const canScrollPrev = currentIndex > 0;
    const canScrollNext = currentIndex < totalItems - 1;

    const contextValue = React.useMemo(
      () => ({
        currentIndex,
        totalItems,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        setTotalItems,
        setCurrentIndex,
        containerRef,
      }),
      [currentIndex, totalItems, scrollPrev, scrollNext, canScrollPrev, canScrollNext]
    );

    return (
      <CarouselContext.Provider value={contextValue}>
        <div
          ref={ref}
          role="region"
          aria-roledescription="carousel"
          className={`gl-carousel-root ${className}`}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselContent = React.forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className = "", children, ...props }, ref) => {
    const { containerRef, setTotalItems, setCurrentIndex } = useCarousel();

    const count = React.Children.count(children);
    React.useEffect(() => {
      setTotalItems((prev) => (prev !== count ? count : prev));
    }, [count, setTotalItems]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      if (el.clientWidth > 0) {
        const index = Math.round(el.scrollLeft / el.clientWidth);
        setCurrentIndex(index);
      }
    };

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        onScroll={handleScroll}
        className={`gl-carousel-content ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        aria-roledescription="slide"
        className={`gl-carousel-item ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
CarouselItem.displayName = "CarouselItem";

export interface CarouselPreviousProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CarouselPrevious = React.forwardRef<HTMLButtonElement, CarouselPreviousProps>(
  ({ className = "", ...props }, ref) => {
    const { scrollPrev, canScrollPrev } = useCarousel();

    return (
      <button
        ref={ref}
        type="button"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        className={`gl-carousel-prev gl-glass ${!canScrollPrev ? "gl-disabled" : ""} ${className}`}
        aria-label="Previous slide"
        {...props}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";

export interface CarouselNextProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CarouselNext = React.forwardRef<HTMLButtonElement, CarouselNextProps>(
  ({ className = "", ...props }, ref) => {
    const { scrollNext, canScrollNext } = useCarousel();

    return (
      <button
        ref={ref}
        type="button"
        disabled={!canScrollNext}
        onClick={scrollNext}
        className={`gl-carousel-next gl-glass ${!canScrollNext ? "gl-disabled" : ""} ${className}`}
        aria-label="Next slide"
        {...props}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";

export interface CarouselDotsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselDots = React.forwardRef<HTMLDivElement, CarouselDotsProps>(
  ({ className = "", ...props }, ref) => {
    const { currentIndex, totalItems, containerRef, setCurrentIndex } = useCarousel();

    const goTo = (index: number) => {
      if (containerRef.current) {
        const itemWidth = containerRef.current.clientWidth;
        containerRef.current.scrollTo({ left: itemWidth * index, behavior: "smooth" });
        setCurrentIndex(index);
      }
    };

    return (
      <div ref={ref} className={`gl-carousel-dots ${className}`} {...props}>
        {Array.from({ length: totalItems }).map((_, i) => (
          <button
            key={i}
            type="button"
            className={`gl-carousel-dot ${i === currentIndex ? "gl-active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    );
  }
);
CarouselDots.displayName = "CarouselDots";
