import apiClient from "./axios";

export interface WeeklyTrendData {
  date: string;
  day: string;
  conversations: number;
  faqs: number;
  messages: number;
}

export interface HourlyActivityData {
  hour: number;
  conversations: number;
  messages: number;
}

export interface TopFAQ {
  _id: string;
  question: string;
  category: string;
  usage_count: number;
}

export interface CategoryDistribution {
  category: string;
  count: number;
  totalUsage: number;
  percentage: number;
}

export interface ResponseTimeBreakdown {
  fast: number;
  medium: number;
  slow: number;
}

export interface UserEngagement {
  avgMessagesPerConversation: number;
  avgSessionDuration: number; // in seconds
}

export interface AnalyticsData {
  totalConversations: number;
  totalConversationsChange: number;
  activeUsers: number;
  activeUsersChange: number;
  totalMessages: number;
  messagesToday: number;
  faqsUsed: number;
  faqsUsedChange: number;
  satisfactionRate: number;
  satisfactionRateChange: number;
  avgResponseTime: number; // in milliseconds
  weeklyTrend: WeeklyTrendData[];
  hourlyActivity: HourlyActivityData[];
  topFAQs: TopFAQ[];
  categoryDistribution: CategoryDistribution[];
  responseTimeBreakdown: ResponseTimeBreakdown;
  userEngagement: UserEngagement;
}

export interface GetAnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}

/**
 * GET /api/analytics
 * Get comprehensive analytics data
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 */
export async function getAnalytics(): Promise<GetAnalyticsResponse> {
  const response = await apiClient.get<GetAnalyticsResponse>("/api/analytics");
  return response.data;
}

