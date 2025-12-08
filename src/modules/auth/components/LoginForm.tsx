import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LoginLogo from "./LoginLogo";
import EmailField from "./EmailField";
import PasswordField from "./PasswordField";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface LoginFormProps {
  onLoginSuccess?: () => void;
  onForgotPassword: (email: string) => void;
}

export default function LoginForm({ onLoginSuccess, onForgotPassword }: LoginFormProps) {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      console.log("Login attempt:", values);
      // TODO: Add actual login API call here
      // For now, just simulate success
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    },
  });

  // Both modes: secondary color background with white text
  const bgColor = "bg-[var(--admin-secondary)]";
  const textColor = "text-white";
  const subtitleColor = "text-white/80";

  return (
    <div className={`flex-1 lg:w-1/2 flex items-center justify-center ${bgColor} p-4 sm:p-8`}>
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-6">
          <ThemeToggle />
        </div>

        {/* Mobile Logo (shown only on mobile) */}
        <div className="lg:hidden mb-6">
          <LoginLogo size="mobile" />
        </div>

        <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${textColor}`}>
          Welcome Back
        </h1>
        <p className={`text-sm ${subtitleColor} mb-8`}>
          Sign in to your account to continue
        </p>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Email Field */}
          <EmailField
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
          />

          {/* Password Field */}
          <PasswordField
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
          />

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onForgotPassword(formik.values.email)}
              className="text-sm text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full px-4 py-2.5 bg-white text-[var(--admin-secondary)] rounded-lg hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {formik.isSubmitting ? (
              "Signing in..."
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
