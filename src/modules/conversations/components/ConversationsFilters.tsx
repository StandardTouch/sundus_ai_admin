import { Search, X, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSearch,
  setPhoneNumber,
  setStartDate,
  setEndDate,
  clearFilters,
} from "../store";

export default function ConversationsFilters() {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.conversations);

  const hasActiveFilters =
    filters.search ||
    filters.phone_number ||
    filters.start_date ||
    filters.end_date;

  // Get today's date in YYYY-MM-DD format for max date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-4 mb-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--admin-text-muted)]" />
        <input
          type="text"
          placeholder="Search by phone number, conversation ID, or message content..."
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className="w-full pl-10 pr-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        {/* Phone Number Filter */}
        <div className="relative flex-1 sm:flex-initial sm:min-w-[200px]">
          <input
            type="text"
            placeholder="Phone number..."
            value={filters.phone_number}
            onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
            className="w-full px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
          />
        </div>

        {/* Start Date Filter */}
        <div className="relative flex-1 sm:flex-initial sm:min-w-[180px]">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)] pointer-events-none" />
          <input
            type="date"
            value={filters.start_date ? filters.start_date.split("T")[0] : ""}
            onChange={(e) => {
              const dateValue = e.target.value;
              // Convert to ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
              const isoDate = dateValue
                ? new Date(dateValue + "T00:00:00.000Z").toISOString()
                : "";
              dispatch(setStartDate(isoDate));
            }}
            max={today}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
          />
        </div>

        {/* End Date Filter */}
        <div className="relative flex-1 sm:flex-initial sm:min-w-[180px]">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--admin-text-muted)] pointer-events-none" />
          <input
            type="date"
            value={filters.end_date ? filters.end_date.split("T")[0] : ""}
            onChange={(e) => {
              const dateValue = e.target.value;
              // Convert to ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
              const isoDate = dateValue
                ? new Date(dateValue + "T23:59:59.999Z").toISOString()
                : "";
              dispatch(setEndDate(isoDate));
            }}
            max={today}
            min={filters.start_date ? filters.start_date.split("T")[0] : undefined}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all"
          />
        </div>

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

