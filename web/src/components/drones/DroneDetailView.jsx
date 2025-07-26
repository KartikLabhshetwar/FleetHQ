// client/src/components/drones/DroneDetailView.jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Battery, AlertTriangle, Check, Plane, MapPin, Activity, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import useDroneStore from '../../stores/droneStore';
import { fetchDroneById, deleteDrone } from '../../services/droneService';
import MapComponent from '../map/MapComponent';

const DroneDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentDrone, isLoading, error } = useDroneStore();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [mapVisible, setMapVisible] = useState(true);
  const [mapKey, setMapKey] = useState(Date.now()); // Add a key to force re-render

  useEffect(() => {
    // Fetch drone details
    fetchDroneById(id);
  }, [id]);

  // Add effect to refresh map when data changes
  useEffect(() => {
    if (currentDrone && mapVisible) {
      setMapKey(Date.now());
    }
  }, [currentDrone, mapVisible]);

  const handleDelete = async () => {
    const success = await deleteDrone(id);
    if (success) {
      navigate('/fleet');
    }
  };

  const getBatteryColorClass = (level) => {
    if (level > 70) return 'bg-green-500';
    if (level > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getStatusInfo = (status) => {
    switch(status) {
      case 'available':
        return { color: 'bg-green-100 text-green-800', label: 'Available' };
      case 'in-mission':
        return { color: 'bg-blue-100 text-blue-800', label: 'In Mission' };
      case 'maintenance':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Maintenance' };
      case 'offline':
        return { color: 'bg-red-100 text-red-800', label: 'Offline' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: status };
    }
  };

  const getHealthStatusInfo = (healthStatus) => {
    switch(healthStatus) {
      case 'excellent':
        return { color: 'text-green-600', label: 'Excellent' };
      case 'good':
        return { color: 'text-green-500', label: 'Good' };
      case 'fair':
        return { color: 'text-yellow-500', label: 'Fair' };
      case 'needs-attention':
        return { color: 'text-orange-500', label: 'Needs Attention' };
      case 'critical':
        return { color: 'text-red-600', label: 'Critical' };
      default:
        return { color: 'text-gray-500', label: healthStatus || 'Unknown' };
    }
  };

  const formatLastUpdated = (lastUpdated) => {
    if (!lastUpdated) return 'Never';
    
    const date = new Date(lastUpdated);
    return date.toLocaleString();
  };

  if (isLoading || !currentDrone) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading drone details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <Link to="/fleet" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Fleet
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(currentDrone.status);
  const healthInfo = getHealthStatusInfo(currentDrone.healthStatus);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center">
            <Link to="/fleet" className="text-indigo-600 hover:text-indigo-900 mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{currentDrone.name}</h1>
          </div>
          <p className="text-gray-600 mt-1">Drone Details</p>
        </div>
        <div className="flex space-x-3">
          <Link 
            to={`/fleet/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          {!deleteConfirm ? (
            <button 
              onClick={() => setDeleteConfirm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          ) : (
            <div className="flex space-x-2">
              <button 
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Confirm
              </button>
              <button 
                onClick={() => setDeleteConfirm(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Main Info */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Drone Information
            </h3>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Serial Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentDrone.serialNumber}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Model
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentDrone.model}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Max Flight Time
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {currentDrone.maxFlightTime} minutes
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Health Status
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <span className={`font-medium ${healthInfo.color}`}>
                    {healthInfo.label}
                  </span>
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Battery Level
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center">
                    <Battery className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    <div className="w-48 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${getBatteryColorClass(currentDrone.batteryLevel)}`} 
                        style={{ width: `${currentDrone.batteryLevel}%` }}
                      ></div>
                    </div>
                    <span>{currentDrone.batteryLevel}%</span>
                  </div>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Last Maintenance
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {formatLastUpdated(currentDrone.lastMaintenance)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Location Map */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Location
            </h3>
            <button
              onClick={() => setMapVisible(!mapVisible)}
              className="text-sm text-indigo-600 hover:text-indigo-900"
            >
              {mapVisible ? 'Hide Map' : 'Show Map'}
            </button>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <div className="flex items-center">
                <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700 font-medium">
                  {currentDrone.location?.locationName || 'Location name not available'}
                </span>
              </div>
              <div className="mt-1 text-xs text-gray-500 ml-6">
                Coordinates: {currentDrone.location?.latitude.toFixed(6)}, {currentDrone.location?.longitude.toFixed(6)}, 
                Alt: {currentDrone.location?.altitude}m
              </div>
              <div className="mt-1 text-xs text-gray-500 ml-6">
                Last updated: {formatLastUpdated(currentDrone.location?.lastUpdated)}
              </div>
            </div>
            
            {mapVisible && (
              <div className="border border-gray-200 rounded-md overflow-hidden" style={{ height: "400px" }}>
                <MapComponent 
                  key={mapKey}
                  initialLocation={
                    currentDrone.location && 
                    typeof currentDrone.location.latitude === 'number' && 
                    typeof currentDrone.location.longitude === 'number' && 
                    currentDrone.location.latitude !== 0 && 
                    currentDrone.location.longitude !== 0 ? 
                    {
                      lat: currentDrone.location.latitude, 
                      lng: currentDrone.location.longitude
                    } : null
                  } 
                  height="400px"
                  zoom={14}
                  markers={[{
                    position: {
                      lat: currentDrone.location?.latitude,
                      lng: currentDrone.location?.longitude
                    },
                    title: currentDrone.name,
                    info: `${currentDrone.name} (${currentDrone.model})`
                  }]}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroneDetailView;