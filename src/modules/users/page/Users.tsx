import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, setSortBy, setSortOrder, deleteExistingUser } from "../store";
import { UsersTable, UsersFilters, UsersPagination, CreateUserModal, EditUserModal, DeleteUserConfirmModal } from "../components";
import { showError } from "@/lib/utils/toast";
import { Plus } from "lucide-react";
import type { User } from "@/lib/api/users";

export default function Users() {
  const dispatch = useAppDispatch();
  const { users, pagination, filters, isLoading, error } = useAppSelector(
    (state) => state.users
  );
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users when filters change
  useEffect(() => {
    const params: any = {
      page: filters.page,
      limit: filters.limit,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    };

    if (filters.search) params.search = filters.search;
    if (filters.role) params.role = filters.role;
    if (filters.is_active !== null) params.is_active = filters.is_active;

    dispatch(fetchUsers(params));
  }, [dispatch, filters]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error]);

  const handleSort = (field: string) => {
    if (filters.sort_by === field) {
      // Toggle sort order if clicking the same field
      dispatch(setSortOrder(filters.sort_order === "asc" ? "desc" : "asc"));
    } else {
      // Set new sort field and default to desc
      dispatch(setSortBy(field as any));
      dispatch(setSortOrder("desc"));
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    
    try {
      await dispatch(deleteExistingUser(selectedUser._id)).unwrap();
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Error is already handled in the thunk with toast notification
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 overflow-y-auto w-full lg:w-auto bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl p-4 sm:p-6">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--admin-text)]">
              Users Management
            </h2>
            <p className="text-sm text-[var(--admin-text-muted)]">
              Manage and view all system users
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create User</span>
          </button>
        </div>

        <UsersFilters />

        <div className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg overflow-hidden">
          <UsersTable
            users={users}
            sortBy={filters.sort_by}
            sortOrder={filters.sort_order}
            onSort={handleSort}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            currentUserId={currentUser?._id}
          />
        </div>

        <UsersPagination />
      </div>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        user={selectedUser}
      />

      <DeleteUserConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        user={selectedUser}
        isLoading={isLoading}
      />
    </main>
  );
}

