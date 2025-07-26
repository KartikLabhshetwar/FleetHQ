// client/src/stores/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      // Set user after successful authentication
      setUser: (userData) => {
        set({ user: userData, error: null });
      },

      // Set loading state
      setLoading: (isLoading) => set({ isLoading }),

      // Set error message
      setError: (errorMessage) => set({ error: errorMessage }),

      // Logout user
      logout: () => {
        localStorage.removeItem("user");
        set({ user: null });
      },

      // Reset error
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // name of the item in localStorage
      getStorage: () => localStorage, // storage to use (defaults to localStorage)
    }
  )
);

export default useAuthStore;
