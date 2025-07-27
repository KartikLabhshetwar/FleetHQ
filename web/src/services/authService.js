// client/src/services/authService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth`
  : "http://localhost:5000/api/auth";

// Create axios instance with interceptors
const apiClient = axios.create();

// Add a request interceptor to include token in headers
apiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Error parsing auth storage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear auth data
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Register new user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed";
    throw new Error(message);
  }
};

// Login user
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error) {
    console.error(
      "Login error details:",
      error.response?.data || error.message
    );
    const message = error.response?.data?.message || "Login failed";
    throw new Error(message);
  }
};

// Validate current session with server
export const validateSession = async () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) {
      return null;
    }

    const { state } = JSON.parse(authStorage);
    if (!state.token) {
      return null;
    }

    // Check token expiration locally first
    const payload = JSON.parse(atob(state.token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp < currentTime) {
      // Token expired
      localStorage.removeItem('auth-storage');
      return null;
    }

    // Validate with server
    const response = await apiClient.get(`${API_URL}/me`);
    return {
      ...response.data,
      token: state.token // Include token in response
    };
  } catch (error) {
    console.error("Session validation failed:", error);
    localStorage.removeItem('auth-storage');
    return null;
  }
};

// Get current user (deprecated in favor of validateSession)
export const getCurrentUser = async (token) => {
  if (!token) {
    return null;
  }

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(`${API_URL}/me`, config);
    return response.data;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Logout user
export const logout = async () => {
  try {
    // Call server-side logout endpoint
    await apiClient.post(`${API_URL}/logout`);
    
    // Clear local storage
    localStorage.removeItem('auth-storage');
    
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    // Even if server call fails, clear local storage
    localStorage.removeItem('auth-storage');
    return true;
  }
};
