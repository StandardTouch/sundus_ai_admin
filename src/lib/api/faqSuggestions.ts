import apiClient from "./axios";

export interface AISuggestion {
  source_conversation_id: string;
  source_message_id: string;
  confidence_score: number;
  suggested_at: string;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_notes?: string | null;
}

export interface FAQSuggestion {
  _id: string;
  question: string;
  question_ar?: string;
  answer: string;
  answer_ar?: string;
  category?: string;
  vector_id?: string;
  source: "ai_suggested";
  status: "pending_review" | "approved" | "rejected";
  ai_suggestion: AISuggestion;
  usage_count?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetSuggestionsParams {
  page?: number;
  limit?: number;
}

export interface GetSuggestionsResponse {
  success: boolean;
  data: {
    suggestions: FAQSuggestion[];
    pagination: PaginationInfo;
  };
}

export interface GetSuggestionByIdResponse {
  success: boolean;
  data: FAQSuggestion;
}

export interface ApproveSuggestionRequest {
  answer?: string;
  answer_ar?: string;
  category?: string;
}

export interface ApproveSuggestionResponse {
  success: boolean;
  data: FAQSuggestion;
  message: string;
}

export interface RejectSuggestionRequest {
  review_notes?: string;
}

export interface RejectSuggestionResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

/**
 * GET /api/faqs/suggestions
 * Get all pending FAQ suggestions (paginated)
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * Query Parameters:
 * - page: number (default: 1) - Page number for pagination
 * - limit: number (default: 10, max: 100) - Number of items per page
 */
export async function getSuggestions(params?: GetSuggestionsParams): Promise<GetSuggestionsResponse> {
  const queryParams = new URLSearchParams();
  
  // Always include page and limit (with defaults if not provided)
  queryParams.append("page", (params?.page || 1).toString());
  queryParams.append("limit", (params?.limit || 10).toString());

  const queryString = queryParams.toString();
  const url = `/api/faqs/suggestions?${queryString}`;
  
  const response = await apiClient.get<GetSuggestionsResponse>(url);
  return response.data;
}

/**
 * GET /api/faqs/suggestions/:id
 * Get specific suggestion
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * URL Parameters:
 * - id: string (Suggestion ID)
 */
export async function getSuggestionById(id: string): Promise<GetSuggestionByIdResponse> {
  const response = await apiClient.get<GetSuggestionByIdResponse>(`/api/faqs/suggestions/${id}`);
  return response.data;
}

/**
 * POST /api/faqs/suggestions/:id/approve
 * Approve suggestion (activate as FAQ)
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * URL Parameters:
 * - id: string (Suggestion ID)
 * 
 * Request Body:
 * - answer: string (required)
 * - answer_ar?: string (optional)
 * - question?: string (optional) - Override the suggested question
 * - question_ar?: string (optional)
 * - category?: string (optional)
 */
export async function approveSuggestion(id: string, data: ApproveSuggestionRequest): Promise<ApproveSuggestionResponse> {
  const response = await apiClient.post<ApproveSuggestionResponse>(`/api/faqs/suggestions/${id}/approve`, data);
  return response.data;
}

/**
 * POST /api/faqs/suggestions/:id/reject
 * Reject suggestion
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * URL Parameters:
 * - id: string (Suggestion ID)
 * 
 * Request Body (optional):
 * - review_notes?: string - Optional rejection reason/notes
 */
export async function rejectSuggestion(id: string, data?: RejectSuggestionRequest): Promise<RejectSuggestionResponse> {
  const response = await apiClient.post<RejectSuggestionResponse>(`/api/faqs/suggestions/${id}/reject`, data || {});
  return response.data;
}

