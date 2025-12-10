import apiClient from "./axios";

export interface Conversation {
  conversation_id: string;
  phone_number: string;
  user_name: string | null;
  last_message: string;
  last_timestamp: string;
  message_count: number;
  rating: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetConversationsParams {
  page?: number;
  limit?: number;
  search?: string;
  phone_number?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: "last_timestamp" | "phone_number" | "message_count";
  sort_order?: "asc" | "desc";
}

export interface GetConversationsResponse {
  success: boolean;
  data: {
    conversations: Conversation[];
    pagination: PaginationInfo;
  };
}

export interface ApiError {
  success: false;
  error: string;
}

/**
 * GET /api/conversations
 * Get all conversations (paginated with search and filters)
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 20, max: 100)
 * - search: string (optional) - Search in phone_number, conversation_id, or message content
 * - phone_number: string (optional) - Filter by phone number (exact match)
 * - start_date: string (optional) - Filter conversations from this date (ISO 8601)
 * - end_date: string (optional) - Filter conversations until this date (ISO 8601)
 * - sort_by: string (optional) - Field to sort by (default: 'last_timestamp')
 * - sort_order: 'asc' | 'desc' (optional) - Sort order (default: 'desc')
 */
export async function getConversations(
  params?: GetConversationsParams
): Promise<GetConversationsResponse> {
  const queryParams = new URLSearchParams();

  // Always include page and limit (with defaults if not provided)
  queryParams.append("page", (params?.page || 1).toString());
  queryParams.append("limit", (params?.limit || 20).toString());

  // Optional parameters
  if (params?.search && params.search.trim()) {
    queryParams.append("search", params.search.trim());
  }
  if (params?.phone_number && params.phone_number.trim()) {
    queryParams.append("phone_number", params.phone_number.trim());
  }
  if (params?.start_date) {
    queryParams.append("start_date", params.start_date);
  }
  if (params?.end_date) {
    queryParams.append("end_date", params.end_date);
  }
  if (params?.sort_by) {
    queryParams.append("sort_by", params.sort_by);
  }
  if (params?.sort_order) {
    queryParams.append("sort_order", params.sort_order);
  }

  const queryString = queryParams.toString();
  const url = `/api/conversations?${queryString}`;

  const response = await apiClient.get<GetConversationsResponse>(url);
  return response.data;
}

