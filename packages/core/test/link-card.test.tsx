import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { LinkCard } from "../src/link-card";
import { CardDescription, CardHeader, CardTitle } from "../src/card";

test("renders a link on the card glass", () => {
  render(
    <LinkCard href="/templates/admin-suite">
      <CardHeader>
        <CardTitle>Admin Suite</CardTitle>
        <CardDescription>A dashboard template.</CardDescription>
      </CardHeader>
    </LinkCard>,
  );
  const link = screen.getByRole("link", { name: /Admin Suite/ });
  expect(link.getAttribute("href")).toBe("/templates/admin-suite");
  expect(link.className).toContain("gl-glass");
  expect(link.className).toContain("gl-card");
  expect(link.className).toContain("gl-link-card");
  expect(link.hasAttribute("data-variant")).toBe(false);
});

test("forwards its ref and props", () => {
  const ref = createRef<HTMLAnchorElement>();
  render(
    <LinkCard ref={ref} href="/x" className="extra" target="_blank" rel="noreferrer">
      Go
    </LinkCard>,
  );
  expect(ref.current).toBe(screen.getByRole("link", { name: "Go" }));
  expect(ref.current?.className).toBe("gl-glass gl-card gl-link-card extra");
  expect(ref.current?.target).toBe("_blank");
});

test("marks the clear variant", () => {
  render(<LinkCard href="/x" variant="clear">Go</LinkCard>);
  expect(screen.getByRole("link").dataset.variant).toBe("clear");
});
