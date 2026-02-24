import apiClient from "./axios";

export interface Shift {
  open: string;
  close: string;
}

export interface StoreTiming {
  day: string;
  shifts: Shift[];
  isClosed: boolean;
}

export interface Location {
  id?: string;
  _id: string;
  location_id: string;
  location_title: string;
  location_title_ara: string;
  location_address: string;
  location_address_ara: string;
  location_latitude: string;
  location_longitude: string;
  country: string;
  state: string;
  city: string;
  timings?: StoreTiming[];
  store_manager_name?: string;
  store_manager_phone?: string;
  store_contact_phone?: string;
  location_animation: string;
  isActive: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLocationDto {
  location_title: string;
  location_title_ara?: string;
  location_address: string;
  location_address_ara?: string;
  location_latitude: string;
  location_longitude: string;
  country: string;
  state: string;
  city: string;
  timings?: StoreTiming[];
  store_manager_name?: string;
  store_manager_phone?: string;
  store_contact_phone?: string;
  location_animation?: string;
  isActive?: boolean;
}

export const fetchLocations = async (params?: { search?: string; isActive?: boolean }) => {
  const response = await apiClient.get("/api/locations", { params });
  return response.data;
};

export const createLocation = async (data: CreateLocationDto) => {
  const response = await apiClient.post("/api/locations", data);
  return response.data;
};

export const updateLocation = async (id: string, data: Partial<CreateLocationDto>) => {
  const response = await apiClient.put(`/api/locations/${id}`, data);
  return response.data;
};

export const deleteLocation = async (id: string) => {
  const response = await apiClient.delete(`/api/locations/${id}`);
  return response.data;
};
