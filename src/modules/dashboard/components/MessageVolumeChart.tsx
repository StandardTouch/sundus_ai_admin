export default function MessageVolumeChart() {
  const data = [40, 60, 30, 70, 90, 80, 50];

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-5">
      <h3 className="text-base sm:text-lg font-semibold mb-3 text-[var(--admin-text)]">Message Volume (Last 7 days)</h3>
      <div className="h-40 sm:h-48 flex items-end gap-2">
        {data.map((height, i) => (
          <div
            key={i}
            style={{
              height: `${height}%`,
              background: `linear-gradient(to top, var(--admin-primary-darker), var(--admin-primary-light))`,
            }}
            className="w-full rounded"
          />
        ))}
      </div>
    </div>
  );
}

