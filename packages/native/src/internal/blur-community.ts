// The bare-React-Native blur backend, isolated so platform resolution can
// choose whether this file exists at all.
//
// `@react-native-community/blur` ships BlurView.ios.js / BlurView.android.js
// with no web build, so a web bundle that statically requires it fails to
// resolve `./components/BlurView`. Metro uses `blur-community.web.ts` for the
// web platform instead, and this module is only ever bundled natively.

declare const require: any;

/** The community `BlurView`, or null when the package is not installed. */
export function loadCommunityBlurView(): any | null {
  try {
    const community = require("@react-native-community/blur");
    return community?.BlurView ?? null;
  } catch {
    return null;
  }
}
