// client/src/components/auth/ProtectedRoute.jsx
import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const ProtectedRoute = () => {
  const { user } = useAuthStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Check if user exists in Zustand store or in localStorage
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (user || storedUser) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, [user]);
  
  if (isLoading) {
    // Return loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated, preserve the intended location
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;