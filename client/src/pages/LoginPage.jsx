import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Main login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Demo Login Handler
  const handleDemoLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      // These credentials must exist in your database
      const demoCredentials = {
        email: "mayank@gmail.com",
        password: "mayank",
      };
      const { data } = await api.post("/auth/login", demoCredentials);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError("The demo account is currently unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    try {
      const { data } = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.msg || "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-8 md:p-10">
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
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              className="w-full px-4 py-2 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="w-full px-4 py-2 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Log In"}
            </button>

            {/* Demo Button - Added for Reviewers */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full py-2 rounded-lg text-blue-600 font-semibold border-2 border-blue-500 hover:bg-blue-50 transition flex items-center justify-center gap-2"
            >
              🚀 Try with Guest Account
            </button>

            <div className="relative my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm italic">
                or
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setError("Google sign-in was cancelled or failed.")
                }
                theme="filled_black"
                size="large"
                text="continue_with"
                shape="rectangular"
              />
            </div>
          </form>

          {error && (
            <p className="text-red-500 text-sm mt-4 text-center font-medium">
              {error}
            </p>
          )}

          {/* Testing Credentials Hint */}
          <div className="mt-8 p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mb-1">
              Testing Credentials
            </p>
            <p className="text-xs text-gray-600">
              Email:{" "}
              <span className="font-mono font-bold">mayank@gmail.com</span> |
              Pass:{" "}
              <span className="font-mono font-bold">mayank</span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl py-4 shadow-sm">
          <p className="text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-bold hover:underline"
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
