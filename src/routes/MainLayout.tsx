import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "@/components/sidebar";
import { Dashboard } from "@/modules/dashboard";
import { Conversations } from "@/modules/conversations";
import ConversationDetail from "@/modules/conversations/page/ConversationDetail";
import { Analytics } from "@/modules/analytics";
import { Users } from "@/modules/users";
import { Faqs } from "@/modules/faqs";
import { Training } from "@/modules/training";
import { Settings } from "@/modules/settings";
import { MobileMenuOverlay } from "@/components/layout";

type Page = "dashboard" | "conversations" | "analytics" | "users" | "faqs" | "training" | "settings";

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  // Get current page from pathname
  const getCurrentPage = (): Page => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path.startsWith("/conversations")) return "conversations";
    if (path === "/analytics") return "analytics";
    if (path === "/users") return "users";
    if (path === "/faqs") return "faqs";
    if (path === "/training") return "training";
    if (path === "/settings") return "settings";
    return "dashboard";
  };

  const currentPage = getCurrentPage();

  return (
    <div className="min-h-screen flex bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={handleMenuClose} />
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={handleMenuClose}
        currentPage={currentPage}
      />
      <Routes>
        <Route path="/" element={<Dashboard onMenuClick={handleMenuToggle} />} />
        <Route path="/dashboard" element={<Dashboard onMenuClick={handleMenuToggle} />} />
        <Route path="/conversations" element={<Conversations />} />
        <Route path="/conversations/:id" element={<ConversationDetail />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/users" element={<Users />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/training" element={<Training />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

