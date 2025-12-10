import apiClient from "./axios";

export interface MessageVolumeData {
  date: string;
  count: number;
}

export interface ResponseTimeTrendData {
  date: string;
  avgResponseTime: number;
}

export interface RecentConversation {
  conversation_id: string;
  user_name: string;
  phone_number: string;
  last_message: string;
  time_ago: string;
  rating: number;
}

export interface DashboardData {
  totalConversations: number;
  totalConversationsChange: number;
  activeUsers: number;
  activeUsersChange: number;
  responseAccuracy: number;
  responseAccuracyChange: number;
  satisfactionScore: number;
  satisfactionScoreChange: number;
  messageVolume: MessageVolumeData[];
  responseTimeTrend: ResponseTimeTrendData[];
  recentConversations: RecentConversation[];
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}

/**
 * GET /api/dashboard
 * Get dashboard metrics and analytics
 * 
 * Headers:
 * Authorization: Bearer <token> (admin only)
 */
export async function getDashboardData(): Promise<DashboardResponse> {
  const response = await apiClient.get<DashboardResponse>("/api/dashboard");
  return response.data;
}

