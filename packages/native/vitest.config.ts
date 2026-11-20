import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: [
      // The tokens package is published built; in the monorepo the source is
      // what the tests run against, so a fresh clone needs no build step.
      { find: /^glacia-tokens$/, replacement: path.resolve(__dirname, "../tokens/src/index.ts") },
    ],
  },
  test: {
    environment: "jsdom",
  },
});
