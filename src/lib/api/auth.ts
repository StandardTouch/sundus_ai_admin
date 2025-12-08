import apiClient from "./axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  last_login_at: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
    expires_at: string;
  };
}

export interface ApiError {
  success: false;
  error: string;
}

/**
 * POST /api/auth/login
 * Authenticate user with username and password
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/api/auth/login", credentials);
  return response.data;
}

/**
 * POST /api/auth/forgot-password
 * Send OTP to user's email
 */
export async function sendOtp(email: string): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post("/api/auth/forgot-password", { email });
  return response.data;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  reset_token?: string;
  expires_in_minutes?: number;
}

/**
 * POST /api/auth/verify-otp
 * Verify OTP and receive a password reset token
 */
export async function verifyOtp(email: string, otp_code: string): Promise<VerifyOtpResponse> {
  const response = await apiClient.post<VerifyOtpResponse>("/api/auth/verify-otp", { 
    email, 
    otp_code 
  });
  return response.data;
}

/**
 * POST /api/auth/reset-password
 * Reset password using reset token
 */
export async function resetPassword(
  token: string,
  new_password: string
): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post("/api/auth/reset-password", { 
    token, 
    new_password 
  });
  return response.data;
}

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<{ success: boolean; data: User }> {
  const response = await apiClient.get<{ success: boolean; data: User }>("/api/auth/me");
  return response.data;
}

/**
 * POST /api/auth/logout
 * Logout user
 */
export async function logout(): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post("/api/auth/logout");
  return response.data;
}

