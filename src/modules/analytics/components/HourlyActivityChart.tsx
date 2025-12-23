interface HourlyData {
  hour: string;
  conversations: number;
}

interface HourlyActivityChartProps {
  data: HourlyData[];
}

export default function HourlyActivityChart({ data }: HourlyActivityChartProps) {
  const maxConversations = Math.max(...data.map((d) => d.conversations));

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Hourly Activity (Today)</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--admin-text-muted)]">{item.hour}</span>
              <span className="text-[var(--admin-text)] font-medium">{item.conversations} conversations</span>
            </div>
            <div className="h-2 bg-[var(--admin-bg)] rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all"
                style={{ width: `${(item.conversations / maxConversations) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

