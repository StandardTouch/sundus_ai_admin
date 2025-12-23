import type { WeeklyTrendData } from "@/lib/api/analytics";

interface WeeklyTrendChartProps {
  data: WeeklyTrendData[];
}

const dayOrder: Record<string, number> = {
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  Sun: 7,
};

export default function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  // Sort data by day order (Mon to Sun)
  const sortedData = [...data].sort((a, b) => {
    const orderA = dayOrder[a.day] || 999;
    const orderB = dayOrder[b.day] || 999;
    return orderA - orderB;
  });

  const maxConversations = Math.max(...sortedData.map((d) => d.conversations), 1);
  const maxFaqs = Math.max(...sortedData.map((d) => d.faqs), 1);

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Weekly Trend</h3>
      <div className="space-y-3">
        {sortedData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--admin-text-muted)]">{item.day}</span>
              <div className="flex items-center gap-4">
                <span className="text-[var(--admin-text)] font-medium">{item.conversations} conv</span>
                <span className="text-[var(--admin-text-muted)]">{item.faqs} FAQs</span>
                <span className="text-[var(--admin-text-muted)]">{item.messages} msgs</span>
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

