import { BarChart3, MessageSquare, LineChart, Users, Settings, GraduationCap, HelpCircle, Sparkles } from "lucide-react";
import React from "react";

export interface SidebarItemConfig {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  path?: string;
}

export const sidebarItems: SidebarItemConfig[] = [
  { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: MessageSquare, label: "Conversations", path: "/conversations" },
  { icon: LineChart, label: "Analytics", path: "/analytics" },
  { icon: HelpCircle, label: "FAQs", path: "/faqs" },
  { icon: Sparkles, label: "Suggestions", path: "/suggestions" },
  { icon: GraduationCap, label: "Training", path: "/training" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

