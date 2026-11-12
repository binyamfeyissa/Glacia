import * as React from "react";

import { Glass } from "../glass";
import { Badge } from "../badge";

export interface ActivityEntry {
  id: string;
  /** Who or what did it. */
  actor: string;
  /** What they did, e.g. "approved the deploy". */
  action: string;
  /** When, already formatted. */
  time: string;
  /** Optional detail line. */
  detail?: string;
  /** Groups consecutive entries by day. */
  day: string;
  /** Tone of the entry's marker. */
  tone?: "neutral" | "positive" | "warning" | "danger";
  /** Initials or a short label for the avatar plate. */
  initials?: string;
}

export interface ActivityBlockProps {
  title?: string;
  summary?: string;
  entries: ActivityEntry[];
  /** Total count shown in the header; defaults to the entry count. */
  total?: number;
  className?: string;
}

const TONE_COLOR: Record<NonNullable<ActivityEntry["tone"]>, string> = {
  neutral: "var(--gl-chart-1, #0088ff)",
  positive: "var(--gl-chart-2, #34c759)",
  warning: "var(--gl-chart-3, #ff9f0a)",
  danger: "var(--gl-chart-4, #ff375f)",
};

/**
 * A chronological feed grouped by day.
 *
 * Grouping is the point: a flat list of timestamps makes the reader do the
 * date arithmetic, so entries carry a day and the block renders one heading
 * per day with a continuous rail between the markers.
 */
export function ActivityBlock({
  title = "Activity",
  summary,
  entries,
  total,
  className,
}: ActivityBlockProps) {
  const groups = React.useMemo(() => {
    const byDay = new Map<string, ActivityEntry[]>();
    for (const entry of entries) {
      const list = byDay.get(entry.day) ?? [];
      list.push(entry);
      byDay.set(entry.day, list);
    }
    return [...byDay.entries()];
  }, [entries]);

  return (
    <Glass className={["gl-activity-block", className].filter(Boolean).join(" ")}>
      <header className="gl-activity-head">
        <div>
          <h3 className="gl-activity-title">{title}</h3>
          {summary && <p className="gl-activity-summary">{summary}</p>}
        </div>
        <Badge variant="default">{total ?? entries.length} events</Badge>
      </header>

      {groups.length === 0 ? (
        <p className="gl-activity-empty">Nothing has happened yet.</p>
      ) : (
        <div className="gl-activity-groups">
          {groups.map(([day, dayEntries]) => (
            <section key={day} className="gl-activity-group">
              <h4 className="gl-activity-day">{day}</h4>
              <ol className="gl-activity-list">
                {dayEntries.map((entry) => {
                  const tone = entry.tone ?? "neutral";
                  return (
                    <li key={entry.id} className="gl-activity-row">
                      <span className="gl-activity-rail" aria-hidden>
                        <span
                          className="gl-activity-marker"
                          style={{ background: TONE_COLOR[tone] }}
                        />
                      </span>

                      <span className="gl-activity-avatar" aria-hidden>
                        {entry.initials ?? entry.actor.slice(0, 1).toUpperCase()}
                      </span>

                      <span className="gl-activity-copy">
                        <span className="gl-activity-line">
                          <strong>{entry.actor}</strong> {entry.action}
                        </span>
                        {entry.detail && <span className="gl-activity-detail">{entry.detail}</span>}
                      </span>

                      <span className="gl-activity-time">{entry.time}</span>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      )}
    </Glass>
  );
}
