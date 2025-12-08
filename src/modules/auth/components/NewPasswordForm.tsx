import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LoginLogo from "./LoginLogo";
import PasswordField from "./PasswordField";

const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

interface NewPasswordFormProps {
  email: string;
  onCancel: () => void;
  onSubmit: (email: string, password: string) => void;
}

export default function NewPasswordForm({ email, onCancel, onSubmit }: NewPasswordFormProps) {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      onSubmit(email, values.password);
    },
  });

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Logo Section */}
      <LoginLogo size="desktop" />

      {/* Right Side - New Password Form (Secondary Color Background) */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center bg-[var(--admin-secondary)] p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Theme Toggle */}
          <div className="flex justify-end mb-6">
            <ThemeToggle />
          </div>

          {/* Mobile Logo */}
          <div className="lg:hidden mb-6">
            <LoginLogo size="mobile" />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Create New Password</h2>
            <p className="text-sm text-white/80">
              Enter your new password below.
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <PasswordField
              id="new-password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
            />

            <PasswordField
              id="confirm-password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              label="Confirm Password"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="flex-1 px-4 py-2.5 bg-white text-[var(--admin-secondary)] rounded-lg hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                {formik.isSubmitting ? (
                  "Updating..."
                ) : (
                  <>
                    Update Password
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

