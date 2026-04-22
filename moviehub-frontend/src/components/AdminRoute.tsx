/* SUBEDI RABIN M25W0465 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role !== "ADMIN") {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
}
