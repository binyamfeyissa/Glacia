// Regenerates the slug lists in apps/docs/data/component-slugs.ts from the
// two catalogues (apps/docs/data/components-data.ts for web,
// apps/docs/data/platform-components.ts for native).
//
// The catalogues are TypeScript, so the slugs are read with a narrow
// extraction — one `slug: "..."` per catalogue entry line — instead of
// importing the modules. Lists are deduplicated and sorted; everything else
// in component-slugs.ts (header, componentSlugs helper) is left untouched.
//
// Usage: node scripts/gen-component-slugs.mjs   (run from the repo root)

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SLUGS_FILE = path.join(ROOT, "apps/docs/data/component-slugs.ts");

const CATALOGUES = [
  {
    file: path.join(ROOT, "apps/docs/data/components-data.ts"),
    list: "WEB_COMPONENT_SLUGS",
  },
  {
    file: path.join(ROOT, "apps/docs/data/platform-components.ts"),
    list: "NATIVE_COMPONENT_SLUGS",
  },
];

/** Entry slugs: one `slug: "..."` per catalogue entry line. */
function extractSlugs(file) {
  const text = fs.readFileSync(file, "utf-8");
  const slugs = [...text.matchAll(/^    slug: "([^"]+)",?$/gm)].map((m) => m[1]);
  const unique = [...new Set(slugs)].sort();
  if (unique.length !== slugs.length) {
    throw new Error(`${file}: duplicate slugs found`);
  }
  if (unique.length === 0) {
    throw new Error(`${file}: no slugs found — catalogue format changed?`);
  }
  return unique;
}

function renderList(slugs) {
  return slugs.map((slug, i) => `  "${slug}"${i === slugs.length - 1 ? "" : ","}`).join("\n");
}

let out = fs.readFileSync(SLUGS_FILE, "utf-8");
for (const { file, list } of CATALOGUES) {
  const slugs = extractSlugs(file);
  const pattern = new RegExp(
    `(export const ${list}: string\\[\\] = \\[\\n)[\\s\\S]*?(\\n\\];)`,
  );
  if (!pattern.test(out)) {
    throw new Error(`${SLUGS_FILE}: could not find the ${list} array`);
  }
  out = out.replace(pattern, `$1${renderList(slugs)}$2`);
  console.log(`${list}: ${slugs.length} slugs from ${path.relative(ROOT, file)}`);
}

fs.writeFileSync(SLUGS_FILE, out, "utf-8");
console.log(`Wrote ${path.relative(ROOT, SLUGS_FILE)}`);
