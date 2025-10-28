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
    <nav
      className={`p-4 flex flex-wrap items-center justify-between shadow-md transition-all duration-300
      ${
        darkMode
          ? "bg-gradient-to-r from-indigo-950 via-indigo-800 to-blue-900 text-white"
          : "bg-gradient-to-r from-blue-100 via-indigo-100 to-indigo-200 text-gray-900"
      }`}
    >
      {/* Left: Logo */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Link
          to="/"
          className={`text-2xl font-extrabold tracking-tight ${
            darkMode ? "text-indigo-300" : "text-indigo-700"
          } hover:scale-105 transition-transform`}
        >
          💸 BluesBudget
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden ml-2 px-2 py-1 border rounded border-indigo-300 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "✖️" : "☰"}
        </button>
      </div>

      {/* Right: Links & Buttons */}
      <div
        className={`w-full sm:flex sm:items-center sm:w-auto transition-all duration-300 ${
          mobileOpen ? "block mt-4" : "hidden sm:block"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 font-medium">
          {/* Authenticated user links */}
          {token && (
            <>
              <Link
                to="/dashboard"
                className="hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/todo"
                className="hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
              >
                To-Do List
              </Link>
            </>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 border rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-700 border-indigo-300 dark:border-indigo-500 transition-all"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* Logout Buttons */}
          {token && (
            <button
              onClick={handleUserLogout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg shadow transition-all"
            >
              Logout (User)
            </button>
          )}

          {adminToken && (
            <button
              onClick={handleAdminLogout}
              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-lg shadow transition-all"
            >
              Logout (Admin)
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
