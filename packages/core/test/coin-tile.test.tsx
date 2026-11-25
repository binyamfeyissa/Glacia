import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { CoinTile } from "../src/coin-tile";

test("renders icon, symbol, name and price", () => {
  render(
    <CoinTile
      icon={<svg data-testid="coin-icon" />}
      symbol="BTC"
      name="Bitcoin"
      price="$67,432.10"
    />,
  );
  expect(screen.getByTestId("coin-icon")).toBeTruthy();
  expect(screen.getByText("BTC")).toBeTruthy();
  expect(screen.getByText("Bitcoin")).toBeTruthy();
  expect(screen.getByText("$67,432.10")).toBeTruthy();
});

test("tints a positive change with --gl-on and a negative one with --gl-destructive", () => {
  render(
    <>
      <CoinTile symbol="BTC" name="Bitcoin" price="$1" change={2.4} />
      <CoinTile symbol="ETH" name="Ethereum" price="$2" change={-1.15} />
      <CoinTile symbol="SOL" name="Solana" price="$3" />
    </>,
  );
  expect(screen.getByText("+2.40%").dataset.direction).toBe("up");
  expect(screen.getByText("-1.15%").dataset.direction).toBe("down");
  // The tile without a change renders no change element at all.
  const solana = screen.getByText("SOL").closest(".gl-coin-tile") as HTMLElement;
  expect(solana.querySelector(".gl-coin-tile-change")).toBeNull();
});

test("takes an icon tint like Item", () => {
  render(
    <CoinTile
      icon={<span>B</span>}
      iconTint="#f7931a"
      symbol="BTC"
      name="Bitcoin"
      price="$1"
    />,
  );
  const badge = document.querySelector(".gl-coin-tile-icon") as HTMLElement;
  expect(badge.style.backgroundColor).toBe("rgb(247, 147, 26)");
});

test("forwards its ref and props", () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <CoinTile ref={ref} symbol="BTC" name="Bitcoin" price="$1" className="extra" />,
  );
  expect(ref.current).toBe(screen.getByText("BTC").closest(".gl-coin-tile"));
  expect(ref.current?.className).toBe("gl-glass gl-coin-tile extra");
});
