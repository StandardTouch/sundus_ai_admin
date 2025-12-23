import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFaqs, deleteExistingFaq } from "../store";
import { FaqsTable, FaqsFilters, FaqsPagination, FaqsSkeleton, CreateFaqModal, EditFaqModal, DeleteFaqConfirmModal } from "../components";
import { showError } from "@/lib/utils/toast";
import { Plus } from "lucide-react";
import type { FAQ } from "@/lib/api/faqs";

export default function Faqs() {
  const dispatch = useAppDispatch();
  const { faqs, filters, isLoading, error } = useAppSelector(
    (state) => state.faqs
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);

  // Fetch FAQs when filters change
  useEffect(() => {
    const params: any = {
      page: filters.page,
      limit: filters.limit,
    };

    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.status) params.status = filters.status;
    if (filters.source) params.source = filters.source;
    if (filters.is_active !== null) params.is_active = filters.is_active;
    if (filters.has_arabic !== null) params.has_arabic = filters.has_arabic;

    dispatch(fetchFaqs(params));
  }, [dispatch, filters]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const handleEdit = (faq: FAQ) => {
    setSelectedFaq(faq);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedFaq(null);
  };

  const handleDelete = (faq: FAQ) => {
    setSelectedFaq(faq);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedFaq(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedFaq) return;
    
    try {
      await dispatch(deleteExistingFaq(selectedFaq._id)).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedFaq(null);
    } catch (error) {
      // Error is already handled in the thunk with toast notification
    }
  };

  if (isLoading && faqs.length === 0) {
    return (
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
          <FaqsSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--admin-text)]">
              FAQs Management
            </h2>
            <p className="text-sm text-[var(--admin-text-muted)]">
              View and manage all frequently asked questions
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2 cursor-pointer"
            aria-label="Create new FAQ"
          >
            <Plus className="w-5 h-5" />
            <span>Create FAQ</span>
          </button>
        </div>

        <FaqsFilters />

        <div className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg overflow-hidden">
          <FaqsTable 
            faqs={faqs} 
            isLoading={isLoading} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            showArabic={filters.has_arabic === true}
          />
        </div>

        <FaqsPagination />
      </div>

      <CreateFaqModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditFaqModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        faq={selectedFaq}
      />

      <DeleteFaqConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        faq={selectedFaq}
        isLoading={isLoading}
      />
    </main>
  );
}

