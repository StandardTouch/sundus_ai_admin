import type {
  DashboardData,
  RecentConversation,
  MessageVolumeData,
  ResponseTimeTrendData,
} from "@/lib/api/dashboard";

export interface Conversation {
  conversation_id: string;
  user: string;
  phone_number: string;
  message: string;
  time: string;
  rating: number;
}

export interface StatsData {
  title: string;
  value: string;
  change: string;
  gradientFrom: string;
  gradientTo: string;
}

/**
 * Transform API dashboard data to stats cards format
 */
export const transformStatsData = (data: DashboardData): StatsData[] => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString("en-US");
  };

  const formatPercentage = (num: number): string => {
    const sign = num >= 0 ? "+" : "";
    return `${sign}${num.toFixed(1)}%`;
  };

  return [
    {
      title: "Total Conversations",
      value: formatNumber(data.totalConversations),
      change: `${formatPercentage(data.totalConversationsChange)} from last month`,
      gradientFrom: "var(--admin-primary-dark)",
      gradientTo: "var(--admin-accent-cyan)",
    },
    {
      title: "Active Users",
      value: formatNumber(data.activeUsers),
      change: `${formatPercentage(data.activeUsersChange)} this week`,
      gradientFrom: "var(--admin-primary-light)",
      gradientTo: "var(--admin-accent-pink)",
    },
    {
      title: "Response Accuracy",
      value: `${data.responseAccuracy.toFixed(1)}%`,
      change: `${formatPercentage(data.responseAccuracyChange)} improvement`,
      gradientFrom: "var(--admin-accent-green)",
      gradientTo: "var(--admin-accent-emerald)",
    },
    {
      title: "Satisfaction Score",
      value: `${(data.satisfactionScore * 5).toFixed(1)} / 5.0`,
      change: data.satisfactionScoreChange >= 0 ? "↑ steady performance" : "↓ needs attention",
      gradientFrom: "var(--admin-accent-yellow)",
      gradientTo: "var(--admin-accent-orange)",
    },
  ];
};

/**
 * Transform API recent conversations to component format
 */
export const transformRecentConversations = (
  conversations: RecentConversation[]
): Conversation[] => {
  return conversations.map((conv) => ({
    conversation_id: conv.conversation_id,
    user: conv.user_name,
    phone_number: conv.phone_number,
    message: conv.last_message,
    time: conv.time_ago,
    rating: conv.rating,
  }));
};

/**
 * Transform message volume data for chart display
 */
export const transformMessageVolume = (
  data: MessageVolumeData[]
): number[] => {
  if (data.length === 0) return [];
  
  const maxCount = Math.max(...data.map((d) => d.count));
  if (maxCount === 0) return data.map(() => 0);
  
  // Normalize to percentage (0-100) for chart display
  return data.map((d) => (d.count / maxCount) * 100);
};

/**
 * Transform response time trend data for chart display
 */
export const transformResponseTimeTrend = (
  data: ResponseTimeTrendData[]
): { dates: string[]; times: number[] } => {
  return {
    dates: data.map((d) => {
      // Format date for display (e.g., "Jan 11")
      const date = new Date(d.date);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    times: data.map((d) => d.avgResponseTime),
  };
};

