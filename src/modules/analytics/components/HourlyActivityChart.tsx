import type { HourlyActivityData } from "@/lib/api/analytics";

interface HourlyActivityChartProps {
  data: HourlyActivityData[];
}

export default function HourlyActivityChart({ data }: HourlyActivityChartProps) {
  const maxConversations = Math.max(...data.map((d) => d.conversations), 1);

  const formatHour = (hour: number): string => {
    return `${hour.toString().padStart(2, "0")}:00`;
  };

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Hourly Activity (Today)</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--admin-text-muted)]">{formatHour(item.hour)}</span>
              <div className="flex items-center gap-4">
                <span className="text-[var(--admin-text)] font-medium">{item.conversations} conv</span>
                <span className="text-[var(--admin-text-muted)]">{item.messages} msgs</span>
              </div>
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

