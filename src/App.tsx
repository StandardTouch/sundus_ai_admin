import { useState } from "react";
import React from "react";
import { Sidebar } from "./components/sidebar";
import { Dashboard } from "./modules/dashboard";
import { Conversations } from "./modules/conversations";
import { Analytics } from "./modules/analytics";
import { Training } from "./modules/training";
import { Settings } from "./modules/settings";
import { MobileMenuOverlay } from "./components/layout";

type Page = "dashboard" | "conversations" | "analytics" | "training" | "settings";

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onMenuClick={handleMenuToggle} />;
      case "conversations":
        return <Conversations />;
      case "analytics":
        return <Analytics />;
      case "training":
        return <Training />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard onMenuClick={handleMenuToggle} />;
    }
  };

  // Debug: Check theme and CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    const hasDark = root.classList.contains("dark");
    const bgValue = getComputedStyle(root).getPropertyValue("--admin-bg").trim();
    const textValue = getComputedStyle(root).getPropertyValue("--admin-text").trim();
    
    console.log("=== App Component Debug ===");
    console.log("HTML has 'dark' class:", hasDark);
    console.log("--admin-bg computed value:", bgValue);
    console.log("--admin-text computed value:", textValue);
    console.log("Current page:", currentPage);
  });

  return (
    <div className="min-h-screen flex bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClose={handleMenuClose} />
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={handleMenuClose}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {renderPage()}
    </div>
  );
}
