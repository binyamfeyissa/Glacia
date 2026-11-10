#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import https from "node:https";

const VERSION = "0.3.1";

const ALL_COMPONENTS = [
  "glass",
  "button",
  "text",
  "input",
  "textarea",
  "label",
  "card",
  "badge",
  "avatar",
  "separator",
  "skeleton",
  "spinner",
  "progress",
  "switch",
  "slider",
  "search-field",
  "checkbox",
  "radio-group",
  "select",
  "tabs",
  "segmented-control",
  "tab-bar",
  "accordion",
  "dialog",
  "alert-dialog",
  "popover",
  "dropdown-menu",
  "menu",
  "tooltip",
  "sonner",
  "table",
  "sidebar",
  "scroll-area",
  // Wave 2
  "button-group",
  "toggle",
  "input-group",
  "field",
  "form",
  "combobox",
  "calendar",
  "chart",
  "empty",
  "item",
  "hover-card",
  "context-menu",
  "drawer",
  "sheet",
  "toast",
  "breadcrumb",
  "navigation-menu",
  "pagination",
  "collapsible",
  "data-table",
  "native-select",
  // Wave 3
  "toggle-group",
  "input-otp",
  "command",
  "carousel",
  "aspect-ratio",
  "kbd",
  "code-block",
  "marker",
  "menubar",
  "resizable",
  "message",
  "bubble",
  "message-scroller",
  "attachment",
  "questionnaire",
  "trace",
  "direction",
];

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
  // Check local monorepo registry if present
  const possiblePaths = [
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
