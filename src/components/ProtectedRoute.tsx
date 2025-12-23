import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) {
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

