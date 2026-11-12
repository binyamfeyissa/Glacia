import { useEffect, useState, type ReactNode } from "react";

import { colors, radii } from "./internal/tokens";
import { primitives } from "./charts/primitives";

export interface NativePlanStep {
  id: string;
  title: string;
  detail?: string;
  status: "pending" | "running" | "done" | "failed";
}

export interface NativePlanProps {
  title?: string;
  steps: NativePlanStep[];
  isDark?: boolean;
  style?: any;
}

/**
 * The ordered steps a model intends to take.
 *
 * Each step carries its own status, so a half-finished plan is legible instead
 * of appearing blank until the whole thing completes.
 */
export function NativePlan({ title = "Plan", steps, isDark = false, style }: NativePlanProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text } = primitives();
  const done = steps.filter((step) => step.status === "done").length;

  const markerColor = (status: NativePlanStep["status"]) =>
    status === "done"
      ? "#34c759"
      : status === "failed"
        ? theme.destructive
        : status === "running"
          ? theme.fill
          : theme.muted;

  return (
    <View style={style}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: "600", color: theme.foreground }}>{title}</Text>
        <Text style={{ fontSize: 11, color: theme.muted }}>
          {done}/{steps.length}
        </Text>
      </View>

      {steps.map((step) => (
        <View
          key={step.id}
          accessibilityRole="text"
          accessibilityLabel={`${step.title}: ${step.status}`}
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 9, marginBottom: 8 }}
        >
          <View
            style={{
              width: 16,
              height: 16,
              borderRadius: 8,
              borderWidth: step.status === "pending" ? 1.5 : 0,
              borderColor: theme.edge,
              backgroundColor: step.status === "pending" ? "transparent" : markerColor(step.status),
              alignItems: "center",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            {step.status !== "pending" && (
              <Text style={{ fontSize: 9, color: "#fff", fontWeight: "700" }}>
                {step.status === "done" ? "✓" : step.status === "failed" ? "!" : "•"}
              </Text>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 13,
                color: step.status === "pending" ? theme.muted : theme.foreground,
              }}
            >
              {step.title}
            </Text>
            {step.detail && (
              <Text style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>{step.detail}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

export interface NativeSource {
  id: string;
  title: string;
  url: string;
  snippet?: string;
  domain?: string;
}

export interface NativeSourcesProps {
  sources: NativeSource[];
  title?: string;
  isDark?: boolean;
  style?: any;
  onSourcePress?: (source: NativeSource) => void;
}

/**
 * Citations behind an answer, so a claim can be traced to its origin.
 *
 * Native has no anchor element, so a row hands the source to the caller's
 * `onSourcePress` instead of opening a browser the component cannot control.
 */
export function NativeSources({
  sources,
  title = "Sources",
  isDark = false,
  style,
  onSourcePress,
}: NativeSourcesProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();

  if (sources.length === 0) return null;

  return (
    <View style={style}>
      <Text style={{ fontSize: 11, fontWeight: "600", color: theme.muted, marginBottom: 6 }}>
        {title}
      </Text>

      {sources.map((source, index) => (
        <Pressable
          key={source.id}
          accessibilityRole="link"
          accessibilityLabel={source.title}
          onPress={() => onSourcePress?.(source)}
          style={{
            flexDirection: "row",
            gap: 9,
            paddingVertical: 7,
            paddingHorizontal: 10,
            borderRadius: radii.md,
            borderWidth: 1,
            borderColor: theme.edge,
            marginBottom: 6,
          }}
        >
          <Text style={{ fontSize: 10, color: theme.muted, marginTop: 1 }}>{index + 1}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: theme.foreground, fontWeight: "500" }}>
              {source.title}
            </Text>
            {source.snippet && (
              <Text style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>
                {source.snippet}
              </Text>
            )}
            {source.domain && (
              <Text style={{ fontSize: 10, color: theme.muted, marginTop: 3 }}>
                {source.domain}
              </Text>
            )}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

export interface NativeResponseProps {
  text: string;
  /** Characters to reveal. Omit to show the whole string. */
  revealed?: number;
  streaming?: boolean;
  isDark?: boolean;
  style?: any;
}

/**
 * Text revealed progressively as a streamed answer arrives.
 *
 * The caller owns the streaming clock (usually a network stream); this only
 * renders the first `revealed` characters and shows a caret while incomplete.
 */
export function NativeResponse({
  text,
  revealed,
  streaming,
  isDark = false,
  style,
}: NativeResponseProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text } = primitives();

  const shown = revealed == null ? text : text.slice(0, Math.max(0, revealed));
  const isStreaming = streaming ?? (revealed != null && revealed < text.length);

  return (
    <View style={style}>
      <Text
        accessibilityRole="text"
        accessibilityLabel={shown}
        style={{ fontSize: 14, lineHeight: 21, color: theme.foreground }}
      >
        {shown}
        {isStreaming ? "▍" : ""}
      </Text>
      {/* Announced as a status so screen readers know it is still arriving. */}
      <Text accessibilityRole="alert" style={{ height: 0, opacity: 0, fontSize: 0 }}>
        {isStreaming ? "Response streaming" : "Response complete"}
      </Text>
    </View>
  );
}

export interface NativeTaskProps {
  task: {
    /** 0–1, or omit for an indeterminate task. */
    progress?: number;
    label?: string;
    detail?: string;
    status?: "running" | "done" | "failed" | "queued";
  };
  isDark?: boolean;
  style?: any;
}

/** Progress of a long-running background task. */
export function NativeTask({ task, isDark = false, style }: NativeTaskProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text } = primitives();

  const percent =
    task.progress == null ? null : Math.round(Math.min(1, Math.max(0, task.progress)) * 100);
  const status = task.status ?? "running";
  const fillColor =
    status === "failed" ? theme.destructive : status === "done" ? "#34c759" : theme.fill;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={task.label ?? "Task progress"}
      accessibilityState={{
        disabled: false,
      }}
      style={style}
    >
      <View
        style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}
      >
        <Text style={{ fontSize: 12, fontWeight: "500", color: theme.foreground }}>
          {task.label ?? "Task"}
        </Text>
        <Text style={{ fontSize: 11, color: theme.muted }}>
          {percent == null ? "…" : `${percent}%`}
        </Text>
      </View>

      <View
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: isDark ? "rgba(235,235,245,0.15)" : "rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            // An indeterminate task fills partially rather than pretending 0%.
            width: percent == null ? "35%" : `${percent}%`,
            height: "100%",
            borderRadius: 3,
            backgroundColor: fillColor,
            opacity: percent == null ? 0.6 : 1,
          }}
        />
      </View>

      {task.detail && (
        <Text style={{ fontSize: 11, color: theme.muted, marginTop: 6 }}>{task.detail}</Text>
      )}
    </View>
  );
}

export interface NativeSoundwaveProps {
  levels?: number[];
  bars?: number;
  active?: boolean;
  height?: number;
  color?: string;
  isDark?: boolean;
  style?: any;
  label?: string;
}

/**
 * A waveform driven by real amplitude.
 *
 * Bars follow `levels` when supplied, so it can show live microphone input.
 * Without levels it rests at a low, static profile instead of animating:
 * continuous motion with no audio behind it would be decorative noise.
 */
export function NativeSoundwave({
  levels,
  bars = 28,
  active = true,
  height = 40,
  color,
  isDark = false,
  style,
  label = "Audio level",
}: NativeSoundwaveProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View } = primitives();

  const count = levels?.length || bars;
  const tint = color ?? theme.foreground;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={label}
      style={{ flexDirection: "row", alignItems: "center", gap: 2, height, ...style }}
    >
      {Array.from({ length: count }, (_, i) => {
        const level = levels ? levels[i] ?? 0 : 0;
        // Idle bars taper at the edges so the shape still reads as a wave.
        const idle = 0.12 + Math.sin((i / count) * Math.PI) * 0.1;
        const scale = Math.max(0.06, Math.min(1, active && levels ? level : idle));
        return (
          <View
            key={i}
            style={{
              width: 3,
              height: height * scale,
              borderRadius: 2,
              backgroundColor: tint,
              opacity: active ? 0.85 : 0.35,
            }}
          />
        );
      })}
    </View>
  );
}

