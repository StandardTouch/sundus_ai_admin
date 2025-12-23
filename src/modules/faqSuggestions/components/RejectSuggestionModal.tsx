import { useFormik } from "formik";
import * as Yup from "yup";
import { X, AlertTriangle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { rejectSuggestionAction } from "../store";
import type { FAQSuggestion } from "@/lib/api/faqSuggestions";

interface RejectSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: FAQSuggestion | null;
}

const rejectSuggestionSchema = Yup.object().shape({
  review_notes: Yup.string().optional(),
});

export default function RejectSuggestionModal({ isOpen, onClose, suggestion }: RejectSuggestionModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.suggestions);

  const formik = useFormik({
    initialValues: {
      review_notes: "",
    },
    validationSchema: rejectSuggestionSchema,
    onSubmit: async (values) => {
      if (!suggestion) return;

      try {
        const rejectData: any = {};
        if (values.review_notes && values.review_notes.trim()) {
          rejectData.review_notes = values.review_notes.trim();
        }

        await dispatch(rejectSuggestionAction({ id: suggestion._id, data: rejectData })).unwrap();
        formik.resetForm();
        onClose();
      } catch (error: any) {
        // Error is already handled in the thunk with toast notification
      }
    },
  });

  if (!isOpen || !suggestion) return null;

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
                Reject Suggestion
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

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Suggestion Preview */}
          <div className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg p-4">
            <p className="text-xs text-[var(--admin-text-muted)] mb-2 font-medium">Question:</p>
            <p className="text-sm text-[var(--admin-text)] font-semibold mb-3">
              {suggestion.question}
            </p>
            {suggestion.question_ar && (
              <>
                <p className="text-xs text-[var(--admin-text-muted)] mb-2 font-medium">السؤال:</p>
                <p className="text-sm text-[var(--admin-text)] mb-3" dir="rtl">
                  {suggestion.question_ar}
                </p>
              </>
            )}
            {suggestion.ai_suggestion.confidence_score > 0 && (
              <p className="text-xs text-[var(--admin-text-muted)]">
                Confidence: {(suggestion.ai_suggestion.confidence_score * 100).toFixed(1)}%
              </p>
            )}
          </div>

          {/* Review Notes */}
          <div>
            <label htmlFor="review_notes" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Rejection Reason (Optional)
            </label>
            <textarea
              id="review_notes"
              name="review_notes"
              rows={4}
              value={formik.values.review_notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 transition-all resize-none ${
                formik.touched.review_notes && formik.errors.review_notes
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
              }`}
              placeholder="e.g., This question is already covered by existing FAQ #123"
            />
            {formik.touched.review_notes && formik.errors.review_notes && (
              <p className="mt-1 text-sm text-red-400">{formik.errors.review_notes}</p>
            )}
            {!formik.errors.review_notes && (
              <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
                Add a note explaining why this suggestion is being rejected (optional).
              </p>
            )}
          </div>

          {/* Warning */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-xs text-red-400">
              <strong>Note:</strong> Rejected suggestions will be marked as inactive and will not be synced to Pinecone. This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] hover:bg-[var(--admin-bg)] transition-colors disabled:opacity-50 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              {isLoading ? "Rejecting..." : "Reject Suggestion"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

