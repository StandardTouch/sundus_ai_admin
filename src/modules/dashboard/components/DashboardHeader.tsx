import { Menu, Settings } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import EnableAIToggle from "./EnableAIToggle";
import ModuleSearch from "./ModuleSearch";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  onSettingsClick: () => void;
}

export default function DashboardHeader({ onMenuClick, onSettingsClick }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border-light)] rounded-lg hover:bg-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--admin-text)]">Dashboard Overview</h2>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <ModuleSearch />
        <EnableAIToggle />
        <ThemeToggle />
        <button 
          type="button"
          onClick={onSettingsClick}
          className="p-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border-light)] rounded-lg hover:bg-[var(--admin-border)] cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-[var(--admin-text-muted)]" />
        </button>
      </div>
    </div>
  );
}

