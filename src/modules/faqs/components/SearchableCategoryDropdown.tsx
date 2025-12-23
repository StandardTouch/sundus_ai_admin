import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Search, Plus, AlertCircle } from "lucide-react";
import { containsArabic } from "../utils/categoryValidation";

interface SearchableCategoryDropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
}

export default function SearchableCategoryDropdown({
  options,
  value,
  onChange,
  placeholder = "Select category...",
  isLoading = false,
  className = "",
}: SearchableCategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if search query doesn't match any existing category (for creating new category)
  const canCreateNew = searchQuery.trim() !== "" && 
    !options.some(option => option.toLowerCase() === searchQuery.toLowerCase().trim());

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

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery("");
  };

  const [categoryError, setCategoryError] = useState<string>("");

  const handleCreateNew = () => {
    const newCategory = searchQuery.trim();
    if (newCategory) {
      // Validate that category is English only
      if (containsArabic(newCategory)) {
        setCategoryError("Category must be in English only. Arabic characters are not allowed.");
        return;
      }
      setCategoryError("");
      onChange(newCategory);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  // Clear error when search query changes
  useEffect(() => {
    if (categoryError) {
      setCategoryError("");
    }
  }, [searchQuery]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchQuery("");
  };

  const displayValue = value || placeholder;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full sm:w-auto sm:min-w-[200px] px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-left text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all flex items-center justify-between gap-2 cursor-pointer"
      >
        <span className={value ? "" : "text-[var(--admin-text-muted)]"}>
          {displayValue}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-[var(--admin-bg-secondary)] rounded transition-colors cursor-pointer"
              title="Clear selection"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4 text-[var(--admin-text-muted)]" />
            </button>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[var(--admin-text-muted)] transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-[var(--admin-border)]">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)]" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-8 pr-3 py-2 bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded text-sm text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)]"
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-[var(--admin-text-muted)] text-center">
                Loading categories...
              </div>
            ) : (
              <>
                {/* All Categories option - only show when not searching or when search matches */}
                {(!searchQuery || filteredOptions.length > 0) && (
                  <button
                    type="button"
                    onClick={() => handleSelect("")}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--admin-bg-secondary)] transition-colors cursor-pointer ${
                      value === ""
                        ? "bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]"
                        : "text-[var(--admin-text)]"
                    }`}
                  >
                    All Categories
                  </button>
                )}

                {/* Create New Category option - show when search doesn't match any existing category */}
                {canCreateNew && (
                  <div className="border-t border-b border-[var(--admin-border)]">
                    {containsArabic(searchQuery.trim()) ? (
                      <div className="px-4 py-3 bg-red-500/10 border-l-4 border-red-500">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-red-400 font-medium mb-1">
                              Category must be in English only
                            </p>
                            <p className="text-xs text-red-400/80">
                              Arabic characters are not allowed in category names.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCreateNew}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--admin-bg-secondary)] transition-colors cursor-pointer bg-[var(--admin-primary)]/5"
                      >
                        <div className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-[var(--admin-primary)]" />
                          <span className="text-[var(--admin-primary)] font-medium">
                            Create new category: "{searchQuery.trim()}"
                          </span>
                        </div>
                      </button>
                    )}
                  </div>
                )}

                {/* Existing categories */}
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-[var(--admin-bg-secondary)] transition-colors cursor-pointer ${
                        value === option
                          ? "bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]"
                          : "text-[var(--admin-text)]"
                      }`}
                    >
                      {option}
                    </button>
                  ))
                ) : searchQuery && !canCreateNew ? (
                  <div className="px-4 py-3 text-sm text-[var(--admin-text-muted)] text-center">
                    No categories found
                  </div>
                ) : !searchQuery && filteredOptions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[var(--admin-text-muted)] text-center">
                    No categories available
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

