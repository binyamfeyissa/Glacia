import { Children, forwardRef, isValidElement } from "react";
import type { ComponentType, ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { defaultRouter } from "./internal/glass-routing";
import { primitives } from "./internal/primitives";

export interface GlassStackLayerProps {
  /** The layer's content. */
  children?: ReactNode;
  /** The layer's own layout. Layers all share the stack's box; this insets or pads inside it. */
  style?: StyleProp<ViewStyle>;
  /** Passed through so a layer is findable in tests and on-device inspectors. */
  testID?: string;
  [prop: string]: any;
}

/**
 * A marker, not a wrapper. `GlassStack` reads the layer props off these elements
 * and builds the real (provider-nested) tree itself, so a bare `Layer` renders
 * its content in a plain view.
 */
const GlassStackLayer = ({ children, style, ...props }: GlassStackLayerProps) => {
  const { View } = primitives();
  return (
    <View pointerEvents="box-none" style={style} {...props}>
      {children}
    </View>
  );
};
GlassStackLayer.displayName = "GlassStack.Layer";

export interface GlassStackProps {
  /** The layers, bottom to top. Bare children are treated as layers of their own. */
  children?: ReactNode;
  /**
   * The stack's box. Layers are absolute, so the stack must own a size — pass
   * `flex: 1` or a fixed height. Defaults to `flex: 1`.
   */
  style?: StyleProp<ViewStyle>;
  /** Passed to the underlying stack so tests can find it. */
  testID?: string;
}

/**
 * Declarative stacked glass — glass that refracts other glass.
 *
 * Layers go bottom to top. Glass inside layer *k* automatically reads a backdrop
 * containing everything below it, including lower layers' finished glass, so a
 * sheet over a glass pill shows the pill's frost re-refracted through its own
 * lens. Layers are direct children of the stack; mount and unmount *content
 * inside* a layer rather than the layer list itself.
 *
 * Every layer occupies the stack's box once, at an explicit z-order — the fix
 * for the smeared, overlapping layers in the lab demo (§7.2). Below every glass
 * tier the layers still render, as plain views, so a stack is never blank.
 */
const GlassStackBase = forwardRef<any, GlassStackProps>(function GlassStack(
  { children, style, testID }: GlassStackProps,
  ref: any,
) {
  const decision = defaultRouter();
  const Stack = decision.LiquidGlassStack;

  const all = Children.toArray(children);
  const layers = all.map((child) =>
    isValidElement(child) && child.type === GlassStackLayer
      ? (child.props as GlassStackLayerProps)
      : ({ children: child } as GlassStackLayerProps),
  );

  // Without a stack there is nothing to build; render the layers as plain
  // views in order, so the content is visible rather than dropped.
  if (!Stack) {
    const { View } = primitives();
    return (
      <View ref={ref} testID={testID} style={style}>
        {layers.map((layer, index) => (
          <View key={index} pointerEvents="box-none" style={layer.style}>
            {layer.children}
          </View>
        ))}
      </View>
    );
  }

  // The engine's stack reads its layers off elements typed as its own Layer
  // component. Glacia's markers are translated into those, and bare children are
  // wrapped here too, so the engine never sees a child it would drop.
  const EngineLayer = (Stack as any).Layer as ComponentType<any> | undefined;
  const engineLayers = EngineLayer
    ? layers.map((layer, index) => (
        <EngineLayer key={index} style={layer.style}>
          {layer.children}
        </EngineLayer>
      ))
    : (layers.map((layer) => layer.children) as ReactNode[]);

  return (
    <Stack ref={ref} style={style} testID={testID}>
      {engineLayers}
    </Stack>
  );
});

/**
 * The stacked-glass primitive. Renders the engine's stack, which builds the
 * nested provider topology for its layers; below every glass tier it renders
 * the plain layer views.
 */
export const GlassStack = Object.assign(GlassStackBase, {
  Layer: GlassStackLayer,
}) as typeof GlassStackBase & { Layer: typeof GlassStackLayer };

GlassStack.displayName = "GlassStack";
