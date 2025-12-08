import { Routes, Route } from "react-router-dom";
import { Login } from "@/modules/auth";
import { ProtectedRoute } from "./ProtectedRoute";
import { MainLayout } from "./MainLayout";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<Login />} />
      <Route path="/forgot-password/new-password" element={<Login />} />
      
      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

