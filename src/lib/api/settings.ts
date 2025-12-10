import apiClient from "./axios";

export interface WebhookStatus {
  _id: string;
  key: string;
  value: boolean;
  description: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface GetWebhookStatusResponse {
  success: boolean;
  data: WebhookStatus;
}

export interface ApiError {
  success: false;
  error: string;
}

/**
 * GET /api/settings/webhook/status
 * Get webhook activation status
 * 
 * Headers:
 * Authorization: Bearer <token> (admin only)
 */
export async function getWebhookStatus(): Promise<GetWebhookStatusResponse> {
  const response = await apiClient.get<GetWebhookStatusResponse>("/api/settings/webhook/status");
  return response.data;
}

/**
 * POST /api/settings/webhook/toggle
 * Toggle webhook activation status
 * 
 * Headers:
 * Authorization: Bearer <token> (admin only)
 */
export interface ToggleWebhookStatusResponse {
  success: boolean;
  data: WebhookStatus;
  message: string;
}

export async function toggleWebhookStatus(): Promise<ToggleWebhookStatusResponse> {
  const response = await apiClient.post<ToggleWebhookStatusResponse>(
    "/api/settings/webhook/toggle"
  );
  return response.data;
}

