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

/**
 * GET /api/settings/tools
 * Get all tools with their enable/disable status
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 */
export interface Tool {
  _id: string;
  tool_name: string;
  category: string;
  display_name: string;
  description: string;
  is_enabled: boolean;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetToolsResponse {
  success: boolean;
  data: {
    tools: Tool[];
  };
}

export async function getTools(): Promise<GetToolsResponse> {
  const response = await apiClient.get<GetToolsResponse>("/api/settings/tools");
  return response.data;
}

/**
 * PUT /api/settings/tools/:toolName/toggle
 * Toggle tool enable/disable status
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * URL Parameters:
 * - toolName: string (Tool name, e.g., "search_products", "track_order")
 */
export interface ToggleToolResponse {
  success: boolean;
  data: Tool;
  message: string;
}

export async function toggleTool(toolName: string): Promise<ToggleToolResponse> {
  const response = await apiClient.put<ToggleToolResponse>(
    `/api/settings/tools/${toolName}/toggle`
  );
  return response.data;
}

/**
 * PUT /api/settings/tools/:toolName
 * Update tool settings (enable/disable or update metadata)
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * URL Parameters:
 * - toolName: string (Tool name, e.g., "search_products", "track_order")
 * 
 * Request Body (all fields optional):
 * {
 *   "is_enabled": false,
 *   "display_name": "Search Products",
 *   "description": "Updated description..."
 * }
 */
export interface UpdateToolRequest {
  is_enabled?: boolean;
  display_name?: string;
  description?: string;
}

export interface UpdateToolResponse {
  success: boolean;
  data: Tool;
  message: string;
}

export async function updateTool(
  toolName: string,
  data: UpdateToolRequest
): Promise<UpdateToolResponse> {
  const response = await apiClient.put<UpdateToolResponse>(
    `/api/settings/tools/${toolName}`,
    data
  );
  return response.data;
}

/**
 * GET /api/settings/openai-credit-status
 * Get OpenAI credit availability status
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 */
export interface OpenAICreditStatus {
  credits_available: boolean;
  recharge_required: boolean;
  last_updated?: string;
}

export interface GetOpenAICreditStatusResponse {
  success: boolean;
  data: OpenAICreditStatus;
}

export async function getOpenAICreditStatus(): Promise<GetOpenAICreditStatusResponse> {
  const response = await apiClient.get<GetOpenAICreditStatusResponse>("/api/settings/openai-credit-status");
  return response.data;
}

/**
 * POST /api/whatsapp/send
 * Send WhatsApp message via api.whatsapp
 * 
 * Headers:
 * Authorization: Bearer <token> (admin or customer_support)
 * 
 * Request Body:
 * {
 *   "phone_number": "917676079163",
 *   "message": "I need to recharge my openai credits for Sundus AI"
 * }
 */
export interface SendWhatsAppMessageRequest {
  phone_number: string;
  message: string;
}

export interface SendWhatsAppMessageResponse {
  success: boolean;
  message?: string;
}

export async function sendWhatsAppMessage(
  data: SendWhatsAppMessageRequest
): Promise<SendWhatsAppMessageResponse> {
  const response = await apiClient.post<SendWhatsAppMessageResponse>(
    "/api/whatsapp/send",
    data
  );
  return response.data;
}

