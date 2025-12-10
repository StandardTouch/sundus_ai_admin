import { Star } from "lucide-react";
import type { Conversation } from "../utils/dashboardUtils";

interface RecentConversationsProps {
  conversations: Conversation[];
}

export default function RecentConversations({ conversations }: RecentConversationsProps) {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4 text-[var(--admin-text)]">
          Recent Conversations
        </h3>
        <p className="text-sm text-[var(--admin-text-muted)] text-center py-8">
          No recent conversations
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold mb-4 text-[var(--admin-text)]">
        Recent Conversations
      </h3>
      <ul className="divide-y divide-[var(--admin-border)]">
        {conversations.map((chat, i) => (
          <li
            key={chat.conversation_id || i}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 py-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold truncate text-[var(--admin-text)]">{chat.user}</p>
              </div>
              <p className="text-[var(--admin-text-muted)] text-xs sm:text-sm mb-1">
                {chat.phone_number}
              </p>
              <p className="text-[var(--admin-text-muted)] text-sm truncate">{chat.message}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-sm text-[var(--admin-text-dim)] flex-shrink-0">
              <p className="whitespace-nowrap">{chat.time}</p>
              <div className="flex">
                {Array.from({ length: chat.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-4 h-4 text-[var(--admin-accent-yellow)]"
                    fill="currentColor"
                  />
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

