import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { sidebarItems } from "@/components/sidebar/sidebarConfig";
import { useAppSelector } from "@/store/hooks";

interface ModuleOption {
  label: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export default function ModuleSearch() {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter modules based on user role
  const getAvailableModules = (): ModuleOption[] => {
    if (user?.role === "customer_support") {
      return sidebarItems
        .filter((item) => item.label === "FAQs" || item.label === "FAQ Suggestions")
        .map((item) => ({
          label: item.label,
          path: item.path || "/",
          icon: item.icon,
        }));
    }
    return sidebarItems.map((item) => ({
      label: item.label,
      path: item.path || "/",
      icon: item.icon,
    }));
  };

  const availableModules = getAvailableModules();

  // Filter modules based on search query
  const filteredModules = availableModules.filter((module) =>
    module.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredModules.length > 0) {
      handleSelect(filteredModules[0].path);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div ref={dropdownRef} className="relative flex-1 sm:flex-initial sm:min-w-[280px]">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
        <input
          type="text"
          placeholder="Search modules..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full pl-9 pr-10 py-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border-light)] rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[var(--admin-primary-dark)] placeholder:text-[var(--admin-text-dim)] text-[var(--admin-text)]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSearchQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] cursor-pointer"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {filteredModules.length > 0 ? (
              filteredModules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSelect(module.path)}
                    className="w-full px-4 py-3 text-left hover:bg-[var(--admin-bg-secondary)] transition-colors cursor-pointer flex items-center gap-3"
                  >
                    <Icon className="w-5 h-5 text-[var(--admin-text-muted)]" />
                    <span className="text-sm text-[var(--admin-text)]">{module.label}</span>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-[var(--admin-text-muted)] text-center">
                No modules found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

