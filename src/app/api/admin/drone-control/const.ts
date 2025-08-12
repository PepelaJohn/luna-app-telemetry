const droneStates = new Map<string, {
    status: string;
    isOnline: boolean;
    battery?: number;
    lastUpdate: Date;
    manualOverride: boolean;
    overrideExpiry?: Date;
    lastPosition?: { lat: number; lng: number };
  }>();

  export { droneStates };