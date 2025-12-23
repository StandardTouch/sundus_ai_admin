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

/**
 * GET /api/settings/support-phone-number
 * Get support phone number
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 */
export interface GetSupportPhoneNumberResponse {
  success: boolean;
  data: {
    phone_number: string;
  };
}

export async function getSupportPhoneNumber(): Promise<GetSupportPhoneNumberResponse> {
  const response = await apiClient.get<GetSupportPhoneNumberResponse>("/api/settings/support-phone-number");
  return response.data;
}

/**
 * PUT /api/settings/support-phone-number
 * Update support phone number
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * Request Body:
 * {
 *   "phone_number": "+966 9200 09339"
 * }
 */
export interface UpdateSupportPhoneNumberRequest {
  phone_number: string;
}

export interface UpdateSupportPhoneNumberResponse {
  success: boolean;
  data: {
    phone_number: string;
  };
  message: string;
}

export async function updateSupportPhoneNumber(
  data: UpdateSupportPhoneNumberRequest
): Promise<UpdateSupportPhoneNumberResponse> {
  const response = await apiClient.put<UpdateSupportPhoneNumberResponse>(
    "/api/settings/support-phone-number",
    data
  );
  return response.data;
}

