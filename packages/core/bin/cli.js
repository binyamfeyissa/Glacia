#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import http from "node:http";
import https from "node:https";

const VERSION = "0.3.1";

const ALL_COMPONENTS = [
  "accordion",
  "action-sheet",
  "activity",
  "activity-view",
  "ai-input",
  "alert-dialog",
  "area-chart",
  "aspect-ratio",
  "attachment",
  "avatar",
  "badge",
  "bar-chart",
  "boarding-pass",
  "breadcrumb",
  "bubble",
  "bubble-chart",
  "bump-chart",
  "button",
  "button-group",
  "calendar",
  "candlestick-chart",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "code-block",
  "collapsible",
  "color-picker",
  "combobox",
  "command",
  "context-menu",
  "data-table",
  "dialog",
  "direction",
  "drawer",
  "dropdown-menu",
  "empty",
  "field",
  "form",
  "funnel-chart",
  "glass",
  "heatmap-chart",
  "hex-chart",
  "hover-card",
  "image-generation",
  "input",
  "input-group",
  "input-otp",
  "item",
  "kbd",
  "label",
  "line-chart",
  "list",
  "live-line-chart",
  "marker",
  "menu",
  "menubar",
  "message",
  "message-scroller",
  "mirror-area-chart",
  "native-select",
  "navigation-menu",
  "page-control",
  "pagination",
  "panelside",
  "pie-chart",
  "plan",
  "plot-chart",
  "polar-area-chart",
  "popover",
  "popup-button",
  "progress",
  "pyramid-chart",
  "questionnaire",
  "radar-chart",
  "radio-group",
  "resizable",
  "response",
  "ring-chart",
  "sankey-chart",
  "scatter-chart",
  "scroll-area",
  "search-field",
  "segmented-control",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "smart-home",
  "sonner",
  "soundwave",
  "sources",
  "spinner",
  "stepper",
  "switch",
  "tab-bar",
  "table",
  "tabs",
  "task",
  "text",
  "textarea",
  "thinking-orb",
  "time-picker",
  "toast",
  "toggle",
  "toggle-group",
  "toolbar",
  "tooltip",
  "trace",
  "treemap-chart",
  "wallet",
  "waterfall-chart",
  "widget",
];

/** Levenshtein distance, used to suggest a close component name. */
function levenshtein(a, b) {
  const rows = [];
  for (let i = 0; i <= a.length; i++) rows.push([i]);
  for (let j = 0; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      rows[i][j] = Math.min(
        rows[i - 1][j] + 1,
        rows[i][j - 1] + 1,
        rows[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return rows[a.length][b.length];
}

function printHelp() {
  console.log(`
Glacia CLI v${VERSION}
Apple's Liquid Glass UI kit for React and React Native

Usage:
  npx glacia add <component>   Add a component to your project
  npx glacia add all           Add all Wave 1 components
  npx glacia list              List all available components
  npx glacia --version         Show CLI version
  npx glacia --help            Show this help message

Examples:
  npx glacia add button
  npx glacia add card dialog tabs
  npx glacia add all
`);
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    // http is allowed so a self-hosted or local registry can be used.
    const client = url.startsWith("http:") ? http : https;
    client
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchJson(res.headers.location).then(resolve, reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        });
      })
      .on("error", reject);
  });
}

function getLocalComponent(name) {
  // Resolve the registry that ships inside this package first, so `npx glacia
  // add` works offline and does not depend on a running docs host.
  const here = path.dirname(fileURLToPath(import.meta.url));
  const possiblePaths = [
    path.resolve(here, `registry/${name}.json`),
    path.resolve(here, `../registry/${name}.json`),
    // Monorepo checkouts keep the registry at the repo root.
    path.resolve(process.cwd(), `registry/new-york/${name}.json`),
    path.resolve(process.cwd(), `../../registry/new-york/${name}.json`),
    path.resolve(process.cwd(), `apps/docs/public/r/${name}.json`),
    path.resolve(process.cwd(), `../../apps/docs/public/r/${name}.json`),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, "utf-8"));
      } catch {}
    }
  }
  return null;
}

async function addComponent(name, targetDir) {
  const normName = name.toLowerCase().trim();

  // Reject unknown names before any network work: a typo should say so, not
  // surface a connection error from the registry host.
  if (normName !== "all" && !ALL_COMPONENTS.includes(normName)) {
    const close = ALL_COMPONENTS.filter(
      (candidate) =>
        candidate.includes(normName) ||
        normName.includes(candidate) ||
        levenshtein(candidate, normName) <= 2,
    ).slice(0, 5);
    throw new Error(
      `Unknown component "${name}".\n` +
        (close.length ? `Did you mean: ${close.join(", ")}?\n` : "") +
        `Run \`npx glacia list\` to see all ${ALL_COMPONENTS.length} components.`,
    );
  }

  let registryItem = getLocalComponent(normName);

  if (!registryItem) {
    // Registries are served from the docs site. Set GLACIA_REGISTRY_URL to point
    // at a self-hosted one; it defaults to the published docs host.
    const base = (process.env.GLACIA_REGISTRY_URL || "https://glacia.dev/r").replace(/\/+$/, "");
    const registryUrl = `${base}/${normName}.json`;
    try {
      registryItem = await fetchJson(registryUrl);
    } catch (err) {
      throw new Error(
        `Could not reach the Glacia registry at ${registryUrl}.\n` +
          `Check your connection, or set GLACIA_REGISTRY_URL to a registry host.\n` +
          `Run \`npx glacia list\` to see the available component names. (${err.message})`,
      );
    }
  }

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (registryItem.files && registryItem.files.length > 0) {
    for (const file of registryItem.files) {
      const fileName = path.basename(file.path);
      const outPath = path.join(targetDir, fileName);
      fs.writeFileSync(outPath, file.content, "utf-8");
      console.log(`✓ Added ${fileName} to ${path.relative(process.cwd(), outPath)}`);
    }
  } else {
    throw new Error(`The registry entry for "${normName}" has no files. Nothing was written.`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  if (args.includes("--version") || args.includes("-v")) {
    console.log(`v${VERSION}`);
    return;
  }

  const command = args[0];

  if (command === "list") {
    console.log("Available Glacia components:\n");
    ALL_COMPONENTS.forEach((c) => console.log(`  - ${c}`));
    console.log(`\nInstall any component with: npx glacia add <component>`);
    return;
  }

  if (command === "add") {
    const components = args.slice(1);
    if (components.length === 0) {
      console.error("Error: Please specify one or more components to add (or 'all').");
      process.exit(1);
    }

    const targetDir = path.resolve(process.cwd(), "components/ui");

    const toInstall = components.includes("all") ? ALL_COMPONENTS : components;

    console.log(`Installing ${toInstall.length} component(s) into ${path.relative(process.cwd(), targetDir)}...\n`);

    for (const comp of toInstall) {
      await addComponent(comp, targetDir);
    }

    console.log("\nSuccess! You own the copied files. Make sure `glacia` is installed in your project:");
    console.log("  npm install glacia");
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exit(1);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
