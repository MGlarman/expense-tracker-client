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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
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

          {/* Todo route for logged-in users */}
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
