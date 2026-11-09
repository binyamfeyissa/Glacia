import { useState } from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "../sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../card";
import { Badge } from "../badge";
import { Button } from "../button";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "../table";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    { title: "Total Revenue", value: "$45,231.89", change: "+20.1%", trend: "up" },
    { title: "Active Users", value: "2,350", change: "+180.1%", trend: "up" },
    { title: "Subscriptions", value: "+12,234", change: "+19%", trend: "up" },
    { title: "Active Sessions", value: "573", change: "+201", trend: "up" },
  ];

  const recentOrders = [
    { id: "ORD-7021", customer: "Sophia Taylor", status: "Completed", amount: "$350.00", date: "Today" },
    { id: "ORD-7020", customer: "Jackson Lee", status: "Processing", amount: "$120.00", date: "Today" },
    { id: "ORD-7019", customer: "Emma Wilson", status: "Completed", amount: "$49.00", date: "Yesterday" },
    { id: "ORD-7018", customer: "Liam Chen", status: "Refunded", amount: "$299.00", date: "Nov 7" },
    { id: "ORD-7017", customer: "Olivia Martinez", status: "Completed", amount: "$199.00", date: "Nov 6" },
  ];

  return (
    <SidebarProvider>
      <div className="gl-admin-layout">
        <Sidebar>
          <SidebarHeader>
            <div className="gl-admin-brand">
              <span className="gl-brand-icon">❄</span>
              <span className="gl-brand-name">Glacia Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "overview"}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "analytics"}
                  onClick={() => setActiveTab("analytics")}
                >
                  Analytics
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "orders"}
                  onClick={() => setActiveTab("orders")}
                >
                  Orders
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "customers"}
                  onClick={() => setActiveTab("customers")}
                >
                  Customers
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === "settings"}
                  onClick={() => setActiveTab("settings")}
                >
                  Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="gl-admin-user">
              <span className="gl-user-avatar">JD</span>
              <div className="gl-user-info">
                <span className="gl-user-name">Jane Doe</span>
                <span className="gl-user-role">Administrator</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="gl-admin-main">
          {/* Top Bar */}
          <header className="gl-glass gl-admin-topbar">
            <div className="gl-topbar-left">
              <SidebarTrigger />
              <h2 className="gl-topbar-title">Dashboard Overview</h2>
            </div>
            <div className="gl-topbar-right">
              <Button size="sm" variant="glass">
                Download Report
              </Button>
              <Button size="sm" variant="filled">
                + New Order
              </Button>
            </div>
          </header>

          <div className="gl-admin-content">
            {/* Stat Cards */}
            <div className="gl-stats-grid">
              {stats.map((stat) => (
                <Card key={stat.title} className="gl-stat-card">
                  <CardHeader>
                    <CardDescription>{stat.title}</CardDescription>
                    <CardTitle className="gl-stat-value">{stat.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary" className="gl-stat-badge">
                      {stat.change} from last month
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Performance Chart & Recent Activity */}
            <div className="gl-dashboard-split">
              <Card className="gl-chart-card">
                <CardHeader>
                  <CardTitle>Revenue Flow</CardTitle>
                  <CardDescription>Visualized revenue progression across quarters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="gl-chart-placeholder">
                    {/* Visual simulated liquid glass bar chart */}
                    <div className="gl-chart-bars">
                      {[40, 65, 50, 85, 95, 75, 88, 100, 70, 82, 90, 94].map((h, i) => (
                        <div key={i} className="gl-chart-bar-col">
                          <div className="gl-chart-bar" style={{ height: `${h}%` }} />
                          <span className="gl-chart-label">
                            {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="gl-activity-card">
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>5 orders processed in the past 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="gl-order-customer">
                            <span className="gl-customer-name">{order.customer}</span>
                            <span className="gl-order-id">{order.id}</span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                order.status === "Completed"
                                  ? "default"
                                  : order.status === "Processing"
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="gl-order-amount">{order.amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
