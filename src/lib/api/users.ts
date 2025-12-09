import apiClient from "./axios";

export interface User {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  role: "admin" | "customer_support";
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: "admin" | "customer_support";
  is_active?: boolean;
  sort_by?: "username" | "email" | "full_name" | "role" | "created_at" | "updated_at" | "last_login_at";
  sort_order?: "asc" | "desc";
}

export interface GetUsersResponse {
  success: boolean;
  data: {
    users: User[];
    pagination: PaginationInfo;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  full_name: string;
  role: "admin" | "customer_support";
  is_active: boolean;
}

export interface CreateUserResponse {
  success: boolean;
  data: {
    _id: string;
    username: string;
    email: string;
    full_name: string;
    role: "admin" | "customer_support";
    is_active: boolean;
    created_by: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * GET /api/users
 * Get all users with pagination, search, and filters
 * 
 * Query Parameters:
 * - page: number (default: 1) - Page number for pagination
 * - limit: number (default: 10) - Number of items per page (max: 100)
 * - search: string (optional) - Search in username, email, or full_name
 * - role: 'admin' | 'customer_support' (optional) - Filter by role
 * - is_active: boolean (optional) - Filter by active status
 * - sort_by: string (optional) - Field to sort by (default: 'created_at')
 * - sort_order: 'asc' | 'desc' (optional) - Sort order (default: 'desc')
 */
export async function getUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
  const queryParams = new URLSearchParams();
  
  // Always include page and limit (with defaults if not provided)
  queryParams.append("page", (params?.page || 1).toString());
  queryParams.append("limit", (params?.limit || 10).toString());
  
  // Optional parameters
  if (params?.search && params.search.trim()) {
    queryParams.append("search", params.search.trim());
  }
  if (params?.role) {
    queryParams.append("role", params.role);
  }
  if (params?.is_active !== undefined) {
    queryParams.append("is_active", params.is_active.toString());
  }
  if (params?.sort_by) {
    queryParams.append("sort_by", params.sort_by);
  }
  if (params?.sort_order) {
    queryParams.append("sort_order", params.sort_order);
  }

  const queryString = queryParams.toString();
  const url = `/api/users?${queryString}`;
  
  const response = await apiClient.get<GetUsersResponse>(url);
  return response.data;
}

/**
 * POST /api/users
 * Create new user (admin only)
 * 
 * Request Body:
 * - username: string (required)
 * - email: string (required)
 * - password: string (required)
 * - full_name: string (required)
 * - role: "admin" | "customer_support" (required)
 * - is_active: boolean (required)
 */
export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  const response = await apiClient.post<CreateUserResponse>("/api/users", data);
  return response.data;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  full_name?: string;
  role?: "admin" | "customer_support";
  is_active?: boolean;
}

export interface UpdateUserResponse {
  success: boolean;
  data: {
    _id: string;
    username: string;
    email: string;
    full_name: string;
    role: "admin" | "customer_support";
    is_active: boolean;
    updated_at: string;
  };
}

/**
 * PUT /api/users/:id
 * Update user (admin only)
 * 
 * URL Parameters:
 * - id: string (user ID)
 * 
 * Request Body (all fields optional):
 * - email: string (optional)
 * - password: string (optional)
 * - full_name: string (optional)
 * - role: "admin" | "customer_support" (optional)
 * - is_active: boolean (optional)
 */
export async function updateUser(id: string, data: UpdateUserRequest): Promise<UpdateUserResponse> {
  const response = await apiClient.put<UpdateUserResponse>(`/api/users/${id}`, data);
  return response.data;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

/**
 * DELETE /api/users/:id
 * Delete user (admin only, cannot delete self)
 * 
 * URL Parameters:
 * - id: string (user ID)
 */
export async function deleteUser(id: string): Promise<DeleteUserResponse> {
  const response = await apiClient.delete<DeleteUserResponse>(`/api/users/${id}`);
  return response.data;
}

