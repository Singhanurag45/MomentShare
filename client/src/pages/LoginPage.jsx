import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", formData);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img
              src="/logo.png"
              alt="MomentShare"
              className="w-20 h-20 rounded-full border-2 border-blue-500 shadow"
            />
            <h1 className="text-4xl font-bold mt-4 text-blue-600">
              Moment<span className="text-gray-800">Share</span>
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Log in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              onChange={handleChange}
              autoComplete="email"
              required
              className="w-full px-4 py-2 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 transition"
            >
              Log In
            </button>
          </form>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center bg-white/80 backdrop-blur-md border rounded-xl py-4">
          <p>
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
