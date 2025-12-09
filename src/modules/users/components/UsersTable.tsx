import type { User } from "@/lib/api/users";
import { ChevronUp, ChevronDown, Edit, Trash2 } from "lucide-react";

interface UsersTableProps {
  users: User[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  isLoading: boolean;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  currentUserId?: string;
}

export default function UsersTable({ users, sortBy, sortOrder, onSort, isLoading, onEdit, onDelete, currentUserId }: UsersTableProps) {
  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === "admin") {
      return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--admin-primary)]"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--admin-text-muted)]">
        No users found
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[var(--admin-border)]">
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)] cursor-pointer hover:text-[var(--admin-text)] transition-colors"
                onClick={() => onSort("username")}
              >
                Username {getSortIcon("username")}
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)] cursor-pointer hover:text-[var(--admin-text)] transition-colors"
                onClick={() => onSort("email")}
              >
                Email {getSortIcon("email")}
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)] cursor-pointer hover:text-[var(--admin-text)] transition-colors"
                onClick={() => onSort("full_name")}
              >
                Full Name {getSortIcon("full_name")}
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)] cursor-pointer hover:text-[var(--admin-text)] transition-colors"
                onClick={() => onSort("role")}
              >
                Role {getSortIcon("role")}
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                Status
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)] cursor-pointer hover:text-[var(--admin-text)] transition-colors"
                onClick={() => onSort("last_login_at")}
              >
                Last Login {getSortIcon("last_login_at")}
              </th>
              <th
                className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)] cursor-pointer hover:text-[var(--admin-text)] transition-colors"
                onClick={() => onSort("created_at")}
              >
                Created {getSortIcon("created_at")}
              </th>
              {(onEdit || onDelete) && (
                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-bg-secondary)] transition-colors"
              >
                <td className="py-3 px-4 text-sm text-[var(--admin-text)] font-medium">
                  {user.username}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text)]">
                  {user.email}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text)]">
                  {user.full_name}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                      user.role
                    )}`}
                  >
                    {user.role === "admin" ? "Admin" : "Support"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text-muted)]">
                  {formatDate(user.last_login_at)}
                </td>
                <td className="py-3 px-4 text-sm text-[var(--admin-text-muted)]">
                  {formatDate(user.created_at)}
                </td>
              {(onEdit || onDelete) && (
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(user)}
                        className="p-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-bg-secondary)] rounded-lg transition-colors"
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(user)}
                        disabled={currentUserId === user._id}
                        className="p-2 text-[var(--admin-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={currentUserId === user._id ? "Cannot delete your own account" : "Delete user"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-[var(--admin-text)] mb-1">
                  {user.full_name}
                </h3>
                <p className="text-sm text-[var(--admin-text-muted)] mb-1">
                  @{user.username}
                </p>
                <p className="text-sm text-[var(--admin-text-muted)]">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(user)}
                    className="p-2 text-[var(--admin-text-muted)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-bg-secondary)] rounded-lg transition-colors"
                    title="Edit user"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(user)}
                    disabled={currentUserId === user._id}
                    className="p-2 text-[var(--admin-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title={currentUserId === user._id ? "Cannot delete your own account" : "Delete user"}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--admin-border)]">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                  user.role
                )}`}
              >
                {user.role === "admin" ? "Admin" : "Support"}
              </span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.is_active
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-[var(--admin-text-muted)] pt-2 border-t border-[var(--admin-border)]">
              <div>
                <p className="font-medium text-[var(--admin-text)] mb-1">Last Login</p>
                <p>{formatDateShort(user.last_login_at)}</p>
              </div>
              <div>
                <p className="font-medium text-[var(--admin-text)] mb-1">Created</p>
                <p>{formatDateShort(user.created_at)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

