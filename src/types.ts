export interface Alert {
  id: string;
  timeAgo: string;
  title: string;
  details: string;
  severity: 'critical' | 'warning' | 'info';
  timestamp: Date;
  location?: string;
}

export interface SupplyCenter {
  id: string;
  name: string;
  barangay: string;
  municipality: string;
  foodPacks: number;
  maxFoodPacks: number;
  medicalPct: number;
  capacityPct: number;
  status: 'critical' | 'low' | 'sufficient';
}

export interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: 'IN FIELD' | 'AT BASE' | 'STANDBY';
}

export interface Assignment {
  id: string;
  title: string;
  location: string;
  description: string;
  steps: string[];
  completed: boolean;
  mapImage: string;
}

export interface Beacon {
  id: string;
  name: string;
  coords: string;
  dist: string;
  lastPing: string;
  pulseColor: 'primary' | 'tertiary';
  latitude: number;
  longitude: number;
}

export interface OfflineSyncItem {
  id: string;
  action: string; // e.g., 'REPORT_INCIDENT', 'UPDATE_INVENTORY', 'BROADCAST_SOS'
  data: any;
  timestamp: string;
}
