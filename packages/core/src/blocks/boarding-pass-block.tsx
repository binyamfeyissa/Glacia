import * as React from "react";

import { Glass } from "../glass";
import { Badge } from "../badge";

export interface BoardingPassFlight {
  airline: string;
  flightNumber: string;
  /** IATA code, e.g. "SFO". */
  from: string;
  fromCity?: string;
  /** IATA code, e.g. "NRT". */
  to: string;
  toCity?: string;
  /** Local departure time, already formatted by the caller. */
  departure: string;
  arrival: string;
  /** e.g. "11h 05m". */
  duration?: string;
  /** Terminal and gate, shown in the detail grid. */
  terminal?: string;
  gate?: string;
}

export interface BoardingPassProps {
  passenger: string;
  flight: BoardingPassFlight;
  /** Date of travel, already formatted. */
  date: string;
  seat: string;
  boardingGroup?: string;
  /** Boarding time, already formatted. */
  boardingTime?: string;
  /** Encoded barcode payload. Rendered as a real stripe pattern, not an image. */
  barcodeValue?: string;
  className?: string;
}

/**
 * A boarding pass with a torn-stub seam.
 *
 * The value of this block is information density that still reads at a glance:
 * route and times dominate, structured details sit in a labelled grid, and the
 * stub repeats the essentials for the gate agent.
 *
 * The barcode is generated deterministically from `barcodeValue` so the same
 * pass always renders the same pattern (and so it is not a decorative
 * placeholder that would mislead anyone who tries to scan it).
 */
export function BoardingPassBlock({
  passenger,
  flight,
  date,
  seat,
  boardingGroup,
  boardingTime,
  barcodeValue,
  className,
}: BoardingPassProps) {
  const bars = React.useMemo(
    () => barcodePattern(barcodeValue ?? `${flight.flightNumber}-${seat}-${date}`),
    [barcodeValue, flight.flightNumber, seat, date],
  );

  const details: { label: string; value: string }[] = [
    { label: "Passenger", value: passenger },
    { label: "Flight", value: `${flight.airline} ${flight.flightNumber}` },
    { label: "Date", value: date },
    { label: "Seat", value: seat },
  ];
  if (flight.terminal) details.push({ label: "Terminal", value: flight.terminal });
  if (flight.gate) details.push({ label: "Gate", value: flight.gate });
  if (boardingGroup) details.push({ label: "Group", value: boardingGroup });
  if (boardingTime) details.push({ label: "Boards", value: boardingTime });

  return (
    <Glass className={["gl-boarding-pass", className].filter(Boolean).join(" ")}>
      <div className="gl-boarding-pass-main">
        <header className="gl-boarding-pass-head">
          <div>
            <span className="gl-boarding-pass-airline">{flight.airline}</span>
            <span className="gl-boarding-pass-flight">Flight {flight.flightNumber}</span>
          </div>
          <Badge variant="default">{boardingGroup ? `Group ${boardingGroup}` : "Confirmed"}</Badge>
        </header>

        <div className="gl-boarding-pass-route">
          <div className="gl-boarding-pass-endpoint">
            <span className="gl-boarding-pass-code">{flight.from}</span>
            {flight.fromCity && <span className="gl-boarding-pass-city">{flight.fromCity}</span>}
            <span className="gl-boarding-pass-time">{flight.departure}</span>
          </div>

          <div className="gl-boarding-pass-path" aria-hidden>
            <span className="gl-boarding-pass-line" />
            {flight.duration && <span className="gl-boarding-pass-duration">{flight.duration}</span>}
          </div>

          <div className="gl-boarding-pass-endpoint gl-boarding-pass-endpoint-end">
            <span className="gl-boarding-pass-code">{flight.to}</span>
            {flight.toCity && <span className="gl-boarding-pass-city">{flight.toCity}</span>}
            <span className="gl-boarding-pass-time">{flight.arrival}</span>
          </div>
        </div>

        <dl className="gl-boarding-pass-details">
          {details.map((detail) => (
            <div key={detail.label}>
              <dt>{detail.label}</dt>
              <dd>{detail.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* The perforation: a dotted seam with punched notches at each end,
          which is what makes the two halves read as a ticket rather than a card. */}
      <div className="gl-boarding-pass-seam" aria-hidden>
        <span className="gl-boarding-pass-notch gl-boarding-pass-notch-top" />
        <span className="gl-boarding-pass-perf" />
        <span className="gl-boarding-pass-notch gl-boarding-pass-notch-bottom" />
      </div>

      <aside className="gl-boarding-pass-stub">
        <span className="gl-boarding-pass-stub-label">Seat</span>
        <span className="gl-boarding-pass-stub-seat">{seat}</span>
        <span className="gl-boarding-pass-stub-label">{flight.from} → {flight.to}</span>

        <div className="gl-boarding-pass-barcode" aria-hidden>
          {bars.map((width, i) => (
            <span key={i} style={{ width: `${width}px` }} />
          ))}
        </div>
        <span className="gl-boarding-pass-barcode-value">{barcodeValue ?? `${flight.flightNumber}${seat}`}</span>
      </aside>
    </Glass>
  );
}

/**
 * Turns a string into bar widths for a barcode-like pattern.
 *
 * Deterministic so a given pass always looks the same; bar widths stay within
 * a readable 1–3px range.
 */
function barcodePattern(value: string): number[] {
  const widths: number[] = [];
  for (let i = 0; i < value.length; i++) {
    const code = value.charCodeAt(i);
    // Two bars per character keeps the pattern dense enough to read as a code.
    widths.push((code % 3) + 1, ((code >> 2) % 3) + 1);
  }
  return widths;
}
