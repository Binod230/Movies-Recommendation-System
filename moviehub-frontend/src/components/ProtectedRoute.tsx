/* SUBEDI RABIN M25W0465 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import React from "react";

interface Props {
  children: React.ReactNode;
  adminOnly?: boolean;
}
export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { isAuthenticated, role } = useAuth();

  // If the user isn't logged in, send them to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but tries to enter /admin without being an ADMIN
  if (adminOnly && role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}