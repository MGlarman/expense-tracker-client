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
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-opacity-80 p-4 flex flex-wrap items-center justify-between shadow-lg border-b transition-all duration-300
        ${
          darkMode
            ? "bg-gradient-to-r from-indigo-950/80 via-indigo-900/80 to-blue-900/80 text-white border-indigo-800"
            : "bg-gradient-to-r from-blue-50 via-indigo-100 to-indigo-200 text-gray-900 border-indigo-300"
        }`}
    >
      {/* Left: Logo + Slogan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full sm:w-auto gap-1">
        <Link
          to="/"
          className={`font-extrabold tracking-tight flex flex-col sm:flex-row sm:items-baseline group transition-transform duration-300 ${
            darkMode ? "text-indigo-300" : "text-indigo-700"
          }`}
        >
          <span className="text-2xl group-hover:scale-105 transform transition-all duration-200">
            💸 BluesBudget
          </span>
          <span
            className={`text-sm font-light ${
              darkMode ? "text-indigo-200" : "text-indigo-600"
            } sm:ml-2 italic opacity-90`}
          >
            Less is More
          </span>
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="sm:hidden ml-auto mt-2 sm:mt-0 px-2 py-1 border rounded border-indigo-300 text-indigo-700 dark:text-indigo-200 hover:bg-indigo-200 dark:hover:bg-indigo-700 transition-colors"
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
                className="hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/todo"
                className="hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
              >
                To-Do List
              </Link>
            </>
          )}

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 border rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 border-indigo-300 dark:border-indigo-600 transition-all shadow-sm"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* Logout Buttons */}
          {token && (
            <button
              onClick={handleUserLogout}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg shadow-md transition-all hover:scale-105"
            >
              Logout (User)
            </button>
          )}

          {adminToken && (
            <button
              onClick={handleAdminLogout}
              className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-lg shadow-md transition-all hover:scale-105"
            >
              Logout (Admin)
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
