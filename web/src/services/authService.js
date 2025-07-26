// client/src/services/authService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

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

// Get current user
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
