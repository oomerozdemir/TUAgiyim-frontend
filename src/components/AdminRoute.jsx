import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { auth } = useAuth();
  const role = auth?.user?.role?.toLowerCase?.();
  if (!auth?.token) return <Navigate to="/giris-yap" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;
  return <Outlet />;
}
