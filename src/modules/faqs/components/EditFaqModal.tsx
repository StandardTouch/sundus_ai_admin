import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, Languages } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateExistingFaq, fetchFaqCategories } from "../store";
import type { FAQ } from "@/lib/api/faqs";
import SearchableCategoryDropdown from "./SearchableCategoryDropdown";
import { validateCategoryEnglish } from "../utils/categoryValidation";
import { showError } from "@/lib/utils/toast";

interface EditFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  faq: FAQ | null;
}

const updateFaqSchema = Yup.object().shape({
  question: Yup.string()
    .min(5, "Question must be at least 5 characters")
    .optional(),
  question_ar: Yup.string().optional(),
  answer: Yup.string()
    .min(10, "Answer must be at least 10 characters")
    .optional(),
  answer_ar: Yup.string().optional(),
  category: Yup.string()
    .optional()
    .test("english-only", "Category must be in English only. Arabic characters are not allowed.", (value) => {
      if (!value) return true; // Optional field
      return validateCategoryEnglish(value) === undefined;
    }),
  is_active: Yup.boolean().optional(),
  status: Yup.string()
    .oneOf(["active", "pending_review", "rejected"], "Invalid status")
    .optional(),
});

export default function EditFaqModal({ isOpen, onClose, faq }: EditFaqModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading, categories } = useAppSelector((state) => state.faqs);
  const [activeTab, setActiveTab] = useState<"en" | "ar">("en");

  // Fetch categories if not loaded
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchFaqCategories());
    }
  }, [dispatch, categories.length]);

  const formik = useFormik({
    initialValues: {
      question: faq?.question || "",
      question_ar: faq?.question_ar || "",
      answer: faq?.answer || "",
      answer_ar: faq?.answer_ar || "",
      category: faq?.category || "",
      is_active: faq?.is_active ?? true,
      status: (faq?.status || "active") as "active" | "pending_review" | "rejected",
    },
    validationSchema: updateFaqSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!faq) return;

      try {
        const updateData: any = {};

        if (values.question.trim() !== faq.question) {
          updateData.question = values.question.trim();
        }
        if (values.question_ar.trim() !== (faq.question_ar || "")) {
          updateData.question_ar = values.question_ar.trim() || undefined;
        }
        if (values.answer.trim() !== faq.answer) {
          updateData.answer = values.answer.trim();
        }
        if (values.answer_ar.trim() !== (faq.answer_ar || "")) {
          updateData.answer_ar = values.answer_ar.trim() || undefined;
        }
        if (values.category !== faq.category) {
          // Validate category is English only
          if (values.category && values.category.trim()) {
            const categoryError = validateCategoryEnglish(values.category.trim());
            if (categoryError) {
              showError(categoryError);
              return;
            }
            updateData.category = values.category.trim();
          } else {
            updateData.category = undefined;
          }
        }
        if (values.is_active !== faq.is_active) {
          updateData.is_active = values.is_active;
        }
        if (values.status !== faq.status) {
          updateData.status = values.status;
        }

        // Only update if there are changes
        if (Object.keys(updateData).length > 0) {
          await dispatch(updateExistingFaq({ id: faq._id, faqData: updateData })).unwrap();
          onClose();
        } else {
          onClose();
        }
      } catch (error: any) {
        // Error is already handled in the thunk with toast notification
      }
    },
  });

  // Reset form when FAQ changes
  useEffect(() => {
    if (faq) {
      formik.setValues({
        question: faq.question,
        question_ar: faq.question_ar || "",
        answer: faq.answer,
        answer_ar: faq.answer_ar || "",
        category: faq.category || "",
        is_active: faq.is_active,
        status: faq.status,
      });
    }
  }, [faq]);

  if (!isOpen || !faq) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--admin-border)] sticky top-0 bg-[var(--admin-bg-secondary)]">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--admin-text)]">Edit FAQ</h3>
            <p className="text-xs sm:text-sm text-[var(--admin-text-muted)] mt-1">
              ID: {faq._id.substring(0, 8)}...
            </p>
          </div>
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
            <>
              {/* Question */}
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                  Question
                </label>
                <textarea
                  id="question"
                  name="question"
                  rows={3}
                  value={formik.values.question}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 transition-all resize-none ${
                    formik.touched.question && formik.errors.question
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
                  }`}
                  placeholder="Enter the question"
                />
                {formik.touched.question && formik.errors.question && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.question}</p>
                )}
              </div>

              {/* Answer */}
              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                  Answer
                </label>
                <textarea
                  id="answer"
                  name="answer"
                  rows={5}
                  value={formik.values.answer}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 transition-all resize-none ${
                    formik.touched.answer && formik.errors.answer
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
                  }`}
                  placeholder="Enter the answer"
                />
                {formik.touched.answer && formik.errors.answer && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.answer}</p>
                )}
              </div>
            </>
          )}

          {/* Arabic Tab Content */}
          {activeTab === "ar" && (
            <>
              {/* Arabic Question */}
              <div>
                <label htmlFor="question_ar" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                  السؤال (اختياري)
                </label>
                <textarea
                  id="question_ar"
                  name="question_ar"
                  rows={3}
                  value={formik.values.question_ar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  dir="rtl"
                  className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 transition-all resize-none ${
                    formik.touched.question_ar && formik.errors.question_ar
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
                  }`}
                  placeholder="أدخل السؤال بالعربية"
                />
                {formik.touched.question_ar && formik.errors.question_ar && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.question_ar}</p>
                )}
              </div>

              {/* Arabic Answer */}
              <div>
                <label htmlFor="answer_ar" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
                  الإجابة (اختياري)
                </label>
                <textarea
                  id="answer_ar"
                  name="answer_ar"
                  rows={5}
                  value={formik.values.answer_ar}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  dir="rtl"
                  className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 transition-all resize-none ${
                    formik.touched.answer_ar && formik.errors.answer_ar
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
                  }`}
                  placeholder="أدخل الإجابة بالعربية"
                />
                {formik.touched.answer_ar && formik.errors.answer_ar && (
                  <p className="mt-1 text-sm text-red-400">{formik.errors.answer_ar}</p>
                )}
              </div>
            </>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Category
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
                Category must be in English only.
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] focus:outline-none focus:ring-2 transition-all ${
                formik.touched.status && formik.errors.status
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
              }`}
            >
              <option value="active">Active</option>
              <option value="pending_review">Pending Review</option>
              <option value="rejected">Rejected</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <p className="mt-1 text-sm text-red-400">{formik.errors.status}</p>
            )}
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-3">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formik.values.is_active}
              onChange={formik.handleChange}
              className="w-4 h-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-[var(--admin-text)]">
              Active FAQ
            </label>
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
              className="flex-1 px-4 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
            >
              {isLoading ? "Updating..." : "Update FAQ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

