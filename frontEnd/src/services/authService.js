import api from './api';

// All methods here simply call the api instance.
// Error messages are already cleaned up by the api.js interceptor,
// so callers just catch err.message for a user-friendly string.

const authService = {
  login: async (credentials) => {
    // Returns ApiResponse { status, message, data: { accessToken } }
    const response = await api.post('/auth/login', credentials);
    if (response.status === 'success' && response.data?.accessToken) {
      localStorage.setItem('token', response.data.accessToken);
    }
    return response;
  },

  register: async (userData) => {
    return api.post('/auth/register', userData);
  },

  verifyEmail: async (email, otp) => {
    return api.post('/auth/verify-email', { email, otp });
  },

  resendVerification: async (email) => {
    return api.post(`/auth/resend-verification?email=${encodeURIComponent(email)}`);
  },

  forgotPassword: async (email) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (email, otp, newPassword) => {
    return api.post('/auth/reset-password', { email, otp, newPassword });
  },

  resendOtp: async (email, type) => {
    return api.post(`/auth/resend-otp?email=${encodeURIComponent(email)}&type=${type}`);
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },
};

export default authService;
