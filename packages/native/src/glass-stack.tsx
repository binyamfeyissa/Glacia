import { Children, forwardRef, isValidElement } from "react";
import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { defaultRouter } from "./internal/glass-routing";
import { primitives } from "./internal/primitives";

export interface GlassStackProps {
  /** The layers, bottom to top. */
  children?: ReactNode;
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
 */
const GlassStackBase = forwardRef<any, GlassStackProps>(function GlassStack(
  { children, style, testID }: GlassStackProps,
  ref: any,
) {
  const decision = defaultRouter();
  const Stack = decision.LiquidGlassStack;

  // Without a stack there is nothing to build; render the layers as plain views.
  if (!Stack) {
    const { View } = primitives();
    return <View ref={ref} testID={testID} style={style}>{children}</View>;
  }

  // The stack reads its layers off direct children typed as its own Layer
  // component; Glacia attaches that same component as `GlassStack.Layer`.
  const Layer = (Stack as any).Layer as React.ComponentType<any> | undefined;
  const layers = Layer
    ? Children.toArray(children).filter(
        (child) => !isValidElement(child) || child.type === Layer,
      )
    : Children.toArray(children);

  return (
    <Stack ref={ref} style={style} testID={testID}>
      {layers}
    </Stack>
  );
});

/**
 * The stacked-glass primitive. Renders the engine's stack, which builds the
 * nested provider topology for its layers; below every glass tier it renders the
 * plain layer views.
 */
export const GlassStack = Object.assign(
  GlassStackBase,
  { Layer: (defaultRouter().LiquidGlassStack as any)?.Layer },
) as typeof GlassStackBase & { Layer?: React.ComponentType<any> };

GlassStack.displayName = "GlassStack";
