import { X, AlertTriangle } from "lucide-react";
import type { FAQ } from "@/lib/api/faqs";

interface DeleteFaqConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  faq: FAQ | null;
  isLoading?: boolean;
}

export default function DeleteFaqConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  faq,
  isLoading = false,
}: DeleteFaqConfirmModalProps) {
  if (!isOpen || !faq) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--admin-border)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[var(--admin-text)]">
                Delete FAQ
              </h3>
              <p className="text-xs sm:text-sm text-[var(--admin-text-muted)] mt-1">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <p className="text-sm text-[var(--admin-text)] mb-4">
            Are you sure you want to delete this FAQ? This action cannot be undone and the FAQ will be permanently removed from both the database and Pinecone.
          </p>

          <div className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg p-4 mb-4">
            <p className="text-xs text-[var(--admin-text-muted)] mb-2 font-medium">Question:</p>
            <p className="text-sm text-[var(--admin-text)] font-semibold mb-3">
              {faq.question}
            </p>
            <p className="text-xs text-[var(--admin-text-muted)] mb-2 font-medium">Category:</p>
            <p className="text-sm text-[var(--admin-text)]">
              {faq.category || "No category"}
            </p>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-xs text-red-400">
              <strong>Warning:</strong> This FAQ will be removed from both MongoDB and Pinecone. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-t border-[var(--admin-border)]">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] hover:bg-[var(--admin-bg)] transition-colors disabled:opacity-50 font-medium cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
          >
            {isLoading ? "Deleting..." : "Delete FAQ"}
          </button>
        </div>
      </div>
    </div>
  );
}

