import { STACK } from "./brand-marks";

/**
 * An infinitely scrolling row of the platform marks.
 *
 * The track holds two identical copies of the list and slides exactly one
 * copy's width, so the loop has no seam. It pauses on hover and stops
 * entirely for anyone who asked for reduced motion (they get a static,
 * wrapping row instead).
 */
export function StackMarquee() {
  const items = [...STACK, ...STACK];

  return (
    <div className="marquee" aria-label="Works across these platforms">
      <div className="marquee-fade marquee-fade-left" aria-hidden="true" />
      <div className="marquee-fade marquee-fade-right" aria-hidden="true" />
      <div className="marquee-track">
        {items.map((item, index) => {
          const { Mark, label } = item;
          return (
            <span
              className="marquee-item"
              key={`${item.id}-${index}`}
              // The second copy is a visual duplicate; hide it from readers.
              aria-hidden={index >= STACK.length ? true : undefined}
            >
              <span className="marquee-mark">
                <Mark size={22} />
              </span>
              <span className="marquee-label">{label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
