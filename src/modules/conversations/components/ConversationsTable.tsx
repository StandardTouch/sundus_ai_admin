import type { Conversation } from "@/lib/api/conversations";
import { ChevronUp, ChevronDown, Star, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ConversationsTableProps {
  conversations: Conversation[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  isLoading: boolean;
}

export default function ConversationsTable({
  conversations,
  sortBy,
  sortOrder,
  onSort,
  isLoading,
}: ConversationsTableProps) {
  const navigate = useNavigate();

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-primary)]"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--admin-text-muted)]">
        No conversations found
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b border-[var(--admin-border)]">
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)] cursor-pointer hover:text-[var(--admin-text)] transition-colors"
                onClick={() => onSort("phone_number")}
              >
                Phone Number {getSortIcon("phone_number")}
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                User Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                Last Message
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)] cursor-pointer hover:text-[var(--admin-text)] transition-colors"
                onClick={() => onSort("last_timestamp")}
              >
                Last Activity {getSortIcon("last_timestamp")}
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)] cursor-pointer hover:text-[var(--admin-text)] transition-colors"
                onClick={() => onSort("message_count")}
              >
                Messages {getSortIcon("message_count")}
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                Rating
              </th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conversation) => (
              <tr
                key={conversation.conversation_id}
                onClick={() => navigate(`/conversations/${conversation.conversation_id}`)}
                className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-bg-secondary)] transition-colors cursor-pointer"
              >
                <td className="py-3 px-4 text-sm text-[var(--admin-text)]">
                  {conversation.phone_number}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text)]">
                  {conversation.user_name || (
                    <span className="text-[var(--admin-text-dim)]">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text-muted)] max-w-xs truncate">
                  {conversation.last_message}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text-muted)]">
                  <div className="hidden lg:block">{formatDate(conversation.last_timestamp)}</div>
                  <div className="lg:hidden">{formatDateShort(conversation.last_timestamp)}</div>
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text)]">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-[var(--admin-text-muted)]" />
                    {conversation.message_count}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    {conversation.rating > 0 ? (
                      <>
                        {Array.from({ length: Math.floor(conversation.rating) }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 text-[var(--admin-accent-yellow)]"
                            fill="currentColor"
                          />
                        ))}
                        {conversation.rating % 1 !== 0 && (
                          <Star className="w-4 h-4 text-[var(--admin-accent-yellow)]" />
                        )}
                        <span className="text-xs text-[var(--admin-text-muted)] ml-1">
                          {conversation.rating.toFixed(1)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-[var(--admin-text-dim)]">No rating</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {conversations.map((conversation) => (
          <div
            key={conversation.conversation_id}
            onClick={() => navigate(`/conversations/${conversation.conversation_id}`)}
            className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-lg p-4 cursor-pointer hover:bg-[var(--admin-bg)] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[var(--admin-text)] truncate">
                  {conversation.phone_number}
                </p>
                {conversation.user_name && (
                  <p className="text-sm text-[var(--admin-text-muted)] mt-1">
                    {conversation.user_name}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                {conversation.rating > 0 ? (
                  <>
                    {Array.from({ length: Math.floor(conversation.rating) }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-[var(--admin-accent-yellow)]"
                        fill="currentColor"
                      />
                    ))}
                    <span className="text-xs text-[var(--admin-text-muted)]">
                      {conversation.rating.toFixed(1)}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-[var(--admin-text-dim)]">No rating</span>
                )}
              </div>
            </div>
            <p className="text-sm text-[var(--admin-text-muted)] mb-3 line-clamp-2">
              {conversation.last_message}
            </p>
            <div className="flex items-center justify-between text-xs text-[var(--admin-text-dim)]">
              <div className="flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span>{conversation.message_count} messages</span>
              </div>
              <span>{formatDateShort(conversation.last_timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

