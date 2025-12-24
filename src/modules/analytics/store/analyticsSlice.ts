import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAnalytics, type AnalyticsData } from "@/lib/api/analytics";

export interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  isLoading: false,
  error: null,
};

// Async thunk to fetch analytics
export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAnalytics();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue("Failed to fetch analytics");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch analytics. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.data = null;
      });
  },
});

export const { clearError } = analyticsSlice.actions;

export default analyticsSlice.reducer;

