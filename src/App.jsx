import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import TodoList from "./pages/TodoList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

export default function App() {
  // 🌙 Dark mode is ON by default
  const [darkMode, setDarkMode] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* 🌈 Gradient background */}
      <div
        className={`min-h-screen transition-colors text-gray-900 dark:text-gray-100
          ${
            darkMode
              ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800"
              : "bg-gradient-to-br from-indigo-100 via-white to-indigo-200"
          }`}
      >
        {/* Fixed or styled Navbar */}
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setToken={setToken}
          setAdminToken={setAdminToken}
        />

        {/* Add padding-top to account for Navbar height */}
        <main className="pt-24 px-4 sm:px-6 lg:px-8">
          <Routes>
            {/* ✅ Protected user routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute token={token}>
                  <Dashboard darkMode={darkMode} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/todo"
              element={
                <ProtectedRoute token={token}>
                  <TodoList darkMode={darkMode} />
                </ProtectedRoute>
              }
            />

            {/* 🚫 Public routes (blocked if logged in) */}
            <Route
              path="/login"
              element={
                <PublicRoute token={token}>
                  <Login setToken={setToken} />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute token={token}>
                  <Register setToken={setToken} />
                </PublicRoute>
              }
            />

            {/* 👑 Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute adminToken={adminToken}>
                  <AdminDashboard token={adminToken} />
                </AdminProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin setToken={setAdminToken} />} />

            {/* 🌐 Fallback route */}
            <Route
              path="*"
              element={
                token ? (
                  <Navigate to="/dashboard" />
                ) : adminToken ? (
                  <Navigate to="/admin" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}
