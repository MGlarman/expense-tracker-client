import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://expense-tracker-api-80j5.onrender.com/api/auth/login",
        { username, password }
      );
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 dark:from-gray-900 dark:via-indigo-950 dark:to-gray-800 transition-colors">
      
      {/* Left: Branding / Slogan */}
      <div className="hidden md:flex flex-col items-start justify-center md:w-1/2 px-10">
        <h1 className="text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4">
          BluesBudget
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-md italic">
          Less is More.
        </p>
      </div>

      {/* Right: Login Form */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 py-12">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-center mb-6 text-indigo-600 dark:text-indigo-400">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-700"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold"
            >
              Register
            </Link>
          </p>
        </div>

        {/* Subtle footer text */}
        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} BluesBudget — Track smarter. Spend better.
        </p>
      </div>
    </div>
  );
}
