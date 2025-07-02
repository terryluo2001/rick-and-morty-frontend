// ProtectedRoute.js
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    // If not logged in, redirect to login
    return <Navigate to="/" replace />;
  }

  return children;
}