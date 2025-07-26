// client/src/components/missions/MissionsList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useMissionStore from '../../stores/missionStore';
import { fetchMissions, deleteMission } from '../../services/missionService';

const MissionsList = () => {
  const { missions, isLoading, error } = useMissionStore();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  useEffect(() => {
    // Fetch missions on component mount
    fetchMissions();
  }, []);
  
  const handleDelete = async (id) => {
    const success = await deleteMission(id);
    if (success) {
      setDeleteConfirm(null);
    }
  };
  
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };
  
  // Check if mission can be edited (only scheduled missions can be edited)
  const canEditMission = (status) => {
    return status === 'scheduled';
  };
  
  if (isLoading && missions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading missions...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Missions</h1>
          <p className="text-gray-600">Manage your fleetHq missions</p>
        </div>
        <Link
          to="/missions/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create New Mission
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}
      
      {missions.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <div className="px-4 py-16 sm:px-6 text-center">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No missions found</h3>
            <p className="mt-1 text-gray-500">Get started by creating a new mission.</p>
            <div className="mt-6">
              <Link
                to="/missions/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create New Mission
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {missions.map((mission) => (
              <li key={mission._id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-3 ${
                        mission.status === 'scheduled' ? 'bg-blue-500' :
                        mission.status === 'in-progress' ? 'bg-yellow-500' :
                        mission.status === 'completed' ? 'bg-green-500' :
                        mission.status === 'cancelled' ? 'bg-red-500' :
                        mission.status === 'aborted' ? 'bg-red-500' :
                        'bg-gray-500'
                      }`}></div>
                      <p className="text-lg font-medium text-indigo-600 truncate">
                        {mission.name}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        mission.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        mission.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        mission.status === 'completed' ? 'bg-green-100 text-green-800' :
                        mission.status === 'aborted' ? 'bg-red-100 text-red-800' :
                        mission.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {mission.status.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {mission.flightParameters.flightPattern} pattern
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                        </svg>
                        {formatDateTime(mission.schedule.dateTime)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <div className="flex space-x-2">
                        <Link
                          to={`/monitoring`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                        <span className="text-gray-300">|</span>
                        {canEditMission(mission.status) ? (
                          <Link
                            to={`/missions/${mission._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </Link>
                        ) : (
                          <span className="text-gray-400 cursor-not-allowed" title={`Cannot edit missions with status: ${mission.status}`}>
                            Edit
                          </span>
                        )}
                        <span className="text-gray-300">|</span>
                        {deleteConfirm === mission._id ? (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleDelete(mission._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(mission._id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={mission.status === 'in-progress'}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MissionsList;