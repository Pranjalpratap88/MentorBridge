import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unwrap the ApiResponse envelope on success.
// On error, extract the clean message from the backend and reject with it
// so callers never see raw SQL or stack traces.
api.interceptors.response.use(
  (response) => {
    // response.data is ApiResponse { status, message, data }
    return response.data;
  },
  (error) => {
    // Build a clean, user-facing error message
    let message = 'Something went wrong. Please try again.';

    if (error.response) {
      const body = error.response.data;

      if (body && body.message) {
        // Our backend always sends { status: "error", message: "..." }
        message = body.message;
      } else if (error.response.status === 401) {
        message = 'Session expired. Please log in again.';
      } else if (error.response.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.response.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.response.status === 409) {
        message = body?.message || 'A conflict occurred. Please check your input.';
      } else if (error.response.status >= 500) {
        message = 'A server error occurred. Please try again later.';
      }
    } else if (error.request) {
      // Request was made but no response received (network down, CORS, etc.)
      message = 'Cannot reach the server. Please check your connection.';
    }

    // Attach the clean message so callers can do: err.message
    const cleanError = new Error(message);
    cleanError.status = error.response?.status;
    cleanError.originalError = error;

    return Promise.reject(cleanError);
  }
);

export default api;
