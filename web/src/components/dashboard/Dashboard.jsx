// client/src/components/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Plane, 
  Calendar, 
  CheckCircle,
  AlertTriangle,
  Battery,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchDrones } from '../../services/droneService';
import { fetchMissions } from '../../services/missionService';
import useDroneStore from '../../stores/droneStore';
import useMissionStore from '../../stores/missionStore';

const Dashboard = () => {
  const { drones } = useDroneStore();
  const { missions } = useMissionStore();
  const [upcomingMissions, setUpcomingMissions] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Fetch drones and missions on component mount
  useEffect(() => {
    fetchDrones();
    fetchMissions();
  }, []);
  
  // Calculate drone stats
  const droneStats = {
    totalDrones: drones.length,
    availableDrones: drones.filter(drone => drone.status === 'available').length,
    maintenanceDrones: drones.filter(drone => drone.status === 'maintenance').length,
    offlineDrones: drones.filter(drone => drone.status === 'offline').length
  };
  
  // Calculate mission stats
  const missionStats = {
    totalMissions: missions.length,
    completedMissions: missions.filter(mission => mission.status === 'completed').length,
    inProgressMissions: missions.filter(mission => mission.status === 'in-progress').length,
    scheduledMissions: missions.filter(mission => mission.status === 'scheduled').length,
  };
  
  // Get upcoming missions
  useEffect(() => {
    if (missions.length > 0) {
      const now = new Date();
      
      // Get scheduled missions that are in the future
      const upcoming = missions
        .filter(mission => mission.status === 'scheduled' && new Date(mission.schedule.dateTime) > now)
        .sort((a, b) => new Date(a.schedule.dateTime) - new Date(b.schedule.dateTime))
        .slice(0, 3) // Take only the next 3 missions
        .map(mission => ({
          id: mission._id,
          name: mission.name,
          date: mission.schedule.dateTime,
          // If we had location info in mission model, we would use that
          // For now we'll just use a placeholder
          location: mission.description?.substring(0, 20) || 'Survey area'
        }));
      
      setUpcomingMissions(upcoming);
    }
  }, [missions]);
  
  // Create recent activities based on missions
  useEffect(() => {
    if (missions.length > 0) {
      // Sort missions by most recently updated
      const sortedMissions = [...missions].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      
      const activities = [];
      
      sortedMissions.slice(0, 4).forEach(mission => {
        const timeAgo = getTimeAgo(new Date(mission.updatedAt));
        
        if (mission.status === 'completed') {
          activities.push({
            id: mission._id,
            type: 'completion',
            mission: mission.name,
            time: timeAgo
          });
        } else if (mission.status === 'in-progress') {
          activities.push({
            id: mission._id,
            type: 'start',
            mission: mission.name,
            time: timeAgo
          });
        } else if (mission.status === 'scheduled') {
          activities.push({
            id: mission._id,
            type: 'scheduled',
            mission: mission.name,
            time: timeAgo
          });
        } else if (mission.status === 'aborted') {
          activities.push({
            id: mission._id,
            type: 'aborted',
            mission: mission.name,
            time: timeAgo
          });
        }
      });
      
      // Add drone maintenance activities if we have any drones in maintenance
      const maintenanceDrones = drones.filter(drone => drone.status === 'maintenance');
      if (maintenanceDrones.length > 0) {
        maintenanceDrones.slice(0, 2).forEach(drone => {
          activities.push({
            id: drone._id,
            type: 'drone-maintenance',
            drone: drone.name,
            time: 'Active'
          });
        });
      }
      
      setRecentActivities(activities.slice(0, 5)); // Limit to 5 activities
    }
  }, [missions, drones]);
  
  // Helper function to format time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Welcome to your FleetHQ command center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Mission Stats Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapPin className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Missions
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {missionStats.totalMissions}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/missions" className="font-medium text-indigo-600 hover:text-indigo-500">
                View all missions
              </Link>
            </div>
          </div>
        </div>

        {/* Drone Stats Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Plane className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Available Drones
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {droneStats.availableDrones} / {droneStats.totalDrones}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/fleet" className="font-medium text-indigo-600 hover:text-indigo-500">
                View fleet status
              </Link>
            </div>
          </div>
        </div>

        {/* Scheduled Missions Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Scheduled Missions
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {missionStats.scheduledMissions}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/monitoring" className="font-medium text-indigo-600 hover:text-indigo-500">
                View schedule
              </Link>
            </div>
          </div>
        </div>

        {/* Completed Missions Card */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Missions
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {missionStats.completedMissions}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/reports" className="font-medium text-indigo-600 hover:text-indigo-500">
                View analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <MapPin className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Plan New Mission</h3>
                  <p className="mt-1 text-sm text-gray-500">Create a new FleetHQ mission</p>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  to="/missions/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Mission
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <Plane className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Manage Drones</h3>
                  <p className="mt-1 text-sm text-gray-500">Add or update drones in your fleet</p>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  to="/fleet/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Drone
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">View Mission Calendar</h3>
                  <p className="mt-1 text-sm text-gray-500">See your mission schedule</p>
                </div>
              </div>
              <div className="mt-5">
                <Link
                  to="/missions"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  View Calendar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Missions and Recent Activity section */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Upcoming Missions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Upcoming Missions
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {upcomingMissions.length > 0 ? (
                  upcomingMissions.map((mission) => (
                    <li key={mission.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 text-indigo-600">
                            <MapPin className="h-6 w-6" />
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {mission.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {mission.location}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <p className="text-sm text-gray-500">
                            {new Date(mission.date).toLocaleDateString()} at{' '}
                            {new Date(mission.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-4 text-center text-gray-500">
                    No upcoming missions scheduled
                  </li>
                )}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/monitoring"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View All
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Activity
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <li key={activity.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {activity.type === 'completion' && (
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-green-100 text-green-600">
                              <CheckCircle className="h-6 w-6" />
                            </span>
                          )}
                          {activity.type === 'start' && (
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-blue-100 text-blue-600">
                              <MapPin className="h-6 w-6" />
                            </span>
                          )}
                          {activity.type === 'scheduled' && (
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-indigo-100 text-indigo-600">
                              <Calendar className="h-6 w-6" />
                            </span>
                          )}
                          {activity.type === 'aborted' && (
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-red-100 text-red-600">
                              <AlertTriangle className="h-6 w-6" />
                            </span>
                          )}
                          {activity.type === 'drone-maintenance' && (
                            <span className="inline-flex items-center justify-center h-10 w-10 rounded-md bg-yellow-100 text-yellow-600">
                              <AlertTriangle className="h-6 w-6" />
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.type === 'completion' && `Mission Completed: ${activity.mission}`}
                            {activity.type === 'start' && `Mission Started: ${activity.mission}`}
                            {activity.type === 'scheduled' && `Mission Scheduled: ${activity.mission}`}
                            {activity.type === 'aborted' && `Mission Aborted: ${activity.mission}`}
                            {activity.type === 'drone-maintenance' && `Drone Maintenance: ${activity.drone}`}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="py-4 text-center text-gray-500">
                    No recent activity
                  </li>
                )}
              </ul>
            </div>
            <div className="mt-6">
              <Link
                to="/monitoring"
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                View All Activity
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;