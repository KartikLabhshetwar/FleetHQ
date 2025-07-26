// client/src/components/auth/ProtectedRoute.jsx
import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { validateSession } from '../../services/authService';

const ProtectedRoute = () => {
  const { user, setUser, logout, isAuthenticated, setAuthenticated, setLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    const checkAuthentication = async () => {
      setLoading(true);
      
      try {
        // First check if there's any stored auth data
        const authStorage = localStorage.getItem('auth-storage');
        if (!authStorage) {
          setAuthenticated(false);
          setIsLoading(false);
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
        console.error('Authentication check failed:', error);
        logout();
        setAuthenticated(false);
      } finally {
        setIsLoading(false);
        setLoading(false);
      }
    };
    
    checkAuthentication();
  }, [setUser, logout, setAuthenticated, setLoading]);
  
  if (isLoading) {
    // Return loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent mb-4"></div>
          <p className="text-orange-700">Validating session...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated, preserve the intended location
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;