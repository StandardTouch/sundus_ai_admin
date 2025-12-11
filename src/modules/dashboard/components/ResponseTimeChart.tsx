
interface ResponseTimeChartProps {
  data: { dates: string[]; times: number[] };
}

export default function ResponseTimeChart({ data }: ResponseTimeChartProps) {
  if (!data || data.times.length === 0) {
    return (
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-semibold mb-3 text-[var(--admin-text)]">
          Response Time Trend
        </h3>
        <div className="h-40 sm:h-48 flex items-center justify-center text-[var(--admin-text-muted)] text-sm">
          No data available
        </div>
      </div>
    );
  }

  const maxTime = Math.max(...data.times);
  const minTime = Math.min(...data.times);
  const range = maxTime - minTime || 1; // Avoid division by zero

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-3 text-[var(--admin-text)]">
        Response Time Trend
      </h3>
      <div className="h-40 sm:h-48 flex flex-col">
        {/* Chart area */}
        <div className="flex-1 flex items-end gap-1 mb-2">
          {data.times.map((time, i) => {
            const height = ((time - minTime) / range) * 100;
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center"
                style={{ height: "100%" }}
              >
                <div
                  style={{
                    height: `${height}%`,
                    width: "100%",
                    background: `linear-gradient(to top, var(--admin-secondary-dark), var(--admin-secondary-light))`,
                  }}
                  className="rounded-t"
                />
              </div>
            );
          })}
        </div>
        {/* Labels */}
        <div className="flex justify-between text-xs text-[var(--admin-text-dim)] mt-2">
          {data.dates.map((date, i) => (
            <span key={i} className="truncate">
              {date}
            </span>
          ))}
        </div>
        {/* Time values */}
        <div className="flex justify-between text-xs text-[var(--admin-text-muted)] mt-1">
          {data.times.map((time, i) => (
            <span key={i} className="truncate">
              {time.toFixed(0)}ms
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

