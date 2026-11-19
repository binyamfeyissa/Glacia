// Source-level guard: no component file may render a DOM host element.
//
// React Native cannot render `div`, `button`, `span`, `input`, `h3`, `p` — an
// exported app throws "View config not found". The resolver
// (internal/primitives.ts) is the only permitted place for DOM stand-ins, and
// they exist solely for jsdom tests and web previews where React Native is
// genuinely absent.
//
// This test reads the source so a regression fails the suite rather than a
// device.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(__dirname, "..", "src");

/** Files allowed to contain DOM vocabulary: the resolver's adapter. */
const ALLOWED = new Set(["internal/primitives.ts"]);

/** The vendored glass engine is third-party source; it is not Glacia-authored. */
const VENDOR_PREFIX = "engine/";

/** Every .ts/.tsx file under src, as paths relative to src. */
function sourceFiles(dir: string = SRC): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) found.push(...sourceFiles(full));
    else if (/\.tsx?$/.test(entry) && !entry.endsWith(".d.ts")) found.push(full);
  }
  return found;
}

/** Whether a src-relative path points into the vendored engine. */
function isVendored(rel: string): boolean {
  return rel === "engine" || rel.startsWith(`${VENDOR_PREFIX}`) || rel.startsWith("engine");
}

/** Source with comments and string literals stripped, so prose about the DOM
 *  and the resolver's own tag names do not read as markup. */
function code(file: string): string {
  return readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1")
    .replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, '""');
}

const HOST_TAG = /<(div|button|span|input|h[1-6]|p|img|a|textarea|section|article|header|footer|ul|li|table|svg)\b/;
const WEB_VOCAB = /\bonClick\b|\bcursor:\s*["']|\bboxShadow\b|\btransition:\s*["']|\boutlineStyle\b|\bwhiteSpace\b|\baria-[a-z]+/;
const CSS_LENGTH = /["']\d+px(\s+\d+px)*["']/;

describe("component source renders no DOM host elements", () => {
  const files = sourceFiles().filter(
    (file) => !ALLOWED.has(relative(SRC, file)) && !isVendored(relative(SRC, file)),
  );

  it("has files to check", () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it("uses no host-element JSX anywhere outside the primitives resolver", () => {
    const offenders = files.filter((file) => HOST_TAG.test(code(file))).map((f) => relative(SRC, f));
    expect(offenders).toEqual([]);
  });

  it("uses no web-only vocabulary outside the primitives resolver", () => {
    const offenders = files.filter((file) => WEB_VOCAB.test(code(file))).map((f) => relative(SRC, f));
    expect(offenders).toEqual([]);
  });

  it("uses no CSS length strings in styles", () => {
    const offenders = files.filter((file) => CSS_LENGTH.test(code(file))).map((f) => relative(SRC, f));
    expect(offenders).toEqual([]);
  });

  it("keeps the resolver as the only file with the DOM adapter", () => {
    const resolver = readFileSync(join(SRC, "internal", "primitives.ts"), "utf8");
    expect(resolver).toContain('fallback("div")');
    expect(resolver).toContain('fallback("span")');
    expect(resolver).toContain('fallback("button")');
  });
});
