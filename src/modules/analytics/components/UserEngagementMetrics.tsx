interface EngagementMetric {
  label: string;
  value: string;
  highlight?: boolean;
}

interface UserEngagementMetricsProps {
  metrics: EngagementMetric[];
}

export default function UserEngagementMetrics({ metrics }: UserEngagementMetricsProps) {
  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">User Engagement</h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--admin-text-muted)]">{metric.label}</span>
              <span
                className={`text-lg font-bold ${
                  metric.highlight ? "text-green-500" : "text-[var(--admin-text)]"
                }`}
              >
                {metric.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

