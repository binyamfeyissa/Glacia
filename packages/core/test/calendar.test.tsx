import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Calendar } from "../src";

const JUNE_2026 = new Date(2026, 5, 15);

describe("Calendar", () => {
  it("selects a day from the grid", () => {
    const onSelect = vi.fn();
    render(<Calendar selected={JUNE_2026} onSelect={onSelect} />);
    fireEvent.click(screen.getByLabelText(new Date(2026, 5, 20).toDateString()));
    expect(onSelect).toHaveBeenCalled();
    expect(onSelect.mock.calls[0]?.[0].getDate()).toBe(20);
  });

  it("jumps to a year without stepping through every month", () => {
    // The reported gap: a year could only be reached by arrowing through it.
    const onSelect = vi.fn();
    render(<Calendar selected={JUNE_2026} onSelect={onSelect} />);

    fireEvent.click(screen.getByLabelText("Choose year"));
    fireEvent.click(screen.getByRole("button", { name: "2021" }));

    // The grid now shows June 2021: the 15th is selectable there.
    expect(screen.getByLabelText(new Date(2021, 5, 15).toDateString())).toBeTruthy();
  });

  it("jumps to a month too", () => {
    render(<Calendar selected={JUNE_2026} />);
    fireEvent.click(screen.getByLabelText("Choose month"));
    fireEvent.click(screen.getByRole("button", { name: "Feb" }));
    expect(screen.getByLabelText(new Date(2026, 1, 15).toDateString())).toBeTruthy();
  });

  it("offers a window of years around the selection", () => {
    render(<Calendar selected={JUNE_2026} />);
    fireEvent.click(screen.getByLabelText("Choose year"));
    // Ten either side, so 2016..2036.
    expect(screen.getByRole("button", { name: "2016" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "2036" })).toBeTruthy();
  });

  it("closes the year list on Escape", () => {
    render(<Calendar selected={JUNE_2026} />);
    fireEvent.click(screen.getByLabelText("Choose year"));
    expect(screen.getByRole("button", { name: "2021" })).toBeTruthy();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("button", { name: "2021" })).toBeNull();
  });

  it("does not roll 29 February into March when the target year has no leap day", () => {
    const leapDay = new Date(2024, 1, 29);
    render(<Calendar selected={leapDay} />);
    fireEvent.click(screen.getByLabelText("Choose year"));
    fireEvent.click(screen.getByRole("button", { name: "2025" }));
    // 2025 has no 29 February; the day clamps to the 28th rather than
    // silently advancing the month.
    expect(screen.getByLabelText(new Date(2025, 1, 28).toDateString())).toBeTruthy();
  });

  describe("with a time picker", () => {
    it("is off unless asked for", () => {
      render(<Calendar selected={JUNE_2026} />);
      expect(screen.queryByLabelText("Time")).toBeNull();
    });

    it("offers quarter hours by default", () => {
      render(<Calendar selected={JUNE_2026} withTime />);
      const select = screen.getByLabelText("Time") as HTMLSelectElement;
      // 24 hours at 15 minutes.
      expect(select.options.length).toBe(96);
      expect(select.value).toBe("00:00");
    });

    it("reports the chosen moment", () => {
      const onSelect = vi.fn();
      render(<Calendar selected={JUNE_2026} onSelect={onSelect} withTime />);
      fireEvent.change(screen.getByLabelText("Time"), { target: { value: "14:30" } });
      const picked = onSelect.mock.calls[0]?.[0] as Date;
      expect(picked.getHours()).toBe(14);
      expect(picked.getMinutes()).toBe(30);
      // The day is preserved.
      expect(picked.getDate()).toBe(15);
    });

    it("honours a custom minute step", () => {
      render(<Calendar selected={JUNE_2026} withTime minuteStep={30} />);
      expect((screen.getByLabelText("Time") as HTMLSelectElement).options.length).toBe(48);
    });
  });
});
