// client/src/components/auth/AuthProvider.jsx
import { useEffect } from 'react';
import useAuthStore from '../../stores/authStore';
import { validateSession } from '../../services/authService';

const AuthProvider = ({ children }) => {
  const { setUser, logout, setAuthenticated, setLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        // Check if there's any stored auth data
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }

        // Validate session with server
        const validatedUser = await validateSession();
        
        if (validatedUser) {
          // Session is valid, update store
          setUser(validatedUser);
          setAuthenticated(true);
        } else {
          // Session invalid, logout
          logout();
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        logout();
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setUser, logout, setAuthenticated, setLoading]);

  return children;
};

export default AuthProvider;