export interface NativeThinkingOrbProps {
  label?: string;
  size?: number;
  paused?: boolean;
  isDark?: boolean;
  style?: any;
}

/**
 * A pulsing indicator shown while a model is working.
 *
 * Purely decorative, so it is hidden from screen readers and the label is
 * exposed as text instead of relying on the motion being perceived.
 */
export function NativeThinkingOrb({
  label = "Thinking",
  size = 22,
  paused = false,
  isDark = false,
  style,
}: NativeThinkingOrbProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text } = primitives();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setTick((value) => value + 1), 700);
    return () => clearInterval(timer);
  }, [paused]);

  const scale = paused ? 1 : [1, 1.12, 1][tick % 3]!;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={label}
      style={{ flexDirection: "row", alignItems: "center", gap: 8, ...style }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.fill,
          opacity: paused ? 0.5 : 0.85,
          transform: [{ scale }],
        }}
      />
      <Text style={{ fontSize: 12, color: theme.muted }}>{label}</Text>
    </View>
  );
}

export interface NativePanelNavItem {
  id: string;
  label: string;
  count?: number;
}

export interface NativePanelsideProps {
  items: NativePanelNavItem[];
  value?: string;
  onValueChange?: (id: string) => void;
  isDark?: boolean;
  style?: any;
  title?: string;
}

