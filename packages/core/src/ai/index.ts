// AI components.
//
// These cover the pieces of a model-driven interface: streaming a response,
// showing what the model is doing, composing a prompt, and surfacing
// background work. Decorative animation always carries a text equivalent and
// honours prefers-reduced-motion.

export {
  Shimmer,
  Plan,
  Response,
  Panelside,
  AIInput,
  type PlanStep,
  type PlanProps,
  type AIPanelNavItem,
  type AIInputProps,
} from "./ai-primitives";
