import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginLogo, LoginForm, ForgotPasswordForm, NewPasswordForm } from "../components";

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");

  // Check if we're on forgot password route
  useEffect(() => {
    if (location.pathname === "/forgot-password") {
      setShowForgotPassword(true);
    }
  }, [location.pathname]);

  const handleForgotPassword = (email: string) => {
    setEmailForReset(email);
    setShowForgotPassword(true);
    navigate("/forgot-password", { replace: true });
  };

  const handleOtpVerified = (email: string, _resetToken: string) => {
    setEmailForReset(email);
    // Reset token is already stored in localStorage by ForgotPasswordForm
    setShowForgotPassword(false);
    setShowNewPassword(true);
    navigate("/forgot-password/new-password", { replace: true });
  };

  const handleNewPasswordSubmit = (_password: string) => {
    setShowNewPassword(false);
    setEmailForReset("");
    navigate("/login", { replace: true });
  };

  const handleCancelForgotPassword = () => {
    setShowForgotPassword(false);
    setEmailForReset("");
    // Clear any reset token if user cancels
    localStorage.removeItem("resetToken");
    navigate("/login", { replace: true });
  };

  const handleCancelNewPassword = () => {
    setShowNewPassword(false);
    setEmailForReset("");
    // Clear reset token when canceling
    localStorage.removeItem("resetToken");
    navigate("/login", { replace: true });
  };

  const handleLoginSuccess = () => {
    localStorage.setItem("isAuthenticated", "true");
    if (onLoginSuccess) {
      onLoginSuccess();
    }
    navigate("/dashboard", { replace: true });
  };

  if (showNewPassword || location.pathname === "/forgot-password/new-password") {
    return (
      <NewPasswordForm
        email={emailForReset}
        onCancel={handleCancelNewPassword}
        onSubmit={handleNewPasswordSubmit}
      />
    );
  }

  if (showForgotPassword || location.pathname === "/forgot-password") {
    return (
      <ForgotPasswordForm
        initialEmail={emailForReset}
        onCancel={handleCancelForgotPassword}
        onOtpSent={handleOtpVerified}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Logo Section */}
      <LoginLogo size="desktop" />

      {/* Right Side - Login Form (Always White) */}
      <LoginForm
        onLoginSuccess={handleLoginSuccess}
        onForgotPassword={handleForgotPassword}
      />
    </div>
  );
}
