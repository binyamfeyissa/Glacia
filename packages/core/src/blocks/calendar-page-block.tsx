import { BlockBackdrop } from "../internal/block-backdrop";
import * as React from "react";
import { Glass } from "../glass";
import { Button } from "../button";
import { SegmentedControl } from "../segmented-control";
import { Calendar } from "../calendar";
import { Badge } from "../badge";

export interface CalendarPageBlockProps {
  /** Backdrop image behind the block. */
  image?: string;
}

export function CalendarPageBlock({ image }: CalendarPageBlockProps) {
  const [view, setView] = React.useState("month");
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  const events = [
    { id: 1, title: "Design Review", time: "10:00 AM", color: "#007aff", category: "Work", day: 12 },
    { id: 2, title: "Liquid Glass Keynote", time: "1:30 PM", color: "#af52de", category: "Glacia", day: 15 },
    { id: 3, title: "Team Lunch", time: "12:00 PM", color: "#34c759", category: "Personal", day: 15 },
    { id: 4, title: "Release 1.0 Tag", time: "4:00 PM", color: "#ff9500", category: "Glacia", day: 22 },
  ];

  return (
    <BlockBackdrop image={image}>
    <div className="gl-calendar-page-block">
      {/* Sidebar */}
      <Glass className="gl-cal-sidebar">
        <div className="gl-cal-sidebar-header">
          <h2 className="gl-cal-sidebar-title">Calendar</h2>
          <Button size="sm" variant="glass" className="gl-cal-add-btn">
            + New
          </Button>
        </div>

        <div className="gl-cal-mini-picker">
          <Calendar selected={selectedDate} onSelect={setSelectedDate} />
        </div>

        <div className="gl-cal-categories">
          <span className="gl-cal-cat-header">My Calendars</span>
          <div className="gl-cal-cat-item">
            <span className="gl-cal-color-dot" style={{ backgroundColor: "#007aff" }} />
            <span className="gl-cal-cat-name">Work</span>
          </div>
          <div className="gl-cal-cat-item">
            <span className="gl-cal-color-dot" style={{ backgroundColor: "#af52de" }} />
            <span className="gl-cal-cat-name">Glacia Project</span>
          </div>
          <div className="gl-cal-cat-item">
            <span className="gl-cal-color-dot" style={{ backgroundColor: "#34c759" }} />
            <span className="gl-cal-cat-name">Personal</span>
          </div>
        </div>

        <div className="gl-cal-upcoming">
          <span className="gl-cal-cat-header">Upcoming Agenda</span>
          {events.map((evt) => (
            <div key={evt.id} className="gl-cal-upcoming-item">
              <span className="gl-cal-upcoming-bar" style={{ backgroundColor: evt.color }} />
              <div className="gl-cal-upcoming-meta">
                <span className="gl-cal-upcoming-title">{evt.title}</span>
                <span className="gl-cal-upcoming-time">{evt.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Glass>

      {/* Main Calendar View */}
      <div className="gl-cal-main">
        <Glass className="gl-cal-toolbar">
          <div className="gl-cal-toolbar-left">
            <Button size="sm" variant="glass">Today</Button>
            <div className="gl-cal-nav-arrows">
              <Button size="sm" variant="glass" aria-label="Previous month">‹</Button>
              <Button size="sm" variant="glass" aria-label="Next month">›</Button>
            </div>
            <span className="gl-cal-current-month">November 2026</span>
          </div>

          <div className="gl-cal-toolbar-right">
            <SegmentedControl
              items={[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" },
              ]}
              value={view}
              onValueChange={setView}
            />
          </div>
        </Glass>

        {/* 7-column Grid */}
        <Glass className="gl-cal-grid-view">
          <div className="gl-cal-weekdays">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="gl-cal-weekday-col">{day}</div>
            ))}
          </div>

          <div className="gl-cal-days-grid">
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 2;
              const isCurrentMonth = dayNum >= 1 && dayNum <= 30;
              const isToday = dayNum === 9;
              const dayEvents = events.filter((e) => e.day === dayNum);

              return (
                <div
                  key={i}
                  className={`gl-cal-day-cell ${!isCurrentMonth ? "gl-other-month" : ""} ${isToday ? "gl-is-today" : ""}`}
                >
                  <span className={`gl-cal-day-number ${isToday ? "gl-today-badge" : ""}`}>
                    {isCurrentMonth ? dayNum : dayNum < 1 ? 31 + dayNum : dayNum - 30}
                  </span>
                  <div className="gl-cal-cell-events">
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className="gl-cal-event-pill gl-glass"
                        style={{ borderLeftColor: evt.color }}
                      >
                        <span className="gl-cal-event-title">{evt.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Glass>
      </div>
    </div>
    </BlockBackdrop>
  );
}
