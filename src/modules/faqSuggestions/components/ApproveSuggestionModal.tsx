import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, Languages } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { approveSuggestionAction } from "../store";
import { fetchFaqCategories } from "@/modules/faqs/store";
import { showError } from "@/lib/utils/toast";
import type { FAQSuggestion } from "@/lib/api/faqSuggestions";
import SearchableCategoryDropdown from "@/modules/faqs/components/SearchableCategoryDropdown";
import { validateCategoryEnglish } from "@/modules/faqs/utils/categoryValidation";

interface ApproveSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: FAQSuggestion | null;
}

const approveSuggestionSchema = Yup.object().shape({
  answer: Yup.string().optional(),
  answer_ar: Yup.string().optional(),
  category: Yup.string()
    .optional()
    .test("english-only", "Category must be in English only. Arabic characters are not allowed.", (value) => {
      if (!value) return true; // Optional field
      return validateCategoryEnglish(value) === undefined;
    }),
});

export default function ApproveSuggestionModal({ isOpen, onClose, suggestion }: ApproveSuggestionModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.suggestions);
  const { categories } = useAppSelector((state) => state.faqs);
  const [activeTab, setActiveTab] = useState<"en" | "ar">("en");

  // Fetch categories if not loaded
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchFaqCategories());
    }
  }, [dispatch, categories.length]);

  // Reset form when suggestion changes
  useEffect(() => {
    if (suggestion && isOpen) {
      formik.resetForm({
        values: {
          answer: suggestion.answer || "",
          answer_ar: suggestion.answer_ar || "",
          category: suggestion.category || "",
        },
      });
      setActiveTab("en");
    }
  }, [suggestion, isOpen]);

  const formik = useFormik({
    initialValues: {
      answer: "",
      answer_ar: "",
      category: "",
    },
    validationSchema: approveSuggestionSchema,
    onSubmit: async (values) => {
      if (!suggestion) return;

      try {
        const approveData: any = {};

        if (values.answer && values.answer.trim()) {
          approveData.answer = values.answer.trim();
        }

        if (values.answer_ar && values.answer_ar.trim()) {
          approveData.answer_ar = values.answer_ar.trim();
        }

        if (values.category && values.category.trim()) {
          // Validate category is English only
          const categoryError = validateCategoryEnglish(values.category.trim());
          if (categoryError) {
            showError(categoryError);
            return;
          }
          approveData.category = values.category.trim();
        }

        await dispatch(approveSuggestionAction({ id: suggestion._id, data: approveData })).unwrap();
        onClose();
      } catch (error: any) {
        // Error is already handled in the thunk with toast notification
      }
    },
  });

  if (!isOpen || !suggestion) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--admin-border)] sticky top-0 bg-[var(--admin-bg-secondary)]">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--admin-text)]">Approve Suggestion</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Suggested Question (Read-only) */}
          <div>
            <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Suggested Question
            </label>
            <div className="px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)]">
              <p className="text-sm">{suggestion.question}</p>
              {suggestion.question_ar && (
                <p className="text-sm text-[var(--admin-text-muted)] mt-2" dir="rtl">
                  {suggestion.question_ar}
                </p>
              )}
            </div>
            {suggestion.ai_suggestion.confidence_score > 0 && (
              <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
                Confidence: {(suggestion.ai_suggestion.confidence_score * 100).toFixed(1)}%
              </p>
            )}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center gap-2 mb-4 p-1 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("en")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                activeTab === "en"
                  ? "bg-[var(--admin-primary)] text-white"
                  : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Languages className="w-4 h-4" />
                <span>English</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ar")}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                activeTab === "ar"
                  ? "bg-[var(--admin-primary)] text-white"
                  : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Languages className="w-4 h-4" />
                <span>العربية</span>
              </div>
            </button>
          </div>

          {/* English Tab Content */}
          {activeTab === "en" && (
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                Answer (Optional)
              </label>
              <textarea
                id="answer"
                name="answer"
                rows={6}
                value={formik.values.answer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 transition-all resize-none ${
                  formik.touched.answer && formik.errors.answer
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
                }`}
                placeholder="Enter the answer (optional - can be filled later)"
              />
              {formik.touched.answer && formik.errors.answer && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.answer}</p>
              )}
              {!formik.errors.answer && (
                <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
                  You can fill the answer now or update it later after approval.
                </p>
              )}
            </div>
          )}

          {/* Arabic Tab Content */}
          {activeTab === "ar" && (
            <div>
              <label htmlFor="answer_ar" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                الإجابة (اختياري)
              </label>
              <textarea
                id="answer_ar"
                name="answer_ar"
                rows={6}
                value={formik.values.answer_ar}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                dir="rtl"
                className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 transition-all resize-none ${
                  formik.touched.answer_ar && formik.errors.answer_ar
                    ? "border-red-500 focus:ring-red-500"
                    : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
                }`}
                placeholder="أدخل الإجابة بالعربية (اختياري - يمكن ملؤها لاحقًا)"
              />
              {formik.touched.answer_ar && formik.errors.answer_ar && (
                <p className="mt-1 text-sm text-red-400">{formik.errors.answer_ar}</p>
              )}
              {!formik.errors.answer_ar && (
                <p className="mt-1 text-xs text-[var(--admin-text-muted)]" dir="rtl">
                  يمكنك ملء الإجابة الآن أو تحديثها لاحقًا بعد الموافقة.
                </p>
              )}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Category (Optional)
            </label>
            <div className={formik.touched.category && formik.errors.category ? "border border-red-500 rounded-lg" : ""}>
              <SearchableCategoryDropdown
                options={categories}
                value={formik.values.category}
                onChange={(value) => {
                  formik.setFieldValue("category", value);
                  formik.setFieldTouched("category", true);
                }}
                placeholder="Select or type a category"
                className="w-full"
              />
            </div>
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-sm text-red-400">{formik.errors.category}</p>
            )}
            {!formik.errors.category && (
              <p className="mt-1 text-xs text-[var(--admin-text-muted)]">
                Select an existing category or leave empty. Category must be in English only.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] hover:bg-[var(--admin-bg)] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              {isLoading ? "Approving..." : "Approve & Activate"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

