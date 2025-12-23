import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface AnalyticsStatsCardProps {
  icon: LucideIcon;
  iconColor: string;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-500/10", text: "text-blue-500" },
  green: { bg: "bg-green-500/10", text: "text-green-500" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-500" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-500" },
  yellow: { bg: "bg-yellow-500/10", text: "text-yellow-500" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-500" },
};

export default function AnalyticsStatsCard({
  icon: Icon,
  iconColor,
  value,
  label,
  trend,
}: AnalyticsStatsCardProps) {
  const colors = colorMap[iconColor] || colorMap.blue;

  return (
    <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 ${colors.bg} rounded-lg`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            } text-xs`}
          >
            {trend.isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-[var(--admin-text)] mb-1">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      <p className="text-xs text-[var(--admin-text-muted)]">{label}</p>
    </div>
  );
}

