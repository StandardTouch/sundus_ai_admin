import { UserCircle, X } from "lucide-react";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./sidebarConfig";
import { useTheme } from "@/contexts/ThemeContext";

type Page = "dashboard" | "conversations" | "analytics" | "training" | "settings";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function Sidebar({ isOpen, onClose, currentPage, onPageChange }: SidebarProps) {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/logo_dark.png" : "/logo_light.png";

  const handleItemClick = (label: string) => {
    const pageMap: Record<string, Page> = {
      "Dashboard": "dashboard",
      "Conversations": "conversations",
      "Analytics": "analytics",
      "Training": "training",
      "Settings": "settings",
    };
    const page = pageMap[label] as Page;
    if (page) {
      onPageChange(page);
    }
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 border-r border-[var(--admin-border)] p-5 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
      style={{
        backgroundColor: theme === "dark" ? "#000000" : "#ffffff"
      }}
    >
      <div>
        <div className="flex items-center justify-between mb-10 relative">
          <div className="flex items-center justify-center w-full">
            <img 
              src={logoSrc} 
              alt="Logo" 
              className="w-full h-auto"
            />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] absolute top-0 right-0 cursor-pointer"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-2">
          {sidebarItems.map((item, i) => {
            const pageMap: Record<string, Page> = {
              "Dashboard": "dashboard",
              "Conversations": "conversations",
              "Analytics": "analytics",
              "Training": "training",
              "Settings": "settings",
            };
            const itemPage = pageMap[item.label] as Page;
            return (
              <SidebarItem 
                key={i} 
                {...item} 
                onClick={() => handleItemClick(item.label)}
                isActive={currentPage === itemPage}
              />
            );
          })}
        </nav>
      </div>

      <div className="border-t border-[var(--admin-border)] pt-4 flex items-center gap-3">
        <UserCircle className="w-8 h-8 text-[var(--admin-text-muted)]" />
        <div>
          <p className="font-semibold text-[var(--admin-text)]">Admin User</p>
          <p className="text-xs text-[var(--admin-text-dim)]">admin@chatbot.ai</p>
        </div>
      </div>
    </aside>
  );
}

