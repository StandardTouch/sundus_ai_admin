import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getConversations,
  type Conversation,
  type PaginationInfo,
  type GetConversationsParams,
} from "@/lib/api/conversations";
import { showError } from "@/lib/utils/toast";

export interface ConversationsState {
  conversations: Conversation[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    phone_number: string;
    start_date: string;
    end_date: string;
    sort_by: "last_timestamp" | "phone_number" | "message_count";
    sort_order: "asc" | "desc";
    page: number;
    limit: number;
  };
}

const initialState: ConversationsState = {
  conversations: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    search: "",
    phone_number: "",
    start_date: "",
    end_date: "",
    sort_by: "last_timestamp",
    sort_order: "desc",
    page: 1,
    limit: 20,
  },
};

// Async thunk to fetch conversations
export const fetchConversations = createAsyncThunk(
  "conversations/fetchConversations",
  async (params: GetConversationsParams = {}, { rejectWithValue }) => {
    try {
      const response = await getConversations(params);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue("Failed to fetch conversations");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch conversations. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setSearch: (state, action: { payload: string }) => {
      state.filters.search = action.payload;
      state.filters.page = 1; // Reset to first page on search
    },
    setPhoneNumber: (state, action: { payload: string }) => {
      state.filters.phone_number = action.payload;
      state.filters.page = 1; // Reset to first page on filter change
    },
    setStartDate: (state, action: { payload: string }) => {
      state.filters.start_date = action.payload;
      state.filters.page = 1; // Reset to first page on filter change
    },
    setEndDate: (state, action: { payload: string }) => {
      state.filters.end_date = action.payload;
      state.filters.page = 1; // Reset to first page on filter change
    },
    setSortBy: (
      state,
      action: { payload: "last_timestamp" | "phone_number" | "message_count" }
    ) => {
      state.filters.sort_by = action.payload;
    },
    setSortOrder: (state, action: { payload: "asc" | "desc" }) => {
      state.filters.sort_order = action.payload;
    },
    setPage: (state, action: { payload: number }) => {
      state.filters.page = action.payload;
    },
    setLimit: (state, action: { payload: number }) => {
      state.filters.limit = action.payload;
      state.filters.page = 1; // Reset to first page on limit change
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        phone_number: "",
        start_date: "",
        end_date: "",
        sort_by: "last_timestamp",
        sort_order: "desc",
        page: 1,
        limit: 20,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload.conversations;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearch,
  setPhoneNumber,
  setStartDate,
  setEndDate,
  setSortBy,
  setSortOrder,
  setPage,
  setLimit,
  clearFilters,
  clearError,
} = conversationsSlice.actions;

export const conversationsReducer = conversationsSlice.reducer;

