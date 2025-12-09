import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { X, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateExistingUser, fetchUsers } from "../store";
import type { User, GetUsersParams } from "@/lib/api/users";
import { showSuccess, showError } from "@/lib/utils/toast";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const baseUpdateUserSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
  full_name: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  role: Yup.string()
    .oneOf(["admin", "customer_support"], "Role must be admin or customer_support")
    .required("Role is required"),
  is_active: Yup.boolean().required("Active status is required"),
});

export default function EditUserModal({ isOpen, onClose, user }: EditUserModalProps) {
  const dispatch = useAppDispatch();
  const { isLoading, filters } = useAppSelector((state) => state.users);
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: user?.email || "",
      password: "",
      full_name: user?.full_name || "",
      role: (user?.role || "customer_support") as "admin" | "customer_support",
      is_active: user?.is_active ?? true,
    },
    validationSchema: baseUpdateUserSchema,
    validate: (values) => {
      const errors: any = {};
      
      // Validate password only if changePassword is checked
      if (changePassword && !values.password) {
        errors.password = "Password is required when changing password";
      } else if (changePassword && values.password && values.password.length < 8) {
        errors.password = "Password must be at least 8 characters";
      }
      
      return errors;
    },
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      if (!user) return;

      try {
        const updateData: any = {
          email: values.email,
          full_name: values.full_name,
          role: values.role,
          is_active: values.is_active,
        };

        // Only include password if user wants to change it
        if (changePassword && values.password) {
          updateData.password = values.password;
        }

        await dispatch(updateExistingUser({ id: user._id, userData: updateData })).unwrap();
        showSuccess("User updated successfully!");
        resetForm();
        setChangePassword(false);
        setShowPassword(false);
        onClose();
        // Refetch users list
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
      } catch (error: any) {
        showError(error || "Failed to update user. Please try again.");
      }
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      formik.setValues({
        email: user.email,
        password: "",
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active,
      });
      setChangePassword(false);
      setShowPassword(false);
    }
  }, [user]);

  // Clear password and re-validate when changePassword toggles
  useEffect(() => {
    if (!changePassword) {
      formik.setFieldValue("password", "");
      formik.setFieldTouched("password", false);
    }
    formik.validateForm();
  }, [changePassword]);

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--admin-bg-secondary)] border border-[var(--admin-border)] rounded-xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--admin-border)] sticky top-0 bg-[var(--admin-bg-secondary)]">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--admin-text)]">Edit User</h3>
            <p className="text-xs sm:text-sm text-[var(--admin-text-muted)] mt-1">{user.username}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Username (read-only) */}
          <div>
            <label className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Username
            </label>
            <input
              type="text"
              value={user.username}
              disabled
              className="w-full px-4 py-2.5 bg-[var(--admin-bg)] border border-[var(--admin-border)] rounded-lg text-[var(--admin-text-muted)] cursor-not-allowed opacity-60"
            />
            <p className="mt-1 text-xs text-[var(--admin-text-muted)]">Username cannot be changed</p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 transition-all ${
                formik.touched.email && formik.errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
              }`}
              placeholder="Enter email"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-400">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <label htmlFor="change_password" className="text-sm font-medium text-[var(--admin-text)]">
                Change Password
              </label>
              <input
                id="change_password"
                type="checkbox"
                checked={changePassword}
                onChange={(e) => {
                  setChangePassword(e.target.checked);
                  if (!e.target.checked) {
                    formik.setFieldValue("password", "");
                    setShowPassword(false);
                  }
                }}
                className="w-4 h-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]"
              />
            </div>
            {changePassword && (
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-2.5 pr-12 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 transition-all ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
                  }`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}
            {changePassword && formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-400">{formik.errors.password}</p>
            )}
            {!changePassword && (
              <p className="mt-1 text-xs text-[var(--admin-text-muted)]">Leave unchecked to keep current password</p>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Full Name *
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formik.values.full_name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] placeholder:text-[var(--admin-text-muted)] focus:outline-none focus:ring-2 transition-all ${
                formik.touched.full_name && formik.errors.full_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
              }`}
              placeholder="Enter full name"
            />
            {formik.touched.full_name && formik.errors.full_name && (
              <p className="mt-1 text-sm text-red-400">{formik.errors.full_name}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-[var(--admin-text)] mb-2">
              Role *
            </label>
            <select
              id="role"
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-2.5 bg-[var(--admin-bg)] border rounded-lg text-[var(--admin-text)] focus:outline-none focus:ring-2 transition-all ${
                formik.touched.role && formik.errors.role
                  ? "border-red-500 focus:ring-red-500"
                  : "border-[var(--admin-border)] focus:ring-[var(--admin-primary)]"
              }`}
            >
              <option value="customer_support">Customer Support</option>
              <option value="admin">Admin</option>
            </select>
            {formik.touched.role && formik.errors.role && (
              <p className="mt-1 text-sm text-red-400">{formik.errors.role}</p>
            )}
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-3">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formik.values.is_active}
              onChange={formik.handleChange}
              className="w-4 h-4 rounded border-[var(--admin-border)] text-[var(--admin-primary)] focus:ring-[var(--admin-primary)]"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-[var(--admin-text)]">
              Active User
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-[var(--admin-border)] rounded-lg text-[var(--admin-text)] hover:bg-[var(--admin-bg)] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-[var(--admin-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

