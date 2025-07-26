import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';

const Documentation = () => {
  const [activeSection, setActiveSection] = useState('project-overview');
  const [markdownContent, setMarkdownContent] = useState('');

  // Table of contents for navigation
  const tableOfContents = [
    { id: 'project-overview', title: 'Project Overview', level: 1 },
    { id: 'problem-statement', title: 'Problem Statement & Approach', level: 1 },
    { id: 'system-architecture', title: 'System Architecture', level: 1 },
    { id: 'technology-stack', title: 'Technology Stack', level: 1 },
    { id: 'database-schema', title: 'Database Schema', level: 1 },
    { id: 'api-structure', title: 'API Structure', level: 1 },
    { id: 'component-structure', title: 'Component Structure', level: 1 },
    { id: 'user-flow', title: 'User Flow', level: 1 },
    { id: 'safety-adaptability', title: 'Safety & Adaptability Strategy', level: 1 },
    { id: 'development-tradeoffs', title: 'Development Trade-offs', level: 1 },
    { id: 'getting-started', title: 'Getting Started', level: 1 },
    { id: 'usage-guide', title: 'Usage Guide', level: 1 },
  ];

  // Mock markdown content for each section
  const getMarkdownContent = (sectionId) => {
    const content = {
      'project-overview': `# Project Overview

**FleetHQ** is a comprehensive drone fleet management system designed for enterprise facilities management. It provides autonomous drone operations with mission planning, real-time fleet monitoring, and advanced analytics capabilities.

## Key Features

- **Drone Fleet Management**: Complete CRUD operations for drone inventory
- **Mission Planning**: Interactive map-based survey area selection with flight parameters
- **Real-time Monitoring**: Live flight tracking and mission progress monitoring
- **Role-based Access**: Multi-tier user management (Admin, Manager, Operator)
- **Survey Reports**: Comprehensive mission analytics and reporting
- **Interactive Maps**: Mapbox integration for visual mission planning

## Architecture Overview

FleetHQ follows a modern 3-tier architecture with clear separation of concerns:

- **Frontend**: React 19 with Vite, Zustand for state management
- **Backend**: Node.js with Express, JWT authentication
- **Database**: MongoDB with GeoJSON support for spatial data`,

      'problem-statement': `# Problem Statement & Approach

## The Challenge

Enterprise facilities require efficient surveillance and monitoring of large areas, but traditional methods are:

- **Time-consuming**: Manual inspections take hours or days
- **Resource-intensive**: Requires multiple personnel and vehicles  
- **Limited coverage**: Human limitations in accessing difficult terrain
- **Inconsistent**: Variable quality depending on inspector expertise
- **Safety risks**: Personnel exposure to hazardous environments

## Our Approach

### 1. Centralized Fleet Management
We approached the problem by creating a unified platform that consolidates all drone operations:
- **Single Dashboard**: All fleet information accessible from one interface
- **Standardized Operations**: Consistent procedures across all missions
- **Resource Optimization**: Intelligent drone allocation based on availability

### 2. User-Centric Design  
- **Role-based Interface**: Different views for different user types
- **Intuitive Navigation**: Clear information hierarchy and workflow
- **Progressive Disclosure**: Complex features revealed as needed

### 3. Safety-First Development
- **Conflict Detection**: Prevent drone scheduling conflicts
- **Battery Monitoring**: Real-time battery level tracking
- **Health Status**: Comprehensive drone health monitoring
- **Mission Validation**: Pre-flight checks and parameter validation`,

      'system-architecture': `# System Architecture

## High-Level Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │    Database     │
│   (React SPA)   │◄──►│  (Express API)  │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Node.js       │    │ • Document Store│
│ • Zustand       │    │ • Express 5     │    │ • GeoJSON       │
│ • Mapbox GL     │    │ • JWT Auth      │    │ • 2dsphere      │
│ • Tailwind CSS  │    │ • Mongoose ODM  │    │   Indexing      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## Data Flow

\`\`\`
User Interaction → Component → Service Layer → API Endpoint → Controller → Model → Database
                                     ↓
User Interface ← Store Update ← Service Response ← API Response ← Controller ← Model
\`\`\`

## Component Architecture

The application follows a modular component structure with clear separation of concerns:

- **Authentication Layer**: Handles user login, registration, and session management
- **Layout Components**: Provides consistent UI structure across the application
- **Feature Modules**: Drone management, mission planning, monitoring, reporting
- **Shared Components**: Reusable UI elements and utilities`,

      'technology-stack': `# Technology Stack

## Frontend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.1.0 | UI Framework |
| Vite | 7.0.4 | Build Tool & Dev Server |
| Zustand | 5.0.6 | State Management |
| React Router | 7.7.1 | Client-side Routing |
| Tailwind CSS | 4.1.11 | Styling Framework |
| Mapbox GL JS | 3.13.0 | Interactive Maps |
| Axios | 1.11.0 | HTTP Client |
| Lucide React | 0.525.0 | Icon Library |

## Backend Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | Latest LTS | Runtime Environment |
| Express | 5.1.0 | Web Framework |
| MongoDB | Latest | Database |
| Mongoose | 8.16.5 | ODM |
| JWT | 9.0.2 | Authentication |
| bcryptjs | 3.0.2 | Password Hashing |
| CORS | 2.8.5 | Cross-Origin Requests |

## Development Tools

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Nodemon**: Development server auto-restart
- **VS Code**: Primary development environment`,

      'database-schema': `# Database Schema

## User Model

\`\`\`javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase),
  password: String (hashed, min 6 chars),
  role: Enum["admin", "manager", "operator"] (default: "operator"),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Drone Model

\`\`\`javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  serialNumber: String (required, unique),
  model: String (required),
  status: Enum["available", "in-mission", "maintenance", "offline"],
  batteryLevel: Number (0-100, default: 100),
  maxFlightTime: Number (5-180 minutes),
  location: {
    latitude: Number (default: 0),
    longitude: Number (default: 0),
    altitude: Number (default: 0),
    locationName: String,
    lastUpdated: Date
  },
  healthStatus: Enum["excellent", "good", "fair", "needs-attention", "critical"],
  lastMaintenance: Date,
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
\`\`\`

## Mission Model

\`\`\`javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  description: String,
  user: ObjectId (ref: User),
  drone: ObjectId (ref: Drone),
  status: Enum["draft", "scheduled", "in-progress", "completed", "cancelled", "aborted"],
  surveyArea: {
    type: "Polygon",
    coordinates: [[[Number]]] // GeoJSON format
  },
  flightParameters: {
    altitude: Number (10-500m),
    speed: Number (1-20 m/s),
    flightPattern: Enum["grid", "perimeter", "crosshatch"],
    overlap: Number (0-90%, default: 70)
  },
  schedule: {
    type: Enum["oneTime", "recurring"],
    dateTime: Date (required),
    recurrence: {
      frequency: Enum["daily", "weekly", "monthly"],
      interval: Number (1-30),
      endDate: Date
    }
  },
  createdAt: Date,
  updatedAt: Date
}

// Indexes:
// surveyArea: "2dsphere" (for geospatial queries)
\`\`\``,

      'component-structure': `# Component Structure

## Directory Organization

\`\`\`
src/
├── components/
│   ├── auth/
│   │   ├── AuthProvider.jsx      # Authentication context
│   │   ├── Login.jsx             # Login form
│   │   ├── Register.jsx          # Registration form
│   │   └── ProtectedRoute.jsx    # Route protection
│   ├── dashboard/
│   │   └── Dashboard.jsx         # Main dashboard
│   ├── drones/
│   │   ├── DronesList.jsx        # Drone inventory list
│   │   ├── DroneManagementForm.jsx # Create/Edit drone
│   │   ├── DroneDetailView.jsx   # Individual drone details
│   │   └── DroneDetails.jsx      # Drone info component
│   ├── layout/
│   │   ├── DashboardLayout.jsx   # Main app layout
│   │   └── Sidebar.jsx           # Navigation sidebar
│   ├── map/
│   │   └── MapComponent.jsx      # Mapbox integration
│   ├── missions/
│   │   ├── MissionsList.jsx      # Mission list view
│   │   ├── MissionPlanningForm.jsx # Create/Edit missions
│   │   └── FlightPatternPreview.jsx # Flight path preview
│   ├── monitoring/
│   │   └── MissionMonitoring.jsx # Real-time monitoring
│   ├── reports/
│   │   └── SurveyReports.jsx     # Mission reports
│   ├── ui/
│   │   ├── button.jsx            # Reusable button component
│   │   └── card.jsx              # Reusable card component
│   └── LandingPage.jsx           # Public landing page
├── services/
│   ├── authService.js            # Authentication API calls
│   ├── droneService.js           # Drone management API calls
│   └── missionService.js         # Mission management API calls
├── stores/
│   ├── authStore.js              # Authentication state
│   ├── droneStore.js             # Drone management state
│   └── missionStore.js           # Mission management state
├── lib/
│   └── utils.js                  # Utility functions
└── assets/
    └── react.svg                 # Static assets
\`\`\`

## Component Hierarchy

\`\`\`
App
├── AuthProvider
├── Router
    ├── LandingPage (public)
    ├── Login (public)
    ├── Register (public)
    └── ProtectedRoute
        └── DashboardLayout
            ├── Sidebar
            ├── Dashboard
            ├── MissionsList
            ├── MissionPlanningForm
            ├── DronesList
            ├── DroneManagementForm
            ├── MissionMonitoring
            └── SurveyReports
\`\`\`

## State Management Architecture

### Zustand Stores
- **authStore.js**: User authentication, JWT tokens, login/logout
- **droneStore.js**: Drone fleet data, CRUD operations, real-time updates  
- **missionStore.js**: Mission data, scheduling, status updates

### Service Layer
- **API Services**: Handle HTTP requests to backend
- **Error Handling**: Centralized error management
- **Data Transformation**: Format data for UI consumption

## Key Component Patterns

### 1. Container Components
Handle business logic and state management:

\`\`\`javascript
// Example: DronesList.jsx
const DronesList = () => {
  const { drones, isLoading, error } = useDroneStore();
  const { isAuthenticated, token } = useAuthStore();
  
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchDrones();
    }
  }, [isAuthenticated, token]);
  
  // Render logic...
};
\`\`\`

### 2. Presentation Components
Focus on UI rendering and user interaction:

\`\`\`javascript
// Example: DroneCard component
const DroneCard = ({ drone, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold">{drone.name}</h3>
      <p className="text-gray-600">{drone.model}</p>
      {/* Action buttons */}
    </div>
  );
};
\`\`\`

### 3. Higher-Order Components
Provide cross-cutting concerns:

\`\`\`javascript
// Example: ProtectedRoute.jsx
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <Outlet />;
};
\`\`\``,

      'user-flow': `# User Flow

## 1. Authentication Flow

\`\`\`
Landing Page → Login/Register → Dashboard
     ↓
Token stored in localStorage
     ↓  
JWT validation on protected routes
     ↓
Role-based content rendering
\`\`\`

### Registration Process
1. User visits landing page
2. Clicks "Start Free Trial" 
3. Fills registration form (name, email, password, role)
4. Backend validates and creates user account
5. JWT token generated and returned
6. User redirected to dashboard

### Login Process
1. User enters email and password
2. Backend validates credentials
3. JWT token generated if valid
4. Token stored in localStorage via Zustand
5. User redirected to dashboard

## 2. Mission Planning Flow

\`\`\`
Dashboard → Mission Planning → Select Area on Map → Configure Parameters
    ↓
Choose Available Drone → Set Schedule → Validate Mission → Create Mission
    ↓
Mission appears in Mission List → Ready for execution
\`\`\`

### Detailed Mission Creation Steps
1. **Access Mission Planning**
   - Navigate from sidebar or dashboard quick action
   - Check user permissions (all roles can create missions)

2. **Define Survey Area**
   - Interactive map loads with drawing tools
   - User draws polygon boundary for survey area
   - System validates area is within operational limits

3. **Configure Flight Parameters**
   - Set altitude (10-500m based on regulations)
   - Choose flight speed (1-20 m/s)
   - Select flight pattern (grid, perimeter, crosshatch)
   - Configure image overlap percentage

4. **Drone Selection**
   - System queries available drones for time slot
   - Displays drone specs, battery level, location
   - User selects optimal drone for mission

5. **Schedule Mission**
   - Choose one-time or recurring mission
   - Set date and time
   - Configure recurrence if needed
   - System checks for scheduling conflicts

6. **Mission Validation**
   - Pre-flight safety checks
   - Weather condition validation
   - Airspace clearance verification
   - Battery level confirmation

## 3. Drone Management Flow

\`\`\`
Dashboard → Fleet Management → Add/Edit Drone → Set Parameters
    ↓
Drone Status Monitoring → Battery Tracking → Health Status Updates
    ↓
Maintenance Scheduling → Availability Management
\`\`\`

### Drone Lifecycle Management
1. **Drone Registration**
   - Add new drone to fleet
   - Configure specifications and capabilities
   - Set initial location and status

2. **Operational Monitoring**
   - Real-time status tracking
   - Battery level monitoring
   - Health diagnostics
   - Location updates

3. **Maintenance Management**
   - Schedule preventive maintenance
   - Track maintenance history
   - Update availability status
   - Generate maintenance reports

## 4. Mission Monitoring Flow

\`\`\`
Mission List → Select Active Mission → Real-time Tracking
    ↓
Progress Monitoring → Status Updates → Completion Notification
    ↓
Generate Survey Report → Archive Mission Data
\`\`\`

### Real-time Mission Tracking
1. **Mission Selection**
   - View list of active/scheduled missions
   - Select mission for detailed monitoring
   - Display mission parameters and flight plan

2. **Live Tracking**
   - Real-time drone position on map
   - Flight path visualization
   - Progress percentage calculation
   - Battery level monitoring

3. **Mission Control**
   - Emergency stop capability
   - Status update controls
   - Communication with drone
   - Alert management

4. **Completion Handling**
   - Automatic mission completion detection
   - Data collection and processing
   - Report generation
   - Mission archiving

## User Role Permissions

| Feature | Operator | Manager | Admin |
|---------|----------|---------|-------|
| View Dashboard | ✅ | ✅ | ✅ |
| Create Missions | ✅ | ✅ | ✅ |
| Manage Own Drones | ✅ | ✅ | ✅ |
| View Own Missions | ✅ | ✅ | ✅ |
| View All Drones | ❌ | ✅ | ✅ |
| View All Missions | ❌ | ✅ | ✅ |
| User Management | ❌ | ❌ | ✅ |
| System Settings | ❌ | ❌ | ✅ |

## Error Handling & Recovery

### Common Error Scenarios
1. **Network Connectivity Issues**
   - Offline detection
   - Request retry mechanism
   - Local state preservation

2. **Authentication Errors**
   - Token expiration handling
   - Automatic logout and redirect
   - Session restoration attempts

3. **Mission Planning Errors**
   - Invalid survey area validation
   - Drone availability conflicts
   - Weather condition warnings

4. **Real-time Communication Failures**
   - Connection loss detection
   - Fallback to polling mode
   - Alert notifications to users

### User Feedback Mechanisms
- **Loading States**: Show progress during operations
- **Success Messages**: Confirm completed actions
- **Error Messages**: Clear, actionable error descriptions
- **Toast Notifications**: Non-intrusive status updates`,

      'api-structure': `# API Structure

## Authentication Endpoints

\`\`\`
POST /api/auth/register
POST /api/auth/login  
GET  /api/auth/me
POST /api/auth/logout
\`\`\`

## Drone Management Endpoints

\`\`\`
GET    /api/drones              # Get all drones (filtered by user role)
POST   /api/drones              # Create new drone
GET    /api/drones/available    # Get available drones for scheduling
GET    /api/drones/:id          # Get specific drone
PUT    /api/drones/:id          # Update drone
DELETE /api/drones/:id          # Delete drone
\`\`\`

## Mission Management Endpoints

\`\`\`
GET    /api/missions            # Get all missions (filtered by user role)
POST   /api/missions            # Create new mission
GET    /api/missions/:id        # Get specific mission
PUT    /api/missions/:id        # Update mission
DELETE /api/missions/:id        # Delete mission
\`\`\`

## Request/Response Examples

### Create Mission

\`\`\`javascript
// POST /api/missions
{
  "name": "Facility Perimeter Survey",
  "description": "Weekly security patrol of building perimeter",
  "drone": "60f7b3b3b3b3b3b3b3b3b3b3",
  "surveyArea": {
    "type": "Polygon",
    "coordinates": [[
      [-74.006, 40.7128],
      [-74.005, 40.7128],
      [-74.005, 40.7138],
      [-74.006, 40.7138],
      [-74.006, 40.7128]
    ]]
  },
  "flightParameters": {
    "altitude": 50,
    "speed": 5,
    "flightPattern": "grid",
    "overlap": 70
  },
  "schedule": {
    "type": "recurring",
    "dateTime": "2025-07-28T10:00:00Z",
    "recurrence": {
      "frequency": "weekly",
      "interval": 1,
      "endDate": "2025-12-31T23:59:59Z"
    }
  }
}
\`\`\``,

      'safety-adaptability': `# Safety & Adaptability Strategy

## Safety Measures

### 1. Pre-flight Safety Checks
- **Battery Level Validation**: Ensure sufficient power for mission duration
- **Drone Health Assessment**: Check all systems before mission start
- **Weather Condition Checks**: Validate safe flying conditions
- **Airspace Clearance**: Verify no restricted zones in flight path

### 2. Conflict Prevention

\`\`\`javascript
// Mission scheduling includes conflict detection
const overlappingMissions = await Mission.find({
  drone: droneId,
  "schedule.dateTime": { $eq: missionDateTime },
  status: { $in: ["scheduled", "in-progress"] }
});

if (overlappingMissions.length > 0) {
  throw new Error("Drone already assigned to another mission");
}
\`\`\`

### 3. Real-time Monitoring
- **Live Position Tracking**: Continuous GPS monitoring
- **Battery Monitoring**: Real-time power level alerts
- **Communication Loss Detection**: Automatic return-to-home protocols
- **Emergency Stop Capability**: Remote mission abort functionality

## Adaptability Features

### 1. Flexible Mission Parameters

\`\`\`javascript
flightParameters: {
  altitude: Number,        // Adjustable based on terrain
  speed: Number,           // Variable speed for different survey types
  flightPattern: String,   // Multiple pattern options
  overlap: Number          // Configurable image overlap
}
\`\`\`

### 2. Dynamic Drone Assignment
- **Automatic Drone Selection**: Best-fit algorithm for mission requirements
- **Real-time Reassignment**: Handle drone failures mid-mission
- **Load Balancing**: Distribute missions across available fleet

### 3. Extensible Architecture
- **Plugin System**: Easy addition of new drone types
- **API Versioning**: Backward compatibility for updates  
- **Modular Components**: Independent feature development`,

      'development-tradeoffs': `# Development Trade-offs

## 1. Technology Choices

### MongoDB vs PostgreSQL
**Chosen: MongoDB**
- ✅ **Pros**: Native GeoJSON support, flexible schema, rapid prototyping
- ❌ **Cons**: Less mature ecosystem, potential consistency issues
- **Trade-off**: Prioritized development speed and geospatial features over ACID compliance

### Zustand vs Redux
**Chosen: Zustand**
- ✅ **Pros**: Minimal boilerplate, TypeScript-friendly, smaller bundle size
- ❌ **Cons**: Less middleware ecosystem, newer library
- **Trade-off**: Chose simplicity and performance over feature richness

### Mapbox vs Google Maps
**Chosen: Mapbox**
- ✅ **Pros**: Customizable styling, drawing tools, better pricing for enterprise
- ❌ **Cons**: Smaller community, more complex setup
- **Trade-off**: Advanced mapping features over ease of implementation

## 2. Architecture Decisions

### Monolithic vs Microservices
**Chosen: Monolithic (initially)**
- ✅ **Pros**: Faster development, easier deployment, simpler debugging
- ❌ **Cons**: Harder to scale individual components, single point of failure
- **Trade-off**: Development velocity over long-term scalability

### Real-time Implementation
**Current: Polling-based**
- ✅ **Pros**: Simpler implementation, easier debugging
- ❌ **Cons**: Higher bandwidth usage, delayed updates
- **Future**: Socket.IO implementation planned for true real-time updates

### Authentication Strategy
**Chosen: JWT with localStorage**
- ✅ **Pros**: Stateless, scalable, client-side storage
- ❌ **Cons**: XSS vulnerability, no server-side session control
- **Trade-off**: Scalability over security (acceptable for internal enterprise use)`,

      'getting-started': `# Getting Started

## Prerequisites
- Node.js 18+ and npm
- MongoDB 5.0+
- Mapbox API key

## Installation

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/KartikLabhshetwar/FleetHQ.git
cd FleetHQ
\`\`\`

### 2. Set up the backend
\`\`\`bash
cd server
npm install
\`\`\`

### 3. Create backend environment variables
\`\`\`bash
# server/.env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fleethq
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
\`\`\`

### 4. Set up the frontend
\`\`\`bash
cd web
npm install
\`\`\`

### 5. Configure frontend environment variables
\`\`\`bash
# web/.env
VITE_API_URL=http://localhost:5000/api
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
\`\`\`

### 6. Start the development servers

Backend:
\`\`\`bash
cd server
npm run dev
\`\`\`

Frontend:
\`\`\`bash
cd web
npm run dev
\`\`\`

## First Time Setup

1. **Create an admin user** by registering through the UI
2. **Add your first drone** in Fleet Management
3. **Create a test mission** to verify functionality`,

      'usage-guide': `# Usage Guide

## For Facility Managers

### Dashboard Overview
- **Fleet Status**: Monitor all drones and their current status
- **Active Missions**: Track ongoing surveillance operations
- **Upcoming Tasks**: Plan and schedule future missions

### Creating a Mission
1. Navigate to **Mission Planning**
2. Click **"New Mission"**
3. Draw survey area on the interactive map
4. Configure flight parameters:
   - **Altitude**: 10-500 meters
   - **Speed**: 1-20 m/s
   - **Pattern**: Grid, Perimeter, or Crosshatch
   - **Overlap**: Image overlap percentage
5. Select available drone from the list
6. Set mission schedule (one-time or recurring)
7. Review and create mission

### Monitoring Active Missions
1. Go to **Mission Monitoring**
2. Select active mission from the list
3. View real-time drone position and flight path
4. Monitor mission progress and battery levels
5. Use emergency controls if needed

## For Operators

### Daily Workflow
1. **Check Dashboard** for assigned missions
2. **Verify Drone Status** before missions
3. **Monitor Mission Progress** during operations
4. **Update Mission Status** upon completion
5. **Review Survey Reports** for quality assurance

### Drone Maintenance
1. Navigate to **Fleet Management**
2. Select drone requiring maintenance
3. Update status to "Maintenance"
4. Schedule maintenance activities
5. Update status to "Available" when complete`,

    };

    return content[sectionId] || content['project-overview'];
  };

  useEffect(() => {
    setMarkdownContent(getMarkdownContent(activeSection));
  }, [activeSection]);

  // Convert markdown to HTML (enhanced implementation)
  const parseMarkdown = (markdown) => {
    let html = markdown
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-2">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-semibold text-gray-800 mb-4 mt-8">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-medium text-gray-700 mb-3 mt-6">$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-gray-900 text-green-400 rounded-lg p-4 overflow-x-auto mb-4 text-sm font-mono"><code>$1</code></pre>')
      .replace(/`([^`]*)`/gim, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>')
      .replace(/^- (.*$)/gim, '<li class="flex items-start mb-2"><span class="text-orange-500 mr-2">•</span><span>$1</span></li>');

    // Handle tables
    const tableRegex = /\|(.+)\|\n\|(.+)\|\n((^\|.+\|$\n?)*)/gm;
    html = html.replace(tableRegex, (match, headers, separator, rows) => {
      const headerCells = headers.split('|').map(cell => 
        `<th class="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold text-gray-900">${cell.trim()}</th>`
      ).join('');
      
      const rowsHtml = rows.trim().split('\n').map(row => {
        const cells = row.substring(1, row.length - 1).split('|').map(cell => 
          `<td class="border border-gray-300 px-4 py-2 text-gray-700">${cell.trim()}</td>`
        ).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      
      return `<table class="w-full border-collapse border border-gray-300 mb-6 mt-4">
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${rowsHtml}</tbody>
      </table>`;
    });

    // Convert paragraphs and line breaks
    html = html
      .replace(/\n\n/gim, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      .replace(/\n/gim, '<br/>')
      .replace(/^(?!<[h|l|p|c|t])(.*)/gim, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>');

    // Wrap lists in ul tags
    html = html.replace(/(<li class="flex[\s\S]*?<\/li>)(\s*<li class="flex[\s\S]*?<\/li>)*/g, (match) => {
      return `<ul class="mb-4 space-y-1">${match}</ul>`;
    });

    return html;
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center mb-4">
            <h1 className="text-xl font-bold text-gray-900">FleetHQ Docs</h1>
          </div>
          <Link 
            to="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {tableOfContents.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? 'bg-orange-100 text-orange-800 font-medium'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  } ${item.level === 2 ? 'ml-4' : ''}`}
                >
                  <div className="flex items-center">
                    {item.level === 2 && <ChevronRight className="h-3 w-3 mr-1 opacity-50" />}
                    {item.title}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(markdownContent) }}
          />
        </div>
      </div>
    </div>
  );
};

export default Documentation;
