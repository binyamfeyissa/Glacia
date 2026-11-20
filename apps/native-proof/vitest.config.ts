import { defineConfig } from "vitest/config";
import path from "node:path";

// The web smoke check: mount every component with react-native-web standing in
// for react-native. React Native Web renders RN primitives as DOM, so a
// component that emitted a raw DOM element or an RN-incompatible prop fails
// here — the same class of defect the audit found.
//
// The package resolves React Native at runtime through `require`, so the alias
// has to apply to CommonJS resolution as well as ESM imports. Vitest's
// `server.deps.inline` plus a module-level alias for both do that.
export default defineConfig({
  resolve: {
    alias: [
      { find: /^react-native$/, replacement: path.resolve(__dirname, "node_modules/react-native-web") },
      { find: /^glacia-native$/, replacement: path.resolve(__dirname, "../../packages/native/src/index.ts") },
      { find: /^glacia-tokens$/, replacement: path.resolve(__dirname, "../../packages/tokens/src/index.ts") },
      // One React, as a peer dependency gives a real app.
      { find: /^react$/, replacement: path.resolve(__dirname, "node_modules/react") },
    ],
    extensions: [".web.tsx", ".web.ts", ".tsx", ".ts", ".jsx", ".js", ".json"],
  },
  define: {
    // `require` inside the package's resolver must see the alias above; in the
    // vitest module graph that means node's require, so point it at a shim that
    // maps react-native onto react-native-web.
    "process.env.GLACIA_SMOKE": '"1"',
  },
  test: {
    environment: "jsdom",
    include: ["smoke/**/*.test.tsx"],
    setupFiles: [path.resolve(__dirname, "smoke/setup-require.ts")],
    server: {
      deps: {
        inline: [/packages\/native/],
      },
    },
  },
});
