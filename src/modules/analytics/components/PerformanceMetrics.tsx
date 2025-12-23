interface PerformanceMetric {
  label: string;
  value: string;
  percentage: number;
  color: string;
}

interface PerformanceMetricsProps {
  metrics: PerformanceMetric[];
}

export default function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Performance Metrics</h3>
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-[var(--admin-text-muted)]">{metric.label}</span>
              <span className="text-sm font-medium text-[var(--admin-text)]">{metric.value}</span>
            </div>
            <div className="h-1.5 bg-[var(--admin-bg)] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  metric.color === "green"
                    ? "bg-green-500"
                    : metric.color === "blue"
                    ? "bg-blue-500"
                    : "bg-purple-500"
                }`}
                style={{ width: `${metric.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

