import type { UserEngagement } from "@/lib/api/analytics";

interface UserEngagementMetricsProps {
  data: UserEngagement;
}

export default function UserEngagementMetrics({ data }: UserEngagementMetricsProps) {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">User Engagement</h3>
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--admin-text-muted)]">Avg Messages per Conversation</span>
            <span className="text-lg font-bold text-[var(--admin-text)]">
              {data.avgMessagesPerConversation.toFixed(1)}
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--admin-text-muted)]">Avg Session Duration</span>
            <span className="text-lg font-bold text-[var(--admin-text)]">
              {formatDuration(data.avgSessionDuration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

