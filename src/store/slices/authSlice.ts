import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, getCurrentUser, logout, type User, type LoginRequest } from "@/lib/api/auth";
import { setCookie, deleteCookie } from "@/lib/utils/cookies";

// Auth State Interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  // Login form state
  loginForm: {
    username: string;
    password: string;
    error: string | null;
    isSubmitting: boolean;
  };
}

// Initial State
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("authToken") || null,
  isAuthenticated: !!localStorage.getItem("authToken"),
  isLoading: false,
  error: null,
  loginForm: {
    username: "",
    password: "",
    error: null,
    isSubmitting: false,
  },
};

// Async Thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      if (response.success && response.data) {
        // Store token in localStorage and cookie
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAuthenticated", "true");
        setCookie("authToken", response.data.token, 7);
        
        return {
          user: response.data.user,
          token: response.data.token,
        };
      }
      return rejectWithValue("Login failed");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An error occurred during login. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser();
      if (response.success && response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      }
      return rejectWithValue("Failed to fetch user");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logout();
      // Clear localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      // Clear cookie
      deleteCookie("authToken");
      return true;
    } catch (error: any) {
      // Even if API call fails, clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      deleteCookie("authToken");
      return true;
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Update login form fields
    updateLoginForm: (
      state,
      action: { payload: { field: "username" | "password"; value: string } }
    ) => {
      state.loginForm[action.payload.field] = action.payload.value;
      // Clear error when user types
      if (state.loginForm.error) {
        state.loginForm.error = null;
      }
    },
    // Clear login form error
    clearLoginError: (state) => {
      state.loginForm.error = null;
    },
    // Reset login form (but keep username/password for retry)
    resetLoginForm: (state) => {
      state.loginForm.error = null;
      state.loginForm.isSubmitting = false;
    },
    // Clear auth error
    clearAuthError: (state) => {
      state.error = null;
    },
    // Set authentication state from localStorage (on app init)
    setAuthFromStorage: (state) => {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");
      
      if (token && userStr) {
        try {
          state.token = token;
          state.user = JSON.parse(userStr);
          state.isAuthenticated = true;
        } catch (error) {
          // Invalid user data, clear it
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loginForm.isSubmitting = true;
        state.loginForm.error = null;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginForm.isSubmitting = false;
        state.loginForm.error = null;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginForm.isSubmitting = false;
        state.loginForm.error = action.payload as string;
        state.error = action.payload as string;
        // Keep username and password in form for retry
      });

    // Fetch Current User
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        deleteCookie("authToken");
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.loginForm = {
          username: "",
          password: "",
          error: null,
          isSubmitting: false,
        };
      });
  },
});

export const {
  updateLoginForm,
  clearLoginError,
  resetLoginForm,
  clearAuthError,
  setAuthFromStorage,
} = authSlice.actions;

export default authSlice.reducer;

