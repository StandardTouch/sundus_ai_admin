import { Menu, Search, Settings } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export default function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
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
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[var(--admin-text-muted)]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-auto bg-[var(--admin-bg-secondary)] border border-[var(--admin-border-light)] rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary-dark)] placeholder:text-[var(--admin-text-dim)] text-[var(--admin-text)]"
          />
        </div>
        <ThemeToggle />
        <button 
          className="p-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border-light)] rounded-lg hover:bg-[var(--admin-border)] cursor-pointer"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-[var(--admin-text-muted)]" />
        </button>
      </div>
    </div>
  );
}

