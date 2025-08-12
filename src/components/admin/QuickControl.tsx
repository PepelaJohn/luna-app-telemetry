'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Power, 
  Play, 
  Square, 
  Plane, 
  Settings,
  Eye,
  EyeOff,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Unlock
} from 'lucide-react';

interface DroneControlState {
  droneId: string;
  status: string;
  isOnline: boolean;
  battery?: number;
  manualOverride?: boolean;
  overrideExpiry?: string;
}

const DRONE_STATUSES = [
  { value: 'Powered Off', label: 'Power Off', color: 'bg-gray-600', icon: Power },
  { value: 'Standby', label: 'Standby', color: 'bg-yellow-600', icon: Square },
  { value: 'Pre-Flight', label: 'Pre-Flight', color: 'bg-blue-600', icon: Settings },
  { value: 'Active', label: 'Active', color: 'bg-green-600', icon: CheckCircle },
  { value: 'In Flight', label: 'In Flight', color: 'bg-cyan-600', icon: Plane },
  { value: 'Landing', label: 'Landing', color: 'bg-orange-600', icon: Plane },
  { value: 'Delivered', label: 'Delivered', color: 'bg-green-700', icon: CheckCircle },
  { value: 'Returning', label: 'Returning', color: 'bg-purple-600', icon: Plane },
  { value: 'Maintenance', label: 'Maintenance', color: 'bg-orange-700', icon: Settings },
  { value: 'Emergency', label: 'Emergency', color: 'bg-red-700', icon: AlertTriangle },
];

const DRONES = ['A1', 'A2', 'B1', 'B2'];

