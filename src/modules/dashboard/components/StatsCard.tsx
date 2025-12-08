interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  gradientFrom: string;
  gradientTo: string;
}

export default function StatsCard({ title, value, change, gradientFrom, gradientTo }: StatsCardProps) {
  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-[var(--admin-primary)]/10 transition-all">
      <p className="text-sm text-[var(--admin-text-muted)]">{title}</p>
      <h3
        className="text-xl sm:text-2xl font-bold mt-2 mb-1 text-transparent bg-clip-text"
        style={{
          backgroundImage: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value}
      </h3>
      <p className="text-xs text-[var(--admin-text-dim)]">{change}</p>
    </div>
  );
}

