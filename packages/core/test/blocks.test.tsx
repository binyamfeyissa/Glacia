import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { BoardingPassBlock } from "../src/blocks/boarding-pass-block";
import { WalletBlock } from "../src/blocks/wallet-block";
import { ActivityBlock } from "../src/blocks/activity-block";
import { SmartHomeBlock } from "../src/blocks/smart-home-block";

// These blocks render real information and own real interaction state. The
// tests below check the behaviour a user would notice, not just that the
// components mount.

const flight = {
  airline: "Glacia Air",
  flightNumber: "GA 208",
  from: "SFO",
  fromCity: "San Francisco",
  to: "NRT",
  toCity: "Tokyo",
  departure: "11:40",
  arrival: "15:25 +1",
  duration: "11h 05m",
  terminal: "2",
  gate: "B14",
};

describe("BoardingPassBlock", () => {
  it("shows the route, times and seat", () => {
    render(
      <BoardingPassBlock
        passenger="A. Rivera"
        flight={flight}
        date="12 Nov"
        seat="14A"
        boardingGroup="2"
        barcodeValue="GA208-14A"
      />,
    );
    expect(screen.getByText("SFO")).toBeTruthy();
    expect(screen.getByText("NRT")).toBeTruthy();
    expect(screen.getByText("11:40")).toBeTruthy();
    // The seat appears twice by design: in the detail grid and on the stub,
    // so a gate agent can read it without scanning the whole pass.
    expect(screen.getAllByText("14A").length).toBe(2);
    expect(screen.getByText("A. Rivera")).toBeTruthy();
  });

  it("generates a deterministic barcode so the same pass looks the same", () => {
    const { container: first } = render(
      <BoardingPassBlock passenger="A" flight={flight} date="12 Nov" seat="1A" barcodeValue="XYZ" />,
    );
    const firstBars = [...first.querySelectorAll(".gl-boarding-pass-barcode > span")].map(
      (b) => b.getAttribute("style"),
    );
    expect(firstBars.length).toBeGreaterThan(4);

    const { container: second } = render(
      <BoardingPassBlock passenger="A" flight={flight} date="12 Nov" seat="1A" barcodeValue="XYZ" />,
    );
    const secondBars = [...second.querySelectorAll(".gl-boarding-pass-barcode > span")].map(
      (b) => b.getAttribute("style"),
    );
    expect(secondBars).toEqual(firstBars);
  });

  it("omits optional detail rows that were not supplied", () => {
    render(
      <BoardingPassBlock
        passenger="A"
        flight={{ airline: "X", flightNumber: "X1", from: "A", to: "B", departure: "1", arrival: "2" }}
        date="1 Jan"
        seat="1A"
      />,
    );
    expect(screen.queryByText("Terminal")).toBeNull();
    expect(screen.queryByText("Gate")).toBeNull();
  });
});

const cards = [
  { id: "a", name: "First", number: "•••• 1111", holder: "A", expiry: "01/30", balance: "$10" },
  { id: "b", name: "Second", number: "•••• 2222", holder: "B", expiry: "02/30" },
];

describe("WalletBlock", () => {
  it("marks the first card selected by default", () => {
    render(<WalletBlock cards={cards} />);
    const buttons = screen.getAllByRole("button", { name: /ending/i });
    expect(buttons[0]!.getAttribute("aria-pressed")).toBe("true");
    expect(buttons[1]!.getAttribute("aria-pressed")).toBe("false");
  });

  it("selects a card when clicked", () => {
    render(<WalletBlock cards={cards} />);
    const buttons = screen.getAllByRole("button", { name: /ending/i });
    fireEvent.click(buttons[1]!);
    expect(buttons[1]!.getAttribute("aria-pressed")).toBe("true");
    expect(buttons[0]!.getAttribute("aria-pressed")).toBe("false");
  });

  it("reports selection to a controlled caller instead of changing itself", () => {
    const picks: number[] = [];
    render(<WalletBlock cards={cards} onSelectCard={(i) => picks.push(i)} />);
    const buttons = screen.getAllByRole("button", { name: /ending/i });
    fireEvent.click(buttons[1]!);
    expect(picks).toEqual([1]);
    // Still showing index 0 as selected, because the caller owns the state.
    expect(buttons[0]!.getAttribute("aria-pressed")).toBe("true");
  });

  it("renders transactions with their amounts", () => {
    render(
      <WalletBlock
        cards={cards}
        transactions={[
          { id: "t1", merchant: "Blue Bottle", amount: "-$8.40", date: "Today", debit: true },
          { id: "t2", merchant: "Payout", amount: "+$100", date: "Yesterday" },
        ]}
      />,
    );
    expect(screen.getByText("Blue Bottle")).toBeTruthy();
    expect(screen.getByText("-$8.40")).toBeTruthy();
  });
});

describe("ActivityBlock", () => {
  const entries = [
    { id: "1", actor: "Mina", action: "approved the deploy", time: "09:42", day: "Today", tone: "positive" as const },
    { id: "2", actor: "CI", action: "failed the build", time: "08:58", day: "Today", tone: "danger" as const },
    { id: "3", actor: "Ana", action: "merged a branch", time: "17:20", day: "Yesterday" },
  ];

  it("groups entries by day", () => {
    const { container } = render(<ActivityBlock entries={entries} />);
    const days = [...container.querySelectorAll(".gl-activity-day")].map((d) => d.textContent);
    expect(days).toEqual(["Today", "Yesterday"]);
  });

  it("renders one row per entry", () => {
    const { container } = render(<ActivityBlock entries={entries} />);
    expect(container.querySelectorAll(".gl-activity-row").length).toBe(3);
  });

  it("shows an empty message when there is nothing to show", () => {
    render(<ActivityBlock entries={[]} />);
    expect(screen.getByText(/nothing has happened/i)).toBeTruthy();
  });
});

describe("SmartHomeBlock", () => {
  const devices = [
    { id: "l1", name: "Ceiling lights", room: "Living room", kind: "light" as const, on: true },
    { id: "c1", name: "Thermostat", room: "Living room", kind: "climate" as const, on: false },
    { id: "k1", name: "Front door", room: "Entry", kind: "lock" as const, on: false },
  ];

  it("toggles a device when its switch is clicked", () => {
    render(<SmartHomeBlock devices={devices} />);
    const switches = screen.getAllByRole("switch");
    expect(switches[0]!.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(switches[0]!);
    expect(switches[0]!.getAttribute("aria-checked")).toBe("false");
  });

  it("filters the device list by room", () => {
    render(<SmartHomeBlock devices={devices} />);
    fireEvent.click(screen.getByRole("tab", { name: /Entry/ }));
    expect(screen.getByText("Front door")).toBeTruthy();
    expect(screen.queryByText("Ceiling lights")).toBeNull();
  });

  it("reports toggles to a controlled caller", () => {
    const changes: [string, boolean][] = [];
    render(<SmartHomeBlock devices={devices} onToggleDevice={(id, next) => changes.push([id, next])} />);
    fireEvent.click(screen.getAllByRole("switch")[0]!);
    expect(changes).toEqual([["l1", false]]);
  });

  it("counts active devices in the header", () => {
    render(<SmartHomeBlock devices={devices} />);
    expect(screen.getByText("1 of 3 devices active")).toBeTruthy();
  });
});
