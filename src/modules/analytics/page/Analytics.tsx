import { useEffect } from "react";
import { Users, MessageSquare, HelpCircle, Clock, BarChart3 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAnalytics } from "../store";
import { showError } from "@/lib/utils/toast";
import {
  AnalyticsStatsCard,
  WeeklyTrendChart,
  HourlyActivityChart,
  TopFaqsList,
  CategoryDistribution,
  ResponseTimeBreakdown,
  UserEngagementMetrics,
  PerformanceMetrics,
  AnalyticsSkeleton,
} from "../components";

export default function Analytics() {
  const dispatch = useAppDispatch();
  const { data, isLoading, error } = useAppSelector((state) => state.analytics);

  useEffect(() => {
    if (!data) {
      dispatch(fetchAnalytics());
    }
  }, [dispatch, data]);

  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  if (isLoading || !data) {
    return (
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <AnalyticsSkeleton />
      </main>
    );
  }

  // Format response time from milliseconds to seconds
  const formatResponseTime = (ms: number): string => {
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Prepare stats cards
  const stats = [
    {
      icon: MessageSquare,
      iconColor: "blue",
      value: data.totalConversations,
      label: "Total Conversations",
      trend: { value: data.totalConversationsChange, isPositive: data.totalConversationsChange >= 0 },
    },
    {
      icon: Users,
      iconColor: "green",
      value: data.activeUsers,
      label: "Active Users",
      trend: { value: data.activeUsersChange, isPositive: data.activeUsersChange >= 0 },
    },
    {
      icon: HelpCircle,
      iconColor: "purple",
      value: data.faqsUsed,
      label: "FAQs Used",
      trend: { value: data.faqsUsedChange, isPositive: data.faqsUsedChange >= 0 },
    },
    {
      icon: Clock,
      iconColor: "orange",
      value: formatResponseTime(data.avgResponseTime),
      label: "Avg Response Time",
    },
    {
      icon: BarChart3,
      iconColor: "yellow",
      value: `${data.satisfactionRate.toFixed(1)}%`,
      label: "Satisfaction Rate",
      trend: { value: data.satisfactionRateChange, isPositive: data.satisfactionRateChange >= 0 },
    },
    {
      icon: MessageSquare,
      iconColor: "indigo",
      value: data.messagesToday,
      label: "Messages Today",
    },
  ];

  // Performance metrics (not in API, keeping as dummy data for now)
  const performanceMetrics = [
    { label: "Uptime", value: "99.9%", percentage: 99.9, color: "green" },
    { label: "API Response Time", value: "142ms", percentage: 85, color: "blue" },
    { label: "Cache Hit Rate", value: "76%", percentage: 76, color: "purple" },
  ];

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--admin-text)]">Analytics Dashboard</h2>
          <p className="text-sm text-[var(--admin-text-muted)]">
            Monitor performance metrics and user engagement insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <AnalyticsStatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyTrendChart data={data.weeklyTrend} />
          <HourlyActivityChart data={data.hourlyActivity} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopFaqsList faqs={data.topFAQs} />
          <CategoryDistribution data={data.categoryDistribution} />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ResponseTimeBreakdown data={data.responseTimeBreakdown} />
          <UserEngagementMetrics data={data.userEngagement} />
          <PerformanceMetrics metrics={performanceMetrics} />
        </div>
      </div>
    </main>
  );
}
