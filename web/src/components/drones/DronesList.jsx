// client/src/components/drones/DronesList.jsx
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useDroneStore from '../../stores/droneStore';
import useAuthStore from '../../stores/authStore';
import { fetchDrones, deleteDrone } from '../../services/droneService';
import { Battery, AlertTriangle, Check, Plane, MapPin, Activity } from 'lucide-react';
import MapComponent from '../map/MapComponent';

const DronesList = () => {
    const { drones, isLoading, error } = useDroneStore();
    const { isAuthenticated, token } = useAuthStore();
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    const [expandedMap, setExpandedMap] = useState(null);
    const mapRefs = useRef({});
    
    useEffect(() => {
        // Fetch drones when authenticated
        if (isAuthenticated && token) {
            fetchDrones();
        }
    }, [isAuthenticated, token]);
    
    const handleDelete = async (id) => {
        const success = await deleteDrone(id);
        if (success) {
            setDeleteConfirm(null);
        }
    };
    
    const toggleMap = (droneId) => {
        setExpandedMap(prevId => {
            // If toggling the same drone, close the map
            if (prevId === droneId) {
                return null;
            }
            
            // Otherwise, open the map for this drone
            // Use a slight delay to allow the component to render
            setTimeout(() => {
                if (mapRefs.current[droneId]) {
                    mapRefs.current[droneId].refreshMap();
                }
            }, 100);
            
            return droneId;
        });
    };
    
    const getBatteryColorClass = (level) => {
        if (level > 70) return 'bg-green-500';
        if (level > 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };
    
    const getStatusInfo = (status) => {
        switch(status) {
            case 'available':
                return { color: 'bg-green-100 text-green-800 border-green-200', label: 'Available', icon: Check };
            case 'in-mission':
                return { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'In Mission', icon: MapPin };
            case 'maintenance':
                return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Maintenance', icon: AlertTriangle };
            case 'offline':
                return { color: 'bg-red-100 text-red-800 border-red-200', label: 'Offline', icon: AlertTriangle };
            default:
                return { color: 'bg-gray-100 text-gray-800 border-gray-200', label: status, icon: AlertTriangle };
        }
    };

    const getHealthStatusInfo = (healthStatus) => {
        switch(healthStatus) {
            case 'excellent':
                return { color: 'text-green-600', label: 'Excellent', bgColor: 'bg-green-50' };
            case 'good':
                return { color: 'text-green-500', label: 'Good', bgColor: 'bg-green-50' };
            case 'fair':
                return { color: 'text-yellow-500', label: 'Fair', bgColor: 'bg-yellow-50' };
            case 'needs-attention':
                return { color: 'text-orange-500', label: 'Needs Attention', bgColor: 'bg-orange-50' };
            case 'critical':
                return { color: 'text-red-600', label: 'Critical', bgColor: 'bg-red-50' };
            default:
                return { color: 'text-gray-500', label: healthStatus || 'Unknown', bgColor: 'bg-gray-50' };
        }
    };
    
    const formatLocationString = (location) => {
        if (!location) return 'Location not available';
        
        if (location.locationName) {
            return location.locationName;
        }
        
        return `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}${location.altitude ? `, ${location.altitude.toFixed(1)}m` : ''}`;
    };
    
    const formatLastUpdated = (lastUpdated) => {
        if (!lastUpdated) return 'Never';
        
        const date = new Date(lastUpdated);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    };
    
    if (isLoading && drones.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center py-16">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
                    <p className="mt-4 text-orange-600 font-medium">Loading drones...</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="max-w-7xl mx-auto px-20 py-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-4xl font-bold text-orange-900 mb-2">Fleet Management</h1>
                    <p className="text-lg text-orange-600">Monitor and manage your drone fleet</p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="flex p-1 border border-orange-300 rounded-lg bg-orange-50">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                viewMode === 'list' 
                                    ? 'bg-white shadow-sm text-orange-900' 
                                    : 'text-orange-600 hover:text-orange-800'
                            }`}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                                viewMode === 'grid' 
                                    ? 'bg-white shadow-sm text-orange-900' 
                                    : 'text-orange-600 hover:text-orange-800'
                            }`}
                        >
                            Grid View
                        </button>
                    </div>
                    <Link
                        to="/fleet/new"
                        className="px-6 py-2 border border-b-5 border-r-5 border-orange-300 rounded-lg bg-orange-50 hover:border-2"
                    >
                        Add New Drone
                    </Link>
                </div>
            </div>
            
            {/* Fleet stats overview */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="bg-yellow-50 rounded-sm p-6 border border-orange-200 border-b-5 border-r-5 hover:border-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">Total Drones</p>
                            <p className="text-3xl font-bold text-orange-900">{drones.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 rounded-sm p-6 border border-orange-200 border-b-5 border-r-5 hover:border-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">Available</p>
                            <p className="text-3xl font-bold text-orange-900">
                                {drones.filter(drone => drone.status === 'available').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 rounded-sm p-6 border border-orange-200 border-b-5 border-r-5 hover:border-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">In Mission</p>
                            <p className="text-3xl font-bold text-orange-900">
                                {drones.filter(drone => drone.status === 'in-mission').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 rounded-sm p-6 border border-orange-200 border-b-5 border-r-5 hover:border-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-orange-600 uppercase tracking-wide">Issues</p>
                            <p className="text-3xl font-bold text-orange-900">
                                {drones.filter(drone =>
                                    drone.status === 'maintenance' || drone.status === 'offline'
                                ).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Drones List/Grid View */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg">
                    <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <div className="ml-3">
                            <p className="text-sm text-red-800 font-medium">{error}</p>
                        </div>
                    </div>
                </div>
            )}
            
            {drones.length === 0 ? (
                <div className="bg-white shadow-lg rounded-xl border-2 border-orange-200 overflow-hidden">
                    <div className="px-6 py-16 text-center">
                        <h3 className="text-xl font-semibold text-orange-900 mb-2">No drones found</h3>
                        <p className="text-orange-600 mb-6">Get started by adding a new drone to your fleet.</p>
                        <Link
                            to="/fleet/new"
                            className="inline-flex items-center px-6 py-3 border border-orange-500 rounded-lg hover:bg-orange-100 text-orange-600 font-medium"
                        >
                            Add New Drone
                        </Link>
                    </div>
                </div>
            ) : viewMode === 'list' ? (
                // List View
                <div className="bg-white shadow-lg rounded-xl border border-orange-200 overflow-hidden">
                    <div className="divide-y divide-orange-100">
                        {drones.map((drone) => {
                            const statusInfo = getStatusInfo(drone.status);
                            const healthInfo = getHealthStatusInfo(drone.healthStatus);
                            const isMapExpanded = expandedMap === drone._id;
                            const StatusIcon = statusInfo.icon;
                            
                            return (
                                <div key={drone._id} className="p-6 hover:bg-orange-50 transition-colors">
                                    {/* Header Row */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <StatusIcon className={`h-6 w-6 ${
                                                    drone.status === 'available' ? 'text-green-600' :
                                                    drone.status === 'in-mission' ? 'text-blue-600' :
                                                    drone.status === 'maintenance' ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-orange-900">{drone.name}</h3>
                                                <div className="flex items-center space-x-4 text-sm text-orange-600">
                                                    <span className="font-medium">Model: {drone.model}</span>
                                                    <span>•</span>
                                                    <span>S/N: {drone.serialNumber}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                    
                                    {/* Metrics Row */}
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                        {/* Battery */}
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <Battery className="h-5 w-5 text-orange-500" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium text-gray-700">Battery</span>
                                                    <span className="text-sm font-bold text-gray-900">{drone.batteryLevel}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div 
                                                        className={`h-2 rounded-full transition-all ${getBatteryColorClass(drone.batteryLevel)}`} 
                                                        style={{ width: `${drone.batteryLevel}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Health Status */}
                                        <div className={`flex items-center space-x-3 p-3 rounded-lg ${healthInfo.bgColor}`}>
                                            <Activity className={`h-5 w-5 ${healthInfo.color}`} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Health</p>
                                                <p className={`text-sm font-bold ${healthInfo.color}`}>{healthInfo.label}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Flight Time */}
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">Max Flight</p>
                                                <p className="text-sm font-bold text-gray-900">{drone.maxFlightTime} min</p>
                                            </div>
                                        </div>
                                        
                                        {/* Location */}
                                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0" />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-700">Location</p>
                                                <p className="text-sm text-gray-900 truncate" title={formatLocationString(drone.location)}>
                                                    {formatLocationString(drone.location)}
                                                </p>
                                                {drone.location?.lastUpdated && (
                                                    <p className="text-xs text-gray-500">
                                                        {formatLastUpdated(drone.location.lastUpdated)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Actions Row */}
                                    <div className="flex items-center justify-between pt-4 border-t border-orange-100">
                                        <div className="flex items-center space-x-4">
                                            <Link
                                                to={`/fleet/${drone._id}`}
                                                className="text-orange-600 hover:text-orange-800 font-medium text-sm transition-colors"
                                            >
                                                View Details
                                            </Link>
                                            <Link
                                                to={`/fleet/${drone._id}/edit`}
                                                className="text-orange-600 hover:text-orange-800 font-medium text-sm transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            {deleteConfirm === drone._id ? (
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleDelete(drone._id)}
                                                        className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                                                    >
                                                        Confirm Delete
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="text-gray-600 hover:text-gray-800 font-medium text-sm transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(drone._id)}
                                                    className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                        
                                        <button
                                            onClick={() => toggleMap(drone._id)}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-orange-700 bg-orange-100 border border-orange-300 rounded-lg hover:bg-orange-200 transition-colors"
                                        >
                                            {isMapExpanded ? 'Hide Map' : 'Show Map'}
                                        </button>
                                    </div>
                                    
                                    {/* Map Expansion */}
                                    {isMapExpanded && drone.location && drone.location.latitude && drone.location.longitude && (
                                        <div className="mt-4 h-64 w-full rounded-lg overflow-hidden border border-orange-200">
                                            <MapComponent
                                                ref={el => mapRefs.current[drone._id] = el}
                                                initialLocation={{
                                                    lat: drone.location.latitude,
                                                    lng: drone.location.longitude
                                                }}
                                                key={`map-${drone._id}-${isMapExpanded}`}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                // Grid View
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {drones.map((drone) => {
                        const statusInfo = getStatusInfo(drone.status);
                        const healthInfo = getHealthStatusInfo(drone.healthStatus);
                        const isMapExpanded = expandedMap === drone._id;
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                            <div key={drone._id} className="bg-white rounded-xl border border-orange-200 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-orange-100 rounded-lg">
                                                <StatusIcon className={`h-5 w-5 ${
                                                    drone.status === 'available' ? 'text-green-600' :
                                                    drone.status === 'in-mission' ? 'text-blue-600' :
                                                    drone.status === 'maintenance' ? 'text-yellow-600' :
                                                    'text-red-600'
                                                }`} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-lg font-semibold text-orange-900 truncate">{drone.name}</h3>
                                                <p className="text-sm text-orange-600 truncate">{drone.model}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusInfo.color} flex-shrink-0`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                    
                                    {/* Metrics */}
                                    <div className="space-y-3 mb-6">
                                        {/* Battery */}
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Battery className="h-4 w-4 text-orange-500" />
                                                <span className="text-sm font-medium text-gray-700">Battery</span>
                                                <span className="text-sm font-bold text-gray-900 ml-auto">{drone.batteryLevel}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full transition-all ${getBatteryColorClass(drone.batteryLevel)}`} 
                                                    style={{ width: `${drone.batteryLevel}%` }}
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Health */}
                                        <div className={`p-3 rounded-lg ${healthInfo.bgColor}`}>
                                            <div className="flex items-center space-x-2">
                                                <Activity className={`h-4 w-4 ${healthInfo.color}`} />
                                                <span className="text-sm font-medium text-gray-700">Health</span>
                                                <span className={`text-sm font-bold ${healthInfo.color} ml-auto`}>{healthInfo.label}</span>
                                            </div>
                                        </div>
                                        
                                        {/* Flight Time */}
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center space-x-2">
                                                <svg className="h-4 w-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm font-medium text-gray-700">Max Flight</span>
                                                <span className="text-sm font-bold text-gray-900 ml-auto">{drone.maxFlightTime} min</span>
                                            </div>
                                        </div>
                                        
                                        {/* Location */}
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4 text-orange-500" />
                                                    <span className="text-sm font-medium text-gray-700">Location</span>
                                                </div>
                                                <button
                                                    onClick={() => toggleMap(drone._id)}
                                                    className="text-xs text-orange-600 hover:text-orange-800 font-medium"
                                                >
                                                    {isMapExpanded ? 'Hide' : 'Show'}
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-900 break-words" title={formatLocationString(drone.location)}>
                                                {formatLocationString(drone.location)}
                                            </p>
                                            {drone.location?.lastUpdated && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Updated {formatLastUpdated(drone.location.lastUpdated)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Map */}
                                    {isMapExpanded && drone.location && drone.location.latitude && drone.location.longitude && (
                                        <div className="mb-6 h-48 w-full rounded-lg overflow-hidden border border-orange-200">
                                            <MapComponent
                                                ref={el => mapRefs.current[drone._id] = el}
                                                initialLocation={{
                                                    lat: drone.location.latitude,
                                                    lng: drone.location.longitude
                                                }}
                                                key={`map-${drone._id}-${isMapExpanded}`}
                                            />
                                        </div>
                                    )}
                                    
                                    {/* Actions */}
                                    <div className="pt-4 border-t border-orange-100">
                                        <div className="flex justify-between text-sm">
                                            <Link
                                                to={`/fleet/${drone._id}`}
                                                className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                                            >
                                                View Details
                                            </Link>
                                            <Link
                                                to={`/fleet/${drone._id}/edit`}
                                                className="text-orange-600 hover:text-orange-800 font-medium transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            {deleteConfirm === drone._id ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleDelete(drone._id)}
                                                        className="text-red-600 hover:text-red-800 font-medium transition-colors"
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirm(drone._id)}
                                                    className="text-red-600 hover:text-red-800 font-medium transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default DronesList;