# Glacia Native Example

A minimal app showing the core controls. The full 49-component proof app lives
in `apps/native-proof`, which bundles for Android, iOS and web and mounts every
component.

Shown here:
1. Glass
2. Button
3. Switch
4. Slider
5. SegmentedControl
6. TabBar
7. Card

## The platform rule

Every component renders the same layout and API on every platform. Only the
glass material changes:

- **iOS 26+:** Apple's real `UIGlassEffect` through `@callstack/liquid-glass`
  (`LiquidGlassView`). The content inside — labels, icons, layout, behaviour —
  is Glacia's own.
- **iOS < 26, Android, Expo Go:** the same component on Glacia's own React
  Native primitives, with the glass replaced by Glacia's translucent fallback
  of identical shape. No layout shift.

No stock platform control is ever swapped in: the Switch, Slider, Segmented
Control, TabBar and Tabs are all built from `View`, `Text` and `Pressable`, so
the control is the same everywhere. Real glass on a device requires a
development build or EAS Build (`npx expo run:ios`); Expo Go cannot load a
native module.
