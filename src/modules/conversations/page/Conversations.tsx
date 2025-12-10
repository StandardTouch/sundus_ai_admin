import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchConversations,
  setSortBy,
  setSortOrder,
} from "../store";
import {
  ConversationsTable,
  ConversationsFilters,
  ConversationsPagination,
} from "../components";
import { ConversationsSkeleton } from "../components/shimmer";
import { showError } from "@/lib/utils/toast";

export default function Conversations() {
  const dispatch = useAppDispatch();
  const { conversations, pagination, filters, isLoading, error } =
    useAppSelector((state) => state.conversations);

  // Fetch conversations when filters change
  useEffect(() => {
    const params: any = {
      page: filters.page,
      limit: filters.limit,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    };

    if (filters.search) params.search = filters.search;
    if (filters.phone_number) params.phone_number = filters.phone_number;
    if (filters.start_date) params.start_date = filters.start_date;
    if (filters.end_date) params.end_date = filters.end_date;

    dispatch(fetchConversations(params));
  }, [dispatch, filters]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const handleSort = (field: string) => {
    if (filters.sort_by === field) {
      // Toggle sort order if clicking the same field
      dispatch(setSortOrder(filters.sort_order === "asc" ? "desc" : "asc"));
    } else {
      // Set new sort field and default to desc
      dispatch(setSortBy(field as any));
      dispatch(setSortOrder("desc"));
    }
  };

  if (isLoading && conversations.length === 0) {
    return (
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <div className="max-w-7xl mx-auto">
          <ConversationsSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--admin-text)]">
            Conversations
          </h2>
        </div>

        {/* Filters */}
        <ConversationsFilters />

        {/* Table */}
        <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
          <ConversationsTable
            conversations={conversations}
            sortBy={filters.sort_by}
            sortOrder={filters.sort_order}
            onSort={handleSort}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {pagination && <ConversationsPagination />}
        </div>
      </div>
    </main>
  );
}

