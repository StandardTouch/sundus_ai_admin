export default function DashboardSkeleton() {
  return (
    <div>
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-5"
          >
            <div className="h-4 shimmer rounded w-24 mb-3"></div>
            <div className="h-8 shimmer rounded w-32 mb-2"></div>
            <div className="h-3 shimmer rounded w-40"></div>
          </div>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-10">
        {/* Message Volume Chart Skeleton */}
        <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-5">
          <div className="h-5 shimmer rounded w-48 mb-3"></div>
          <div className="h-40 sm:h-48 flex items-end gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 shimmer rounded"
                style={{
                  height: `${30 + (i * 8)}%`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Response Time Chart Skeleton */}
        <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-5">
          <div className="h-5 shimmer rounded w-48 mb-3"></div>
          <div className="h-40 sm:h-48 flex items-end gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 shimmer rounded-t"
                style={{
                  height: `${35 + (i * 6)}%`,
                }}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-3 shimmer rounded w-8"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Conversations Skeleton */}
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
        <div className="h-5 shimmer rounded w-48 mb-4"></div>
        <div className="divide-y divide-[var(--admin-border)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="py-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                <div className="flex-1 min-w-0">
                  <div className="h-4 shimmer rounded w-32 mb-1"></div>
                  <div className="h-3 shimmer rounded w-24 mb-1"></div>
                  <div className="h-3 shimmer rounded w-full max-w-xs"></div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="h-3 shimmer rounded w-12"></div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div
                        key={j}
                        className="h-4 w-4 shimmer rounded"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

