// client/src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      
      // If there's no token, don't even try to fetch /me
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);
        // Explicitly set the header for this specific call to be safe
        const { data } = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` }
        });
        setUser(data);
      } catch (error) {
        console.error("Failed to load user", error);
        // If the server says 401 (Unauthorized), clear everything
        if (error.response?.status === 401) {
          logout();
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (userData, userToken) => {
    localStorage.setItem("token", userToken);
    // Set the header specifically for the instance
    api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
