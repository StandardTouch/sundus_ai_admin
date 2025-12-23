export default function SuggestionsSkeleton() {
  return (
    <div>
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <div className="h-8 shimmer rounded w-48 mb-2"></div>
          <div className="h-4 shimmer rounded w-64"></div>
        </div>
      </div>

      {/* Table Container Skeleton */}
      <div className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg overflow-hidden">
        {/* Desktop Table Skeleton */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-[var(--admin-border)]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <th key={i} className="text-left py-3 px-4">
                    <div className="h-4 shimmer rounded w-24"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[var(--admin-border)]">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="py-3 px-4">
                      <div className="h-4 shimmer rounded w-full max-w-[120px]"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Skeleton */}
        <div className="md:hidden space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-lg p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="h-5 shimmer rounded w-32 mb-2"></div>
                  <div className="h-4 shimmer rounded w-48 mb-2"></div>
                  <div className="h-4 shimmer rounded w-40"></div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="h-3 shimmer rounded w-20"></div>
                <div className="h-3 shimmer rounded w-16"></div>
                <div className="h-3 shimmer rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-[var(--admin-border)]">
        <div className="h-4 shimmer rounded w-48"></div>
        <div className="flex items-center gap-4">
          <div className="h-10 shimmer rounded w-24"></div>
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 shimmer rounded-lg"></div>
            <div className="h-10 w-10 shimmer rounded-lg"></div>
            <div className="h-10 w-10 shimmer rounded-lg"></div>
            <div className="h-10 w-10 shimmer rounded-lg"></div>
            <div className="h-10 w-10 shimmer rounded-lg"></div>
          </div>
          <div className="h-10 w-10 shimmer rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

