import * as React from "react";
import { memo, useId, useRef } from "react";
import { StyleSheet, View } from "react-native";

import { COMPONENT_NAMES } from "../../constants";
import { GlassStackProviderContext } from "../../context";
import type {
  ILiquidGlassStackLayerProps,
  ILiquidGlassStackProps,
} from "../../interfaces";
import { devWarnOnce } from "../../utils";
import { LiquidGlassProvider } from "../LiquidGlassProvider";

/**
 * A marker, not a wrapper: `LiquidGlassStack` reads props straight off its `Layer` elements and
 * builds the real tree itself, so this render body only runs when a `Layer` is mounted somewhere
 * other than directly under a stack — which gets a dev warning and a plain pass-through view.
 */
const LiquidGlassStackLayer: React.FC<ILiquidGlassStackLayerProps> = ({
  children,
  style,
}: ILiquidGlassStackLayerProps): React.ReactNode & React.ReactElement => {
  devWarnOnce(
    "stack-layer-standalone",
    "A <LiquidGlassStack.Layer> rendered outside a <LiquidGlassStack>. Layers only mean " +
      "something as direct children of a stack; this one is a plain view.",
  );
  return (
    <View pointerEvents="box-none" style={style}>
      {children}
    </View>
  );
};

LiquidGlassStackLayer.displayName = `${COMPONENT_NAMES.LIQUID_GLASS_STACK}.Layer`;

/**
 * Declarative stacked glass — glass that refracts other glass.
 *
 * Layers go bottom to top. Glass inside layer *k* automatically reads a backdrop containing
 * everything below it, **including lower layers' finished glass** — a sheet over a glass pill
 * shows the pill's frost, rim and refraction re-refracted through its own lens:
 *
 * ```tsx
 * <LiquidGlassStack style={{ flex: 1 }}>
 *   <LiquidGlassStack.Layer>
 *     <ScrollView>{…}</ScrollView>
 *   </LiquidGlassStack.Layer>
 *   <LiquidGlassStack.Layer>
 *     <GlassPill />               // LiquidGlassView inside — no providerId needed
 *   </LiquidGlassStack.Layer>
 *   <LiquidGlassStack.Layer>
 *     {open && <GlassSheet />}    // toggle content INSIDE a layer, not the layer itself
 *   </LiquidGlassStack.Layer>
 * </LiquidGlassStack>
 * ```
 *
 * Each layer boundary expands to a nested `LiquidGlassProvider` with an auto-generated id
 * (internal — do not pair against it by hand), delivered to descendant glass views through
 * context, so reusable glass components need no `providerId` prop. N layers cost N−1 providers,
 * and every level re-records everything below it whenever that content changes — two or three
 * layers is the sane budget.
 *
 * **Keep the layer list static.** Adding or removing a `Layer` changes the nesting depth and
 * remounts every layer below it (scroll positions, video, local state). Mount and unmount
 * *content inside* a layer instead — an empty layer slot is cheap. Dev builds warn when the
 * count changes, and log the stacked topology once at INFO (`Stacked glass: …`) — that line is
 * this component working as designed.
 *
 * On iOS and web this renders plain views and the glass samples the window as always — no
 * platform branches needed.
 */
const LiquidGlassStackBase: React.FC<ILiquidGlassStackProps> = ({
  children,
  style,
}: ILiquidGlassStackProps): React.ReactNode & React.ReactElement => {
  const uid = useId();

  const layers: ILiquidGlassStackLayerProps[] = [];
  for (const child of React.Children.toArray(children)) {
    if (React.isValidElement(child) && child.type === LiquidGlassStackLayer) {
      layers.push(child.props as ILiquidGlassStackLayerProps);
    } else if (React.isValidElement(child) || child != null) {
      // A bare child is a layer without the marker. It is wrapped rather than
      // dropped: silently losing a layer is what makes a stack look like the
      // bug it is trying to avoid.
      devWarnOnce(
        "stack-non-layer-child",
        "A direct child of <LiquidGlassStack> is not a <LiquidGlassStack.Layer>; it is wrapped " +
          "in one, bottom to top. Prefer an explicit Layer — including conditional ones: put the " +
          "condition inside a Layer that always mounts.",
      );
      layers.push({ children: child as React.ReactNode });
    }
  }

  const layerCount = useRef(layers.length);
  if (layerCount.current !== layers.length) {
    devWarnOnce(
      `stack-layer-count:${uid}`,
      `A <LiquidGlassStack> went from ${layerCount.current} to ${layers.length} layers. That ` +
        "changes the nesting depth and remounts every layer below the change — toggle content " +
        "inside a static Layer instead.",
    );
    layerCount.current = layers.length;
  }

  const base = layers[0];
  if (base === undefined) {
    return <View style={style} />;
  }

  // The provider recording everything below layer k is id(k - 1). Ids are per-instance and
  // internal; the registry only ever string-matches them.
  const providerIdFor = (k: number): string => `stack:${uid}:${k}`;

  // Built bottom-up. Every level is the *same* absolutely-positioned box inside the stack
  // root, with an explicit z-order, rather than a re-derived flex box:
  //
  //   - the base layer used to sit in `flex: 1` flow while every layer above it was an
  //     absolute overlay, so the base content was measured in a different box at every
  //     nesting depth. Layers with padding, insets or uneven heights (the lab's stack demo)
  //     then drew the same text once per depth, each copy at slightly different metrics —
  //     the smeared, overlapping layers from the device photos.
  //   - the flow box also let a layer overflow its parent, because nothing clipped it.
  //
  // Absolute boxes plus zIndex make each layer occupy the stack's box exactly once, in the
  // order given, so a layer can never be laid out twice. The stack therefore needs its own
  // size (a style with flex: 1 or a fixed height), which the README documents.
  let subtree: React.ReactElement = (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, styles.layer, base.style, { zIndex: 0 }]}
    >
      {base.children}
    </View>
  );
  for (let k = 1; k < layers.length; k++) {
    const layer = layers[k];
    if (layer === undefined) continue;
    subtree = (
      <View style={[StyleSheet.absoluteFill, styles.layer, { zIndex: k }]}>
        <LiquidGlassProvider
          providerId={providerIdFor(k - 1)}
          style={StyleSheet.absoluteFill}
        >
          {subtree}
        </LiquidGlassProvider>
        <View
          pointerEvents="box-none"
          style={[StyleSheet.absoluteFill, layer.style]}
        >
          <GlassStackProviderContext.Provider value={providerIdFor(k - 1)}>
            {layer.children}
          </GlassStackProviderContext.Provider>
        </View>
      </View>
    );
  }

  return <View style={[styles.root, style]}>{subtree}</View>;
};

LiquidGlassStackBase.displayName = `${COMPONENT_NAMES.LIQUID_GLASS_STACK}Base`;

type TLiquidGlassStackComponent = React.NamedExoticComponent<ILiquidGlassStackProps> & {
  Layer: React.FC<ILiquidGlassStackLayerProps>;
};

const LiquidGlassStack: TLiquidGlassStackComponent = Object.assign(
  memo<ILiquidGlassStackProps>(LiquidGlassStackBase),
  { Layer: LiquidGlassStackLayer },
);

LiquidGlassStack.displayName = COMPONENT_NAMES.LIQUID_GLASS_STACK;

const styles = StyleSheet.create({
  // The stack must own a box (flex: 1 or a fixed size) now that its layers are absolute;
  // `overflow: hidden` keeps a rounded stack from spilling a layer's glass outside it.
  root: { flex: 1, overflow: "hidden" },
  layer: { overflow: "visible" },
});

export { LiquidGlassStack };
