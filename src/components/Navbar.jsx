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
            {/* Main navigation */}
            {token && (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-sm
                    ${
                      darkMode
                        ? "bg-indigo-700 hover:bg-indigo-600 text-white"
                        : "bg-indigo-500 hover:bg-indigo-600 text-white"
                    }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/todo"
                  className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-sm
                    ${
                      darkMode
                        ? "bg-blue-700 hover:bg-blue-600 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                    }`}
                >
                  To-Do List
                </Link>
              </>
            )}

            {/* Divider */}
            {token && (
              <div className="hidden sm:block w-px h-6 bg-indigo-300 dark:bg-indigo-600 mx-2 opacity-60"></div>
            )}

            {/* Utility buttons - smaller and neutral */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border ${
                  darkMode
                    ? "border-indigo-700 text-indigo-200 hover:bg-indigo-800"
                    : "border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                }`}
              >
                {darkMode ? "☀️ Light" : "🌙 Dark"}
              </button>

              {token && (
                <button
                  onClick={handleUserLogout}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border ${
                    darkMode
                      ? "border-red-700 text-red-300 hover:bg-red-800"
                      : "border-red-300 text-red-700 hover:bg-red-100"
                  }`}
                >
                  Logout
                </button>
              )}

              {adminToken && (
                <button
                  onClick={handleAdminLogout}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all border ${
                    darkMode
                      ? "border-blue-700 text-blue-300 hover:bg-blue-800"
                      : "border-blue-300 text-blue-700 hover:bg-blue-100"
                  }`}
                >
                  Admin Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
