import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, token } = useAuth();

  if (!token || !user || user.isAdmin !== true) {
    return <Navigate to="/" replace />;
  }

  return children;
}
