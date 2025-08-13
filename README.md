# Lunadrone Telemetry Dashboard - Complete Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Quick Start Guide](#quick-start-guide)
3. [Installation & Setup](#installation--setup)
4. [Architecture](#architecture)
5. [Configuration](#configuration)
6. [API Documentation](#api-documentation)
7. [Component Documentation](#component-documentation)
8. [Admin Control System](#admin-control-system)
9. [Database Schema](#database-schema)
10. [Deployment](#deployment)
11. [Usage Guide](#usage-guide)
12. [Troubleshooting](#troubleshooting)
13. [Development Guide](#development-guide)

---

## System Overview

The Lunadrone Dashboard is a professional-grade telemetry monitoring and fleet management system for autonomous medical drone delivery operations. Built with Next.js 14+ and TypeScript, it provides real-time data visualization, mission coordination, and comprehensive fleet oversight.

### Key Features

- **Real-time Telemetry Monitoring**: Live drone data with gauge charts, GPS tracking, and environmental sensors
- **Fleet Management**: Multi-drone oversight with individual and fleet-wide controls
- **Mission Coordination**: Flight status tracking, delivery monitoring, and return-to-base operations
- **Historical Analytics**: Time-series data analysis with customizable time ranges
- **Admin Control System**: Real-time status override for presentations and demonstrations
- **Professional UI**: Grafana-inspired dark theme with responsive design
- **Auto-Simulation**: Realistic drone behavior simulation for development and demos

### Technology Stack

- **Frontend**: Next.js 14+ (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization
- **Maps**: React Leaflet for GPS tracking
- **Icons**: Lucide React

---

## Quick Start Guide

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (local or Atlas)

### 1. Clone and Install
```bash
git clone https://github.com/PepelaJohn/luna-app-telemetry
cd lunadrone-dashboard
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your MongoDB connection
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access Dashboard
- Homepage: `http://localhost:3000`
- Operations Dashboard: `http://localhost:3000/dashboard`
- Mission Logs: `http://localhost:3000/logs`
- Admin Control: Press `Ctrl+Shift+A` on dashboard

---

## Installation & Setup

### System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher
- **MongoDB**: 5.0 or higher
- **RAM**: 4GB minimum (8GB recommended)
- **Storage**: 1GB for application, additional for database

### Environment Configuration

Create `.env.local` file:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/lunadrone

# Optional: Enhanced mapping
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# Application Settings
NODE_ENV=development
```

### Database Setup

The application automatically:
- Creates necessary MongoDB collections
- Generates initial historical data
- Sets up database indexes for performance
- Validates data schema on write operations

### First Run

When you start the application for the first time:
1. Auto-simulation system initializes
2. 6 hours of historical telemetry data is generated
3. 4 drones (A1, A2, B1, B2) are created with realistic profiles
4. Real-time data generation begins every 15-20 seconds

---

## Architecture

### System Architecture

```
┌─────────────────┐    Real-time    ┌─────────────────┐
│   Web Client    │ ◄─────────────► │  Next.js App    │
│   (Dashboard)   │   HTTP/WebSocket│   (Frontend)    │
└─────────────────┘                 └─────────────────┘
                                              │
                                              │ API Calls
                                              ▼
                                    ┌─────────────────┐
                                    │  API Routes     │
                                    │  (Backend)      │
                                    └─────────────────┘
                                              │
                        ┌─────────────────────┼─────────────────────┐
                        │                     │                     │
                        ▼                     ▼                     ▼
              ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
              │ Auto-Simulator  │   │    Database     │   │ Admin Control   │
              │    System       │   │   (MongoDB)     │   │    System       │
              └─────────────────┘   └─────────────────┘   └─────────────────┘
```

### Application Structure

```
src/
├── app/                           # Next.js App Router
│   ├── globals.css               # Global styles & design system
│   ├── layout.tsx                # Root layout with sidebar
│   ├── page.tsx                  # Homepage
│   ├── dashboard/
│   │   └── page.tsx             # Operations dashboard
│   ├── logs/
│   │   └── page.tsx             # Mission logs & analytics
│   └── api/                     # Backend API routes
│       ├── admin/
│       │   └── drone-control/   # Admin control system
│       ├── telemetry/           # Telemetry CRUD operations
│       ├── drones/              # Drone fleet management
│       └── simulation-status/   # Auto-simulation status
├── components/                   # React components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── DroneSelector.tsx    # Drone fleet selector
│   │   ├── MetricGauge.tsx      # Gauge chart components
│   │   ├── DroneMap.tsx         # Interactive GPS map
│   │   ├── TelemetryGrid.tsx    # Telemetry data display
│   │   └── HistoricalChart.tsx  # Time-series analytics
│   ├── logs/
│   │   └── TelemetryTable.tsx   # Data table with filtering
│   ├── admin/
│   │   └── QuickControl.tsx     # Real-time admin controls
│   ├── layout/
│   │   ├── Sidebar.tsx          # Professional navigation
│   │   └── MobileSidebar.tsx    # Mobile-responsive nav
│   └── ui/                      # Reusable UI components
│       ├── Card.tsx
│       └── Button.tsx
├── lib/                         # Utilities and core logic
│   ├── mongodb.ts              # Database connection
│   ├── auto-simulator.ts       # Realistic drone simulation
│   └── utils.ts                # Helper functions
├── models/                      # Mongoose schemas
│   └── Telemetry.ts            # Telemetry data model
└── types/                       # TypeScript definitions
    └── telemetry.ts            # Type definitions
```

---

## Configuration

### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://localhost:27017/lunadrone` |
| `NODE_ENV` | No | Application environment | `development` / `production` |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | No | Mapbox API key for enhanced maps | `pk.eyJ1...` |

### Tailwind CSS Configuration

The application uses a comprehensive design system:

```javascript
// Key color variables
colors: {
  // Drone status colors
  drone: {
    'powered-off': '#6b7280',
    'standby': '#eab308',
    'active': '#22c55e',
    'in-flight': '#06b6d4',
    'emergency': '#dc2626',
  },
  // Gauge indicators
  gauge: {
    'good': '#22c55e',
    'warning': '#eab308',
    'danger': '#ef4444',
  }
}
```

### Database Configuration

MongoDB collections and indexes:

```javascript
// Telemetry collection with optimized indexes
db.telemetries.createIndex({ droneId: 1, timestamp: -1 });
db.telemetries.createIndex({ timestamp: -1 });
db.telemetries.createIndex({ status: 1 });
```

---

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
Currently no authentication required. For production deployment, implement authentication middleware.

### Endpoints

#### Telemetry Management

**GET** `/api/telemetry`
- Retrieve telemetry data with filtering and pagination

**Query Parameters:**
- `droneId` (string): Filter by specific drone ID
- `since` (ISO date): Get data from specific timestamp
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `status` (string): Filter by flight status
- `dateFrom` (ISO date): Start date filter
- `dateTo` (ISO date): End date filter
- `format` (string): Response format ('json' or 'csv')

**Example Request:**
```bash
GET /api/telemetry?droneId=A1&since=2025-08-13T00:00:00Z&limit=50
```

**Response:**
```json
{
  "logs": [
    {
      "_id": "64f7b1234567890abcdef123",
      "droneId": "A1",
      "timestamp": "2025-08-13T14:30:00Z",
      "battery": 87.5,
      "temperature": 35.2,
      "humidity": 61.0,
      "speed": 42.3,
      "altitude": 150,
      "lat": -1.292100,
      "lng": 36.821900,
      "status": "In Flight"
    }
  ],
  "total": 1,
  "page": 1,
  "totalPages": 1
}
```

**POST** `/api/telemetry`
- Submit new telemetry data

**Request Body:**
```json
{
  "droneId": "A1",
  "timestamp": "2025-08-13T14:30:00Z",
  "battery": 87.5,
  "temperature": 35.2,
  "humidity": 61.0,
  "speed": 42.3,
  "altitude": 150,
  "lat": -1.292100,
  "lng": 36.821900,
  "status": "In Flight"
}
```

#### Drone Fleet Management

**GET** `/api/drones`
- Get list of all drones with their latest status

**Response:**
```json
[
  {
    "id": "A1",
    "name": "Drone A1",
    "lastSeen": "2025-08-13T14:30:00Z",
    "status": "In Flight",
    "isOnline": true,
    "battery": 87.5
  }
]
```

#### Admin Control System

**POST** `/api/admin/drone-control`
- Manually override drone status for demonstrations

**Request Body:**
```json
{
  "droneId": "A1",
  "status": "Active",
  "isOnline": true,
  "battery": 90,
  "duration": 600000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Drone A1 manually set to Active",
  "droneId": "A1",
  "status": "Active",
  "overrideActive": true,
  "overrideExpiry": "2025-08-13T14:40:00Z"
}
```

#### System Status

**GET** `/api/simulation-status`
- Get auto-simulation system status

**Response:**
```json
{
  "success": true,
  "isRunning": true,
  "droneCount": 4,
  "profiles": [
    {
      "id": "A1",
      "name": "Drone A1",
      "battery": 87.5,
      "phase": "flying",
      "manualOverride": false
    }
  ]
}
```

### Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2025-08-13T14:30:00Z"
}
```

**HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `500`: Internal Server Error

---

## Component Documentation

### Dashboard Components

#### DroneSelector
Displays fleet overview with individual drone cards showing status, battery, and online indicators.

**Props:**
```typescript
interface DroneSelectorProps {
  drones: DroneInfo[];
  selectedDrone: string;
  onDroneSelect: (droneId: string) => void;
}
```

**Features:**
- Visual status indicators with color coding
- Online/offline status with timestamps
- Click-to-select drone functionality
- Responsive grid layout

#### MetricGauge
Circular gauge chart displaying telemetry metrics with color-coded status indicators.

**Props:**
```typescript
interface MetricGaugeProps {
  title: string;
  value: number;
  unit: string;
  max: number;
  type: 'battery' | 'temperature' | 'humidity' | 'speed' | 'altitude';
  subtitle?: string;
}
```

**Features:**
- Animated gauge with color transitions
- Status bar indicator
- Professional Grafana-style design
- Responsive to value changes

#### DroneMap
Interactive map component showing real-time drone GPS locations with detailed popups.

**Props:**
```typescript
interface DroneMapProps {
  telemetry: TelemetryData | null;
}
```

**Features:**
- OpenStreetMap integration
- Real-time position updates
- Detailed drone information popups
- Auto-centering on selected drone

#### TelemetryGrid
Main telemetry display showing current mission status and sensor readings.

**Props:**
```typescript
interface TelemetryGridProps {
  telemetry: TelemetryData | null;
}
```

**Features:**
- Mission status with emoji indicators
- GPS coordinates display
- Environmental sensor readings
- Professional card-based layout

#### HistoricalChart
Time-series line chart for analyzing telemetry data over time.

**Props:**
```typescript
interface HistoricalChartProps {
  data: TelemetryData[];
  timeRange: string;
}
```

**Features:**
- Multi-metric line charts
- Time range filtering
- Interactive tooltips
- Responsive design

### Layout Components

#### Sidebar
Professional navigation sidebar with system status and fleet overview.

**Features:**
- Active route highlighting
- System status indicators
- Fleet statistics
- Mobile-responsive with hamburger menu

### Admin Components

#### QuickControl
Real-time drone control panel for demonstrations and manual override.

**Features:**
- Individual drone controls
- Fleet-wide quick actions
- Manual override duration settings
- Visual feedback for active overrides

---

## Admin Control System

### Overview

The Admin Control System provides real-time drone status override capabilities, perfect for demonstrations and presentations. It ensures realistic behavior by temporarily pausing auto-simulation for manually controlled drones.

### Access Methods

1. **Keyboard Shortcut**: `Ctrl+Shift+A` on dashboard
2. **UI Button**: "Admin" button in bottom-right corner
3. **Hide Panel**: Press `Escape` key

### Features

#### Manual Override System
- **Duration Control**: 5 minutes to 1 hour override periods
- **Realistic Transitions**: Status changes include appropriate telemetry adjustments
- **Visual Indicators**: Blue highlighting shows manually controlled drones
- **Auto-Simulation Pause**: Background system skips overridden drones

#### Drone Status Options

| Status | Description | Telemetry Behavior |
|--------|-------------|-------------------|
| **Powered Off** | Drone completely offline | Ambient temperature, base location, offline |
| **Standby** | Ready and waiting | Slight charging, base location, ready status |
| **Pre-Flight** | Running system checks | Warming up, base location, preparation mode |
| **Active** | Powered up and operational | Active systems, base location, ready for mission |
| **In Flight** | Currently flying mission | High speed, altitude, GPS movement, hot temperature |
| **Landing** | Coming down for delivery | Slow speed, low altitude, landing approach |
| **Delivered** | Successfully completed delivery | Stationary, delivery location, mission complete |
| **Returning** | Flying back to base | Return speed, altitude, GPS movement to base |
| **Maintenance** | Under service/repair | Cool temperature, base location, systems off |
| **Emergency** | Emergency situation | High temperature, low altitude, rapid battery drain |

#### Quick Actions

- **Start All Drones**: Set all drones to "Active" status
- **Launch Mission**: Set drones to "In Flight" with realistic flight data
- **Return to Base**: Set drones to "Returning" status
- **Power Off All**: Set all drones to "Powered Off" status

### Demo Scenarios

#### Investor Presentation Flow

1. **Initial State**: Drones start in "Standby" mode
2. **"Start the drones"**: Click "Start All Drones" → All show "Active"
3. **"Show them flying"**: Click "Launch Mission" → Drones show "In Flight"
4. **"Emergency landing"**: Individual emergency controls → Show emergency procedures
5. **"Power down"**: Click "Power Off All" → Professional shutdown sequence

#### Override Duration Guidelines

- **5 minutes**: Quick feature demonstrations
- **10 minutes**: Standard presentation sections
- **15 minutes**: Extended feature walkthroughs
- **30 minutes**: Full product demonstrations
- **1 hour**: Comprehensive investor meetings

---

## Database Schema

### Telemetry Collection

```javascript
{
  _id: ObjectId,                    // MongoDB document ID
  droneId: String,                  // Drone identifier (e.g., "A1")
  timestamp: Date,                  // Telemetry timestamp (UTC)
  battery: Number,                  // Battery percentage (0-100)
  temperature: Number,              // Temperature in Celsius
  humidity: Number,                 // Humidity percentage (0-100)
  speed: Number,                   // Ground speed in km/h
  altitude: Number,                // Altitude in meters AGL
  lat: Number,                     // Latitude (-90 to 90)
  lng: Number,                     // Longitude (-180 to 180)
  status: String,                  // Flight status (enum)
  createdAt: Date,                 // Document creation timestamp
  updatedAt: Date                  // Document update timestamp
}
```

### Status Enum Values

```javascript
const DroneStatus = [
  'Powered Off',     // Drone completely offline
  'Standby',         // Ready and waiting for commands
  'Pre-Flight',      // Running pre-flight system checks
  'Active',          // Powered up and operational
  'In Flight',       // Currently flying a mission
  'Landing',         // Landing approach for delivery
  'Delivered',       // Successfully completed delivery
  'Returning',       // Flying back to base station
  'Maintenance',     // Under service or repair
  'Emergency'        // Emergency situation requiring attention
];
```

### Validation Rules

```javascript
// Battery percentage validation
battery: {
  type: Number,
  required: true,
  min: 0,
  max: 100
}

// Humidity percentage validation
humidity: {
  type: Number,
  required: true,
  min: 0,
  max: 100
}

// GPS coordinate validation
lat: {
  type: Number,
  required: true,
  min: -90,
  max: 90
}

lng: {
  type: Number,
  required: true,
  min: -180,
  max: 180
}

// Speed validation (non-negative)
speed: {
  type: Number,
  required: true,
  min: 0
}
```

### Database Indexes

```javascript
// Compound index for efficient drone-specific queries
db.telemetries.createIndex({ droneId: 1, timestamp: -1 });

// Time-based index for historical data queries
db.telemetries.createIndex({ timestamp: -1 });

// Status index for filtering operations
db.telemetries.createIndex({ status: 1 });

// Individual field indexes
db.telemetries.createIndex({ droneId: 1 });
```

---

## Deployment

### Production Environment Setup

#### Environment Variables

```env
# Production MongoDB (Atlas recommended)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lunadrone

# Application Settings
NODE_ENV=production
NEXT_PUBLIC_MAPBOX_TOKEN=your_production_mapbox_token

# Optional: Add authentication keys for production
# NEXTAUTH_SECRET=your-production-secret
# NEXTAUTH_URL=https://your-domain.com
```

#### Vercel Deployment

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Configure Environment Variables**
   - Add all production environment variables in Vercel dashboard
   - Configure MongoDB Atlas IP whitelist for Vercel

3. **Build Configuration**
   ```javascript
   // next.config.js
   module.exports = {
     experimental: {
       serverComponentsExternalPackages: ['mongoose'],
     },
   }
   ```

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/lunadrone
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Performance Optimization

#### Database Optimization
- Enable MongoDB compression
- Set up proper connection pooling
- Configure read preferences for analytics
- Implement data retention policies

#### Application Optimization
- Enable Next.js compression
- Configure CDN for static assets
- Implement API response caching
- Optimize bundle size with dynamic imports

---

## Usage Guide

### Dashboard Navigation

#### Homepage (`/`)
- System overview and quick access links
- Fleet status summary
- Feature highlights
- Professional landing page for stakeholders

#### Operations Dashboard (`/dashboard`)
- Real-time drone monitoring
- Interactive telemetry displays
- GPS tracking map
- Historical data analysis
- Time range filtering

#### Mission Logs (`/logs`)
- Complete telemetry history
- Advanced filtering options
- Data export capabilities
- Sortable data tables

### Real-Time Monitoring

#### Telemetry Metrics
- **Battery Level**: Power management with color-coded warnings
- **Temperature**: Thermal monitoring for system health
- **Humidity**: Environmental conditions for cargo integrity
- **Speed**: Current ground speed and flight dynamics
- **Altitude**: Above-ground-level altitude measurement

#### Status Indicators
- **Mission Status**: Current flight phase with emoji indicators
- **GPS Location**: Precise coordinates with altitude information
- **System Health**: Online/offline status with timestamps
- **Override Status**: Manual control indicators during demos

### Data Analysis

#### Time Range Options
- **10 minutes**: Real-time operational monitoring
- **1 hour**: Short-term performance analysis
- **6 hours**: Shift-based operational review
- **24 hours**: Daily performance summary
- **7 days**: Weekly trend analysis

#### Filtering Capabilities
- **Drone Selection**: Individual or fleet-wide analysis
- **Status Filtering**: Filter by operational state
- **Date Range**: Custom date/time filtering
- **Export Options**: CSV download for external analysis

---

## Troubleshooting

### Common Issues

#### Database Connection Issues

**Problem**: MongoDB connection failures
```
Error: Failed to connect to MongoDB
```

**Solutions**:
1. Verify MongoDB is running: `mongosh "your-connection-string"`
2. Check firewall settings and network connectivity
3. Validate connection string format
4. Ensure MongoDB service is started

#### Auto-Simulation Not Starting

**Problem**: No telemetry data appearing on dashboard

**Solutions**:
1. Check browser console for JavaScript errors
2. Verify API endpoints are responding: `GET /api/simulation-status`
3. Restart development server: `npm run dev`
4. Clear browser cache and reload

#### Admin Control Panel Issues

**Problem**: Manual override not working

**Solutions**:
1. Ensure `Ctrl+Shift+A` keyboard shortcut is working
2. Check browser console for API call errors
3. Verify override duration is set appropriately
4. Refresh dashboard to clear any cached states

#### Map Display Issues

**Problem**: Map tiles not loading or GPS markers missing

**Solutions**:
1. Check internet connectivity for map tiles
2. Verify GPS coordinates are valid numbers
3. Check browser console for Leaflet errors
4. Ensure React Leaflet CSS is properly imported

#### Performance Issues

**Problem**: Slow dashboard loading or updates

**Solutions**:
1. Check MongoDB query performance with `.explain()`
2. Verify database indexes are created
3. Reduce telemetry data generation frequency
4. Clear browser cache and reload

### Debug Mode

Enable detailed logging:

```env
# Add to .env.local
NODE_ENV=development
DEBUG=app:*
```

### API Testing

Test endpoints manually:

```bash
# Test telemetry API
curl "http://localhost:3000/api/telemetry?droneId=A1&limit=5"

# Test drone fleet API
curl "http://localhost:3000/api/drones"

# Test admin control
curl -X POST "http://localhost:3000/api/admin/drone-control" \
  -H "Content-Type: application/json" \
  -d '{"droneId":"A1","status":"Active"}'
```

---

## Development Guide

### Development Workflow

#### Local Development Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-org/lunadrone-dashboard.git
   cd lunadrone-dashboard
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your settings
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

#### Code Structure Guidelines

**TypeScript Best Practices**
- Use explicit types for props and API responses
- Implement proper error handling with try-catch blocks
- Utilize TypeScript strict mode for better type safety
- Document complex types with JSDoc comments

**React Component Guidelines**
- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines (ARIA labels, keyboard navigation)
- Extract reusable logic into custom hooks

**API Design Principles**
- Use RESTful conventions for endpoint naming
- Implement consistent error response format
- Include proper request validation
- Add rate limiting for production deployment

#### Adding New Features

**New Telemetry Metric**

1. Update type definitions:
   ```typescript
   // src/types/telemetry.ts
   interface TelemetryData {
     // ... existing fields
     newMetric: number;
   }
   ```

2. Update database schema:
   ```typescript
   // src/models/Telemetry.ts
   const TelemetrySchema = new mongoose.Schema({
     // ... existing fields
     newMetric: {
       type: Number,
       required: true,
       min: 0
     }
   });
   ```

3. Add gauge component:
   ```typescript
   // In dashboard component
   <MetricGauge
     title="New Metric"
     value={telemetry.newMetric}
     unit="units"
     max={100}
     type="newMetric"
   />
   ```

**New Drone Status**

1. Update status enum:
   ```typescript
   // src/types/telemetry.ts
   status: 'Existing Status' | 'New Status' | ...
   ```

2. Add status handling:
   ```typescript
   // src/lib/utils.ts
   export function getStatusColor(status: string): string {
     switch (status) {
       case 'New Status':
         return 'text-new-color';
       // ... existing cases
     }
   }
   ```

#### Testing Strategy

**Component Testing**
```javascript
// src/__tests__/components/MetricGauge.test.tsx
import { render, screen } from '@testing-library/react';
import { MetricGauge } from '@/components/dashboard/MetricGauge';

test('renders gauge with correct value', () => {
  render(
    <MetricGauge title="Test" value={75} unit="%" max={100} type="battery" />
  );
  expect(screen.getByText('75%')).toBeInTheDocument();
});
```

**API Testing**
```javascript
// src/__tests__/api/telemetry.test.ts
import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/telemetry/route';

test('GET /api/telemetry returns telemetry data', async () => {
  const { req } = createMocks({ method: 'GET' });
  const response = await GET(req);
  expect(response.status).toBe(200);
});
```

#### Security Considerations

**For Production Deployment**
- Implement authentication middleware
- Add rate limiting to API endpoints
- Validate and sanitize all user inputs
- Use HTTPS for all communications
- Implement proper error handling without information leakage

**Database Security**
- Use connection string with authentication
- Implement proper access controls
- Regular security updates
- Monitor for suspicious activity

### Contributing Guidelines

1. **Code Style**: Follow ESLint and Prettier configurations
2. **Commit Messages**: Use conventional commit format
3. **Documentation**: Update relevant documentation with changes
4. **Testing**: Add tests for new features and bug fixes
5. **Performance**: Consider impact on application performance

---

## Support & Resources

### Getting Help

- **Documentation**: This comprehensive guide
- **API Reference**: Complete endpoint documentation above
- **Component Library**: Detailed component documentation
- **Troubleshooting**: Common issues and solutions

### External Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **React Documentation**: https://react.dev
- **MongoDB Documentation**: https://docs.mongodb.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs

### Version Information

- **Current Version**: 1.0.0
- **Node.js Compatibility**: 18.0.0+
- **Browser Support**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- **Last Updated**: August 2025

---

*This documentation is maintained alongside the codebase. For the most current information, always refer to the latest version in the repository.*