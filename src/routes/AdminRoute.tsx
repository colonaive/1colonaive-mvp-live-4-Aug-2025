// src/routes/AdminRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type Props = { children: React.ReactNode };

/**
 * Only allow users whose profiles.user_type is 'super_admin' or 'admin'.
 * Everyone else is redirected to /login.
 */
const AdminRoute: React.FC<Props> = ({ children }) => {
  const { user, userType, loading } = useAuth();

  if (loading) return null; // or a spinner if you like

  if (!user) return <Navigate to="/login" replace />;

  const isAdmin =
    (userType || "").toLowerCase() === "super_admin" ||
    (userType || "").toLowerCase() === "admin";

  return isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
};

export default AdminRoute;
