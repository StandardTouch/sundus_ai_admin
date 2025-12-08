import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface SidebarItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  isActive?: boolean;
}

export default function SidebarItem({ icon: Icon, label, isActive = false }: SidebarItemProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all ${
        isActive
          ? ""
          : "hover:bg-[var(--admin-border)] hover:text-[var(--admin-text)]"
      }`}
      style={
        isActive
          ? {
              backgroundColor: "#2C598A",
              color: "#ffffff",
            }
          : {
              color: theme === "dark" ? "#ffffff" : "var(--admin-text-secondary)",
            }
      }
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </div>
  );
}

