import { Users, MessageSquare, HelpCircle, Clock, BarChart3 } from "lucide-react";
import {
  AnalyticsStatsCard,
  WeeklyTrendChart,
  HourlyActivityChart,
  TopFaqsList,
  CategoryDistribution,
  ResponseTimeBreakdown,
  UserEngagementMetrics,
  PerformanceMetrics,
} from "../components";

export default function Analytics() {
  // Dummy data
  const stats = [
    {
      icon: MessageSquare,
      iconColor: "blue",
      value: 1247,
      label: "Total Conversations",
      trend: { value: 12.5, isPositive: true },
    },
    {
      icon: Users,
      iconColor: "green",
      value: 342,
      label: "Active Users",
      trend: { value: 8.3, isPositive: true },
    },
    {
      icon: HelpCircle,
      iconColor: "purple",
      value: 892,
      label: "FAQs Used",
      trend: { value: 5.2, isPositive: false },
    },
    {
      icon: Clock,
      iconColor: "orange",
      value: "1.2s",
      label: "Avg Response Time",
    },
    {
      icon: BarChart3,
      iconColor: "yellow",
      value: "94.5%",
      label: "Satisfaction Rate",
    },
    {
      icon: MessageSquare,
      iconColor: "indigo",
      value: 87,
      label: "Today",
    },
  ];

  const weeklyTrend = [
    { day: "Mon", conversations: 142, faqs: 98 },
    { day: "Tue", conversations: 156, faqs: 112 },
    { day: "Wed", conversations: 178, faqs: 125 },
    { day: "Thu", conversations: 165, faqs: 118 },
    { day: "Fri", conversations: 189, faqs: 134 },
    { day: "Sat", conversations: 134, faqs: 95 },
    { day: "Sun", conversations: 98, faqs: 68 },
  ];

  const hourlyData = [
    { hour: "00:00", conversations: 12 },
    { hour: "04:00", conversations: 8 },
    { hour: "08:00", conversations: 45 },
    { hour: "12:00", conversations: 78 },
    { hour: "16:00", conversations: 92 },
    { hour: "20:00", conversations: 65 },
  ];

  const topFaqs = [
    { question: "What is your return policy?", usage: 234, category: "policies" },
    { question: "How long does shipping take?", usage: 189, category: "shipping" },
    { question: "What payment methods do you accept?", usage: 156, category: "payment" },
    { question: "How do I track my order?", usage: 142, category: "orders" },
    { question: "Can I cancel my order?", usage: 128, category: "orders" },
  ];

  const categoryUsage = [
    { category: "policies", count: 456, percentage: 32 },
    { category: "shipping", count: 342, percentage: 24 },
    { category: "payment", count: 289, percentage: 20 },
    { category: "orders", count: 234, percentage: 16 },
    { category: "products", count: 145, percentage: 10 },
  ];

  const responseTimeData = [
    { label: "< 1s", percentage: 68, color: "green" },
    { label: "1-2s", percentage: 24, color: "yellow" },
    { label: "> 2s", percentage: 8, color: "red" },
  ];

  const engagementMetrics = [
    { label: "Avg Messages per Conversation", value: "4.2" },
    { label: "Avg Session Duration", value: "3m 24s" },
    { label: "FAQ Resolution Rate", value: "87%", highlight: true },
  ];

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
          <WeeklyTrendChart data={weeklyTrend} />
          <HourlyActivityChart data={hourlyData} />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopFaqsList faqs={topFaqs} />
          <CategoryDistribution data={categoryUsage} />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ResponseTimeBreakdown data={responseTimeData} />
          <UserEngagementMetrics metrics={engagementMetrics} />
          <PerformanceMetrics metrics={performanceMetrics} />
        </div>
      </div>
    </main>
  );
}
