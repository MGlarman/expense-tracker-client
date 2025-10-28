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

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* 🌈 Gradient background */}
      <div
        className={`min-h-screen transition-colors text-gray-900 dark:text-gray-100
          ${darkMode
            ? "bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-800"
            : "bg-gradient-to-br from-indigo-100 via-white to-indigo-200"
          }`}
      >
        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setToken={setToken}
          setAdminToken={setAdminToken}
        />

        <Routes>
          {/* User routes */}
          <Route
            path="/dashboard"
            element={token ? <Dashboard darkMode={darkMode} /> : <Navigate to="/login" />}
          />

          <Route
            path="/todo"
            element={token ? <TodoList darkMode={darkMode} /> : <Navigate to="/login" />}
          />

          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register setToken={setToken} />} />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute adminToken={adminToken}>
                <AdminDashboard token={adminToken} />
              </AdminProtectedRoute>
            }
          />
          <Route path="/admin/login" element={<AdminLogin setToken={setAdminToken} />} />

          {/* Fallback route */}
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
      </div>
    </div>
  );
}
