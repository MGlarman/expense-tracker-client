import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ darkMode, setDarkMode, setToken, setAdminToken }) {
  const navigate = useNavigate();

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
    <nav className="bg-gray-200 dark:bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="font-bold text-lg">
          Expense Tracker
        </Link>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-2 py-1 border rounded"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* User Logout */}
        {localStorage.getItem("token") && (
          <button
            onClick={handleUserLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout (User)
          </button>
        )}

        {/* Admin Logout */}
        {localStorage.getItem("adminToken") && (
          <button
            onClick={handleAdminLogout}
            className="bg-red-700 text-white px-3 py-1 rounded"
          >
            Logout (Admin)
          </button>
        )}
      </div>
    </nav>
  );
}
