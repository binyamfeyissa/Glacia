import { act, fireEvent, render, renderHook, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  useCopyToClipboard,
  useDebouncedValue,
  useDisclosure,
  useKeyboard,
  usePrevious,
} from "../src/hooks/utility";
import { useSkeletonHandoff } from "../src/hooks/environment";
import {
  AIInput,
  Plan,
  Response,
  Shimmer,
} from "../src/ai/ai-primitives";

describe("useCopyToClipboard", () => {
  it("reports success and resets the flag", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    const { result } = renderHook(() => useCopyToClipboard(500));
    await act(async () => {
      await result.current.copy("hello");
    });

    expect(writeText).toHaveBeenCalledWith("hello");
    expect(result.current.copied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(501);
    });
    expect(result.current.copied).toBe(false);

    vi.useRealTimers();
  });

  it("surfaces a clipboard failure instead of pretending it worked", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
    });
    const { result } = renderHook(() => useCopyToClipboard());
    await act(async () => {
      await result.current.copy("x");
    });
    expect(result.current.copied).toBe(false);
    expect(result.current.error?.message).toBe("denied");
  });
});

describe("useDebouncedValue", () => {
  it("only publishes the latest value after the delay", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, 200), {
      initialProps: { value: "a" },
    });

    rerender({ value: "ab" });
    rerender({ value: "abc" });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(201);
    });
    expect(result.current).toBe("abc");
    vi.useRealTimers();
  });
});

describe("usePrevious", () => {
  it("lags one render behind the current value", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });

    // After the first commit there is no prior value to report yet, so the
    // hook's own initial value is what a later render will see as "previous".
    rerender({ value: 2 });
    expect(result.current).toBe(1);

    rerender({ value: 3 });
    expect(result.current).toBe(2);
  });
});

describe("useDisclosure", () => {
  it("toggles and exposes matching ARIA wiring", () => {
    const { result } = renderHook(() => useDisclosure(false, "panel-1"));
    expect(result.current.open).toBe(false);
    expect(result.current.triggerProps["aria-expanded"]).toBe(false);
    expect(result.current.triggerProps["aria-controls"]).toBe("panel-1");
    expect(result.current.contentProps.id).toBe("panel-1");

    act(() => result.current.toggle());
    expect(result.current.open).toBe(true);
    expect(result.current.triggerProps["aria-expanded"]).toBe(true);
    expect(result.current.contentProps.hidden).toBe(false);
  });
});

describe("useKeyboard", () => {
  it("fires a handler for a bound key", () => {
    const onEsc = vi.fn();
    renderHook(() => useKeyboard({ Escape: onEsc }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onEsc).toHaveBeenCalledTimes(1);
  });

  it("ignores keys typed into inputs by default", () => {
    const onS = vi.fn();
    renderHook(() => useKeyboard({ s: onS }));
    const input = document.createElement("input");
    document.body.appendChild(input);
    fireEvent.keyDown(input, { key: "s" });
    expect(onS).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });
});

describe("useSkeletonHandoff", () => {
  it("starts on the skeleton and clears once loading finishes", async () => {
    const { result, rerender } = renderHook(({ loading }) => useSkeletonHandoff(loading), {
      initialProps: { loading: true },
    });
    expect(result.current).toBe(true);

    rerender({ loading: false });
    await waitFor(() => expect(result.current).toBe(false));
  });
});

describe("AI components", () => {
  it("Shimmer announces itself once, not per line", () => {
    render(<Shimmer lines={4} label="Loading answer" />);
    expect(screen.getByRole("status", { name: "Loading answer" })).toBeTruthy();
  });

  it("Plan reports each step's status", () => {
    const { container } = render(
      <Plan
        steps={[
          { id: "1", title: "Read files", status: "done" },
          { id: "2", title: "Write patch", status: "running" },
          { id: "3", title: "Run tests", status: "pending" },
        ]}
      />,
    );
    expect(container.querySelectorAll('.gl-plan-step[data-status="done"]').length).toBe(1);
    expect(screen.getByText("1/3")).toBeTruthy();
  });

  it("Response reveals only the streamed prefix and reports streaming", () => {
    const { container } = render(<Response text="Hello world" revealed={5} />);
    expect(container.querySelector(".gl-response-text")!.textContent).toBe("Hello");
    expect(container.querySelector(".gl-response-caret")).toBeTruthy();
  });

  it("Response drops the caret when complete", () => {
    const { container } = render(<Response text="Done" revealed={4} />);
    expect(container.querySelector(".gl-response-caret")).toBeNull();
  });

  it("AIInput submits on Enter and blocks empty input", () => {
    const submitted: string[] = [];
    render(<AIInput onSubmit={(value) => submitted.push(value)} />);
    const field = screen.getByPlaceholderText("Ask anything…");

    fireEvent.keyDown(field, { key: "Enter" });
    expect(submitted).toEqual([]);

    fireEvent.change(field, { target: { value: "Summarise this" } });
    fireEvent.keyDown(field, { key: "Enter" });
    expect(submitted).toEqual(["Summarise this"]);
  });

  it("AIInput inserts a newline on Shift+Enter instead of submitting", () => {
    const submitted: string[] = [];
    render(<AIInput onSubmit={(value) => submitted.push(value)} />);
    const field = screen.getByPlaceholderText("Ask anything…");
    fireEvent.change(field, { target: { value: "line" } });
    fireEvent.keyDown(field, { key: "Enter", shiftKey: true });
    expect(submitted).toEqual([]);
  });

  it("AIInput refuses to submit while busy", () => {
    const submitted: string[] = [];
    render(<AIInput value="hello" busy onSubmit={(value) => submitted.push(value)} />);
    fireEvent.keyDown(screen.getByPlaceholderText("Ask anything…"), { key: "Enter" });
    expect(submitted).toEqual([]);
  });
});
