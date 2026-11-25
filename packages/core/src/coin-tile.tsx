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

export interface CoinTileProps extends HTMLAttributes<HTMLDivElement> {
  /** Coin icon or logo. */
  icon?: ReactNode;
  /** Background tint colour for the icon squircle badge (copies Item's iconTint). */
  iconTint?: string;
  /** Ticker symbol, e.g. "BTC". */
  symbol: string;
  /** Full coin name, e.g. "Bitcoin". */
  name: string;
  /** Current price, already formatted (e.g. "$67,432.10"). */
  price: ReactNode;
  /** 24h change in percent. Positive tints `--gl-on`, negative `--gl-destructive`. */
  change?: number;
}

/**
 * A Liquid Glass coin tile — icon, symbol, name, price and 24h change.
 * Reference is Card (glass surface, useRefraction) laid out like Item
 * (icon badge, title + description, trailing accessory).
 *
 * No sparkline: the kit has no sparkline primitive. Its charts (LineChart
 * and friends in src/charts) are full-size charts, not inline sparklines,
 * so none is embedded here.
 */
export const CoinTile: ForwardRefExoticComponent<
  CoinTileProps & RefAttributes<HTMLDivElement>
> = /* @__PURE__ */ forwardRef<HTMLDivElement, CoinTileProps>(
  function CoinTile(
    { icon, iconTint, symbol, name, price, change, className, children, ...props },
    forwardedRef,
  ) {
    const ref = useRef<HTMLDivElement>(null);
    useImperativeHandle(forwardedRef, () => ref.current!);
    useRefraction(ref);

    const direction = change == null ? undefined : change >= 0 ? "up" : "down";

    return (
      <div
        ref={ref}
        className={cx("gl-glass gl-coin-tile", className)}
        suppressHydrationWarning
        {...props}
      >
        {icon && (
          <div
            className="gl-coin-tile-icon"
            style={iconTint ? { backgroundColor: iconTint } : undefined}
            aria-hidden
          >
            {icon}
          </div>
        )}
        <div className="gl-coin-tile-body">
          <div className="gl-coin-tile-symbol">{symbol}</div>
          <div className="gl-coin-tile-name">{name}</div>
        </div>
        <div className="gl-coin-tile-values">
          <div className="gl-coin-tile-price">{price}</div>
          {change != null && (
            <div className="gl-coin-tile-change" data-direction={direction}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)}%
            </div>
          )}
        </div>
        {children}
      </div>
    );
  },
);
