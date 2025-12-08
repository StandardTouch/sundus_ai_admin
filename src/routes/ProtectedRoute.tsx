import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser, setAuthFromStorage } from "@/store/slices/authSlice";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // First, try to set auth from localStorage
    dispatch(setAuthFromStorage());
    
    // Then verify with API
    const token = localStorage.getItem("authToken");
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);

  if (isLoading) {
    // Show loading state while verifying
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--admin-bg)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--admin-primary)] mx-auto mb-4"></div>
          <p className="text-[var(--admin-text)]">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

