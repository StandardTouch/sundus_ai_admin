import React from "react";

interface SidebarItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
}

import { useTheme } from "@/contexts/ThemeContext";

export default function SidebarItem({ icon: Icon, label, onClick, isActive = false }: SidebarItemProps) {
  const { theme } = useTheme();

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-all cursor-pointer ${
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
    </button>
  );
}

