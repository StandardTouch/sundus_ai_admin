import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";
import LoginLogo from "./LoginLogo";
import EmailField from "./EmailField";
import OtpInput from "./OtpInput";
import { sendOtp, verifyOtp } from "@/lib/api/auth";
import { showError, showSuccess, showInfo } from "@/lib/utils/toast";

const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

interface ForgotPasswordFormProps {
  initialEmail?: string;
  onCancel: () => void;
  onOtpSent: (email: string, resetToken: string) => void;
}

export default function ForgotPasswordForm({ initialEmail = "", onCancel, onOtpSent }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState(initialEmail);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");

  const formik = useFormik({
    initialValues: {
      email: initialEmail,
    },
    validationSchema: emailSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        setEmail(values.email);
        setOtpError("");
        const response = await sendOtp(values.email);
        if (response.success) {
          setIsOtpSent(true);
          setStep("otp");
          showSuccess("OTP has been sent to your email");
        }
      } catch (error: any) {
        // Handle specific error status codes
        const status = error.response?.status;
        let errorMessage = "Failed to send OTP. Please try again.";
        
        if (status === 400) {
          errorMessage = error.response?.data?.error || "Email is required";
        } else if (status === 404) {
          errorMessage = error.response?.data?.error || "User not found";
        } else if (status === 429) {
          errorMessage = error.response?.data?.error || "Too many requests. Please try again later";
        } else {
          errorMessage = error.response?.data?.error || error.message || errorMessage;
        }
        
        setFieldError("email", errorMessage);
        showError(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleOtpComplete = async (otp: string) => {
    try {
      setOtpError("");
      const response = await verifyOtp(email, otp);
      if (response.success && response.reset_token) {
        // Store reset token temporarily for password reset
        localStorage.setItem("resetToken", response.reset_token);
        showSuccess("OTP verified successfully");
        onOtpSent(email, response.reset_token);
      } else {
        const errorMsg = "OTP verification failed. Please try again.";
        setOtpError(errorMsg);
        showError(errorMsg);
      }
    } catch (error: any) {
      // Handle specific error status codes
      const status = error.response?.status;
      let errorMessage = "Invalid OTP. Please try again.";
      
      if (status === 400) {
        errorMessage = error.response?.data?.error || "Invalid or expired OTP";
      } else if (status === 500) {
        errorMessage = error.response?.data?.error || "Internal server error. Please try again later.";
      } else {
        errorMessage = error.response?.data?.error || error.message || errorMessage;
      }
      
      setOtpError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtpError("");
      const response = await sendOtp(email);
      if (response.success) {
        setIsOtpSent(true);
        showSuccess("OTP has been re-sent to your email");
      }
    } catch (error: any) {
      // Handle specific error status codes
      const status = error.response?.status;
      let errorMessage = "Failed to resend OTP. Please try again.";
      
      if (status === 400) {
        errorMessage = error.response?.data?.error || "Email is required";
      } else if (status === 404) {
        errorMessage = error.response?.data?.error || "User not found";
      } else if (status === 429) {
        errorMessage = error.response?.data?.error || "Too many requests. Please try again later";
      } else {
        errorMessage = error.response?.data?.error || error.message || errorMessage;
      }
      
      setOtpError(errorMessage);
      showError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Logo Section */}
      <LoginLogo size="desktop" />

      {/* Right Side - Forgot Password Form (Secondary Color Background) */}
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

          {step === "email" ? (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
                <p className="text-sm text-white/80">
                  Enter your email address and we'll send you a 6-digit OTP to reset your password.
                </p>
              </div>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <EmailField
                  id="forgot-email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.email}
                  touched={formik.touched.email}
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
                      "Sending..."
                    ) : (
                      <>
                        Send OTP
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Verify OTP</h2>
                <p className="text-sm text-white/80">
                  We've sent a 6-digit OTP to <span className="font-semibold">{email}</span>
                </p>
              </div>
              <div className="space-y-4">
                <OtpInput
                  length={6}
                  onComplete={handleOtpComplete}
                  error={otpError}
                />
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-white/90 hover:text-white transition-colors cursor-pointer"
                  >
                    Didn't receive OTP? Resend
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onCancel}
                  className="w-full px-4 py-2.5 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

