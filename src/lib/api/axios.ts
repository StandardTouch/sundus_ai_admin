import axios from "axios";
import { getCookie } from "@/lib/utils/cookies";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage first, then cookie
    const token = localStorage.getItem("authToken") || getCookie("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Don't redirect on login endpoint errors - let the component handle it
    const isLoginEndpoint = error.config?.url?.includes("/api/auth/login");
    
    // Only auto-logout on /api/auth/me failures (authentication verification)
    // Other 401 errors should be handled by the component
    const isAuthMeEndpoint = error.config?.url?.includes("/api/auth/me");
    
    if (error.response?.status === 401 && !isLoginEndpoint && isAuthMeEndpoint) {
      // Authentication verification failed - clear token and redirect to login
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      
      // Clear cookie
      const { deleteCookie } = await import("@/lib/utils/cookies");
      deleteCookie("authToken");
      
      // Only redirect if we're not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    // For other 401 errors (like conversations, users, etc.), just reject and let component handle
    return Promise.reject(error);
  }
);

export default apiClient;

