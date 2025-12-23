import { UserCircle, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import { sidebarItems } from "./sidebarConfig";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logoutUser } from "@/modules/auth/store";
import { showSuccess } from "@/lib/utils/toast";

type Page = "dashboard" | "conversations" | "analytics" | "users" | "faqs" | "suggestions" | "settings";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: Page;
}

export default function Sidebar({ isOpen, onClose, currentPage }: SidebarProps) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const logoSrc = theme === "dark" ? "/logo_dark.png" : "/logo_light.png";

  const activePage = currentPage;

  // Filter sidebar items based on user role
  const getFilteredSidebarItems = () => {
    if (user?.role === "customer_support") {
      // Customer support only sees FAQs and FAQ Suggestions
      return sidebarItems.filter(
        (item) => item.label === "FAQs" || item.label === "FAQ Suggestions"
      );
    }
    // Admin sees all items
    return sidebarItems;
  };

  const filteredItems = getFilteredSidebarItems();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-[var(--admin-border)] flex flex-col transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
      style={{
        backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <div className="p-5 flex flex-col h-full">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-between mb-10 relative">
            <Link to={user?.role === "customer_support" ? "/faqs" : "/dashboard"} className="flex items-center justify-center w-full">
              <img 
                src={logoSrc} 
                alt="Logo" 
                className="w-full h-auto"
              />
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] absolute top-0 right-0 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-2">
            {filteredItems.map((item, i) => {
              const pageMap: Record<string, Page> = {
                "Dashboard": "dashboard",
                "Conversations": "conversations",
                "Analytics": "analytics",
                "Users": "users",
                "FAQs": "faqs",
                "FAQ Suggestions": "suggestions",
                "Settings": "settings",
              };
              const itemPage = pageMap[item.label] as Page;
              const path = item.path || "/";
              return (
                <Link key={i} to={path} onClick={onClose}>
                  <SidebarItem 
                    {...item} 
                    isActive={activePage === itemPage}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-[var(--admin-border)] pt-4 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <UserCircle className="w-8 h-8 text-[var(--admin-text-muted)]" />
            <div>
              <p className="font-semibold text-[var(--admin-text)]">
                {user?.full_name || "Admin User"}
              </p>
              <p className="text-xs text-[var(--admin-text-dim)]">
                {user?.email || "admin@chatbot.ai"}
              </p>
            </div>
          </div>
          <button
            onClick={async () => {
              await dispatch(logoutUser());
              showSuccess("Logged out successfully");
              navigate("/login", { replace: true });
            }}
            className="w-full px-3 py-2 text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-border)] rounded-lg transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
