// Makes the package's runtime resolution see react-native-web.
//
// glacia-native deliberately never imports react-native statically: it calls
// `require("react-native")` at runtime so the package stays importable where
// React Native is absent. Vite's alias only rewrites ESM imports, so this
// shim teaches Node's CommonJS resolution the same mapping for the check.

import { createRequire } from "node:module";
import path from "node:path";
import Module from "node:module";

const realRequire = createRequire(path.join(__dirname, "..", "package.json"));
const rnWeb = realRequire.resolve("react-native-web");
// React is a peer dependency of glacia-native, so a real app has one copy. The
// workspace links the package by source, where its own dev React would be
// found instead, giving two Reacts and a null `useState`. Pin one.
const reactEntry = realRequire.resolve("react");
const reactJsxRuntime = realRequire.resolve("react/jsx-runtime");

const originalResolve = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function patchedResolve(
  request: string,
  ...rest: any[]
) {
  if (request === "react-native") return rnWeb;
  if (request === "react" || request === "react/jsx-runtime") {
    return request === "react" ? reactEntry : reactJsxRuntime;
  }
  return originalResolve.call(this, request, ...rest);
};
