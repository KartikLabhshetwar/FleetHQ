// client/src/components/drones/DroneDetails.jsx
import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useDroneStore from '../../stores/droneStore';
import { fetchDroneById } from '../../services/droneService';
import { Battery, AlertTriangle, Check, Plane, MapPin, Activity } from 'lucide-react';
import MapComponent from '../map/MapComponent';

const DroneDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoading, error, currentDrone } = useDroneStore();
  const [mapVisible, setMapVisible] = useState(false);
  const mapRef = useRef(null);
  
  useEffect(() => {
    // Fetch drone details
    fetchDroneById(id);
  }, [id]);
  
  const handleMapToggle = () => {
    setMapVisible(prevVisible => {
      const newVisible = !prevVisible;
      
      // If we're showing the map, trigger a refresh after a short delay
      if (newVisible && mapRef.current) {
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.refreshMap();
          }
        }, 100);
      }
      
      return newVisible;
    });
  };
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {currentDrone && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Location Information
              </h3>
              
              {currentDrone.location && currentDrone.location.latitude && currentDrone.location.longitude && (
                <button
                  onClick={handleMapToggle}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {mapVisible ? 'Hide Map' : 'Show Map'}
                </button>
              )}
            </div>
            
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Location Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentDrone.location?.locationName || 'Not specified'}
                </dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Coordinates
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentDrone.location?.latitude && currentDrone.location?.longitude
                    ? `${currentDrone.location.latitude.toFixed(6)}, ${currentDrone.location.longitude.toFixed(6)}`
                    : 'Not available'
                  }
                </dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Altitude
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentDrone.location?.altitude
                    ? `${currentDrone.location.altitude.toFixed(1)} meters`
                    : 'Not available'
                  }
                </dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Last Updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {currentDrone.location?.lastUpdated
                    ? new Date(currentDrone.location.lastUpdated).toLocaleString()
                    : 'Never'
                  }
                </dd>
              </div>
              
              {mapVisible && currentDrone.location && currentDrone.location.latitude && currentDrone.location.longitude && (
                <div className="sm:col-span-2 mt-2">
                  <div className="h-80 w-full rounded-md overflow-hidden border border-gray-200">
                    <MapComponent
                      ref={mapRef}
                      initialLocation={{
                        lat: currentDrone.location.latitude,
                        lng: currentDrone.location.longitude
                      }}
                      key={`map-details-${mapVisible}`}
                    />
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
};

export default DroneDetails;