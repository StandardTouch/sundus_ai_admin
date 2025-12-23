import type { FAQSuggestion } from "@/lib/api/faqSuggestions";
import { CheckCircle2, XCircle } from "lucide-react";

interface SuggestionsTableProps {
  suggestions: FAQSuggestion[];
  isLoading: boolean;
  onApprove?: (suggestion: FAQSuggestion) => void;
  onReject?: (suggestion: FAQSuggestion) => void;
}

export default function SuggestionsTable({ 
  suggestions, 
  isLoading, 
  onApprove, 
  onReject
}: SuggestionsTableProps) {
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

  const formatConfidenceScore = (score: number) => {
    return `${(score * 100).toFixed(1)}%`;
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return "—";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-primary)]"></div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--admin-text-muted)]">
        No suggestions found
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
                Question
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                Confidence
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                Suggested At
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                Status
              </th>
                {(onApprove || onReject) && (
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                    Actions
                  </th>
                )}
            </tr>
          </thead>
          <tbody>
            {suggestions.map((suggestion) => (
              <tr
                key={suggestion._id}
                className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-bg-secondary)] transition-colors"
              >
                <td className="py-3 px-4 text-sm text-[var(--admin-text)] font-medium max-w-xs">
                  <div className="line-clamp-2">{suggestion.question}</div>
                  {suggestion.question_ar && (
                    <div className="line-clamp-1 text-xs text-[var(--admin-text-muted)] mt-1" dir="rtl">
                      {suggestion.question_ar}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text)]">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-[var(--admin-bg-secondary)] rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[var(--admin-primary)] transition-all"
                        style={{ width: `${suggestion.ai_suggestion.confidence_score * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[var(--admin-text-muted)] min-w-[3rem]">
                      {formatConfidenceScore(suggestion.ai_suggestion.confidence_score)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text-muted)]">
                  {formatDateShort(suggestion.ai_suggestion.suggested_at)}
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                    Pending Review
                  </span>
                </td>
                {(onApprove || onReject) && (
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {onApprove && (
                        <button
                          type="button"
                          onClick={() => onApprove(suggestion)}
                          className="p-2 text-[var(--admin-text-muted)] hover:text-green-500 hover:bg-green-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Approve suggestion"
                          aria-label="Approve suggestion"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {onReject && (
                        <button
                          type="button"
                          onClick={() => onReject(suggestion)}
                          className="p-2 text-[var(--admin-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Reject suggestion"
                          aria-label="Reject suggestion"
                        >
                          <XCircle className="w-4 h-4" />
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
        {suggestions.map((suggestion) => (
          <div
            key={suggestion._id}
            className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg p-4 space-y-3"
          >
            <div className="flex-1">
              <h3 className="text-base font-semibold text-[var(--admin-text)] mb-2">
                {suggestion.question}
              </h3>
              {suggestion.question_ar && (
                <p className="text-sm text-[var(--admin-text-muted)] mb-2" dir="rtl">
                  {suggestion.question_ar}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--admin-border)]">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[var(--admin-bg-secondary)] rounded-full h-2 w-20 overflow-hidden">
                  <div
                    className="h-full bg-[var(--admin-primary)] transition-all"
                    style={{ width: `${suggestion.ai_suggestion.confidence_score * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-[var(--admin-text-muted)]">
                  {formatConfidenceScore(suggestion.ai_suggestion.confidence_score)}
                </span>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                Pending Review
              </span>
            </div>

            <div className="text-xs text-[var(--admin-text-muted)] pt-2 border-t border-[var(--admin-border)]">
              <p>Suggested: {formatDateShort(suggestion.ai_suggestion.suggested_at)}</p>
            </div>

            {(onApprove || onReject) && (
              <div className="pt-2 border-t border-[var(--admin-border)]">
                <div className="flex gap-2">
                  {onApprove && (
                    <button
                      type="button"
                      onClick={() => onApprove(suggestion)}
                      className="flex-1 px-4 py-2 text-sm bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      aria-label="Approve suggestion"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve</span>
                    </button>
                  )}
                  {onReject && (
                    <button
                      type="button"
                      onClick={() => onReject(suggestion)}
                      className="flex-1 px-4 py-2 text-sm bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      aria-label="Reject suggestion"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
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

