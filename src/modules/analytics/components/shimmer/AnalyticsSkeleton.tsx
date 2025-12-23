export default function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div>
        <div className="h-8 shimmer rounded w-64 mb-2"></div>
        <div className="h-4 shimmer rounded w-96"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4">
            <div className="h-10 shimmer rounded w-10 mb-3"></div>
            <div className="h-8 shimmer rounded w-20 mb-2"></div>
            <div className="h-4 shimmer rounded w-24"></div>
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
            <div className="h-6 shimmer rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j}>
                  <div className="h-4 shimmer rounded w-full mb-2"></div>
                  <div className="h-2 shimmer rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
            <div className="h-6 shimmer rounded w-40 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-20 shimmer rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

