import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Wait for auth to load before making decisions
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--admin-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--admin-text)]">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check if user's role is in the list
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect customer_support to FAQs page
    if (user.role === "customer_support") {
      return <Navigate to="/faqs" replace />;
    }
    // Redirect others to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

