import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSuggestions } from "../store";
import { SuggestionsTable, SuggestionsPagination, SuggestionsSkeleton, ApproveSuggestionModal, RejectSuggestionModal } from "../components";
import { showError } from "@/lib/utils/toast";
import type { FAQSuggestion } from "@/lib/api/faqSuggestions";

export default function Suggestions() {
  const dispatch = useAppDispatch();
  const { suggestions, filters, isLoading, error } = useAppSelector(
    (state) => state.suggestions
  );
  const [selectedSuggestion, setSelectedSuggestion] = useState<FAQSuggestion | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Fetch suggestions when filters change
  useEffect(() => {
    const params: any = {
      page: filters.page,
      limit: filters.limit,
    };

    dispatch(fetchSuggestions(params));
  }, [dispatch, filters]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const handleApprove = (suggestion: FAQSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsApproveModalOpen(true);
  };

  const handleReject = (suggestion: FAQSuggestion) => {
    setSelectedSuggestion(suggestion);
    setIsRejectModalOpen(true);
  };

  const handleCloseApproveModal = () => {
    setIsApproveModalOpen(false);
    setSelectedSuggestion(null);
  };

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false);
    setSelectedSuggestion(null);
  };

  if (isLoading && suggestions.length === 0) {
    return (
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
          <SuggestionsSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--admin-text)]">
            Smart FAQ Suggestions
          </h2>
          <p className="text-sm text-[var(--admin-text-muted)]">
            Review and manage AI-suggested FAQs from customer conversations
          </p>
        </div>

        <div className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg overflow-hidden">
          <SuggestionsTable 
            suggestions={suggestions} 
            isLoading={isLoading}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </div>

        <SuggestionsPagination />
      </div>

      {/* Approve Modal */}
      <ApproveSuggestionModal
        isOpen={isApproveModalOpen}
        onClose={handleCloseApproveModal}
        suggestion={selectedSuggestion}
      />

      {/* Reject Modal */}
      <RejectSuggestionModal
        isOpen={isRejectModalOpen}
        onClose={handleCloseRejectModal}
        suggestion={selectedSuggestion}
      />
    </main>
  );
}

