// src/components/PublicRoute.js
import { Navigate } from "react-router-dom";

export default function PublicRoute({ token, children }) {
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
