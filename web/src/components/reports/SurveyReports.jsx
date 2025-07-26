// client/src/components/reports/SurveyReports.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useMissionStore from '../../stores/missionStore';
import { fetchMissions } from '../../services/missionService';
import { BarChart2, Calendar, MapPin, Clock, ArrowRight, Download, Layers, Flag } from 'lucide-react';
import * as XLSX from 'xlsx';

// Calculate polygon area using the Shoelace formula (Gauss's area formula)
const calculatePolygonArea = (coordinates) => {
  if (!coordinates || !coordinates.length || !coordinates[0] || coordinates[0].length < 3) {
    return 0; // Return 0 if coordinates are invalid or insufficient
  }

  // Extract the first polygon (in case of multipolygons)
  const polygon = coordinates[0];
  
  // Use a more accurate method for calculating geographic area
  // This uses the Haversine formula to calculate distances between points
  let area = 0;
  const n = polygon.length;
  
  // Convert degrees to radians
  const toRadians = (degrees) => degrees * Math.PI / 180;
  
  // Earth's radius in meters
  const earthRadius = 6371000;
  
  // Calculate area using a modified version of the shoelace formula
  // adapted for geographical coordinates
  for (let i = 0; i < n - 1; i++) {
    const lat1 = toRadians(polygon[i][1]);
    const lon1 = toRadians(polygon[i][0]);
    const lat2 = toRadians(polygon[i+1][1]);
    const lon2 = toRadians(polygon[i+1][0]);
    
    // Calculate the cross product using the haversine formula for accurate distance
    area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  
  // Complete the polygon by connecting the last point to the first
  const lat1 = toRadians(polygon[n-1][1]);
  const lon1 = toRadians(polygon[n-1][0]);
  const lat2 = toRadians(polygon[0][1]);
  const lon2 = toRadians(polygon[0][0]);
  area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
  
  // Final calculation - area in square meters
  area = Math.abs(area * (earthRadius * earthRadius) / 2);
  
  // Convert to square kilometers
  const areaSqKm = area / 1000000;
  
  return areaSqKm;
};

// Format area with appropriate units
const formatArea = (areaSqKm) => {
  if (areaSqKm < 0.0001) {
    // Very small areas in square meters
    const areaSqM = areaSqKm * 1000000;
    return `${areaSqM.toFixed(1)} m²`;
  } else if (areaSqKm < 0.01) {
    // Small areas in square meters
    const areaSqM = areaSqKm * 1000000;
    return `${Math.round(areaSqM)} m²`;
  } else if (areaSqKm < 1) {
    // Medium areas in hectares (1 hectare = 0.01 sq km)
    const areaHectares = areaSqKm * 100;
    return `${areaHectares.toFixed(2)} hectares`;
  } else {
    // Large areas in square kilometers
    return `${areaSqKm.toFixed(2)} km²`;
  }
};

// Export function for survey data
const exportSurveyData = (mission, surveyAreaSize, format = 'xlsx') => {
  // Prepare the data for export
  const exportData = {
    'Mission Name': mission.name,
    'Date Completed': new Date(mission.updatedAt).toLocaleString(),
    'Status': mission.status,
    'Drone Used': mission.drone?.name || 'N/A',
    'Drone Model': mission.drone?.model || 'N/A',
    'Flight Pattern': mission.flightParameters?.flightPattern || 'N/A',
    'Flight Altitude (m)': mission.flightParameters?.altitude || 'N/A',
    'Flight Speed (m/s)': mission.flightParameters?.speed || 'N/A',
    'Image Overlap (%)': mission.flightParameters?.overlap || 'N/A',
    'Survey Area Size': surveyAreaSize,
    'Survey Area Coordinates': mission.surveyArea?.coordinates?.[0]?.map(coord => 
      `(${coord[0].toFixed(6)}, ${coord[1].toFixed(6)})`
    ).join('; ') || 'Not available',
    'Mission Description': mission.description || 'No description available',
    'Created Date': new Date(mission.createdAt).toLocaleString(),
    'Updated Date': new Date(mission.updatedAt).toLocaleString(),
    'Schedule Date': mission.schedule?.dateTime ? new Date(mission.schedule.dateTime).toLocaleString() : 'N/A',
  };

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet([exportData]);
  
  // Set column widths for better readability
  const columnWidths = [
    { wch: 20 }, // Mission Name
    { wch: 20 }, // Date Completed
    { wch: 12 }, // Status
    { wch: 15 }, // Drone Used
    { wch: 15 }, // Drone Model
    { wch: 15 }, // Flight Pattern
    { wch: 18 }, // Flight Altitude
    { wch: 18 }, // Flight Speed
    { wch: 18 }, // Image Overlap
    { wch: 18 }, // Survey Area Size
    { wch: 50 }, // Survey Area Coordinates
    { wch: 30 }, // Mission Description
    { wch: 20 }, // Created Date
    { wch: 20 }, // Updated Date
    { wch: 20 }, // Schedule Date
  ];
  worksheet['!cols'] = columnWidths;

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Survey Report');

  // Generate filename with mission name and current date
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const sanitizedMissionName = mission.name.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Survey_Report_${sanitizedMissionName}_${timestamp}`;

  if (format === 'csv') {
    // Export as CSV
    XLSX.writeFile(workbook, `${filename}.csv`);
  } else {
    // Export as Excel (default)
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }
};

const SurveyReports = () => {
  const { missions, isLoading } = useMissionStore();
  const [completedMissions, setCompletedMissions] = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [organizationStats, setOrganizationStats] = useState({
    totalSurveys: 0,
    scheduledSurveys: 0,
    inProgressSurveys: 0,
    abortedSurveys: 0
  });
  
  // New state for survey area calculation
  const [surveyAreaSize, setSurveyAreaSize] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    // Fetch missions on component mount
    fetchMissions();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    // Filter completed missions
    const completed = missions.filter(mission => mission.status === 'completed');
    setCompletedMissions(completed);
    
    // Calculate organization stats based on actual mission data
    const totalSurveys = missions.length;
    const scheduledSurveys = missions.filter(mission => mission.status === 'scheduled').length;
    const inProgressSurveys = missions.filter(mission => mission.status === 'in-progress').length;
    const abortedSurveys = missions.filter(mission => mission.status === 'aborted').length;
    
    setOrganizationStats({
      totalSurveys,
      scheduledSurveys,
      inProgressSurveys,
      abortedSurveys
    });
    
  }, [missions]);
  
  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString();
  };
  
  const handleSelectMission = (mission) => {
    setSelectedMission(mission);
    
    // Calculate survey area when mission is selected
    if (mission.surveyArea && mission.surveyArea.coordinates) {
      const area = calculatePolygonArea(mission.surveyArea.coordinates);
      setSurveyAreaSize(formatArea(area));
    } else {
      setSurveyAreaSize('Not available');
    }
  };
  
  if (isLoading && missions.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
          <p className="mt-4 text-orange-600">Loading survey reports...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-orange-900 mb-2">Survey Reports</h1>
          <p className="text-orange-600">View and analyze completed fleetHQ missions</p>
        </div>
      </div>
      
      {/* Organization Stats */}
      <div className="bg-white shadow rounded-lg border-2 border-orange-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-orange-900 mb-4">Mission Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-500">Total Missions</p>
                <p className="text-2xl font-bold text-orange-900">{organizationStats.totalSurveys}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-green-500">Scheduled</p>
                <p className="text-2xl font-bold text-green-900">{organizationStats.scheduledSurveys}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-500">In Progress</p>
                <p className="text-2xl font-bold text-blue-900">{organizationStats.inProgressSurveys}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-100">
            <div className="flex items-center">
              <div className="ml-4">
                <p className="text-sm font-medium text-red-500">Aborted</p>
                <p className="text-2xl font-bold text-red-900">{organizationStats.abortedSurveys}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Survey List */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg border border-orange-200 overflow-hidden">
            <div className="px-4 py-4 bg-orange-50 border-b border-orange-200">
              <h2 className="text-lg font-medium text-orange-900">Completed Surveys</h2>
            </div>
            
            {completedMissions.length === 0 ? (
              <div className="p-6 text-center">
                <p className="text-orange-500">No completed surveys found</p>
              </div>
            ) : (
              <ul className="divide-y divide-orange-200 max-h-[600px] overflow-y-auto">
                {completedMissions.map((mission) => (
                  <li
                    key={mission._id}
                    className={`px-4 py-4 hover:bg-orange-50 cursor-pointer transition-colors duration-150 ease-in-out ${
                      selectedMission && selectedMission._id === mission._id 
                        ? 'bg-orange-50 border-l-4 border-orange-500' 
                        : ''
                    }`}
                    onClick={() => handleSelectMission(mission)}
                  >
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-900">{mission.name}</p>
                        <p className="text-xs text-orange-500">{formatDateTime(mission.updatedAt)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Survey Details */}
        <div className="lg:col-span-2">
          {selectedMission ? (
            <div className="bg-white shadow rounded-lg border border-orange-200 overflow-hidden">
              <div className="px-6 py-4 bg-orange-50 border-b border-orange-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-orange-900">{selectedMission.name}</h2>
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    className="inline-flex rounded-md items-center px-4 py-2 border border-orange-300 border-b-5 border-r-5 hover:border-2 bg-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showExportDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-orange-200 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            exportSurveyData(selectedMission, surveyAreaSize, 'xlsx');
                            setShowExportDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-900"
                        >
                          <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Export as Excel (.xlsx)
                        </button>
                        <button
                          onClick={() => {
                            exportSurveyData(selectedMission, surveyAreaSize, 'csv');
                            setShowExportDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-900"
                        >
                          <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Export as CSV (.csv)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-orange-900 mb-3">Mission Details</h3>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-orange-500 mb-1">Date Completed</p>
                        <p className="text-sm font-medium text-orange-900">{formatDateTime(selectedMission.updatedAt)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-orange-500 mb-1">Drone Used</p>
                        <p className="text-sm font-medium text-orange-900">{selectedMission.drone?.name || 'N/A'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-orange-500 mb-1">Flight Pattern</p>
                        <p className="text-sm font-medium text-orange-900 capitalize">{selectedMission.flightParameters.flightPattern}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-orange-500 mb-1">Flight Altitude</p>
                        <p className="text-sm font-medium text-orange-900">{selectedMission.flightParameters.altitude}m</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-orange-500 mb-1">Flight Speed</p>
                        <p className="text-sm font-medium text-orange-900">{selectedMission.flightParameters.speed} m/s</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-orange-500 mb-1">Image Overlap</p>
                        <p className="text-sm font-medium text-orange-900">{selectedMission.flightParameters.overlap}%</p>
                      </div>
                      
                      {/* Add survey area calculation */}
                      <div>
                        <p className="text-sm text-orange-500 mb-1">Survey Area Size</p>
                        <p className="text-sm font-medium text-orange-900">{surveyAreaSize}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-orange-900 mb-3">Survey Area</h3>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-100 flex justify-center">
                    {/* This would be an actual map visualization with the survey area in a real implementation */}
                    <div className="bg-white border border-orange-200 rounded-lg w-full h-64 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-10 w-10 text-orange-400 mx-auto mb-2" />
                        <p className="text-orange-500">Survey area coordinates: {
                          selectedMission.surveyArea?.coordinates?.[0]?.[0] 
                            ? `(${selectedMission.surveyArea.coordinates[0][0][0].toFixed(6)}, ${selectedMission.surveyArea.coordinates[0][0][1].toFixed(6)})...` 
                            : 'Not available'
                        }</p>
                        {surveyAreaSize && (
                          <p className="text-orange-600 mt-2">Total area: {surveyAreaSize}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-orange-900 mb-3">Notes</h3>
                  
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                    <p className="text-sm text-orange-700">{selectedMission.description || 'No notes available for this survey.'}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Link
                    to={`/monitoring`}
                    className="inline-flex items-center px-4 py-2 border border-orange-300 shadow-sm text-sm font-medium rounded-md text-orange-700 bg-white hover:bg-orange-50"
                  >
                    Back to Monitoring
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 shadow rounded-lg border border-orange-200 overflow-hidden h-full flex items-center justify-center">
              <div className="p-8 text-center">
                <h3 className="mt-4 text-lg font-medium text-orange-900">Select a survey to view details</h3>
                <p className="mt-2 text-orange-500">
                  Choose a completed survey from the list to see detailed reports.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyReports;