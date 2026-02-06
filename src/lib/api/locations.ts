import apiClient from "./axios";

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
  location_animation?: string;
  isActive?: boolean;
}

export const fetchLocations = async () => {
  const response = await apiClient.get("/api/locations");
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
