<img width="2816" height="1536" alt="open_graph" src="https://github.com/user-attachments/assets/538c614d-5601-402f-a684-72be96ff7dfd" />


# Fleet HQ

Enterprise drone fleet management system for autonomous operations, mission planning, and real-time monitoring.

## Documentation
Docs for this project is [here](https://fleethq.onrender.com/documentation)

## Features

- **Mission Planning**: Interactive map-based flight path creation with waypoint optimization
- **Real-time Monitoring**: Live fleet tracking with battery levels and mission progress
- **Analytics Dashboard**: Comprehensive reporting and flight statistics
- **Multi-facility Support**: Centralized management across multiple locations
- **Enterprise Security**: Role-based access control with encrypted data management

## Tech Stack

**Frontend**: React 18, Vite, TailwindCSS, Zustand, React Router  
**Backend**: Node.js, Express, MongoDB, JWT Authentication  
**Maps**: Interactive mapping for mission planning and tracking

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/KartikLabhshetwar/FleetHQ.git
cd FleetHQ

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../web
npm install
```

### Configuration

1. Create `.env` file in `/server`:
```env
MONGODB_URI=mongodb://localhost:27017/fleethq
JWT_SECRET=your-jwt-secret
PORT=5000
NODE_ENV=development
```

2. Create `.env` file in `/web`:
```env
VITE_API_URL=http://localhost:5000
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-access-token
```

### Running the Application

```bash
# Terminal 1 - Start backend server
cd server
npm start

# Terminal 2 - Start frontend
cd web
npm run dev
```

Access the application at [http://localhost:5173](http://localhost:5173)

## Project Structure

```
FleetHQ/
├── server/           # Express.js backend
│   ├── controllers/  # Route controllers
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── middleware/   # Custom middleware
└── web/             # React frontend
    ├── src/
    │   ├── components/  # Reusable components
    │   ├── services/    # API services
    │   ├── stores/      # Zustand state management
    │   └── lib/         # Utilities
    └── public/         # Static assets
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User authentication |
| POST | `/api/auth/register` | User registration |
| GET | `/api/drones` | Get all drones |
| POST | `/api/missions` | Create mission |
| GET | `/api/missions/:id` | Get mission details |

## Available Scripts

### Backend (`/server`)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend (`/web`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Authentication

The system uses JWT-based authentication with role-based access control:
- **Operator**: Basic drone operations
- **Manager**: Mission planning and oversight
- **Admin**: Full system access

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
