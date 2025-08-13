# Next.js API Routes & Mongoose Fast Startup

## Table of Contents

1. [Understanding Next.js as Full-Stack Framework](#understanding-nextjs-as-full-stack-framework)
2. [API Routes Fundamentals](#api-routes-fundamentals)
3. [MongoDB & Mongoose Basics](#mongodb--mongoose-basics)
4. [Project Structure Explained](#project-structure-explained)
5. [Building Your First API Route](#building-your-first-api-route)
6. [Database Integration with Mongoose](#database-integration-with-mongoose)
7. [Real Examples from Lunadrone Project](#real-examples-from-lunadrone-project)
8. [Common Patterns & Best Practices](#common-patterns--best-practices)
9. [Debugging & Troubleshooting](#debugging--troubleshooting)
10. [Next Steps](#next-steps)

---

## Understanding Next.js as Full-Stack Framework

### What is Next.js?

Next.js is a **React framework** that can handle both **frontend (client-side)** and **backend (server-side)** code in one application. This means you don't need separate servers like Express.js - Next.js can be your entire web application.

```
Traditional Setup:
┌─────────────────┐    HTTP     ┌─────────────────────┐    Database
│   React App     │ ◄─────────► │ Express.js / Django │  ◄─────────►
│   (Frontend)    │             │   (Backend)         │
└─────────────────┘             └─────────────────────┘

Next.js Setup:
┌─────────────────────────────────────────────┐    Database
│           Next.js Application                │ ◄─────────►
│  ┌─────────────────┐ ┌─────────────────┐   │
│  │  React Pages    │ │   API Routes    │   │
│  │  (Frontend)     │ │   (Backend)     │   │
│  └─────────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────┘
```

### Why Use Next.js API Routes?

**Benefits:**
- ✅ **One Codebase**: Frontend and backend in same project
- ✅ **Shared Types**: TypeScript types work across frontend/backend
- ✅ **Easy Deployment**: Deploy everything together
- ✅ **No CORS Issues**: Frontend and backend are same origin
- ✅ **Serverless Ready**: Can deploy as serverless functions

---

## API Routes Fundamentals

### How API Routes Work

In Next.js, any file inside `src/app/api/` becomes an API endpoint. The file structure maps directly to URL paths.

```
File Structure:
src/app/api/
├── route.ts                    → /api
├── users/
│   └── route.ts               → /api/users
├── telemetry/
│   └── route.ts               → /api/telemetry
└── admin/
    └── drone-control/
        └── route.ts           → /api/admin/drone-control
```

### Basic API Route Structure

Every API route file exports functions named after HTTP methods:

```typescript
// src/app/api/example/route.ts

import { NextRequest, NextResponse } from 'next/server';

// Handle GET requests to /api/example
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Hello from GET!' });
}

// Handle POST requests to /api/example
export async function POST(request: NextRequest) {
  const data = await request.json(); // Get request body
  return NextResponse.json({ received: data });
}

// Handle PUT, DELETE, PATCH, etc.
export async function PUT(request: NextRequest) { /* ... */ }
export async function DELETE(request: NextRequest) { /* ... */ }
```

### Understanding NextRequest and NextResponse

**NextRequest** - Represents incoming HTTP request:
```typescript
// Get query parameters
const { searchParams } = new URL(request.url);
const userId = searchParams.get('userId'); // ?userId=123

// Get request body (for POST/PUT)
const body = await request.json();

// Get headers
const authHeader = request.headers.get('authorization');
```

**NextResponse** - Send HTTP response:
```typescript
// Send JSON response
return NextResponse.json({ data: 'something' });

// Send with status code
return NextResponse.json({ error: 'Not found' }, { status: 404 });

// Send plain text
return new NextResponse('Plain text response');
```

### HTTP Methods Explained

| Method | Purpose | Has Body | Example Use |
|--------|---------|----------|-------------|
| **GET** | Retrieve data | No | Get list of drones |
| **POST** | Create new data | Yes | Add new telemetry |
| **PUT** | Update existing data | Yes | Update drone status |
| **DELETE** | Remove data | No | Delete old records |
| **PATCH** | Partial update | Yes | Update just battery level |

---

## MongoDB & Mongoose Basics

### What is MongoDB?

**MongoDB** is a **NoSQL database** that stores data as **documents** (like JSON objects) instead of tables and rows.

```javascript
// Traditional SQL (rows in tables)
Users Table:
| id | name     | email           |
|----|----------|-----------------|
| 1  | John Doe | john@email.com  |

// MongoDB (documents in collections)
Users Collection:
{
  "_id": "64f7b1234567890abcdef123",
  "name": "John Doe", 
  "email": "john@email.com",
  "metadata": {
    "lastLogin": "2025-08-13T14:30:00Z"
  }
}
```

### What is Mongoose?

**Mongoose** is a library that makes working with MongoDB easier by providing:
- **Schema Definition**: Define structure for your data
- **Data Validation**: Ensure data meets requirements
- **Query Helpers**: Simplified database operations
- **Middleware**: Run code before/after database operations

### MongoDB vs Mongoose Example

**Raw MongoDB:**
```javascript
// Complex and error-prone
db.collection('users').insertOne({
  name: 'John',
  email: 'john@email.com',
  createdAt: new Date()
});
```

**With Mongoose:**
```javascript
// Simple and safe
const user = new User({
  name: 'John',
  email: 'john@email.com'  // createdAt auto-added
});
await user.save();
```

---

## Project Structure Explained

### Lunadrone Project Structure

```
src/
├── app/
│   ├── api/                     # 🔥 BACKEND (API Routes)
│   │   ├── telemetry/
│   │   │   └── route.ts        # Telemetry CRUD operations
│   │   ├── drones/
│   │   │   └── route.ts        # Drone fleet management  
│   │   └── admin/
│   │       └── drone-control/
│   │           └── route.ts    # Admin controls
│   ├── dashboard/
│   │   └── page.tsx           # 🔥 FRONTEND (React Pages)
│   └── layout.tsx
├── lib/
│   ├── mongodb.ts             # 🔥 DATABASE CONNECTION
│   └── auto-simulator.ts      # Business logic
├── models/
│   └── Telemetry.ts          # 🔥 DATABASE SCHEMA
└── types/
    └── telemetry.ts          # 🔥 TYPESCRIPT TYPES
```

### File Responsibilities

| File Type | Purpose | Example |
|-----------|---------|---------|
| **route.ts** | API endpoints (backend) | Handle HTTP requests |
| **page.tsx** | Web pages (frontend) | Display UI to users |
| **models/*.ts** | Database schemas | Define data structure |
| **lib/*.ts** | Utilities & connections | Database setup, helpers |
| **types/*.ts** | TypeScript definitions | Shared data types |

---

## Building Your First API Route

### Step 1: Create the Route File

```typescript
// src/app/api/hello/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Hello from Next.js API!',
    timestamp: new Date().toISOString()
  });
}
```

**Test it:**
- Start your app: `npm run dev`
- Visit: `http://localhost:3000/api/hello`
- You'll see: `{"message":"Hello from Next.js API!","timestamp":"..."}`

### Step 2: Handle Query Parameters

```typescript
// src/app/api/greet/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get query parameters from URL
  const { searchParams } = new URL(request.url);
  const name = searchParams.get('name') || 'World';
  
  return NextResponse.json({ 
    greeting: `Hello, ${name}!`
  });
}
```

**Test it:**
- Visit: `http://localhost:3000/api/greet?name=John`
- You'll see: `{"greeting":"Hello, John!"}`

### Step 3: Handle POST Requests

```typescript
// src/app/api/submit/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get JSON data from request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }
    
    // Process the data (save to database, send email, etc.)
    console.log('Received data:', data);
    
    return NextResponse.json({ 
      success: true,
      message: 'Data received successfully',
      received: data
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON data' },
      { status: 400 }
    );
  }
}
```

**Test it with curl:**
```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@email.com"}'
```

---

## Database Integration with Mongoose

### Step 1: Install Dependencies

```bash
npm install mongoose
npm install @types/mongoose  # For TypeScript
```

### Step 2: Database Connection

```typescript
// src/lib/mongodb.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in your .env.local file');
}

// Cache connection to avoid multiple connections
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection if none exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
```

### Step 3: Create a Mongoose Schema

```typescript
// src/models/User.ts

import mongoose from 'mongoose';

// Define the structure of your data
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age cannot exceed 120']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt
});

// Create indexes for better performance
UserSchema.index({ email: 1 }); // Ascending index on email
UserSchema.index({ createdAt: -1 }); // Descending index on creation date

// Prevent re-compilation during development
export default mongoose.models.User || mongoose.model('User', UserSchema);
```

### Step 4: Use Schema in API Route

```typescript
// src/app/api/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// GET all users
export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();
    
    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Query database with pagination
    const users = await User.find()
      .select('-__v') // Exclude version field
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 }); // Newest first
    
    const total = await User.countDocuments();
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// CREATE new user
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const userData = await request.json();
    
    // Create new user (Mongoose will validate automatically)
    const user = new User(userData);
    await user.save();
    
    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }
    
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

---

## Real Examples from Lunadrone Project

### Example 1: Telemetry API Route

Let's break down the telemetry API route from the Lunadrone project:

```typescript
// src/app/api/telemetry/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Telemetry from '@/models/Telemetry';

export async function GET(request: NextRequest) {
  try {
    // 1. Connect to database
    await dbConnect();
    
    // 2. Parse query parameters
    const { searchParams } = new URL(request.url);
    const droneId = searchParams.get('droneId');     // Filter by drone
    const since = searchParams.get('since');         // Date filter
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // 3. Build database query
    const query: any = {};
    
    if (droneId) {
      query.droneId = droneId; // Only this drone's data
    }
    
    if (since) {
      query.timestamp = { $gte: new Date(since) }; // Data after this date
    }
    
    // 4. Execute database query with pagination
    const skip = (page - 1) * limit;
    
    const [logs, total] = await Promise.all([
      Telemetry.find(query)
        .sort({ timestamp: -1 })  // Newest first
        .skip(skip)
        .limit(limit)
        .lean(),                  // Return plain objects (faster)
      Telemetry.countDocuments(query)
    ]);
    
    // 5. Return formatted response
    return NextResponse.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
    
  } catch (error) {
    console.error('Telemetry API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch telemetry data' },
      { status: 500 }
    );
  }
}
```

**How this works:**
1. **URL**: `/api/telemetry?droneId=A1&since=2025-08-13T00:00:00Z&page=1&limit=10`
2. **Query Parameters**: Extracted using `searchParams.get()`
3. **Database Query**: Built dynamically based on parameters
4. **Response**: JSON with data and pagination info

### Example 2: Telemetry Schema

```typescript
// src/models/Telemetry.ts

import mongoose from 'mongoose';

const TelemetrySchema = new mongoose.Schema({
  droneId: {
    type: String,
    required: true,
    index: true,              // Create index for fast queries
    trim: true
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true
  },
  battery: {
    type: Number,
    required: true,
    min: [0, 'Battery cannot be negative'],
    max: [100, 'Battery cannot exceed 100%']
  },
  temperature: {
    type: Number,
    required: true
  },
  // ... other fields
  status: {
    type: String,
    required: true,
    enum: {
      values: ['Standby', 'Active', 'In Flight', 'Emergency'],
      message: 'Status must be one of: Standby, Active, In Flight, Emergency'
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Compound index for efficient queries
TelemetrySchema.index({ droneId: 1, timestamp: -1 });

// Export model (avoid re-compilation in development)
export default mongoose.models.Telemetry || mongoose.model('Telemetry', TelemetrySchema);
```

**Key Features:**
- **Validation**: Automatic data validation before saving
- **Indexes**: Fast database queries on common fields
- **Enum Values**: Restrict status to specific values
- **Timestamps**: Automatic createdAt/updatedAt fields

### Example 3: Admin Control API

```typescript
// src/app/api/admin/drone-control/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Telemetry from '@/models/Telemetry';

// In-memory store for quick access
const droneStates = new Map();

export async function POST(request: NextRequest) {
  try {
    const { droneId, status, battery } = await request.json();
    
    // Validate input
    if (!droneId || !status) {
      return NextResponse.json(
        { error: 'DroneId and status are required' },
        { status: 400 }
      );
    }
    
    // Update in-memory state (for instant UI response)
    droneStates.set(droneId, {
      status,
      battery,
      lastUpdate: new Date(),
      manualOverride: true
    });
    
    // Also save to database
    await dbConnect();
    const telemetry = new Telemetry({
      droneId,
      status,
      battery: battery || 85,
      temperature: 28,
      humidity: 65,
      speed: status === 'In Flight' ? 45 : 0,
      altitude: status === 'In Flight' ? 150 : 0,
      lat: -1.2921,
      lng: 36.8219,
    });
    
    await telemetry.save();
    
    return NextResponse.json({
      success: true,
      message: `Drone ${droneId} status updated to ${status}`,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Admin control error:', error);
    return NextResponse.json(
      { error: 'Failed to update drone status' },
      { status: 500 }
    );
  }
}
```

**Key Concepts:**
- **Input Validation**: Check required fields before processing
- **Dual Storage**: In-memory for speed + database for persistence
- **Error Handling**: Different responses for different error types
- **Business Logic**: Generate realistic telemetry based on status

---

## Common Patterns & Best Practices

### 1. Error Handling Pattern

```typescript
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Validate input
    if (!data.required_field) {
      return NextResponse.json(
        { error: 'Required field missing' },
        { status: 400 } // Bad Request
      );
    }
    
    // Database operation
    const result = await Model.create(data);
    
    return NextResponse.json({ success: true, data: result });
    
  } catch (error) {
    // Mongoose validation error
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    // Duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate entry' },
        { status: 409 }
      );
    }
    
    // Generic server error
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. Query Building Pattern

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Build query object dynamically
  const query: any = {};
  
  // Optional filters
  const droneId = searchParams.get('droneId');
  if (droneId) query.droneId = droneId;
  
  const status = searchParams.get('status');
  if (status) query.status = status;
  
  // Date range filter
  const since = searchParams.get('since');
  const until = searchParams.get('until');
  if (since || until) {
    query.timestamp = {};
    if (since) query.timestamp.$gte = new Date(since);
    if (until) query.timestamp.$lte = new Date(until);
  }
  
  // Execute query
  const results = await Model.find(query);
  return NextResponse.json(results);
}
```

### 3. Pagination Pattern

```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Pagination parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;
  
  // Get data and count in parallel
  const [data, total] = await Promise.all([
    Model.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Model.countDocuments(query)
  ]);
  
  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    }
  });
}
```

### 4. TypeScript Types Pattern

```typescript
// src/types/api.ts

// Define request/response types
export interface CreateUserRequest {
  name: string;
  email: string;
  age?: number;
}

export interface CreateUserResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
  message: string;
}

export interface ErrorResponse {
  error: string;
  code?: string;
}

// Use in API route
export async function POST(request: NextRequest): Promise<NextResponse<CreateUserResponse | ErrorResponse>> {
  const userData: CreateUserRequest = await request.json();
  // ... handle request
}
```

---

## Debugging & Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot connect to MongoDB"

**Error:**
```
MongoNetworkError: failed to connect to server
```

**Solutions:**
```typescript
// Check your connection string
const MONGODB_URI = process.env.MONGODB_URI;
console.log('MongoDB URI:', MONGODB_URI); // Debug

// Test connection manually
async function testConnection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
  }
}
```

#### 2. "Model is not defined"

**Error:**
```
ReferenceError: User is not defined
```

**Solution:**
```typescript
// Make sure to import your model
import User from '@/models/User'; // ← Add this import

export async function GET() {
  const users = await User.find(); // Now it works
}
```

#### 3. "Request body is undefined"

**Error:**
```
Cannot read property 'name' of undefined
```

**Solution:**
```typescript
export async function POST(request: NextRequest) {
  // Wrong way
  const data = request.body; // ❌ undefined
  
  // Correct way
  const data = await request.json(); // ✅ Gets the JSON data
  
  console.log('Received data:', data);
}
```

#### 4. "Headers already sent" Error

**Error:**
```
Cannot set headers after they are sent to the client
```

**Solution:**
```typescript
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.name) {
      return NextResponse.json({ error: 'Name required' }); // ✅ Single return
    }
    
    const result = await User.create(data);
    return NextResponse.json({ result }); // ✅ Single return
    
  } catch (error) {
    return NextResponse.json({ error: error.message }); // ✅ Single return
  }
  
  // ❌ Don't have multiple return statements in same execution path
}
```

### Debugging Tools

#### 1. Console Logging

```typescript
export async function POST(request: NextRequest) {
  console.log('🚀 API Route called'); // Debug entry point
  
  const data = await request.json();
  console.log('📥 Received data:', data); // Debug input
  
  await dbConnect();
  console.log('🔗 Database connected'); // Debug connection
  
  const result = await User.create(data);
  console.log('💾 User created:', result._id); // Debug result
  
  return NextResponse.json({ success: true });
}
```

#### 2. API Testing with curl

```bash
# Test GET endpoint
curl "http://localhost:3000/api/users?page=1&limit=5"

# Test POST endpoint
curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com"}'

# Test with invalid data
curl -X POST "http://localhost:3000/api/users" \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"invalid-email"}'
```

#### 3. Database Query Debugging

```typescript
// Debug Mongoose queries
mongoose.set('debug', true); // Shows all database queries

// Manual query testing
export async function GET() {
  try {
    const users = await User.find().explain('executionStats');
    console.log('Query execution stats:', users);
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Query failed:', error);
    return NextResponse.json({ error: error.message });
  }
}
```

---

## Next Steps

### 1. Learn Advanced Patterns

Once you're comfortable with basics, explore:

**Middleware:**
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Add authentication, logging, etc.
  console.log(`${request.method} ${request.url}`);
  return NextResponse.next();
}
```

**Dynamic Routes:**
```typescript
// src/app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const userId = params.id; // From URL path
  const user = await User.findById(userId);
  return NextResponse.json({ user });
}
```

### 2. Production Considerations

**Environment Variables:**
```typescript
// Use different databases for different environments
const MONGODB_URI = process.env.NODE_ENV === 'production' 
  ? process.env.MONGODB_URI_PROD 
  : process.env.MONGODB_URI_DEV;
```

**Error Handling:**
```typescript
// Don't expose internal errors in production
const isDev = process.env.NODE_ENV === 'development';

return NextResponse.json(
  { error: isDev ? error.message : 'Something went wrong' },
  { status: 500 }
);
```

**Rate Limiting:**
```typescript
// Add rate limiting for production
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

### 3. Testing Your APIs

**Simple Testing:**
```typescript
// src/__tests__/api/users.test.ts
import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/users/route';

test('GET /api/users returns users list', async () => {
  const { req } = createMocks({ method: 'GET' });
  const response = await GET(req);
  const data = await response.json();
  
  expect(response.status).toBe(200);
  expect(data.users).toBeDefined();
});
```

### 4. Documentation

Always document your APIs:

```typescript
/**
 * GET /api/telemetry
 * 
 * Retrieves telemetry data with optional filtering
 * 
 * Query Parameters:
 * - droneId: Filter by specific drone
 * - since: ISO date string for data after specific time
 * - page: Page number for pagination (default: 1)
 * - limit: Items per page (default: 20)
 * 
 * Returns:
 * - logs: Array of telemetry records
 * - total: Total number of records
 * - page: Current page
 * - totalPages: Total number of pages
 */
export async function GET(request: NextRequest) {
  // Implementation...
}
```

---

## Summary

You now understand:

✅ **Next.js API Routes**: How to create backend endpoints in Next.js  
✅ **HTTP Methods**: GET, POST, PUT, DELETE and when to use each  
✅ **Request/Response**: How to handle incoming data and send responses  
✅ **MongoDB & Mongoose**: Database connection, schemas, and queries  
✅ **Error Handling**: Proper error responses and debugging  
✅ **Real Examples**: How everything works in the Lunadrone project  

**Key Takeaways:**
- API routes in `src/app/api/` become HTTP endpoints
- Each route file exports functions named after HTTP methods
- Mongoose provides structure and validation for MongoDB
- Always handle errors gracefully
- Use TypeScript for better development experience

Now you can build robust, type-safe backends with Next.js and MongoDB! 🚀