interface ResponseTimeData {
  label: string;
  percentage: number;
  color: string;
}

interface ResponseTimeBreakdownProps {
  data: ResponseTimeData[];
}

export default function ResponseTimeBreakdown({ data }: ResponseTimeBreakdownProps) {
  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Response Time Breakdown</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
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

