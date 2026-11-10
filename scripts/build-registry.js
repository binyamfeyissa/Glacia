// Builds the Glacia registry from the real component source.
//
// Every registry item ships the component's actual source code (not a re-export
// stub), so `npx glacia add <component>` copies working, editable code into the
// user's project. Internal helpers and styles stay in the `glacia` package and
// are imported from there.

import fs from "node:fs";
import path from "node:path";

// Registry dependency URLs. Relative to the registry root so the CLI can
// resolve them against whichever host actually serves the registry.
const BASE_URL = "/r";

const SRC = path.resolve("packages/core/src");
const registryDir = path.resolve("registry/new-york");
const docsPublicRDir = path.resolve("apps/docs/public/r");

// Component name -> source file stem. Most match; the rest are listed here.
const FILE_OVERRIDES = {
  "admin-dashboard": "blocks/admin-dashboard",
};

const COMPONENTS = [
  // Wave 1
  "glass", "button", "text", "input", "textarea", "label", "card", "badge",
  "avatar", "separator", "skeleton", "spinner", "progress", "switch", "slider",
  "search-field", "checkbox", "radio-group", "select", "tabs",
  "segmented-control", "tab-bar", "accordion", "dialog", "alert-dialog",
  "popover", "dropdown-menu", "menu", "tooltip", "sonner", "table", "sidebar",
  "scroll-area",
  // Wave 2
  "button-group", "toggle", "input-group", "field", "form", "combobox",
  "calendar", "chart", "empty", "item", "hover-card", "context-menu", "drawer",
  "sheet", "toast", "breadcrumb", "navigation-menu", "pagination",
  "collapsible", "data-table", "native-select",
  // Wave 3
  "toggle-group", "input-otp", "command", "carousel", "aspect-ratio", "kbd",
  "code-block", "marker", "menubar", "resizable", "message", "bubble",
  "message-scroller", "attachment", "questionnaire", "trace", "direction",
];

/**
 * Reads a component's source and rewrites its local imports so the copied file
 * works on its own:
 *   ./internal/x   -> glacia/internal/x   (shared helpers, kept in the package)
 *   ./other-comp   -> glacia              (cross-component imports)
 *   ./some-comp.tsx -> glacia
 */
function sourceFor(name) {
  const stem = FILE_OVERRIDES[name] ?? name;
  const file = path.join(SRC, `${stem}.tsx`);
  if (!fs.existsSync(file)) {
    throw new Error(`No source file for registry item "${name}" (looked for ${file})`);
  }
  let code = fs.readFileSync(file, "utf-8");

  code = code.replace(/from "\.\/internal\/([a-z0-9-]+)"/g, 'from "glacia/internal/$1"');
  // Cross-component imports resolve from the package entry point.
  code = code.replace(/from "\.\.?\/([a-z0-9-]+)(\.tsx)?"/g, (match, imported) => {
    if (imported === "internal") return match; // already handled above
    return 'from "glacia"';
  });

  const header =
    `// Glacia — ${name}\n` +
    `// Copied with \`npx glacia add ${name}\`. Edit freely; it is yours.\n` +
    `// Shared helpers come from the \`glacia\` package, which must be installed.\n\n`;

  return header + code;
}

/** CSS the component needs. All Glacia styles live in one stylesheet. */
const STYLES_IMPORT =
  'import "glacia/styles.css";\n';

const registryIndex = [];

fs.mkdirSync(registryDir, { recursive: true });
fs.mkdirSync(docsPublicRDir, { recursive: true });

for (const name of COMPONENTS) {
  const source = STYLES_IMPORT + sourceFor(name);
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:ui",
    dependencies: ["glacia@^0.3.1"],
    registryDependencies: [`${BASE_URL}/glass.json`],
    files: [
      {
        path: `components/ui/${name}.tsx`,
        content: source,
        type: "registry:ui",
      },
    ],
  };
  const jsonStr = JSON.stringify(item, null, 2);
  fs.writeFileSync(path.join(registryDir, `${name}.json`), jsonStr, "utf-8");
  fs.writeFileSync(path.join(docsPublicRDir, `${name}.json`), jsonStr, "utf-8");
  registryIndex.push({
    name,
    type: "registry:ui",
    dependencies: ["glacia@^0.3.1"],
    registryDependencies: [`${BASE_URL}/glass.json`],
  });
}

// all.json — a list that names every component
const allItem = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "all",
  type: "registry:ui",
  dependencies: ["glacia@^0.3.1"],
  registryDependencies: COMPONENTS.map((name) => `${BASE_URL}/${name}.json`),
  files: [],
};
for (const target of [registryDir, docsPublicRDir]) {
  fs.writeFileSync(path.join(target, "all.json"), JSON.stringify(allItem, null, 2), "utf-8");
}

// base.json — the shared stylesheet
const baseItem = {
  $schema: "https://ui.shadcn.com/schema/registry-item.json",
  name: "base",
  type: "registry:style",
  dependencies: ["glacia@^0.3.1"],
  registryDependencies: [],
  files: [],
};
for (const target of [registryDir, docsPublicRDir]) {
  fs.writeFileSync(path.join(target, "base.json"), JSON.stringify(baseItem, null, 2), "utf-8");
}

const fullRegistry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "glacia",
  homepage: "https://glacia.dev",
  items: [...registryIndex, baseItem, allItem],
};
fs.writeFileSync(path.resolve("registry/registry.json"), JSON.stringify(fullRegistry, null, 2), "utf-8");
fs.writeFileSync(path.join(docsPublicRDir, "index.json"), JSON.stringify(fullRegistry, null, 2), "utf-8");

console.log(`Registry built: ${COMPONENTS.length} components with real source.`);
