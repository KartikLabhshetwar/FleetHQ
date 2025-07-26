import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Bird,
} from 'lucide-react';

const Sidebar = ({ isMobile, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
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
    <div className={`h-full bg-gray-900 text-white flex flex-col ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ease-in-out' : 'w-64'}`}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-800">
        <div className="flex items-center">
          <Bird className="h-8 w-8 text-indigo-400" />
          <span className="ml-2 text-xl font-semibold">FleetHQ</span>
        </div>
        {isMobile && (
          <button onClick={toggleSidebar} className="p-1 rounded-md text-gray-400 hover:text-white">
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
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive(item.path)
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 ${
                  isActive(item.path)
                    ? 'text-indigo-400'
                    : 'text-gray-400 group-hover:text-gray-300'
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
          className="w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white group"
        >
          <LogOut className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300" />
          Logout
        </button>
      </div>
      
      {/* User profile */}
      <div className="w-full p-4 border-t border-gray-800">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User Name'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.role || 'Facility Manager'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;