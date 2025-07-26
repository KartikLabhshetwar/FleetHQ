import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import { logout as authLogout } from '../../services/authService';
import { 
  Home, 
  MapPin, 
  Plane, 
  BarChart2, 
  Settings, 
  Menu, 
  X,
  Users,
  Calendar,
  LogOut,
  FileText,
} from 'lucide-react';

const Sidebar = ({ isMobile, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
  const handleLogout = async () => {
    try {
      // Call logout service
      await authLogout();
      // Call store logout
      logout();
      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if service call fails, clear local state
      logout();
      navigate('/login');
    }
  };
  
  const navItems = [
    { name: 'Dashboard', icon: Home, path: '/dashboard' },
    { name: 'Mission Planning', icon: MapPin, path: '/missions' },
    { name: 'Fleet Management', icon: Plane, path: '/fleet' },
    { name: 'Mission Monitoring', icon: BarChart2, path: '/monitoring' },
    { name: 'Survey Reports', icon: FileText, path: '/reports' },
    // { name: 'Analytics', icon: BarChart2, path: '/analytics' },
    // { name: 'Schedule', icon: Calendar, path: '/schedule' },
    // { name: 'Users', icon: Users, path: '/users' },
    // { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className={`h-full bg-white border-r-2 border-orange-400 text-orange-900 flex flex-col shadow-sm ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out' : 'w-64'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b-2 border-orange-400">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-9 7-4-10-6 3 6z" />
              </svg>
          </div>
          <span className="ml-2 text-xl font-semibold text-orange-900">FleetHQ</span>
        </div>
        {isMobile && (
          <button onClick={toggleSidebar} className="p-1 rounded-md text-orange-400 hover:text-orange-600">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>
      
      <nav className="mt-5 px-2 flex-grow">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                isActive(item.path)
                  ? 'bg-orange-100 text-orange-700 border-orange-500'
                  : 'text-orange-600 hover:bg-orange-50 hover:text-orange-700'
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 ${
                  isActive(item.path)
                    ? 'text-orange-600'
                    : 'text-orange-400 group-hover:text-orange-600'
                }`}
              />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Logout option */}
      <div className="px-2 py-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-orange-600 hover:bg-orange-50 hover:text-orange-700 group transition-colors"
        >
          <LogOut className="mr-3 h-6 w-6 text-orange-400 group-hover:text-orange-600" />
          Logout
        </button>
      </div>
      
      {/* User profile */}
      <div className="w-full p-4 border-t-2 border-orange-400">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-orange-900 truncate">{user?.name || 'User Name'}</p>
            <p className="text-xs text-orange-600 truncate">{user?.role || 'Facility Manager'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;