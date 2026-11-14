import { describe, expect, it, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";

import { TimePicker } from "../src";

// The reported bugs were (1) the wheels spin forever without being touched and
// (2) picking a value never reaches onChange. Both came from one feedback loop:
// a scroll event set state, which scrolled the wheel again, which fired scroll.

function wheels(container: HTMLElement) {
  return Array.from(container.querySelectorAll(".gl-time-column-scroll")) as HTMLElement[];
}

describe("TimePicker", () => {
  it("shows the value it was given", () => {
    const { container } = render(<TimePicker value="2:05 PM" />);
    const selected = Array.from(container.querySelectorAll(".gl-time-column-selected"));
    expect(selected.map((el) => el.textContent)).toEqual(["2", "05", "PM"]);
  });

  it("does not report a change on mount", () => {
    // Spontaneous spinning showed up as a stream of changes with no input.
    const onChange = vi.fn();
    render(<TimePicker value="9:41 AM" onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("selects a clicked minute and reports it once", () => {
    const onChange = vi.fn();
    const { container } = render(<TimePicker value="9:41 AM" onChange={onChange} />);
    const [, minuteWheel] = wheels(container);

    const item = minuteWheel!.querySelectorAll(".gl-time-column-item")[30] as HTMLElement;
    expect(item.textContent).toBe("30");
    fireEvent.click(item);

    // Reported exactly once — not once per scroll event it triggers.
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("9:30 AM");
  });

  it("keeps the hour when the minute wheel is scrolled", async () => {
    const onChange = vi.fn();
    const { container } = render(<TimePicker value="3:00 PM" onChange={onChange} />);
    const [, minuteWheel] = wheels(container);
    // A real scroll: the wheel's own offset is settable, as in a browser.
    minuteWheel!.scrollTop = (15 + 2) * 40;
    fireEvent.scroll(minuteWheel!);

    // Scrolling settles on a short debounce, so the Change is asynchronous.
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(onChange).toHaveBeenCalledWith("3:15 PM");
  });

  it("switches AM and PM without moving the hour number", () => {
    const onChange = vi.fn();
    const { container } = render(<TimePicker value="9:41 AM" onChange={onChange} />);
    const periodWheel = wheels(container)[2]!;
    fireEvent.click(periodWheel.querySelectorAll(".gl-time-column-item")[1] as HTMLElement);
    expect(onChange).toHaveBeenCalledWith("9:41 PM");
  });

  it("turns 12 AM into midnight and 12 PM into noon", () => {
    const onChange = vi.fn();
    const { container, rerender } = render(<TimePicker value="12:00 AM" onChange={onChange} />);
    let selected = Array.from(container.querySelectorAll(".gl-time-column-selected"));
    expect(selected[0]!.textContent).toBe("12");

    rerender(<TimePicker value="12:00 PM" onChange={onChange} />);
    selected = Array.from(container.querySelectorAll(".gl-time-column-selected"));
    expect(selected[2]!.textContent).toBe("PM");
  });

  it("honours minuteStep for a five-minute wheel", () => {
    const onChange = vi.fn();
    const { container } = render(
      <TimePicker value="9:00 AM" minuteStep={5} onChange={onChange} />,
    );
    const minuteWheel = wheels(container)[1]!;
    const labels = Array.from(minuteWheel.querySelectorAll(".gl-time-column-item")).map(
      (el) => el.textContent,
    );
    expect(labels.slice(0, 4)).toEqual(["00", "05", "10", "15"]);
    fireEvent.click(minuteWheel.querySelectorAll(".gl-time-column-item")[3] as HTMLElement);
    expect(onChange).toHaveBeenCalledWith("9:15 AM");
  });

  it("settles instead of spinning on its own", async () => {
    // The reported bug: wheels spun forever untouched. A cleanup loop showed up
    // as an unbounded stream of onChange calls; a settled picker reports none.
    const onChange = vi.fn();
    const { container } = render(<TimePicker value="9:41 AM" onChange={onChange} />);
    const wheelsEls = wheels(container);
    const start = wheelsEls.map((w) => w.scrollTop);

    await new Promise((resolve) => setTimeout(resolve, 400));

    expect(onChange).not.toHaveBeenCalled();
    // Nothing moved the wheels either.
    expect(wheelsEls.map((w) => w.scrollTop)).toEqual(start);
  });

  it("does not loop when it is given a new value", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<TimePicker value="9:41 AM" onChange={onChange} />);
    rerender(<TimePicker value="6:20 PM" onChange={onChange} />);
    await new Promise((resolve) => setTimeout(resolve, 300));
    // The parent set the value; the picker must not answer with a change.
    expect(onChange).not.toHaveBeenCalled();
  });

  it("moves with the arrow keys", () => {
    const onChange = vi.fn();
    const { container } = render(<TimePicker value="9:41 AM" onChange={onChange} />);
    const [hourWheel] = wheels(container);
    act(() => {
      fireEvent.keyDown(hourWheel!, { key: "ArrowDown" });
    });
    expect(onChange).toHaveBeenCalledWith("10:41 AM");
  });

  it("formats 24-hour values when twelveHour is off", () => {
    const { container } = render(<TimePicker value="17:30" twelveHour={false} />);
    const selected = Array.from(container.querySelectorAll(".gl-time-column-selected"));
    expect(selected.map((el) => el.textContent)).toEqual(["17", "30"]);
    expect(wheels(container)).toHaveLength(2);
  });
});