/**
 * A rail for an AI workspace: conversations, saved prompts or tasks.
 *
 * Selection is a press rather than navigation because the panel's content is
 * client state; the caller decides what a selection means.
 */
export function NativePanelside({
  items,
  value,
  onValueChange,
  isDark = false,
  style,
  title,
}: NativePanelsideProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Pressable } = primitives();

  return (
    <View style={style}>
      {title && (
        <Text style={{ fontSize: 11, fontWeight: "600", color: theme.muted, marginBottom: 6 }}>
          {title}
        </Text>
      )}

      {items.map((item) => {
        const isActive = item.id === value;
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={item.label}
            onPress={() => onValueChange?.(item.id)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 9,
              paddingHorizontal: 11,
              borderRadius: radii.md,
              backgroundColor: isActive ? theme.glassActive : "transparent",
              marginBottom: 2,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                color: isActive ? theme.foreground : theme.muted,
                fontWeight: isActive ? "600" : "400",
              }}
            >
              {item.label}
            </Text>
            {item.count != null && (
              <Text style={{ fontSize: 10, color: theme.muted }}>{item.count}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

export interface NativeAIInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  disabled?: boolean;
  /** Shown as a spinner-free label while a response is pending. */
  busy?: boolean;
  sendLabel?: string;
  isDark?: boolean;
  style?: any;
  footer?: ReactNode;
}

/**
 * The composer for an AI conversation.
 *
 * Send stays disabled until there is non-whitespace to send, which is the rule
 * that prevents empty submissions rather than a validation message afterwards.
 */
export function NativeAIInput({
  value = "",
  onChangeText,
  onSubmit,
  placeholder = "Ask anything",
  disabled = false,
  busy = false,
  sendLabel = "Send",
  isDark = false,
  style,
  footer,
}: NativeAIInputProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, TextInput, Pressable } = primitives();

  const canSend = !disabled && !busy && value.trim().length > 0;

  return (
    <View style={style}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: 8,
          padding: 8,
          borderRadius: radii.lg,
          borderWidth: 1,
          borderColor: theme.edge,
          backgroundColor: theme.glass,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          editable={!disabled}
          multiline
          numberOfLines={3}
          accessibilityLabel={placeholder}
          style={{
            flex: 1,
            minHeight: 34,
            maxHeight: 120,
            paddingHorizontal: 6,
            paddingVertical: 7,
            fontSize: 14,
            color: theme.foreground,
          }}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={sendLabel}
          accessibilityState={{ disabled: !canSend }}
          disabled={!canSend}
          onPress={() => canSend && onSubmit?.()}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: radii.pill,
            backgroundColor: canSend ? theme.fill : theme.edge,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "600", color: canSend ? "#fff" : theme.muted }}>
            {busy ? "…" : sendLabel}
          </Text>
        </Pressable>
      </View>

      {footer}
    </View>
  );
}

export interface NativeGeneratedImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  /** Shown under the image while generation is still running. */
  progress?: number;
}

export interface NativeImageGenerationProps {
  image?: NativeGeneratedImage;
  prompt?: string;
  status?: "queued" | "generating" | "done" | "failed";
  isDark?: boolean;
  style?: any;
}

/**
 * A generated image with its prompt and state.
 *
 * While generating, a placeholder with the same aspect ratio holds the space so
 * the layout does not jump when the image arrives.
 */
export function NativeImageGeneration({
  image,
  prompt,
  status = "queued",
  isDark = false,
  style,
}: NativeImageGenerationProps) {
  const theme = isDark ? colors.dark : colors.light;
  const { View, Text, Image } = primitives();

  const width = image?.width ?? 320;
  const height = image?.height ?? 200;
  const showImage = image && status === "done";

  return (
    <View style={style}>
      <View
        style={{
          width: "100%",
          aspectRatio: width / height,
          borderRadius: radii.md,
          overflow: "hidden",
          backgroundColor: isDark ? "rgba(235,235,245,0.08)" : "rgba(0,0,0,0.05)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {showImage ? (
          <Image
            source={{ uri: image.url }}
            accessibilityLabel={image.alt}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <Text style={{ fontSize: 12, color: theme.muted }}>
            {status === "failed" ? "Generation failed" : "Generating…"}
          </Text>
        )}
      </View>

      {prompt && (
        <Text style={{ fontSize: 11, color: theme.muted, marginTop: 6 }}>{prompt}</Text>
      )}
    </View>
  );
}
