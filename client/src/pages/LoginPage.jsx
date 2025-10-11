import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", formData);
      login(data.user, data.token);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="p-10 bg-white border rounded-lg shadow-sm">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/logo.png"
              alt="MomentShare Logo"
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500 shadow-sm"
            />
            <h1 className="text-4xl font-semibold font-serif text-center mt-4 text-blue-600">
              Moment<span className="text-gray-800">Share</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border rounded-md"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-50 border rounded-md"
            />
            <button
              type="submit"
              className="w-full py-2 text-white font-semibold bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Log In
            </button>
          </form>
          {error && (
            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
          )}
        </div>

        <div className="p-6 mt-4 text-center bg-white border rounded-lg shadow-sm">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
