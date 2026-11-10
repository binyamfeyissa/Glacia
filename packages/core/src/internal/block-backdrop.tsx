import type { CSSProperties, ReactNode } from "react";

/**
 * Wraps a full-page block so it can sit on a photographic backdrop.
 *
 * The scrim matters: a raw photo behind body text costs contrast, so it is
 * darkened enough that a block stays legible over any image, while still
 * giving the glass something with real detail to refract.
 */
export function BlockBackdrop({
  image,
  children,
}: {
  image?: string;
  children: ReactNode;
}) {
  if (!image) return <>{children}</>;

  const style = {
    position: "relative",
    minHeight: "min(760px, 100vh)",
    backgroundImage: `linear-gradient(150deg, rgb(5 6 10 / 0.8) 0%, rgb(5 6 10 / 0.66) 55%, rgb(5 6 10 / 0.84) 100%), url("${image}")`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "inherit",
  } as CSSProperties;

  return (
    <div
      style={style}
      data-block-backdrop
      data-glacia-backdrop="true"
      data-glisse-backdrop="true"
    >
      {children}
    </div>
  );
}
