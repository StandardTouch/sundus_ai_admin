import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSupportPhoneNumber,
  updateSupportPhoneNumber,
  type UpdateSupportPhoneNumberRequest,
} from "@/lib/api/settings";
import { showSuccess, showError } from "@/lib/utils/toast";

export interface SettingsState {
  supportPhoneNumber: string | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  supportPhoneNumber: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

// Async thunk to fetch support phone number
export const fetchSupportPhoneNumber = createAsyncThunk(
  "settings/fetchSupportPhoneNumber",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getSupportPhoneNumber();
      if (response.success) {
        return response.data.phone_number;
      }
      return rejectWithValue("Failed to fetch support phone number");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch support phone number. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to update support phone number
export const updateSupportPhoneNumberAction = createAsyncThunk(
  "settings/updateSupportPhoneNumber",
  async (data: UpdateSupportPhoneNumberRequest, { rejectWithValue }) => {
    try {
      const response = await updateSupportPhoneNumber(data);
      if (response.success) {
        showSuccess(response.message || "Support phone number updated successfully!");
        return response.data.phone_number;
      }
      return rejectWithValue("Failed to update support phone number");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to update support phone number. Please try again.";
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupportPhoneNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSupportPhoneNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.supportPhoneNumber = action.payload;
        state.error = null;
      })
      .addCase(fetchSupportPhoneNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSupportPhoneNumberAction.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateSupportPhoneNumberAction.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.supportPhoneNumber = action.payload;
        state.error = null;
      })
      .addCase(updateSupportPhoneNumberAction.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = settingsSlice.actions;

export default settingsSlice.reducer;

