import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setPage, setLimit } from "../store";

export default function UsersPagination() {
  const dispatch = useAppDispatch();
  const { pagination, filters, isLoading } = useAppSelector((state) => state.users);

  if (!pagination) return null;

  const { page, limit, total, totalPages } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      dispatch(setPage(newPage));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-[var(--admin-border)]">
      {/* Results Info */}
      <div className="text-sm text-[var(--admin-text-muted)]">
        Showing <span className="font-medium text-[var(--admin-text)]">{startItem}</span> to{" "}
        <span className="font-medium text-[var(--admin-text)]">{endItem}</span> of{" "}
        <span className="font-medium text-[var(--admin-text)]">{total}</span> users
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
        {/* Limit Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <label className="text-sm text-[var(--admin-text-muted)] whitespace-nowrap">Per page:</label>
          <select
            value={filters.limit}
            onChange={(e) => dispatch(setLimit(Number(e.target.value)))}
            disabled={isLoading}
            className="px-3 py-1.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary)] transition-all disabled:opacity-50"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className="p-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-secondary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    page === pageNum
                      ? "bg-[var(--admin-primary)] text-white"
                      : "bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-secondary)]"
                  } disabled:opacity-50`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages || isLoading}
            className="p-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-secondary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