export function QuickControl() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [droneStates, setDroneStates] = useState<DroneControlState[]>([]);
  const [overrideDuration, setOverrideDuration] = useState(10); // Default 10 minutes

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setIsVisible(!isVisible);
      }
      if (e.key === 'Escape') {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      fetchDroneStates();
      const interval = setInterval(fetchDroneStates, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  const fetchDroneStates = async () => {
    try {
      const response = await fetch('/api/admin/drone-control');
      if (response.ok) {
        const data = await response.json();
        setDroneStates(data.states || []);
      }
    } catch (error) {
      console.error('Failed to fetch drone states:', error);
    }
  };

  const updateDroneStatus = async (
    droneId: string, 
    status: string, 
    options: { battery?: number; isOnline?: boolean; duration?: number } = {}
  ) => {
    setIsLoading(true);
    setFeedback('');

    try {
      const response = await fetch('/api/admin/drone-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          droneId,
          status,
          isOnline: options.isOnline !== undefined ? options.isOnline : (status !== 'Powered Off'),
          battery: options.battery,
          duration: (options.duration || overrideDuration) * 60 * 1000, // Convert minutes to ms
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setFeedback(`✅ ${result.message} (Override: ${overrideDuration}min)`);
        
        // Update local state
        setDroneStates(prev => {
          const updated = prev.filter(d => d.droneId !== droneId);
          updated.push({
            droneId,
            status,
            isOnline: options.isOnline !== undefined ? options.isOnline : (status !== 'Powered Off'),
            battery: options.battery,
            manualOverride: true,
            overrideExpiry: result.overrideExpiry,
          });
          return updated;
        });

        setTimeout(() => setFeedback(''), 3000);
      } else {
        setFeedback('❌ Failed to update drone status');
      }
    } catch (error) {
      setFeedback('❌ Error updating drone status');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    {
      label: 'Start All Drones',
      action: () => {
        DRONES.forEach(droneId => 
          updateDroneStatus(droneId, 'Active', { battery: 85 + Math.random() * 15 })
        );
      },
      color: 'bg-green-600 hover:bg-green-700',
      icon: Play,
    },
    {
      label: 'Launch Mission',
      action: () => {
        DRONES.forEach(droneId => 
          updateDroneStatus(droneId, 'In Flight', { battery: 70 + Math.random() * 20 })
        );
      },
      color: 'bg-cyan-600 hover:bg-cyan-700',
      icon: Plane,
    },
    {
      label: 'Return to Base',
      action: () => {
        DRONES.forEach(droneId => 
          updateDroneStatus(droneId, 'Returning', { battery: 40 + Math.random() * 30 })
        );
      },
      color: 'bg-purple-600 hover:bg-purple-700',
      icon: Plane,
    },
    {
      label: 'Power Off All',
      action: () => {
        DRONES.forEach(droneId => 
          updateDroneStatus(droneId, 'Powered Off', { isOnline: false })
        );
      },
      color: 'bg-red-600 hover:bg-red-700',
      icon: Power,
    },
  ];

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-card/90 backdrop-blur-sm border-border/50"
        >
          <Eye className="h-4 w-4 mr-2" />
          Admin
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-auto bg-card/95 backdrop-blur border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <span>Live Demo Control Panel</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Override Duration:</span>
              <select
                value={overrideDuration}
                onChange={(e) => setOverrideDuration(Number(e.target.value))}
                className="bg-secondary border border-border rounded px-2 py-1 text-sm"
              >
                <option value={5}>5 min</option>
                <option value={10}>10 min</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
              </select>
            </div>
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              size="sm"
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Feedback */}
          {feedback && (
            <div className="p-3 bg-secondary/50 rounded-lg text-center">
              <p className="text-sm">{feedback}</p>
            </div>
          )}

          {/* Override Status */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Unlock className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Manual Override System</span>
            </div>
            <p className="text-xs text-muted-foreground">
              When you manually set a drone status, the auto-simulation will respect that setting for the duration you specify. 
              This prevents unrealistic status changes during your demo.
            </p>
            <div className="mt-2 text-xs">
              <span className="text-green-400">Active Overrides: </span>
              {droneStates.filter(s => s.manualOverride).map(s => s.droneId).join(', ') || 'None'}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Demo Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    onClick={action.action}
                    disabled={isLoading}
                    className={`${action.color} text-white flex flex-col items-center p-4 h-auto`}
                  >
                    <Icon className="h-5 w-5 mb-2" />
                    <span className="text-xs text-center">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Individual Drone Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Individual Drone Control</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DRONES.map((droneId) => {
                const currentState = droneStates.find(s => s.droneId === droneId);
                const isOverridden = currentState?.manualOverride;
                
                return (
                  <Card key={droneId} className={`${isOverridden ? 'bg-blue-500/10 border-blue-500/30' : 'bg-secondary/30'}`}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        <span>Drone {droneId}</span>
                        <div className="flex items-center space-x-2">
                          {isOverridden && <Unlock className="h-3 w-3 text-blue-400" />}
                          <div className="text-xs text-muted-foreground">
                            {currentState?.status || 'Unknown'}
                          </div>
                        </div>
                      </CardTitle>
                      {isOverridden && (
                        <p className="text-xs text-blue-400">Manual Override Active</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {DRONE_STATUSES.slice(0, 8).map((status) => {
                          const Icon = status.icon;
                          return (
                            <Button
                              key={status.value}
                              onClick={() => updateDroneStatus(droneId, status.value)}
                              disabled={isLoading}
                              className={`${status.color} hover:opacity-80 text-white flex flex-col items-center p-2 h-auto text-xs`}
                            >
                              <Icon className="h-3 w-3 mb-1" />
                              {status.label}
                            </Button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <div className="text-xs text-muted-foreground bg-secondary/20 p-3 rounded-lg">
            <p className="font-semibold mb-2">How Manual Override Works:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Set any drone status manually - it will stay that way for the duration you specify</li>
              <li>Auto-simulation will skip overridden drones to prevent conflicts</li>
              <li>Override expires automatically, then normal simulation resumes</li>
              <li>Blue indicators show which drones are under manual control</li>
              <li>Press <kbd className="px-1 py-0.5 bg-secondary rounded">Ctrl+Shift+A</kbd> to toggle this panel</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}