// client/src/stores/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Set user and token after successful authentication
      setUser: (userData) => {
        set({ 
          user: userData, 
          token: userData.token,
          isAuthenticated: true,
          error: null 
        });
      },

      // Set loading state
      setLoading: (isLoading) => set({ isLoading }),

      // Set error message
      setError: (errorMessage) => set({ error: errorMessage }),

      // Set authentication status
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      // Logout user
      logout: () => {
        // Clear all auth data
        localStorage.removeItem("auth-storage");
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null 
        });
      },

      // Reset error
      clearError: () => set({ error: null }),

      // Check if user session is valid
      isSessionValid: () => {
        const { token, user } = get();
        if (!token || !user) return false;
        
        try {
          // Decode JWT token to check expiration
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          // Check if token is expired
          if (payload.exp < currentTime) {
            // Token expired, logout
            get().logout();
            return false;
          }
          
          return true;
        } catch (error) {
          console.error('Error validating token:', error);
          get().logout();
          return false;
        }
      },
    }),
    {
      name: "auth-storage", // name of the item in localStorage
      getStorage: () => localStorage, // storage to use (defaults to localStorage)
    }
  )
);

export default useAuthStore;
