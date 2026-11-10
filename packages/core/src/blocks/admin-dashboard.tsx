import { useState } from "react";

import { AppShell } from "./app-shell";
import { Badge } from "../badge";
import { Button } from "../button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../table";

export interface AdminDashboardProps {
  /** Backdrop image behind the whole app shell. */
  image?: string;
}

/**
 * A workspace overview on the shared app shell: inset sidebar, floating top
 * strip, KPI row, and a two-panel body. Built only from Glacia components.
 */
export function AdminDashboard({ image }: AdminDashboardProps = {}) {
  const [active, setActive] = useState("overview");

  const stats = [
    { label: "Requests today", value: "1.2M", icon: "◈" },
    { label: "Avg latency", value: "128 ms", icon: "◷" },
    { label: "Spend today", value: "$0.00", icon: "◇" },
    { label: "Active keys", value: "1", icon: "◎" },
  ];

  const orders = [
    { id: "ORD-7021", customer: "Sophia Taylor", status: "Completed", amount: "$350.00" },
    { id: "ORD-7020", customer: "Jackson Lee", status: "Processing", amount: "$120.00" },
    { id: "ORD-7019", customer: "Emma Wilson", status: "Completed", amount: "$49.00" },
    { id: "ORD-7018", customer: "Liam Chen", status: "Refunded", amount: "$299.00" },
    { id: "ORD-7017", customer: "Olivia Martinez", status: "Completed", amount: "$199.00" },
  ];

  const bars = [38, 62, 48, 80, 94, 72, 86, 100, 68, 84, 90, 96];

  return (
    <AppShell
      image={image}
      brand={
        <>
          <span className="gl-shell-brand-mark">❄</span>
          <span>Glacia</span>
        </>
      }
      activeId={active}
      onSelect={setActive}
      nav={[
        {
          label: "Workspace",
          items: [
            { id: "overview", label: "Overview", icon: <span aria-hidden>◈</span> },
            { id: "activity", label: "Activity", icon: <span aria-hidden>◇</span> },
            { id: "keys", label: "API keys", icon: <span aria-hidden>◎</span> },
            { id: "usage", label: "Usage", icon: <span aria-hidden>◷</span> },
          ],
        },
        {
          label: "Account",
          items: [
            { id: "billing", label: "Billing & plan", icon: <span aria-hidden>◆</span> },
            { id: "settings", label: "Settings", icon: <span aria-hidden>⚙</span> },
          ],
        },
      ]}
      user={{ name: "Binyam Feyissa", email: "you@example.com", initials: "B" }}
      heading="Good evening, Binyam"
      subheading="Sunday, November 9 · All systems operating normally"
      topbarRight={
        <Button size="sm" variant="filled">
          + New API key
        </Button>
      }
    >
      <div className="gl-shell-grid" data-cols="4">
        {stats.map((s) => (
          <div className="gl-shell-panel" key={s.label}>
            <span aria-hidden style={{ opacity: 0.5, fontSize: 13 }}>
              {s.icon}
            </span>
            <div className="gl-shell-stat-value" style={{ marginTop: 8 }}>
              {s.value}
            </div>
            <span className="gl-shell-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="gl-shell-grid" data-cols="2">
        <div className="gl-shell-panel">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Activity</div>
              <div style={{ fontSize: 12.5, color: "rgb(255 255 255 / 0.45)", marginTop: 2 }}>
                Requests and spend, last 12 intervals
              </div>
            </div>
            <Badge variant="secondary">Live</Badge>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 6,
              height: 132,
            }}
          >
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  borderRadius: 6,
                  background:
                    i === bars.length - 1
                      ? "linear-gradient(180deg, #5ac8fa, #0a84ff)"
                      : "rgb(255 255 255 / 0.14)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="gl-shell-panel">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Plan &amp; balance</div>
            <Badge variant="secondary">Active</Badge>
          </div>
          <div style={{ marginTop: 18, fontSize: 12.5, color: "rgb(255 255 255 / 0.45)" }}>
            Current plan
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, marginTop: 2 }}>Ultra</div>
          <div
            style={{
              height: 1,
              background: "rgb(255 255 255 / 0.08)",
              margin: "16px 0",
            }}
          />
          <div style={{ fontSize: 12.5, color: "rgb(255 255 255 / 0.45)" }}>Balance</div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>$0.00</div>
          <div style={{ marginTop: 16 }}>
            <Button size="sm" variant="glass">
              Manage billing
            </Button>
          </div>
        </div>
      </div>

      <div className="gl-shell-panel">
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Recent orders</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <span style={{ fontWeight: 500 }}>{o.customer}</span>
                  <span
                    style={{
                      display: "block",
                      fontSize: 11.5,
                      color: "rgb(255 255 255 / 0.4)",
                    }}
                  >
                    {o.id}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      o.status === "Completed"
                        ? "default"
                        : o.status === "Processing"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {o.status}
                  </Badge>
                </TableCell>
                <TableCell>{o.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppShell>
  );
}
