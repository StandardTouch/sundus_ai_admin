import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import type { User } from "@/lib/api/users";

interface DeleteUserConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
  isLoading?: boolean;
}

export default function DeleteUserConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  user,
  isLoading = false,
}: DeleteUserConfirmModalProps) {
  if (!user) return null;

  return (
    <ConfirmDeleteModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isLoading={isLoading}
      title="Delete User"
      confirmLabel="Delete User"
      description={
        <p>
          Are you sure you want to delete the user{" "}
          <span className="font-semibold text-[var(--admin-text)]">
            {user.full_name} (@{user.username})
          </span>
          ? This action cannot be undone and all user data will be permanently deleted.
        </p>
      }
      warning={
        <p>
          <strong>Warning:</strong> You cannot delete your own account.
        </p>
      }
    />
  );
}

