import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUsers, createUser, updateUser, deleteUser, type User, type PaginationInfo, type GetUsersParams, type CreateUserRequest, type UpdateUserRequest } from "@/lib/api/users";
import { showSuccess, showError } from "@/lib/utils/toast";

export interface UsersState {
  users: User[];
  pagination: PaginationInfo | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    role: "admin" | "customer_support" | "";
    is_active: boolean | null;
    sort_by: "username" | "email" | "full_name" | "role" | "created_at" | "updated_at" | "last_login_at";
    sort_order: "asc" | "desc";
    page: number;
    limit: number;
  };
}

const initialState: UsersState = {
  users: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    search: "",
    role: "",
    is_active: null,
    sort_by: "created_at",
    sort_order: "desc",
    page: 1,
    limit: 10,
  },
};

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (params: GetUsersParams = {}, { rejectWithValue }) => {
    try {
      const response = await getUsers(params);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue("Failed to fetch users");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch users. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to create user
export const createNewUser = createAsyncThunk(
  "users/createUser",
  async (userData: CreateUserRequest, { rejectWithValue }) => {
    try {
      const response = await createUser(userData);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue("Failed to create user");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to create user. Please try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to update user
export const updateExistingUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }: { id: string; userData: UpdateUserRequest }, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await updateUser(id, userData);
      if (response.success) {
        showSuccess("User updated successfully!");
        // Refetch users list with current filters
        const state = getState() as any;
        const filters = state.users.filters;
        const params: GetUsersParams = {
          page: filters.page,
          limit: filters.limit,
          sort_by: filters.sort_by,
          sort_order: filters.sort_order,
        };
        if (filters.search) params.search = filters.search;
        if (filters.role) params.role = filters.role;
        if (filters.is_active !== null) params.is_active = filters.is_active;
        dispatch(fetchUsers(params));
        return response.data;
      }
      return rejectWithValue("Failed to update user");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to update user. Please try again.";
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to delete user
export const deleteExistingUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await deleteUser(id);
      if (response.success) {
        showSuccess("User deleted successfully!");
        // Refetch users list with current filters
        const state = getState() as any;
        const filters = state.users.filters;
        const params: GetUsersParams = {
          page: filters.page,
          limit: filters.limit,
          sort_by: filters.sort_by,
          sort_order: filters.sort_order,
        };
        if (filters.search) params.search = filters.search;
        if (filters.role) params.role = filters.role;
        if (filters.is_active !== null) params.is_active = filters.is_active;
        dispatch(fetchUsers(params));
        return id;
      }
      return rejectWithValue("Failed to delete user");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to delete user. Please try again.";
      showError(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearch: (state, action: { payload: string }) => {
      state.filters.search = action.payload;
      state.filters.page = 1; // Reset to first page on search
    },
    setRole: (state, action: { payload: "admin" | "customer_support" | "" }) => {
      state.filters.role = action.payload;
      state.filters.page = 1; // Reset to first page on filter change
    },
    setIsActive: (state, action: { payload: boolean | null }) => {
      state.filters.is_active = action.payload;
      state.filters.page = 1; // Reset to first page on filter change
    },
    setSortBy: (
      state,
      action: { payload: "username" | "email" | "full_name" | "role" | "created_at" | "updated_at" | "last_login_at" }
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
        role: "",
        is_active: null,
        sort_by: "created_at",
        sort_order: "desc",
        page: 1,
        limit: 10,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.users = [];
        state.pagination = null;
      })
      .addCase(createNewUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNewUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // User will be refetched automatically via useEffect
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateExistingUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateExistingUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // User will be refetched automatically via useEffect
      })
      .addCase(updateExistingUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteExistingUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteExistingUser.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // User list will be refreshed by fetchUsers dispatch in thunk
      })
      .addCase(deleteExistingUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSearch,
  setRole,
  setIsActive,
  setSortBy,
  setSortOrder,
  setPage,
  setLimit,
  clearFilters,
  clearError,
} = usersSlice.actions;

export default usersSlice.reducer;

