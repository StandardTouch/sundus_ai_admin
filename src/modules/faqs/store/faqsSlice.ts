import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllFaqs, getFaqById, getFaqCategories, createFaq, updateFaq, deleteFaq, type FAQ, type PaginationInfo, type GetFaqsParams, type CreateFaqRequest, type UpdateFaqRequest } from "@/lib/api/faqs";
import { showError, showSuccess } from "@/lib/utils/toast";

export interface FaqsState {
  faqs: FAQ[];
  selectedFaq: FAQ | null;
  categories: string[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  isLoadingCategories: boolean;
  error: string | null;
  filters: {
    search: string;
    category: string;
    status: "active" | "pending_review" | "rejected" | "";
    source: "manual" | "ai_suggested" | "";
    is_active: boolean | null;
    has_arabic: boolean | null;
    page: number;
    limit: number;
  };
}

const initialState: FaqsState = {
  faqs: [],
  selectedFaq: null,
  categories: [],
  pagination: null,
  isLoading: false,
  isLoadingCategories: false,
  error: null,
  filters: {
    search: "",
    category: "",
    status: "",
    source: "",
    is_active: null,
    has_arabic: null,
    page: 1,
    limit: 10,
  },
};

// Async thunk to fetch FAQs
export const fetchFaqs = createAsyncThunk(
  "faqs/fetchFaqs",
  async (params: GetFaqsParams = {}, { rejectWithValue }) => {
    try {
      const response = await getAllFaqs(params);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue("Failed to fetch FAQs");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch FAQs. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to fetch single FAQ by ID
export const fetchFaqById = createAsyncThunk(
  "faqs/fetchFaqById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getFaqById(id);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue("Failed to fetch FAQ");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch FAQ. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to fetch FAQ categories
export const fetchFaqCategories = createAsyncThunk(
  "faqs/fetchFaqCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFaqCategories();
      if (response.success) {
        return response.data.categories;
      }
      return rejectWithValue("Failed to fetch categories");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch categories. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to create FAQ
export const createNewFaq = createAsyncThunk(
  "faqs/createFaq",
  async (faqData: CreateFaqRequest, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await createFaq(faqData);
      if (response.success) {
        showSuccess("FAQ created successfully!");
        // Refetch FAQs list with current filters
        const state = getState() as any;
        const filters = state.faqs.filters;
        const params: GetFaqsParams = {
          page: filters.page,
          limit: filters.limit,
        };
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.status) params.status = filters.status;
        if (filters.source) params.source = filters.source;
        if (filters.is_active !== null) params.is_active = filters.is_active;
        if (filters.has_arabic !== null) params.has_arabic = filters.has_arabic;
        dispatch(fetchFaqs(params));
        // Refetch categories to include new category if it's new
        dispatch(fetchFaqCategories());
        return response.data;
      }
      return rejectWithValue("Failed to create FAQ");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to create FAQ. Please try again.";
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to update FAQ
export const updateExistingFaq = createAsyncThunk(
  "faqs/updateFaq",
  async ({ id, faqData }: { id: string; faqData: UpdateFaqRequest }, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await updateFaq(id, faqData);
      if (response.success) {
        showSuccess("FAQ updated successfully!");
        // Refetch FAQs list with current filters
        const state = getState() as any;
        const filters = state.faqs.filters;
        const params: GetFaqsParams = {
          page: filters.page,
          limit: filters.limit,
        };
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.status) params.status = filters.status;
        if (filters.source) params.source = filters.source;
        if (filters.is_active !== null) params.is_active = filters.is_active;
        if (filters.has_arabic !== null) params.has_arabic = filters.has_arabic;
        dispatch(fetchFaqs(params));
        // Refetch categories to include new category if it's new
        dispatch(fetchFaqCategories());
        return response.data;
      }
      return rejectWithValue("Failed to update FAQ");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to update FAQ. Please try again.";
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to delete FAQ
export const deleteExistingFaq = createAsyncThunk(
  "faqs/deleteFaq",
  async (id: string, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await deleteFaq(id);
      if (response.success) {
        showSuccess("FAQ deleted successfully!");
        // Refetch FAQs list with current filters
        const state = getState() as any;
        const filters = state.faqs.filters;
        const params: GetFaqsParams = {
          page: filters.page,
          limit: filters.limit,
        };
        if (filters.search) params.search = filters.search;
        if (filters.category) params.category = filters.category;
        if (filters.status) params.status = filters.status;
        if (filters.source) params.source = filters.source;
        if (filters.is_active !== null) params.is_active = filters.is_active;
        if (filters.has_arabic !== null) params.has_arabic = filters.has_arabic;
        dispatch(fetchFaqs(params));
        return id;
      }
      return rejectWithValue("Failed to delete FAQ");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to delete FAQ. Please try again.";
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const faqsSlice = createSlice({
  name: "faqs",
  initialState,
  reducers: {
    setSearch: (state, action: { payload: string }) => {
      state.filters.search = action.payload;
      state.filters.page = 1; // Reset to first page on search
    },
    setCategory: (state, action: { payload: string }) => {
      state.filters.category = action.payload;
      state.filters.page = 1; // Reset to first page on filter change
    },
    setStatus: (state, action: { payload: "active" | "pending_review" | "rejected" | "" }) => {
      state.filters.status = action.payload;
      state.filters.page = 1; // Reset to first page on filter change
    },
    setSource: (state, action: { payload: "manual" | "ai_suggested" | "" }) => {
      state.filters.source = action.payload;
      state.filters.page = 1; // Reset to first page on filter change
    },
    setIsActive: (state, action: { payload: boolean | null }) => {
      state.filters.is_active = action.payload;
      state.filters.page = 1; // Reset to first page on filter change
    },
    setHasArabic: (state, action: { payload: boolean | null }) => {
      state.filters.has_arabic = action.payload;
      state.filters.page = 1; // Reset to first page on filter change
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
        category: "",
        status: "",
        source: "",
        is_active: null,
        has_arabic: null,
        page: 1,
        limit: 10,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedFaq: (state) => {
      state.selectedFaq = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaqs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.faqs = action.payload.faqs;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.faqs = [];
        state.pagination = null;
      })
      .addCase(fetchFaqById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFaqById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedFaq = action.payload;
        state.error = null;
      })
      .addCase(fetchFaqById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.selectedFaq = null;
      })
      .addCase(fetchFaqCategories.pending, (state) => {
        state.isLoadingCategories = true;
      })
      .addCase(fetchFaqCategories.fulfilled, (state, action) => {
        state.isLoadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchFaqCategories.rejected, (state, action) => {
        state.isLoadingCategories = false;
        // Don't set error for categories fetch failure, just log it
        console.error("Failed to fetch categories:", action.payload);
      })
      .addCase(createNewFaq.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewFaq.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // FAQ list will be refreshed by fetchFaqs dispatch in thunk
      })
      .addCase(createNewFaq.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateExistingFaq.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExistingFaq.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // FAQ list will be refreshed by fetchFaqs dispatch in thunk
      })
      .addCase(updateExistingFaq.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteExistingFaq.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExistingFaq.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // FAQ list will be refreshed by fetchFaqs dispatch in thunk
      })
      .addCase(deleteExistingFaq.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearch,
  setCategory,
  setStatus,
  setSource,
  setIsActive,
  setHasArabic,
  setPage,
  setLimit,
  clearFilters,
  clearError,
  clearSelectedFaq,
} = faqsSlice.actions;

export default faqsSlice.reducer;

