import type { ComponentType } from "react";
import type { ViewProps } from "react-native";

import { NATIVE_MODULE_NAME } from "../constants";
import { requireNativeViewOnce } from "../utils";

/**
 * The iOS backdrop scope for the Metal tier.
 *
 * Glass inside this view photographs the scroll content in content coordinates instead of
 * photographing the window, so a pane dragged over a list keeps reading the right rows. It is a
 * scope, not a surface: it draws nothing, lays out nothing of its own, and is a no-op on tiers
 * that do not need it. The Android tier's equivalent is `LiquidGlassProviderView`; this exists
 * because the iOS renderer needed the same contract and had no provider.
 */
export type IGlassBackdropViewProps = ViewProps;

const NativeGlassBackdropView: ComponentType<IGlassBackdropViewProps> =
  requireNativeViewOnce<IGlassBackdropViewProps>(
    NATIVE_MODULE_NAME,
    "GlassBackdropView",
  );

export { NativeGlassBackdropView };
