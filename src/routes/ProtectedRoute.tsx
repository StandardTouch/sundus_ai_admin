import { Navigate } from "react-router-dom";
import { useState } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated] = useState(() => {
    // Check localStorage for auth state
    return localStorage.getItem("isAuthenticated") === "true";
  });

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

