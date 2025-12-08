import { BarChart3, MessageSquare, LineChart, Users, Settings } from "lucide-react";
import React from "react";

export interface SidebarItemConfig {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  path?: string;
}

export const sidebarItems: SidebarItemConfig[] = [
  { icon: BarChart3, label: "Dashboard", path: "/" },
  { icon: MessageSquare, label: "Conversations", path: "/conversations" },
  { icon: LineChart, label: "Analytics", path: "/analytics" },
  { icon: Users, label: "Training", path: "/training" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

