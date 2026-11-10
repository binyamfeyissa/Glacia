import type { ElementType, HTMLAttributes, JSX, ReactNode } from "react";

import { Segments } from "./internal/segments";

export interface NavigationItem {
  value: string;
  label: ReactNode;
  /** An icon drawn beside the label. */
  icon?: ReactNode;
  /** The destination. Items with an `href` render as links. */
  href?: string;
}

export interface NavigationTabsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  items: NavigationItem[];
  /** The active item's `value`. Give `null` when nothing is active. */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  /** The component used to render links, such as Next.js's `Link`. */
  link?: ElementType;
}

/**
 * A floating navigation bar in the reference implementation's style: a glass
 * rail whose selection is a lens that springs between items, follows a drag,
 * and lifts while held.
 *
 * Structurally the same engine as `TabBar`, but marked as site navigation and
 * built for links, so it can carry a whole application's top-level routes.
 */
export function NavigationTabs(props: NavigationTabsProps): JSX.Element {
  return <Segments kind="tab-bar" {...props} />;
}
