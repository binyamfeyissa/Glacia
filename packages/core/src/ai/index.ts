// AI components.
//
// These cover the pieces of a model-driven interface: streaming a response,
// showing what the model is doing, citing what it used, composing a prompt,
// and surfacing background work. Decorative animation always carries a text
// equivalent and honours prefers-reduced-motion.

export {
  Shimmer,
  ThinkingOrb,
  Plan,
  Sources,
  Response,
  Soundwave,
  Task,
  Panelside,
  AIInput,
  ImageGeneration,
  type PlanStep,
  type PlanProps,
  type Source,
  type SourcesProps,
  type TaskProgress,
  type AIPanelNavItem,
  type AIInputProps,
  type GeneratedImage,
} from "./ai-primitives";
