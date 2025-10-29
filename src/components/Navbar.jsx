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
      className={`fixed top-0 left-0 w-full z-50 overflow-hidden box-border backdrop-blur-md bg-opacity-80 border-b shadow-md transition-all duration-300
        ${
          darkMode
            ? "bg-gradient-to-r from-indigo-950/90 via-indigo-900/80 to-blue-900/90 text-white border-indigo-800"
            : "bg-gradient-to-r from-blue-50 via-indigo-100 to-indigo-200 text-gray-900 border-indigo-300"
        }`}
      style={{
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "none",
      }}
    >
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between overflow-hidden">
        {/* Left: Logo + Slogan */}
        <div className="flex items-center justify-between w-full sm:w-auto min-w-0">
          <Link
            to="/"
            className={`flex flex-col sm:flex-row sm:items-baseline group min-w-0 ${
              darkMode ? "text-indigo-300" : "text-indigo-700"
            }`}
          >
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight group-hover:scale-105 transform transition-all duration-200 truncate">
              💸 BluesBudget
            </span>
            <span
              className={`text-xs sm:text-sm font-light ${
                darkMode ? "text-indigo-200" : "text-indigo-600"
              } sm:ml-2 italic opacity-90 whitespace-nowrap`}
            >
              Less is More
            </span>
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
          className={`w-full sm:flex sm:items-center sm:w-auto overflow-hidden transition-all duration-300 ${
            mobileOpen ? "block mt-3" : "hidden sm:block"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 font-medium">
            {token && (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors truncate"
                >
                  Dashboard
                </Link>
                <Link
                  to="/todo"
                  className="hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors truncate"
                >
                  To-Do List
                </Link>
              </>
            )}

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 border rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-800 border-indigo-300 dark:border-indigo-600 transition-all text-sm shadow-sm truncate"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>

            {token && (
              <button
                onClick={handleUserLogout}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm shadow transition-all hover:scale-105 truncate"
              >
                Logout
              </button>
            )}

            {adminToken && (
              <button
                onClick={handleAdminLogout}
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-lg text-sm shadow transition-all hover:scale-105 truncate"
              >
                Admin Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
