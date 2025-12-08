import { useState } from "react";
import { LoginLogo, LoginForm, ForgotPasswordForm, NewPasswordForm } from "../components";

interface LoginProps {
  onLoginSuccess?: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [emailForReset, setEmailForReset] = useState("");

  const handleForgotPassword = (email: string) => {
    setEmailForReset(email);
    setShowForgotPassword(true);
  };

  const handleOtpVerified = (email: string) => {
    setEmailForReset(email);
    setShowForgotPassword(false);
    setShowNewPassword(true);
  };

  const handleNewPasswordSubmit = (email: string, password: string) => {
    console.log("New password set for:", email, "Password length:", password.length);
    // TODO: Add API call to update password
    alert(`Password updated successfully for ${email}`);
    setShowNewPassword(false);
    setEmailForReset("");
  };

  const handleCancelForgotPassword = () => {
    setShowForgotPassword(false);
    setEmailForReset("");
  };

  const handleCancelNewPassword = () => {
    setShowNewPassword(false);
    setEmailForReset("");
  };

  if (showNewPassword) {
    return (
      <NewPasswordForm
        email={emailForReset}
        onCancel={handleCancelNewPassword}
        onSubmit={handleNewPasswordSubmit}
      />
    );
  }

  if (showForgotPassword) {
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
        onLoginSuccess={onLoginSuccess}
        onForgotPassword={handleForgotPassword}
      />
    </div>
  );
}
