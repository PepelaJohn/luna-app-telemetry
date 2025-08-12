import { NextRequest, NextResponse } from 'next/server';

import Telemetry from '@/models/Telemetry';
import { connectDB } from '@/lib/db';
import { droneStates } from './const';

// Enhanced in-memory store with manual override tracking


export async function POST(request: NextRequest) {
  try {
    const { droneId, status, isOnline, battery, duration } = await request.json();
    
    if (!droneId || !status) {
      return NextResponse.json(
        { error: 'DroneId and status are required' },
        { status: 400 }
      );
    }

    // Calculate override expiry (default 5 minutes, or specified duration)
    const overrideDuration = duration || 5 * 60 * 1000; // 5 minutes in ms
    const overrideExpiry = new Date(Date.now() + overrideDuration);

    // Get last known position
    const lastTelemetry = await connectDB().then(() => 
      Telemetry.findOne({ droneId }).sort({ timestamp: -1 })
    );

    // Update in-memory state with manual override
    droneStates.set(droneId, {
      status,
      isOnline: isOnline !== undefined ? isOnline : (status !== 'Powered Off'),
      battery: battery !== undefined ? battery : (lastTelemetry?.battery || 85),
      lastUpdate: new Date(),
      manualOverride: true,
      overrideExpiry,
      lastPosition: lastTelemetry ? { lat: lastTelemetry.lat, lng: lastTelemetry.lng } : undefined,
    });

    // Create realistic telemetry based on status
    const realisticTelemetry = generateRealisticTelemetry(droneId, status, {
      battery: battery !== undefined ? battery : (lastTelemetry?.battery || 85),
      lastPosition: lastTelemetry ? { lat: lastTelemetry.lat, lng: lastTelemetry.lng } : { lat: -1.2921, lng: 36.8219 },
      previousTelemetry: lastTelemetry,
    });

    // Save to database
    const newTelemetry = new Telemetry(realisticTelemetry);
    await newTelemetry.save();

    return NextResponse.json({
      success: true,
      message: `Drone ${droneId} manually set to ${status}`,
      droneId,
      status,
      isOnline: realisticTelemetry.speed > 0 || status === 'Active',
      battery: realisticTelemetry.battery,
      timestamp: new Date().toISOString(),
      overrideActive: true,
      overrideExpiry: overrideExpiry.toISOString(),
    });

  } catch (error) {
    console.error('Drone control error:', error);
    return NextResponse.json(
      { error: 'Failed to update drone status' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const droneId = searchParams.get('droneId');

    // Clean up expired overrides
    const now = new Date();
    for (const [id, state] of droneStates.entries()) {
      if (state.manualOverride && state.overrideExpiry && now > state.overrideExpiry) {
        droneStates.set(id, {
          ...state,
          manualOverride: false,
          overrideExpiry: undefined,
        });
      }
    }

    if (droneId) {
      const state = droneStates.get(droneId);
      if (state) {
        return NextResponse.json({
          success: true,
          droneId,
          ...state,
        });
      }
    }

    const allStates = Array.from(droneStates.entries()).map(([id, state]) => ({
      droneId: id,
      ...state,
    }));

    return NextResponse.json({
      success: true,
      states: allStates,
    });

  } catch (error) {
    console.error('Get drone states error:', error);
    return NextResponse.json(
      { error: 'Failed to get drone states' },
      { status: 500 }
    );
  }
}

// Helper function to generate realistic telemetry based on status
function generateRealisticTelemetry(droneId: string, status: string, context: {
  battery: number;
  lastPosition: { lat: number; lng: number };
  previousTelemetry?: any;
}) {
  const { battery, lastPosition, previousTelemetry } = context;
  const basePosition = { lat: -1.2921, lng: 36.8219 }; // Nairobi base

  let telemetryData = {
    droneId,
    timestamp: new Date(),
    battery,
    temperature: 28,
    humidity: 65,
    speed: 0,
    altitude: 0,
    lat: lastPosition.lat,
    lng: lastPosition.lng,
    status,
  };

  switch (status) {
    case 'Powered Off':
      telemetryData = {
        ...telemetryData,
        temperature: 22 + Math.random() * 3, // Ambient temperature
        speed: 0,
        altitude: 0,
        lat: basePosition.lat, // Return to base position
        lng: basePosition.lng,
      };
      break;

    case 'Standby':
      telemetryData = {
        ...telemetryData,
        temperature: 25 + Math.random() * 3, // Slightly warm
        battery: Math.min(100, battery + 1), // Charging
        speed: 0,
        altitude: 0,
        lat: basePosition.lat,
        lng: basePosition.lng,
      };
      break;

    case 'Pre-Flight':
      telemetryData = {
        ...telemetryData,
        temperature: 28 + Math.random() * 3, // Warming up
        speed: 0,
        altitude: 0,
        lat: basePosition.lat,
        lng: basePosition.lng,
      };
      break;

    case 'Active':
      telemetryData = {
        ...telemetryData,
        temperature: 30 + Math.random() * 4, // Active systems
        battery: Math.max(battery - 0.5, 20), // Slight power draw
        speed: 0,
        altitude: 0,
        lat: basePosition.lat,
        lng: basePosition.lng,
      };
      break;

    case 'In Flight':
      telemetryData = {
        ...telemetryData,
        temperature: 35 + Math.random() * 6, // Hot during flight
        battery: Math.max(battery - 2, 15), // Flight power consumption
        speed: 40 + Math.random() * 25, // Realistic flight speed
        altitude: 120 + Math.random() * 80, // Flight altitude
        // Keep current position or move slightly for realism
        lat: lastPosition.lat + (Math.random() - 0.5) * 0.01,
        lng: lastPosition.lng + (Math.random() - 0.5) * 0.01,
      };
      break;

    case 'Landing':
      telemetryData = {
        ...telemetryData,
        temperature: 33 + Math.random() * 4,
        battery: Math.max(battery - 1, 15),
        speed: 5 + Math.random() * 10, // Slow landing speed
        altitude: Math.random() * 20, // Low altitude
        lat: lastPosition.lat,
        lng: lastPosition.lng,
      };
      break;

    case 'Delivered':
      telemetryData = {
        ...telemetryData,
        temperature: 32 + Math.random() * 4,
        battery: Math.max(battery - 0.5, 15),
        speed: 0, // Stationary
        altitude: 0,
        lat: lastPosition.lat,
        lng: lastPosition.lng,
      };
      break;

    case 'Returning':
      telemetryData = {
        ...telemetryData,
        temperature: 34 + Math.random() * 5,
        battery: Math.max(battery - 1.5, 15),
        speed: 35 + Math.random() * 20, // Return flight speed
        altitude: 100 + Math.random() * 60,
        // Move slightly towards base
        lat: lastPosition.lat + (basePosition.lat - lastPosition.lat) * 0.1,
        lng: lastPosition.lng + (basePosition.lng - lastPosition.lng) * 0.1,
      };
      break;

    case 'Maintenance':
      telemetryData = {
        ...telemetryData,
        temperature: 24 + Math.random() * 2, // Cool, systems off
        battery: battery, // No change during maintenance
        speed: 0,
        altitude: 0,
        lat: basePosition.lat,
        lng: basePosition.lng,
      };
      break;

    case 'Emergency':
      telemetryData = {
        ...telemetryData,
        temperature: 40 + Math.random() * 8, // High temperature indicating problem
        battery: Math.max(battery - 3, 5), // Rapid battery drain
        speed: Math.random() * 15, // Erratic or emergency landing
        altitude: Math.random() * 50, // Low altitude emergency
        lat: lastPosition.lat,
        lng: lastPosition.lng,
      };
      break;
  }

  return telemetryData;
}

// Export function to check if drone is under manual override
export function isDroneUnderManualOverride(droneId: string): boolean {
  const state = droneStates.get(droneId);
  if (!state?.manualOverride) return false;
  
  const now = new Date();
  if (state.overrideExpiry && now > state.overrideExpiry) {
    // Override expired, clean it up
    droneStates.set(droneId, {
      ...state,
      manualOverride: false,
      overrideExpiry: undefined,
    });
    return false;
  }
  
  return true;
}

// Export drone states for auto-simulator
