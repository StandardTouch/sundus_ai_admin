import { Search, X } from "lucide-react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearch, setCategory, setStatus, setSource, setIsActive, setHasArabic, clearFilters, fetchFaqCategories } from "../store";
import SearchableCategoryDropdown from "./SearchableCategoryDropdown";

export default function FaqsFilters() {
  const dispatch = useAppDispatch();
  const { filters, categories, isLoadingCategories } = useAppSelector((state) => state.faqs);

  // Fetch categories on mount
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchFaqCategories());
    }
  }, [dispatch, categories.length]);

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.status ||
    filters.source ||
    filters.is_active !== null ||
    filters.has_arabic !== null;

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--admin-text-muted)]" />
        <input
          type="text"
          placeholder="Search by question or answer..."
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {/* Category Filter - Searchable Dropdown */}
        <SearchableCategoryDropdown
          options={categories}
          value={filters.category}
          onChange={(value) => dispatch(setCategory(value))}
          placeholder="All Categories"
          isLoading={isLoadingCategories}
          className="w-full sm:w-auto"
        />

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) =>
            dispatch(setStatus(e.target.value as "active" | "pending_review" | "rejected" | ""))
          }
          className="w-full sm:w-auto sm:min-w-[150px] px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="pending_review">Pending Review</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Source Filter */}
        <select
          value={filters.source}
          onChange={(e) =>
            dispatch(setSource(e.target.value as "manual" | "ai_suggested" | ""))
          }
          className="w-full sm:w-auto sm:min-w-[150px] px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
        >
          <option value="">All Sources</option>
          <option value="manual">Manual</option>
          <option value="ai_suggested">AI Suggested</option>
        </select>

        {/* Active Status Filter */}
        <select
          value={filters.is_active === null ? "" : filters.is_active ? "true" : "false"}
          onChange={(e) => {
            const value = e.target.value;
            dispatch(setIsActive(value === "" ? null : value === "true"));
          }}
          className="w-full sm:w-auto sm:min-w-[150px] px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
        >
          <option value="">All Active Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Has Arabic Filter */}
        <select
          value={filters.has_arabic === null ? "" : filters.has_arabic ? "true" : "false"}
          onChange={(e) => {
            const value = e.target.value;
            dispatch(setHasArabic(value === "" ? null : value === "true"));
          }}
          className="w-full sm:w-auto sm:min-w-[150px] px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
        >
          <option value="">All FAQs</option>
          <option value="true">With Arabic</option>
          <option value="false">Without Arabic</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => dispatch(clearFilters())}
            className="w-full sm:w-auto px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-secondary)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            aria-label="Clear all filters"
          >
            <X className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}

