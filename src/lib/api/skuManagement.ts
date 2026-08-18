import apiClient from "./axios";

export interface SkuImage {
  id: string;
  url: string;
  isPrimary: boolean;
  label: string;
  status?: "pending" | "accepted" | "rejected";
}

export interface SkuLookupResult {
  sku: string;
  brand_name: string;
  model_number: string;
  model_number_ar: string;
  description: string;
  description_ar: string;
  short_description: string;
  short_description_ar: string;
  case_diameter: string;
  case_diameter_ar: string;
  case_thickness: string;
  case_thickness_ar: string;
  gender: string;
  gender_ar: string;
  watch_type: string;
  watch_type_ar: string;
  case_material: string;
  case_material_ar: string;
  band_material: string;
  band_material_ar: string;
  movement_type: string;
  movement_type_ar: string;
  display_type: string;
  display_type_ar: string;
  water_resistance: string;
  water_resistance_ar: string;
  dial_color: string;
  dial_color_ar: string;
  images: SkuImage[];
}

export interface SkuLookupPayload {
  sku?: string;
  brand_name?: string;
  image?: string;
}

export const lookupSku = async (
  payload: string | SkuLookupPayload
): Promise<SkuLookupResult> => {
  const body = typeof payload === "string" ? { sku: payload } : payload;
  const response = await apiClient.post("/api/sku-management/lookup", body);
  return response.data?.data || response.data;
};
