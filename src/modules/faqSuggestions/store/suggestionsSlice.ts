import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getSuggestions, 
  getSuggestionById, 
  approveSuggestion, 
  rejectSuggestion,
  type FAQSuggestion, 
  type PaginationInfo, 
  type GetSuggestionsParams,
  type ApproveSuggestionRequest,
  type RejectSuggestionRequest
} from "@/lib/api/faqSuggestions";
import { showError, showSuccess } from "@/lib/utils/toast";

export interface SuggestionsState {
  suggestions: FAQSuggestion[];
  selectedSuggestion: FAQSuggestion | null;
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    page: number;
    limit: number;
  };
}

const initialState: SuggestionsState = {
  suggestions: [],
  selectedSuggestion: null,
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
  },
};

// Async thunk to fetch suggestions
export const fetchSuggestions = createAsyncThunk(
  "suggestions/fetchSuggestions",
  async (params: GetSuggestionsParams = {}, { rejectWithValue }) => {
    try {
      const response = await getSuggestions(params);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue("Failed to fetch suggestions");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch suggestions. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to fetch single suggestion by ID
export const fetchSuggestionById = createAsyncThunk(
  "suggestions/fetchSuggestionById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getSuggestionById(id);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue("Failed to fetch suggestion");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch suggestion. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to approve suggestion
export const approveSuggestionAction = createAsyncThunk(
  "suggestions/approveSuggestion",
  async ({ id, data }: { id: string; data: ApproveSuggestionRequest }, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await approveSuggestion(id, data);
      if (response.success) {
        showSuccess("Suggestion approved and FAQ created successfully!");
        // Refetch suggestions list with current filters
        const state = getState() as any;
        const filters = state.suggestions.filters;
        const params: GetSuggestionsParams = {
          page: filters.page,
          limit: filters.limit,
        };
        dispatch(fetchSuggestions(params));
        return response.data;
      }
      return rejectWithValue("Failed to approve suggestion");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to approve suggestion. Please try again.";
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to reject suggestion
export const rejectSuggestionAction = createAsyncThunk(
  "suggestions/rejectSuggestion",
  async ({ id, data }: { id: string; data?: RejectSuggestionRequest }, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await rejectSuggestion(id, data);
      if (response.success) {
        showSuccess("Suggestion rejected successfully!");
        // Refetch suggestions list with current filters
        const state = getState() as any;
        const filters = state.suggestions.filters;
        const params: GetSuggestionsParams = {
          page: filters.page,
          limit: filters.limit,
        };
        dispatch(fetchSuggestions(params));
        return id;
      }
      return rejectWithValue("Failed to reject suggestion");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to reject suggestion. Please try again.";
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const suggestionsSlice = createSlice({
  name: "suggestions",
  initialState,
  reducers: {
    setPage: (state, action: { payload: number }) => {
      state.filters.page = action.payload;
    },
    setLimit: (state, action: { payload: number }) => {
      state.filters.limit = action.payload;
      state.filters.page = 1; // Reset to first page on limit change
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedSuggestion: (state) => {
      state.selectedSuggestion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suggestions = action.payload.suggestions;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchSuggestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.suggestions = [];
        state.pagination = null;
      })
      .addCase(fetchSuggestionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuggestionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSuggestion = action.payload;
        state.error = null;
      })
      .addCase(fetchSuggestionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.selectedSuggestion = null;
      })
      .addCase(approveSuggestionAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveSuggestionAction.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Suggestions list will be refreshed by fetchSuggestions dispatch in thunk
      })
      .addCase(approveSuggestionAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(rejectSuggestionAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(rejectSuggestionAction.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // Suggestions list will be refreshed by fetchSuggestions dispatch in thunk
      })
      .addCase(rejectSuggestionAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setPage,
  setLimit,
  clearError,
  clearSelectedSuggestion,
} = suggestionsSlice.actions;

export default suggestionsSlice.reducer;

