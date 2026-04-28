import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the real user profile from the backend using the stored JWT
  const fetchUserProfile = async () => {
    try {
      // api interceptor returns ApiResponse; .data is the UserDto
      const res = await api.get('/users/profile');
      setUser(res.data);
    } catch (err) {
      // Token expired or invalid — clear everything
      authService.logout();
      setUser(null);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.getCurrentUser()) {
        await fetchUserProfile();
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Login: throws err.message (already cleaned by api.js interceptor) on failure
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response.status === 'success') {
      await fetchUserProfile();
      // Return the freshly fetched user so callers can redirect based on role
      const profileRes = await api.get('/users/profile');
      response.user = profileRes.data;
    }
    return response;
  };

  // Register: throws err.message on failure
  const register = async (userData) => {
    return authService.register(userData);
  };

  // Verify email OTP
  const verifyEmail = async (email, otp) => {
    const response = await api.post('/auth/verify-email', { email, otp });
    if (response.status === 'success' && user) {
      await fetchUserProfile();
    }
    return response;
  };

  const resendVerification = async (email) => {
    return api.post(`/auth/resend-verification?email=${encodeURIComponent(email)}`);
  };

  const forgotPassword = async (email) => {
    return api.post('/auth/forgot-password', { email });
  };

  const resetPassword = async (email, otp, newPassword) => {
    return api.post('/auth/reset-password', { email, otp, newPassword });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      verifyEmail,
      resendVerification,
      forgotPassword,
      resetPassword,
      logout,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
