import { Search, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSearch, setRole, setIsActive, clearFilters } from "../store";

export default function UsersFilters() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.users);

  const hasActiveFilters =
    filters.search ||
    filters.role ||
    filters.is_active !== null;

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--admin-text-muted)]" />
        <input
          type="text"
          placeholder="Search by username, email, or name..."
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {/* Role Filter */}
        <select
          value={filters.role}
          onChange={(e) =>
            dispatch(setRole(e.target.value as "admin" | "customer_support" | ""))
          }
          className="w-full sm:w-auto sm:min-w-[150px] px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="customer_support">Customer Support</option>
        </select>

        {/* Status Filter */}
        <select
          value={filters.is_active === null ? "" : filters.is_active ? "true" : "false"}
          onChange={(e) => {
            const value = e.target.value;
            dispatch(setIsActive(value === "" ? null : value === "true"));
          }}
          className="w-full sm:w-auto sm:min-w-[150px] px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={() => dispatch(clearFilters())}
            className="w-full sm:w-auto px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-secondary)] transition-all flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}

