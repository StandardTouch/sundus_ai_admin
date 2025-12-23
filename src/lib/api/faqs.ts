import apiClient from "./axios";

export interface FAQ {
  _id: string;
  question: string;
  question_ar?: string;
  answer: string;
  answer_ar?: string;
  category: string;
  vector_id: string;
  source: "manual" | "ai_suggested";
  status: "active" | "pending_review" | "rejected";
  usage_count: number;
  last_used_at: string | null;
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

export interface GetFaqsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: "active" | "pending_review" | "rejected";
  source?: "manual" | "ai_suggested";
  is_active?: boolean;
  has_arabic?: boolean;
}

export interface GetFaqsResponse {
  success: boolean;
  data: {
    faqs: FAQ[];
    pagination: PaginationInfo;
  };
}

export interface GetFaqByIdResponse {
  success: boolean;
  data: FAQ;
}

export interface GetFaqCategoriesResponse {
  success: boolean;
  data: {
    categories: string[];
    count: number;
  };
}

export interface CreateFaqRequest {
  question: string;
  question_ar?: string;
  answer: string;
  answer_ar?: string;
  category?: string;
}

export interface CreateFaqResponse {
  success: boolean;
  data: FAQ;
}

export interface UpdateFaqRequest {
  question?: string;
  question_ar?: string;
  answer?: string;
  answer_ar?: string;
  category?: string;
  is_active?: boolean;
  status?: "active" | "pending_review" | "rejected";
}

export interface UpdateFaqResponse {
  success: boolean;
  data: FAQ;
}

export interface DeleteFaqResponse {
  success: boolean;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

/**
 * GET /api/faqs
 * Get all FAQs (paginated with search and filters)
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * Query Parameters:
 * - page: number (default: 1) - Page number for pagination
 * - limit: number (default: 10, max: 100) - Number of items per page
 * - search: string (optional) - Search in question or answer (case-insensitive)
 * - category: string (optional) - Filter by category (e.g., "policies", "shipping", "payment")
 * - status: 'active' | 'pending_review' | 'rejected' (optional) - Filter by status
 * - source: 'manual' | 'ai_suggested' (optional) - Filter by source
 * - is_active: boolean (optional) - Filter by active status (true/false)
 */
export async function getAllFaqs(params?: GetFaqsParams): Promise<GetFaqsResponse> {
  const queryParams = new URLSearchParams();
  
  // Always include page and limit (with defaults if not provided)
  queryParams.append("page", (params?.page || 1).toString());
  queryParams.append("limit", (params?.limit || 10).toString());
  
  // Optional parameters
  if (params?.search && params.search.trim()) {
    queryParams.append("search", params.search.trim());
  }
  if (params?.category) {
    queryParams.append("category", params.category);
  }
  if (params?.status) {
    queryParams.append("status", params.status);
  }
  if (params?.source) {
    queryParams.append("source", params.source);
  }
  if (params?.is_active !== undefined) {
    queryParams.append("is_active", params.is_active.toString());
  }
  if (params?.has_arabic !== undefined) {
    queryParams.append("has_arabic", params.has_arabic.toString());
  }

  const queryString = queryParams.toString();
  const url = `/api/faqs?${queryString}`;
  
  const response = await apiClient.get<GetFaqsResponse>(url);
  return response.data;
}

/**
 * GET /api/faqs/:id
 * Get FAQ by ID
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * URL Parameters:
 * - id: string (FAQ ID)
 */
export async function getFaqById(id: string): Promise<GetFaqByIdResponse> {
  const response = await apiClient.get<GetFaqByIdResponse>(`/api/faqs/${id}`);
  return response.data;
}

/**
 * GET /api/faqs/categories
 * Get all unique FAQ categories
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 */
export async function getFaqCategories(): Promise<GetFaqCategoriesResponse> {
  const response = await apiClient.get<GetFaqCategoriesResponse>("/api/faqs/categories");
  return response.data;
}

/**
 * POST /api/faqs
 * Create new FAQ (admin or customer_support only)
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * Request Body:
 * - question: string (required)
 * - answer: string (required)
 * - answer_ar: string (optional)
 * - category: string (optional)
 */
export async function createFaq(data: CreateFaqRequest): Promise<CreateFaqResponse> {
  const response = await apiClient.post<CreateFaqResponse>("/api/faqs", data);
  return response.data;
}

/**
 * PUT /api/faqs/:id
 * Update FAQ (admin or customer_support only)
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * URL Parameters:
 * - id: string (FAQ ID)
 * 
 * Request Body (all fields optional):
 * - question: string
 * - answer: string
 * - answer_ar: string
 * - category: string
 * - is_active: boolean
 * - status: "active" | "pending_review" | "rejected"
 */
export async function updateFaq(id: string, data: UpdateFaqRequest): Promise<UpdateFaqResponse> {
  const response = await apiClient.put<UpdateFaqResponse>(`/api/faqs/${id}`, data);
  return response.data;
}

/**
 * DELETE /api/faqs/:id
 * Delete FAQ (admin or customer_support only)
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * URL Parameters:
 * - id: string (FAQ ID)
 * 
 * Note: FAQ will be removed from both MongoDB and Pinecone
 */
export async function deleteFaq(id: string): Promise<DeleteFaqResponse> {
  const response = await apiClient.delete<DeleteFaqResponse>(`/api/faqs/${id}`);
  return response.data;
}

