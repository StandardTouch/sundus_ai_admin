import type { FAQ } from "@/lib/api/faqs";
import { Edit, Trash2 } from "lucide-react";

interface FaqsTableProps {
  faqs: FAQ[];
  isLoading: boolean;
  onEdit?: (faq: FAQ) => void;
  onDelete?: (faq: FAQ) => void;
  showArabic?: boolean;
}

export default function FaqsTable({ faqs, isLoading, onEdit, onDelete, showArabic = false }: FaqsTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending_review":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getSourceBadgeColor = (source: string) => {
    if (source === "manual") {
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
    return "bg-purple-500/10 text-purple-400 border-purple-500/20";
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Get display text based on showArabic flag
  const getQuestion = (faq: FAQ) => {
    if (showArabic && faq.question_ar) {
      return faq.question_ar;
    }
    return faq.question;
  };

  const getAnswer = (faq: FAQ) => {
    if (showArabic && faq.answer_ar) {
      return faq.answer_ar;
    }
    return faq.answer;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-primary)]"></div>
      </div>
    );
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--admin-text-muted)]">
        No FAQs found
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="border-b border-[var(--admin-border)]">
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                {showArabic ? "السؤال" : "Question"}
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                {showArabic ? "الإجابة" : "Answer"}
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                Category
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                Source
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                Usage
              </th>
              {(onEdit || onDelete) && (
                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr
                key={faq._id}
                className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-bg-secondary)] transition-colors"
              >
                <td className={`py-3 px-4 text-sm text-[var(--admin-text)] font-medium max-w-xs ${showArabic && faq.question_ar ? "text-right" : ""}`} dir={showArabic && faq.question_ar ? "rtl" : "ltr"}>
                  <div className="line-clamp-2">{getQuestion(faq)}</div>
                  {showArabic && faq.question_ar && faq.question && (
                    <p className="text-xs text-[var(--admin-text-muted)] mt-1 line-clamp-1" dir="ltr">
                      EN: {faq.question}
                    </p>
                  )}
                </td>
                <td className={`py-3 px-4 text-sm text-[var(--admin-text)] max-w-md ${showArabic && faq.answer_ar ? "text-right" : ""}`} dir={showArabic && faq.answer_ar ? "rtl" : "ltr"}>
                  <div className="line-clamp-2">{truncateText(getAnswer(faq), 150)}</div>
                  {showArabic && faq.answer_ar && faq.answer && (
                    <p className="text-xs text-[var(--admin-text-muted)] mt-1 line-clamp-1" dir="ltr">
                      EN: {truncateText(faq.answer, 80)}
                    </p>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text)]">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] text-[var(--admin-text-muted)]">
                    {faq.category || "N/A"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                      faq.status
                    )}`}
                  >
                    {faq.status === "active" ? "Active" : faq.status === "pending_review" ? "Pending Review" : "Rejected"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSourceBadgeColor(
                      faq.source
                    )}`}
                  >
                    {faq.source === "manual" ? "Manual" : "AI Suggested"}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text-muted)]">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-[var(--admin-text)]">{faq.usage_count}</span>
                    {faq.last_used_at && (
                      <span className="text-xs">{formatDateShort(faq.last_used_at)}</span>
                    )}
                  </div>
                </td>
                {(onEdit || onDelete) && (
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {onEdit && (
                        <button
                          type="button"
                          onClick={() => onEdit(faq)}
                          className="p-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-bg-secondary)] rounded-lg transition-colors cursor-pointer"
                          title="Edit FAQ"
                          aria-label="Edit FAQ"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(faq)}
                          className="p-2 text-[var(--admin-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Delete FAQ"
                          aria-label="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq._id}
            className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg p-4 space-y-3"
          >
            <div className="flex-1">
              <h3 className={`text-base font-semibold text-[var(--admin-text)] mb-2 ${showArabic && faq.question_ar ? "text-right" : ""}`} dir={showArabic && faq.question_ar ? "rtl" : "ltr"}>
                {getQuestion(faq)}
              </h3>
              {showArabic && faq.question_ar && faq.question && (
                <p className="text-xs text-[var(--admin-text-muted)] mb-2 line-clamp-1" dir="ltr">
                  EN: {faq.question}
                </p>
              )}
              <p className={`text-sm text-[var(--admin-text-muted)] mb-3 line-clamp-3 ${showArabic && faq.answer_ar ? "text-right" : ""}`} dir={showArabic && faq.answer_ar ? "rtl" : "ltr"}>
                {getAnswer(faq)}
              </p>
              {showArabic && faq.answer_ar && faq.answer && (
                <p className="text-xs text-[var(--admin-text-muted)] mb-2 line-clamp-2" dir="ltr">
                  EN: {faq.answer}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--admin-border)]">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] text-[var(--admin-text-muted)]">
                {faq.category || "N/A"}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                  faq.status
                )}`}
              >
                {faq.status === "active" ? "Active" : faq.status === "pending_review" ? "Pending Review" : "Rejected"}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getSourceBadgeColor(
                  faq.source
                )}`}
              >
                {faq.source === "manual" ? "Manual" : "AI Suggested"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-[var(--admin-text-muted)] pt-2 border-t border-[var(--admin-border)]">
              <div>
                <p className="font-medium text-[var(--admin-text)] mb-1">Usage Count</p>
                <p>{faq.usage_count}</p>
              </div>
              <div>
                <p className="font-medium text-[var(--admin-text)] mb-1">Last Used</p>
                <p>{formatDateShort(faq.last_used_at)}</p>
              </div>
            </div>

            {(onEdit || onDelete) && (
              <div className="pt-2 border-t border-[var(--admin-border)]">
                <div className="flex gap-2">
                  {onEdit && (
                    <button
                      type="button"
                      onClick={() => onEdit(faq)}
                      className="flex-1 px-4 py-2 text-sm bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-bg-secondary)] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      aria-label="Edit FAQ"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      onClick={() => onDelete(faq)}
                      className="flex-1 px-4 py-2 text-sm bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text-muted)] hover:text-red-500 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      aria-label="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

