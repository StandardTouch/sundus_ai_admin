import { useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LoginLogo from "./LoginLogo";
import PasswordField from "./PasswordField";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, updateLoginForm, clearLoginError } from "@/store/slices/authSlice";

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required"),
  password: Yup.string()
    .required("Password is required"),
});

interface LoginFormProps {
  onLoginSuccess?: () => void;
  onForgotPassword: (email: string) => void;
}

export default function LoginForm({ onLoginSuccess, onForgotPassword }: LoginFormProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get form state from Redux
  const { username, password, error: loginError, isSubmitting } = useAppSelector(
    (state) => state.auth.loginForm
  );
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Navigate to dashboard on successful login
  useEffect(() => {
    if (isAuthenticated) {
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate, onLoginSuccess]);

  // Memoize initial values so enableReinitialize works properly
  const initialValues = useMemo(() => ({
    username: username || "",
    password: password || "",
  }), [username, password]);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    enableReinitialize: true, // Allow reinitialize from Redux state - this keeps form values in sync
    onSubmit: async (values, { setSubmitting }) => {
      // Update Redux with form values BEFORE login attempt to ensure they persist on error
      dispatch(updateLoginForm({ field: "username", value: values.username }));
      dispatch(updateLoginForm({ field: "password", value: values.password }));
      dispatch(clearLoginError());
      
      try {
        await dispatch(loginUser({
          username: values.username,
          password: values.password,
        })).unwrap();
      } catch (error) {
        // Error is already handled by Redux slice
        // Form values are preserved in Redux state
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Update Redux when form values change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    dispatch(updateLoginForm({ field: "username", value: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    dispatch(updateLoginForm({ field: "password", value: e.target.value }));
  };

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

        {loginError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{loginError}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
              Username
            </label>
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                value={formik.values.username}
                onChange={handleUsernameChange}
                onBlur={formik.handleBlur}
                className={`w-full pl-4 pr-4 py-2.5 bg-white/10 border rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 transition-all ${
                  formik.touched.username && formik.errors.username
                    ? "border-red-500 focus:ring-red-500"
                    : "border-white/20 focus:ring-white/50"
                }`}
                placeholder="Enter your username"
              />
            </div>
            {formik.touched.username && formik.errors.username && (
              <p className="mt-1 text-sm text-red-400">{formik.errors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <PasswordField
            id="password"
            name="password"
            value={formik.values.password}
            onChange={handlePasswordChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
          />

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => onForgotPassword(formik.values.username)}
              className="text-sm text-white/90 hover:text-white transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 bg-white text-[var(--admin-secondary)] rounded-lg hover:bg-white/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
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
