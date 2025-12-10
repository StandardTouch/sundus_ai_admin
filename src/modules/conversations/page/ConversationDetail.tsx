import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConversation, type ConversationDetail, type Message } from "@/lib/api/conversations";
import { showError } from "@/lib/utils/toast";
import { ArrowLeft, Star, User, Bot, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function ConversationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);

  useEffect(() => {
    if (!id) {
      navigate("/conversations");
      return;
    }

    const fetchConversation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getConversation(id, { page: currentPage, limit });
        if (response.success) {
          setConversation(response.data.conversation);
          setMessages(response.data.messages);
          setPagination(response.data.pagination);
        } else {
          setError("Failed to load conversation");
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          "Failed to load conversation";
        setError(errorMessage);
        showError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [id, currentPage, limit, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePageChange = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[var(--admin-primary)] animate-spin" />
            <p className="text-sm text-[var(--admin-text-muted)]">Loading conversation...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !conversation) {
    return (
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-lg font-semibold text-[var(--admin-text)] mb-2">
              Failed to load conversation
            </p>
            <p className="text-sm text-[var(--admin-text-muted)] mb-4">{error || "Unknown error"}</p>
            <button
              onClick={() => navigate("/conversations")}
              className="px-4 py-2 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Back to Conversations
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/conversations")}
            className="flex items-center gap-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Conversations</span>
          </button>

          <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--admin-text)] mb-2">
                  Conversation Details
                </h2>
                <div className="space-y-1 text-sm">
                  <p className="text-[var(--admin-text-muted)]">
                    <span className="font-medium text-[var(--admin-text)]">Phone:</span>{" "}
                    {conversation.phone_number}
                  </p>
                  {conversation.user_name && (
                    <p className="text-[var(--admin-text-muted)]">
                      <span className="font-medium text-[var(--admin-text)]">User:</span>{" "}
                      {conversation.user_name}
                    </p>
                  )}
                  <p className="text-[var(--admin-text-muted)]">
                    <span className="font-medium text-[var(--admin-text)]">Total Messages:</span>{" "}
                    {conversation.total_messages}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {conversation.rating > 0 ? (
                  <>
                    {Array.from({ length: Math.floor(conversation.rating) }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[var(--admin-accent-yellow)]"
                        fill="currentColor"
                      />
                    ))}
                    <span className="text-sm text-[var(--admin-text-muted)]">
                      {conversation.rating.toFixed(1)}
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-[var(--admin-text-dim)]">No rating</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[var(--admin-text-dim)] pt-4 border-t border-[var(--admin-border)]">
              <div>
                <span className="font-medium text-[var(--admin-text-muted)]">Started:</span>{" "}
                {formatDate(conversation.first_timestamp)}
              </div>
              <div>
                <span className="font-medium text-[var(--admin-text-muted)]">Last Activity:</span>{" "}
                {formatDate(conversation.last_timestamp)}
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Messages</h3>

          {messages.length === 0 ? (
            <div className="text-center py-12 text-[var(--admin-text-muted)]">
              No messages found
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {messages.map((message) => (
                  <div
                    key={message.message_id}
                    className={`flex gap-3 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] rounded-lg p-3 sm:p-4 ${
                        message.role === "user"
                          ? "bg-[var(--admin-primary)] text-white"
                          : "bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)]"
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        {message.role === "user" ? (
                          <User className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Bot className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        )}
                        <span className="text-xs font-medium opacity-80">
                          {message.role === "user" ? "User" : "Assistant"}
                        </span>
                        {message.metadata?.response_time_ms && (
                          <span className="text-xs opacity-60 ml-auto">
                            {message.metadata.response_time_ms}ms
                          </span>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                      <p className="text-xs opacity-60 mt-2">
                        {formatDate(message.timestamp)}
                      </p>
                      {message.metadata?.accuracy_score && (
                        <p className="text-xs opacity-60 mt-1">
                          Accuracy: {(message.metadata.accuracy_score * 100).toFixed(1)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t border-[var(--admin-border)]">
                  <div className="text-sm text-[var(--admin-text-muted)]">
                    Showing page {pagination.page} of {pagination.totalPages} ({pagination.total}{" "}
                    messages)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-secondary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm text-[var(--admin-text)] px-3">
                      {currentPage} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className="p-2 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] hover:bg-[var(--admin-bg-secondary)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}

