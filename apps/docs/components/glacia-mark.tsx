/**
 * The Glacia mark: a dark rounded square holding a white lowercase "g".
 *
 * The glyph is a real text character, not a drawn path, so it matches the
 * app icon's letterform and scales with the surrounding font rather than
 * faking a shape.
 */
export function GlaciaMark({
  size = 16,
  className,
  title,
}: {
  size?: number;
  className?: string;
  /** Supply only when the mark is the sole label; otherwise leave it empty. */
  title?: string;
}) {
  const labelled = Boolean(title);

  return (
    <span
      className={className}
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
      style={{
        // Size the square from the caller's `size`, and derive the glyph from
        // it so the letter always sits optically centred at any scale.
        width: size,
        height: size,
        display: "inline-grid",
        placeItems: "center",
        flex: "none",
        borderRadius: Math.max(3, size * 0.28),
        background: "linear-gradient(160deg, #2a2a2e 0%, #0b0b0d 55%, #000 100%)",
        boxShadow:
          "inset 0 1px 0 rgb(255 255 255 / 0.18), inset 0 -1px 0 rgb(255 255 255 / 0.04)",
        color: "#fff",
        fontFamily: "var(--font-sans, ui-sans-serif, system-ui, sans-serif)",
        fontSize: size * 0.66,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        lineHeight: 1,
        // A lowercase g has a descender that the browser centres on the em box,
        // which reads high. A small downward nudge sits it optically true; kept
        // well under the descender depth so it never clips.
        paddingTop: size * 0.035,
        boxSizing: "border-box",
        userSelect: "none",
      }}
    >
      g
    </span>
  );
}
