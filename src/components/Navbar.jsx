import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode, setToken, setAdminToken }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleUserLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
    navigate("/admin/login");
  };

  return (
    <nav className={`p-4 flex flex-wrap items-center justify-between ${darkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"}`}>
      
      {/* Left: Logo */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Link to="/" className="font-bold text-lg hover:text-indigo-600 transition-colors">
          Expense Tracker
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="sm:hidden ml-2 px-2 py-1 border rounded"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "✖️" : "☰"}
        </button>
      </div>

      {/* Right: Links & buttons */}
      <div
        className={`w-full sm:flex sm:items-center sm:w-auto transition-all duration-300 ${
          mobileOpen ? "block mt-4" : "hidden sm:block"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Priority Links */}
          {token && (
            <>
              <Link
                to="/dashboard"
                className="font-semibold hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/todo"
                className="font-semibold hover:text-indigo-600 transition-colors"
              >
                To-Do List
              </Link>
            </>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 border rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* User Logout */}
          {token && (
            <button
              onClick={handleUserLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
            >
              Logout (User)
            </button>
          )}

          {/* Admin Logout */}
          {adminToken && (
            <button
              onClick={handleAdminLogout}
              className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded transition-colors"
            >
              Logout (Admin)
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
