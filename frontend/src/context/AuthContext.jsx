import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { adminApi } from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const parseToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) return null; // expired
    return { token, id: decoded.id, name: decoded.name || '', email: decoded.email || '' };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [admin,   setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  // Expose logout so the axios interceptor can call it
  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  }, []);

  // ── Global axios interceptor: auto-logout on 401 ──────────────────────────
  useEffect(() => {
    const id = adminApi.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          // Token expired or invalid — clear session
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => adminApi.interceptors.response.eject(id);
  }, [logout]);

  // ── Bootstrap from localStorage ──────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      const parsed = parseToken(token);
      if (parsed) setAdmin(parsed);
      else {
        localStorage.removeItem('adminToken');
        setAdmin(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token) => {
    localStorage.setItem('adminToken', token);
    setAdmin(parseToken(token));
  };

  // Re-issue token after credential / password change
  const refreshToken = (token) => {
    localStorage.setItem('adminToken', token);
    setAdmin(parseToken(token));
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, refreshToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
