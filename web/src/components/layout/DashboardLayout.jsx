import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-orange-25">
      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar isMobile={false} toggleSidebar={toggleSidebar} />
      </div>

      {/* Mobile sidebar */}
      <div className={`md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <Sidebar isMobile={true} toggleSidebar={toggleSidebar} />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-orange-900 bg-opacity-70 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            onClick={toggleSidebar}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-orange-500 hover:text-orange-700 focus:outline-none hover:bg-orange-50"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;