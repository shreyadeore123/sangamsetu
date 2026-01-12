import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
  const token = localStorage.getItem('access_token');
  const savedUser = localStorage.getItem('user');

  if (token && savedUser) {
    try {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    } catch {
      logout();
    }
  }

  setLoading(false);
}, []);

  const login = async (username, password) => {
  try {
    // 1️⃣ Get JWT tokens
    const tokenResponse = await authAPI.login(username, password);

    localStorage.setItem('access_token', tokenResponse.access);
    if (tokenResponse.refresh) {
      localStorage.setItem('refresh_token', tokenResponse.refresh);
    }

    // 2️⃣ Fetch user profile
    const userProfile = await authAPI.getCurrentUser();

    localStorage.setItem('user', JSON.stringify(userProfile));
    setUser(userProfile);
    setIsAuthenticated(true);

    return { success: true, user: userProfile };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error:
        error.response?.data?.detail ||
        'Login failed. Please check your credentials.',
    };
  }
};

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    // Admin has access to everything
    if (user.role === 'ADMIN') return true;
    
    // Check specific role
    return user.role === requiredRole;
  };

  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
