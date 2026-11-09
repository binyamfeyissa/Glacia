# Glacia Native Example

Demonstrates the 7 React Native Liquid Glass components:
1. Glass
2. Button
3. Switch
4. Slider
5. SegmentedControl
6. TabBar
7. Card

## Platform Fallback Ladder

- **iOS 26+:** Real `UIGlassEffect` powered by `@callstack/liquid-glass`. Requires Xcode 26+ and React Native 0.80+ with New Architecture.
- **iOS < 26 & Android:** Translucent tint + soft edge boundary with identical layout and zero shifts.
- **Expo Go:** Fallback translucent view with warning. For real glass on physical devices, use EAS Build or a development build (`npx expo run:ios`).
