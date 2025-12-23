import type { ResponseTimeBreakdown } from "@/lib/api/analytics";

interface ResponseTimeBreakdownProps {
  data: ResponseTimeBreakdown;
}

export default function ResponseTimeBreakdown({ data }: ResponseTimeBreakdownProps) {
  const breakdownData = [
    { label: "< 1s", percentage: data.fast, color: "green" },
    { label: "1-2s", percentage: data.medium, color: "yellow" },
    { label: "> 2s", percentage: data.slow, color: "red" },
  ];

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Response Time Breakdown</h3>
      <div className="space-y-3">
        {breakdownData.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--admin-text-muted)]">{item.label}</span>
              <span className="text-sm font-medium text-[var(--admin-text)]">{item.percentage}%</span>
            </div>
            <div className="h-2 bg-[var(--admin-bg)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  item.color === "green"
                    ? "bg-green-500"
                    : item.color === "yellow"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

