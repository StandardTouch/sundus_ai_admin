import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "@/components/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Dashboard } from "@/modules/dashboard";
import { Conversations } from "@/modules/conversations";
import ConversationDetail from "@/modules/conversations/page/ConversationDetail";
import { Analytics } from "@/modules/analytics";
import { Users } from "@/modules/users";
import { Faqs } from "@/modules/faqs";
import { Suggestions } from "@/modules/faqSuggestions";
import { Settings } from "@/modules/settings";
import { Locations } from "@/modules/locations";
import { SkuManagement } from "@/modules/skuManagement";
import { MobileMenuOverlay } from "@/components/layout";
import { useAppSelector } from "@/store/hooks";
import { Menu } from "lucide-react";

type Page = "dashboard" | "conversations" | "analytics" | "users" | "faqs" | "suggestions" | "settings" | "locations" | "SkuManagement";

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

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
    if (path === "/suggestions") return "suggestions";
    if (path === "/settings") return "settings";
    if (path === "/locations") return "locations";
    if (path === "/sku-management") return "SkuManagement";
    return "dashboard";
  };

  const currentPage = getCurrentPage();

  // Default redirect path based on role
  const defaultPath = user?.role === "customer_support" ? "/faqs" : "/dashboard";

  return (
    <div className="min-h-screen flex bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={handleMenuClose} />
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={handleMenuClose}
        currentPage={currentPage}
      />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <div className="lg:hidden p-4 border-b border-[var(--admin-border)] flex items-center gap-3 bg-[var(--admin-bg-secondary)] sticky top-0 z-40">
          <button
            onClick={handleMenuToggle}
            className="p-2 -ml-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-lg text-[var(--admin-text)] capitalize">
            {currentPage === "dashboard" ? "Dashboard" : currentPage === "SkuManagement" ? "SKU Management" : currentPage}
          </span>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to={defaultPath} replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/conversations"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer_support"]}>
                  <Conversations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/conversations/:id"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer_support"]}>
                  <ConversationDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer_support"]}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/faqs"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer_support"]}>
                  <Faqs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/suggestions"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer_support"]}>
                  <Suggestions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/locations"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer_support"]}>
                  <Locations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sku-management"
              element={
                <ProtectedRoute allowedRoles={["admin", "customer_support"]}>
                  <SkuManagement />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

