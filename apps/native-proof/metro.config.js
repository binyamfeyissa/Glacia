// The proof app bundles glacia-native the way a published consumer does.
//
// The workspace links packages/native by source. That package's own
// node_modules still holds a dev copy of react-native for its unit tests, and
// Metro's hierarchical lookup finds it before this app's Expo-pinned copy —
// then fails to parse its sources. A published consumer has exactly one copy
// of each package, so the library's nested copies are excluded here.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const libraryNodeModules = path.resolve(__dirname, "../../packages/native/node_modules");
// The library's copies are pnpm symlinks, so block the real path each one
// resolves to; blocking the symlink path alone never matches.
const shadowed = ["react-native", "react", "react-native-svg"].map((name) => {
  const link = path.join(libraryNodeModules, name);
  const fs = require("fs");
  try {
    return fs.realpathSync(link);
  } catch {
    return link;
  }
});

// Keep Expo's own hierarchical lookup (pnpm nests real packages), but never
// resolve these three from inside the library.
const existing = config.resolver.blockList;
const existingList = Array.isArray(existing) ? existing : existing ? [existing] : [];
config.resolver.blockList = [
  ...existingList,
  ...shadowed.map((target) => new RegExp(`^${target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/`)),
];

module.exports = config;
