import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSupportPhoneNumber,
  updateSupportPhoneNumber,
  getTools,
  toggleTool,
  updateTool,
  type UpdateSupportPhoneNumberRequest,
  type Tool,
  type UpdateToolRequest,
} from "@/lib/api/settings";
import { showSuccess, showError } from "@/lib/utils/toast";

export interface SettingsState {
  supportPhoneNumber: string | null;
  tools: Tool[];
  isLoading: boolean;
  isUpdating: boolean;
  isLoadingTools: boolean;
  isTogglingTool: Record<string, boolean>;
  error: string | null;
}

const initialState: SettingsState = {
  supportPhoneNumber: null,
  tools: [],
  isLoading: false,
  isUpdating: false,
  isLoadingTools: false,
  isTogglingTool: {},
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

// Async thunk to fetch tools
export const fetchTools = createAsyncThunk(
  "settings/fetchTools",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getTools();
      if (response.success) {
        return response.data.tools;
      }
      return rejectWithValue("Failed to fetch tools");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch tools. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to toggle tool
export const toggleToolAction = createAsyncThunk(
  "settings/toggleTool",
  async (toolName: string, { rejectWithValue, dispatch }) => {
    try {
      const response = await toggleTool(toolName);
      if (response.success) {
        showSuccess(response.message || "Tool toggled successfully!");
        // Refetch tools to get updated list
        dispatch(fetchTools());
        return response.data;
      }
      return rejectWithValue("Failed to toggle tool");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to toggle tool. Please try again.";
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to update tool
export const updateToolAction = createAsyncThunk(
  "settings/updateTool",
  async (
    { toolName, data }: { toolName: string; data: UpdateToolRequest },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await updateTool(toolName, data);
      if (response.success) {
        showSuccess(response.message || "Tool updated successfully!");
        // Refetch tools to get updated list
        dispatch(fetchTools());
        return response.data;
      }
      return rejectWithValue("Failed to update tool");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to update tool. Please try again.";
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
      })
      .addCase(fetchTools.pending, (state) => {
        state.isLoadingTools = true;
        state.error = null;
      })
      .addCase(fetchTools.fulfilled, (state, action) => {
        state.isLoadingTools = false;
        state.tools = action.payload;
        state.error = null;
      })
      .addCase(fetchTools.rejected, (state, action) => {
        state.isLoadingTools = false;
        state.error = action.payload as string;
      })
      .addCase(toggleToolAction.pending, (state, action) => {
        state.isTogglingTool[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(toggleToolAction.fulfilled, (state, action) => {
        state.isTogglingTool[action.meta.arg] = false;
        // Update the tool in the tools array
        const index = state.tools.findIndex(
          (tool) => tool.tool_name === action.payload.tool_name
        );
        if (index !== -1) {
          state.tools[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(toggleToolAction.rejected, (state, action) => {
        state.isTogglingTool[action.meta.arg] = false;
        state.error = action.payload as string;
      })
      .addCase(updateToolAction.pending, (state) => {
        state.error = null;
      })
      .addCase(updateToolAction.fulfilled, (state, action) => {
        // Update the tool in the tools array
        const index = state.tools.findIndex(
          (tool) => tool.tool_name === action.payload.tool_name
        );
        if (index !== -1) {
          state.tools[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateToolAction.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = settingsSlice.actions;

export default settingsSlice.reducer;
