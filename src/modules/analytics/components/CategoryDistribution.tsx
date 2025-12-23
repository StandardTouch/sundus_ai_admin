import type { CategoryDistribution } from "@/lib/api/analytics";

interface CategoryDistributionProps {
  data: CategoryDistribution[];
}

export default function CategoryDistribution({ data }: CategoryDistributionProps) {
  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Category Distribution</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-[var(--admin-text)] font-medium capitalize">{item.category}</span>
                <span className="text-[var(--admin-text-muted)]">({item.count} FAQs)</span>
              </div>
              <span className="text-[var(--admin-text-muted)] font-medium">{item.percentage}%</span>
            </div>
            <div className="h-2 bg-[var(--admin-bg)] rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

