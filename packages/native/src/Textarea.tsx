// Wave 2 — Textarea.
//
// The donor's multiline field: the same label/description/error contract as a
// single-line input, `textAlignVertical: top`, and a height derived from `rows`.
// It is the family's Input with `multiline`, not a second control.

import { forwardRef } from "react";

import { Input, type InputProps } from "./Input";

export interface TextareaProps extends Omit<InputProps, "multiline"> {
  /** Visible height in text lines. Defaults to 4. */
  rows?: number;
}

export const Textarea = forwardRef<any, TextareaProps>(function Textarea(
  { rows = 4, style, minLines, ...props },
  ref,
) {
  const own = { textAlignVertical: "top" as const, minHeight: 22 * rows + 20 };
  const flat = Array.isArray(style)
    ? Object.assign({}, own, ...style.filter(Boolean))
    : Object.assign({}, own, style ?? {});
  return (
    <Input
      ref={ref}
      multiline
      minLines={minLines ?? rows}
      style={flat as any}
      {...({ rows } as any)}
      {...props}
    />
  );
});
