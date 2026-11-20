// A visible failure boundary.
//
// The proof app's rule is that a component which throws is shown, labelled with
// its own name and the error message — never dropped or silently replaced by a
// lookalike. That is what makes the Controls tab an honest device report.

import { Component, type ErrorInfo, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Props {
  name: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ComponentProbe extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // The device build has no console to read, so the message also stays on
    // screen in the probe below.
    console.warn(`[proof] ${this.props.name} failed`, error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.failed}>
          <Text style={styles.name}>{this.props.name}</Text>
          <Text style={styles.message}>{this.state.error.message}</Text>
          <Text style={styles.hint}>tag: {this.state.error.name}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  failed: {
    borderWidth: 1,
    borderColor: "#FF3B30",
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  name: { fontSize: 14, fontWeight: "700", color: "#FF3B30" },
  message: { fontSize: 12, color: "#7F1D1D" },
  hint: { fontSize: 11, color: "#9CA3AF" },
});
