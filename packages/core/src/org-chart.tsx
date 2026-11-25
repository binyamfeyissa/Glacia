import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type ReactNode,
  type RefAttributes,
} from "react";
import { cx } from "./internal/cx";
import { useRefraction } from "./internal/refraction";

export interface OrgChartNodeData {
  /** Person's name. */
  name: ReactNode;
  /** Role or title, e.g. "CTO". */
  role?: ReactNode;
  /** Avatar slot — pass an Avatar, an image, or initials. */
  avatar?: ReactNode;
  /** Direct reports, rendered nested below this node. */
  children?: OrgChartNodeData[];
}

export interface OrgChartProps extends HTMLAttributes<HTMLDivElement> {
  /** Top-level nodes (usually one root). */
  nodes: OrgChartNodeData[];
}

/**
 * A nested organisation chart — a glass node card (avatar, name, role)
 * per person, children fanning out below, joined by connector lines.
 * Reference is List / Accordion nesting: the node card copies Card's
 * glass surface and Item's avatar + title layout, and the connector lines
 * use the existing separator token (`--gl-separator`) — no new line style.
 */
export const OrgChart: ForwardRefExoticComponent<
  OrgChartProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, OrgChartProps>(
  function OrgChart({ nodes, className, ...props }, forwardedRef) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);

    return (
      <div ref={ref} className={cx("gl-org-chart", className)} {...props}>
        <ul className="gl-org-chart-level">
          {nodes.map((node, index) => (
            <OrgChartNode key={index} node={node} />
          ))}
        </ul>
      </div>
    );
  },
);

export interface OrgChartNodeProps extends HTMLAttributes<HTMLLIElement> {
  node: OrgChartNodeData;
}

/** One person in the chart, with their reports nested below. */
export const OrgChartNode: ForwardRefExoticComponent<
  OrgChartNodeProps & RefAttributes<HTMLLIElement>
> = /* @__PURE__ */ forwardRef<HTMLLIElement, OrgChartNodeProps>(
  // Inner name differs from the component: this component renders itself
  // recursively, and a same-named inner function would shadow the component.
  function OrgChartNodeInner({ node, className, ...props }, forwardedRef) {
    const ref = useRef<HTMLLIElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    const cardRef = useRef<HTMLDivElement>(null);
    useRefraction(cardRef);

    const children = node.children ?? [];

    return (
      <li ref={ref} className={cx("gl-org-chart-node", className)} {...props}>
        <div
          ref={cardRef}
          className="gl-glass gl-org-chart-card"
          suppressHydrationWarning
        >
          {node.avatar && (
            <span className="gl-org-chart-avatar" aria-hidden>
              {node.avatar}
            </span>
          )}
          <span className="gl-org-chart-identity">
            <span className="gl-org-chart-name">{node.name}</span>
            {node.role && <span className="gl-org-chart-role">{node.role}</span>}
          </span>
        </div>
        {children.length > 0 && (
          <ul className="gl-org-chart-level">
            {children.map((child, index) => (
              <OrgChartNode key={index} node={child} />
            ))}
          </ul>
        )}
      </li>
    );
  },
);
