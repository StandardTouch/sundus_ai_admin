import { Routes, Route } from "react-router-dom";
import { Login } from "@/modules/auth";

export function PublicRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<Login />} />
      <Route path="/forgot-password/new-password" element={<Login />} />
    </Routes>
  );
}

