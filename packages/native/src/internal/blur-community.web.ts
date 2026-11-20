// Web: the community blur has no web build, so it is never loaded and never
// resolved by Metro. `expo-blur` covers the web fallback through CSS blur.

/** Always null on web. */
export function loadCommunityBlurView(): any | null {
  return null;
}
