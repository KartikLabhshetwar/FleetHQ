import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout Components
import DashboardLayout from './components/layout/DashboardLayout';

// Dashboard Components
import Dashboard from './components/dashboard/Dashboard';

// Mission Planning Components
import MissionsList from './components/missions/MissionsList';
import MissionPlanningForm from './components/missions/MissionPlanningForm';

// Drone Management Components
import DronesList from './components/drones/DronesList';
import DroneManagementForm from './components/drones/DroneManagementForm';
import DroneDetailView from './components/drones/DroneDetailView';

// Mission Monitoring Component
import MissionMonitoring from './components/monitoring/MissionMonitoring';

// Survey Reports Component
import SurveyReports from './components/reports/SurveyReports';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes with Dashboard Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Mission Routes */}
            <Route path="/missions" element={<MissionsList />} />
            <Route path="/missions/new" element={<MissionPlanningForm />} />
            <Route path="/missions/:id" element={<div className="p-8">View Mission (Coming Soon)</div>} />
            <Route path="/missions/:id/edit" element={<MissionPlanningForm />} />
            
            {/* Drone Routes */}
            <Route path="/fleet" element={<DronesList />} />
            <Route path="/fleet/new" element={<DroneManagementForm />} />
            <Route path="/fleet/:id" element={<DroneDetailView />} />
            <Route path="/fleet/:id/edit" element={<DroneManagementForm />} />
            
            {/* Mission Monitoring Route */}
            <Route path="/monitoring" element={<MissionMonitoring />} />
            
            {/* Survey Reports Route */}
            <Route path="/reports" element={<SurveyReports />} />
            
            {/* These routes are placeholders for future implementation */}
            <Route path="/analytics" element={<div className="p-8">Analytics (Coming Soon)</div>} />
            <Route path="/schedule" element={<div className="p-8">Schedule (Coming Soon)</div>} />
            <Route path="/users" element={<div className="p-8">Users (Coming Soon)</div>} />
            <Route path="/settings" element={<div className="p-8">Settings (Coming Soon)</div>} />
            <Route path="/activity" element={<div className="p-8">Activity (Coming Soon)</div>} />
          </Route>
        </Route>
        
        {/* Redirect to dashboard if authenticated, or login if not */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
