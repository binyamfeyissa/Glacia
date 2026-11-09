import { useState } from "react";
import { Glass } from "../glass";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../card";
import { Item } from "../item";
import { Button } from "../button";
import { Badge } from "../badge";
import { Avatar, AvatarFallback } from "../avatar";
import { Separator } from "../separator";

export interface ProfileBlockProps {
  name?: string;
  role?: string;
  email?: string;
  onEdit?: () => void;
}

export function ProfileBlock({
  name = "Alexander Wright",
  role = "Principal Design Architect",
  email = "alexander.wright@apple.design",
  onEdit,
}: ProfileBlockProps) {
  const [activeTab, setActiveTab] = useState<"devices" | "security">("devices");

  const devices = [
    { name: "iPhone 16 Pro Max", type: "This device", icon: "📱" },
    { name: "MacBook Pro 16\"", type: "macOS Sequoia", icon: "💻" },
    { name: "Apple Watch Ultra 2", type: "watchOS 11", icon: "⌚" },
    { name: "iPad Pro 13\" (M4)", type: "iPadOS 18", icon: "📟" },
  ];

  return (
    <div className="gl-profile-block max-w-4xl mx-auto space-y-6">
      {/* Profile Header Hero Card */}
      <Card className="gl-profile-hero">
        <div className="gl-profile-hero-content flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="relative">
            <Avatar style={{ width: 96, height: 96, fontSize: 32 }}>
              <AvatarFallback>AW</AvatarFallback>
            </Avatar>
            <span className="gl-profile-online-badge" />
          </div>

          <div className="flex-1 text-center md:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
              <Badge variant="default">Verified Apple ID</Badge>
            </div>
            <p className="text-sm opacity-80">{role}</p>
            <p className="text-xs font-mono opacity-60">{email}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="glass" size="sm" onClick={onEdit}>
              Edit Profile
            </Button>
            <Button variant="filled" size="sm">
              Share Contact
            </Button>
          </div>
        </div>
      </Card>

      {/* Linked Devices & Security Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Devices Signed In to Apple Account</CardTitle>
              <CardDescription>
                Hardware tokens receiving two-factor authentication prompts.
              </CardDescription>
            </div>
            <Badge variant="outline">{devices.length} Devices</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {devices.map((device, idx) => (
            <div key={device.name}>
              <Item
                icon={<span className="text-xl">{device.icon}</span>}
                title={device.name}
                description={device.type}
                accessory={
                  <Button variant="ghost" size="sm">
                    Manage
                  </Button>
                }
                interactive
              />
              {idx < devices.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
