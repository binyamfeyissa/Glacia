import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { expect, test } from "vitest";

import { TicketEntry } from "../src/ticket-entry";

test("renders author header, timestamp, body, and status", () => {
  render(
    <TicketEntry author="Maya Chen" avatar="MC" timestamp="Tue 10:41" status="resolved">
      Your refund has been issued.
    </TicketEntry>,
  );
  expect(screen.getByText("Maya Chen")).toBeTruthy();
  expect(screen.getByText("MC")).toBeTruthy();
  expect(screen.getByText("Tue 10:41")).toBeTruthy();
  expect(screen.getByText("Resolved")).toBeTruthy();
  expect(screen.getByText("Your refund has been issued.")).toBeTruthy();
});

test("is NOT chat-shaped: no bubble, no side alignment, full-width row", () => {
  const { container } = render(
    <TicketEntry author="Sam" status="open">
      Hello?
    </TicketEntry>,
  );
  const root = container.querySelector(".gl-ticket-entry")!;
  expect(root.tagName).toBe("ARTICLE");
  expect(root.className).toContain("gl-glass");
  expect(container.querySelector(".gl-message-bubble")).toBeNull();
  expect(container.querySelector(".gl-message-user")).toBeNull();
  expect(container.querySelector(".gl-message-assistant")).toBeNull();
  expect(root.className).not.toContain("gl-message-user");
});

test("defaults to open status and takes a body prop", () => {
  const { container } = render(
    <TicketEntry author="Sam" body="Still waiting on this." />,
  );
  expect(screen.getByText("Open")).toBeTruthy();
  expect(container.querySelector(".gl-ticket-entry")?.getAttribute("data-status")).toBe("open");
  expect(screen.getByText("Still waiting on this.")).toBeTruthy();
});

test("marks each status for its tint", () => {
  const { container } = render(
    <>
      <TicketEntry author="A" status="pending">p</TicketEntry>
      <TicketEntry author="B" status="closed">c</TicketEntry>
    </>,
  );
  const labels = [...container.querySelectorAll(".gl-ticket-entry-status")];
  expect(labels.map((el) => el.getAttribute("data-status"))).toEqual(["pending", "closed"]);
  expect(labels.map((el) => el.textContent)).toEqual(["Pending", "Closed"]);
});

test("forwards its ref and props", () => {
  const ref = createRef<HTMLElement>();
  render(
    <TicketEntry ref={ref} author="Sam" className="extra" id="t1">
      Hi
    </TicketEntry>,
  );
  expect(ref.current?.tagName).toBe("ARTICLE");
  expect(ref.current?.className).toBe("gl-glass gl-ticket-entry extra");
  expect(ref.current?.id).toBe("t1");
});
