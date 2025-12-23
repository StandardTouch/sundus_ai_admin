interface WeeklyData {
  day: string;
  conversations: number;
  faqs: number;
}

interface WeeklyTrendChartProps {
  data: WeeklyData[];
}

export default function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  const maxConversations = Math.max(...data.map((d) => d.conversations));
  const maxFaqs = Math.max(...data.map((d) => d.faqs));

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Weekly Trend</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--admin-text-muted)]">{item.day}</span>
              <div className="flex items-center gap-4">
                <span className="text-[var(--admin-text)] font-medium">{item.conversations} conv</span>
                <span className="text-[var(--admin-text-muted)]">{item.faqs} FAQs</span>
              </div>
            </div>
            <div className="flex gap-2 h-2">
              <div
                className="bg-blue-500 rounded-full"
                style={{ width: `${(item.conversations / maxConversations) * 100}%` }}
              />
              <div
                className="bg-purple-500 rounded-full"
                style={{ width: `${(item.faqs / maxFaqs) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

