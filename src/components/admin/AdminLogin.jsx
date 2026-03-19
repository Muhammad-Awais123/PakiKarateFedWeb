import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosConfig.js";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post("/admin/login", { email, password });
      const token = data?.token;
      const admin = data?.admin || null;
      const adminName = admin?.name || data?.name || "";
      if (!token) throw new Error("No token returned");
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminName", adminName);
      navigate("/admin/dashboard/events");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-50">Admin Login</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-zinc-300">
          Sign in to manage events, rankings, and registrations.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-zinc-100">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm bg-white dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100 pr-20"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#008000] hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error ? <div className="text-sm text-red-600">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#008000] text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;