import React, { useState, useEffect } from 'react';
import {
  MapPin, AlertTriangle, ShieldAlert, Package2, Users, Radio, Wifi, WifiOff,
  Bell, Settings, MessageSquare, Compass, Siren, Eye, RefreshCw, Layers
} from 'lucide-react';

import { Alert, SupplyCenter, TeamMember, Assignment, Beacon, OfflineSyncItem } from './types';
import OfflineBanner from './components/OfflineBanner';
import MapWorkspace from './components/MapWorkspace';
import SuppliesTracker from './components/SuppliesTracker';
import VolunteerDeployment from './components/VolunteerDeployment';
import BeaconMonitor from './components/BeaconMonitor';
import TeamComms from './components/TeamComms';
import { ReportIncidentForm, RequestLogisticsForm } from './components/ActionForms';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'map' | 'supplies' | 'comms' | 'volunteer' | 'beacon'>('map');

  // Network Offline Emulation States
  const [isOffline, setIsOffline] = useState(false);
  const [syncQueue, setSyncQueue] = useState<OfflineSyncItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState('14:02 Manila • 02 Oct 2023');

  // Master Lists - Incident reports / Alerts feed
  const [incidents, setIncidents] = useState<Alert[]>([
    {
      id: 'inc-1',
      timeAgo: '02 MINS AGO',
      title: 'Flash Flood: Tumana, Marikina',
      details: 'Water levels reached critical 18.2m. Mandatory evacuation initiated for District 2.',
      severity: 'critical',
      timestamp: new Date()
    },
    {
      id: 'inc-2',
      timeAgo: '14 MINS AGO',
      title: 'Structure Collapse: Cainta',
      details: 'Commercial building near Junction. Rescue Team Echo dispatched. Heavy traffic.',
      severity: 'critical',
      timestamp: new Date(Date.now() - 14 * 60000)
    },
    {
      id: 'inc-3',
      timeAgo: '32 MINS AGO',
      title: 'Power Outage: Pasig City',
      details: 'Substation failure due to fallen debris. Critical care facilities on generator.',
      severity: 'warning',
      timestamp: new Date(Date.now() - 32 * 60000)
    }
  ]);

  // Master Lists - Supply depots
  const [supplyCenters, setSupplyCenters] = useState<SupplyCenter[]>([
    {
      id: 'sup-1',
      name: 'San Pedro Central Gym',
      barangay: 'Barangay Poblacion',
      municipality: 'San Pedro',
      foodPacks: 12,
      maxFoodPacks: 500,
      medicalPct: 45,
      capacityPct: 98,
      status: 'critical'
    },
    {
      id: 'sup-2',
      name: 'Biñan Evac Center B',
      barangay: 'Barangay Sto. Tomas',
      municipality: 'Biñan',
      foodPacks: 140,
      maxFoodPacks: 800,
      medicalPct: 82,
      capacityPct: 65,
      status: 'low'
    },
    {
      id: 'sup-3',
      name: 'Sta. Rosa Covered Court',
      barangay: 'Barangay Tagapo',
      municipality: 'Sta. Rosa',
      foodPacks: 1200,
      maxFoodPacks: 1500,
      medicalPct: 95,
      capacityPct: 30,
      status: 'sufficient'
    }
  ]);

  // Master Lists - Survivor / Distress tracking beacons
  const [beacons, setBeacons] = useState<Beacon[]>([
    {
      id: 'beac-1',
      name: 'USER_7731 (Alpha-1)',
      coords: '14.59° N, 120.98° E',
      dist: '1.2 KM',
      lastPing: '2M AGO',
      pulseColor: 'primary',
      latitude: 14.5901,
      longitude: 120.9811
    },
    {
      id: 'beac-2',
      name: 'USER_0411 (Beta-9)',
      coords: '14.61° N, 121.01° E',
      dist: '3.8 KM',
      lastPing: '14M AGO',
      pulseColor: 'tertiary',
      latitude: 14.6112,
      longitude: 121.0125
    }
  ]);

  // Master Lists - Volunteer Tasks & Assignments
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'ASG-9921',
      title: 'SUPPLY DISTRIBUTION',
      location: 'Brgy. Guadalupe Central Plaza',
      description: 'Allocate vital nutritional loads and hygiene packs to residents in Guadalupe evacuation basin.',
      steps: [
        'Verify cargo manifest with local logistics lead (Officer Santos).',
        'Prioritize distribution to households with ID-verified elderly dependents.'
      ],
      completed: false,
      mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0WmcOrL5vb0FBl2Dqtpwy6Pwo9IMDsBgIWqCvt_rBEU9r8bhU8k-pgxJXFlM7tsZFvYT4Jv1tgCz8fBzvM--AJQohiKMhz9FsuzWTsp8XMykiNKz_L1c3AtCvn4Dcm6xUPbntDJh4rO0dkc5P3LDYxsqPVPVPi-G_tcg4F6juDD-prwM7nhIO9opvha4p0XiyW_IGbgnY6o8DFDNTcqXfdeoTpNZNUGioRmuTQfHdu6Ef0YEphtyi4xMadXOrgExg_WQCGuR_j1s'
    }
  ]);

  // Master Lists - Filipino responder staff portraits
  const [teamMembers] = useState<TeamMember[]>([
    {
      id: 'team-1',
      name: 'Capt. Reyes, J.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC3zL1WtdNqd87iIWtZbvuD1nTU8_X4QZ1SAZU2k_80P5GnUGKNRxicyS5FkSPevmlg_L-97Q68137JfIqjGvIc6nptKbDvhJFZ71lCK0nZS04p_UXMJbAM3VAUsO6dttkZ8wnul_c3sclwlT73DEEu1I85exbVvNe1W2_-so_fuO_YAlxHPHWRH0wYO6tZBM7mKQWbvHrJu1-w4RJSbb8WQFQPIb_yNIHbc6vu5pybHPPRa_ClMTS5LMxdbbnAnWVMdviUgWo7Ybk',
      role: 'Lead Paramedic',
      status: 'IN FIELD'
    },
    {
      id: 'team-2',
      name: 'Sgt. Santos, M.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaDPqDifYAzXuZ9kCKV5Tc2eYjBqOJ4BUMuKlnP6DpCAvKiuUoZb5crW78Qh1wCQb5OQYMLp1fteXumxu79EVByTsnhNHU376RLP0sG-A1Ad0ksRqJBJ63uL87IEy_k1XSfGeL_yoEgsjX7Pg7X_e1G60ElWBNrSujIlj-FodKQfl3HYKp-JYdkwKjy6Owgoe_1WOTLXql51gd5LGeVB6JamqVartAP55JaHlgsZVQFHZclLXsF0SJ8ZZhhZy0kTOpD9jnilQW0QY',
      role: 'Rescue Specialist',
      status: 'IN FIELD'
    },
    {
      id: 'team-3',
      name: 'Lt. Cruz, L.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8BvPmUgHvCEBhW1Hya-ZpdN4LA_fsznpKSLNX3gkDIugNORHtDFK6nQe3964ekNL_FIkhgyDhg0IOF2qVKGcchYpBsSBoYTOkCaHCuWNCd2IzP1ei5BWxbEq9kvcI0XNc-_nvFyyXeRsZKj98iKGnMxbApJ-oFfmkOvAgGzsO4ExVgyZo2r8W-gtx9hzzN0fMG8eoiGbn1nwKrVfctu9aH0Ej6VnNIhdjDlTEZaMu23viAMcs9NOMYFut7rsakMIxoKFkPXRyiww',
      role: 'Communications',
      status: 'AT BASE'
    },
    {
      id: 'team-4',
      name: 'Cpl. Garcia, D.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUsT_4yG_bG3GXIzd0EGO1hAs3ouq_CeXQp3_nupZC0T_42NM4ddbmYOWEl9BA8QfXTlD5HJkKFByW2oEq8G_RR3uVv-W-G0qLqxF5dzmCoOsYigN3_t9z3t7vSYzI8C3E1mLf9W1sAFSH4uqAiZknpNKkF-bDJKhEu35qWRoDsjwOpEMcqvuc_TU_YJ-h7ws87YfUBLuCPm4iViGUgRsENbLUY7V070JFFpe5v86r7GWuus1RHx9S38F7ps_k7p9VKfGvW5ElFC8',
      role: 'Logistics Officer',
      status: 'STANDBY'
    }
  ]);

  // Command State
  const [isSosBroadcasting, setIsSosBroadcasting] = useState(false);
  const [activeMapOverlay, setActiveMapOverlay] = useState<'all' | 'incidents' | 'units' | 'evac'>('all');
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showLogisticsForm, setShowLogisticsForm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Auto-clear toasts
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Toggle network status
  const handleOfflineToggle = (offlineState: boolean) => {
    setIsOffline(offlineState);
    if (offlineState) {
      setNotification('📡 Network Dropout Simulated. Tactical node operating in local buffer mode.');
    } else {
      setNotification('⚡ Live network uplink established. Synchronize files now.');
    }
  };

  // Perform operational synchronization of cached telemetry
  const handleTriggerSync = () => {
    if (syncQueue.length === 0) return;
    setIsSyncing(true);

    setTimeout(() => {
      // Re-integrate queued local telemetry to the live indices
      syncQueue.forEach((queuedItem) => {
        if (queuedItem.action === 'REPORT_INCIDENT') {
          setIncidents((prev) => [queuedItem.data, ...prev]);
        } else if (queuedItem.action === 'UPDATE_INVENTORY') {
          const { centerId, foodPacks, medicalPct, capacityPct } = queuedItem.data;
          setSupplyCenters((prev) =>
            prev.map((c) =>
              c.id === centerId
                ? {
                    ...c,
                    foodPacks,
                    medicalPct,
                    capacityPct,
                    status: foodPacks < c.maxFoodPacks * 0.15 ? 'critical' : foodPacks < c.maxFoodPacks * 0.4 ? 'low' : 'sufficient'
                  }
                : c
            )
          );
        }
      });

      setSyncQueue([]);
      setIsSyncing(false);
      setLastSyncTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' Manila • Current');
      setNotification('✓ Operational files uploaded. Databases synchronized successfully.');
    }, 1500);
  };

  // Dispatch incident report
  const handleAddIncident = (title: string, details: string, severity: 'critical' | 'warning' | 'info', location: string) => {
    const newIncident: Alert = {
      id: `inc-${Date.now()}`,
      timeAgo: '01 MIN AGO',
      title,
      details,
      severity,
      timestamp: new Date()
    };

    if (isOffline) {
      const queuedItem: OfflineSyncItem = {
        id: `sync-${Date.now()}`,
        action: 'REPORT_INCIDENT',
        data: newIncident,
        timestamp: new Date().toISOString()
      };
      setSyncQueue((prev) => [...prev, queuedItem]);
      setNotification('💾 Incident saved in local buffer. Sync required to propagate.');
    } else {
      setIncidents((prev) => [newIncident, ...prev]);
      setNotification('✓ Critical incident transmitted to HQ search operations.');
    }
  };

  // Dispatch logistics routing
  const handleLogisticsRequest = (centerId: string, requestedPacks: number, note: string) => {
    setNotification(`✓ Dispatch routing generated for ${requestedPacks} Food Packs. Code priority assigned.`);
    
    // Increment stock of destination center
    setSupplyCenters((prev) =>
      prev.map((c) => {
        if (c.id === centerId) {
          const updatedFood = Math.min(c.maxFoodPacks, c.foodPacks + requestedPacks);
          return {
            ...c,
            foodPacks: updatedFood,
            status: updatedFood < c.maxFoodPacks * 0.15 ? 'critical' : updatedFood < c.maxFoodPacks * 0.4 ? 'low' : 'sufficient'
          };
        }
        return c;
      })
    );
  };

  // Update inventory level
  const handleUpdateInventory = (centerId: string, foodPacks: number, medicalPct: number, capacityPct: number) => {
    if (isOffline) {
      const queuedItem: OfflineSyncItem = {
        id: `sync-${Date.now()}`,
        action: 'UPDATE_INVENTORY',
        data: { centerId, foodPacks, medicalPct, capacityPct },
        timestamp: new Date().toISOString()
      };
      setSyncQueue((prev) => [...prev, queuedItem]);
      setNotification('💾 Secondary depot inventory queued to local backlog.');
    } else {
      setSupplyCenters((prev) =>
        prev.map((c) =>
          c.id === centerId
            ? {
                ...c,
                foodPacks,
                medicalPct,
                capacityPct,
                status: foodPacks < c.maxFoodPacks * 0.15 ? 'critical' : foodPacks < c.maxFoodPacks * 0.4 ? 'low' : 'sufficient'
              }
            : c
        )
      );
      setNotification('✓ Depot logistics successfully synchronized online.');
    }
  };

  const handleCompleteAssignment = (assignmentId: string) => {
    setAssignments((prev) => prev.map((a) => (a.id === assignmentId ? { ...a, completed: true } : a)));
    setNotification('✓ Assignment marked complete. Task logs uploaded.');
  };

  const handleAddCustomAlert = (title: string, details: string, severity: 'critical' | 'warning' | 'info') => {
    handleAddIncident(title, details, severity, 'Sector 04');
  };

  const handleSendBeaconSms = (phone: string, message: string) => {
    setNotification(`✓ Encrypted satellite SMS transmitted to ${phone}.`);
  };

  // Dropping pin from coordinates shift + click
  const handleDropCustomMapPin = (lat: number, lng: number, title: string) => {
    const newBeacon: Beacon = {
      id: `beac-drop-${Date.now()}`,
      name: title,
      coords: `${lat.toFixed(3)}° N, ${lng.toFixed(3)}° E`,
      dist: 'Custom Plot',
      lastPing: 'JUST NOW',
      pulseColor: 'tertiary',
      latitude: lat,
      longitude: lng
    };
    setBeacons((prev) => [newBeacon, ...prev]);
    setNotification(`📍 Custom telemetry point plotted: ${title}.`);
  };

  const handleToggleSos = () => {
    setIsSosBroadcasting(!isSosBroadcasting);
    if (!isSosBroadcasting) {
      setNotification('🚨 MASSIVE BEACON FORCE PLOTTED. SEARCH CORRIDORS ALERTED.');
    } else {
      setNotification('🚨 SOS beacon set to standby loop.');
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-all duration-300 relative ${
      isSosBroadcasting ? 'ring-12 ring-red-700/50 dark:ring-red-600/50 bg-red-950/20' : ''
    }`}>
      {/* Toast Notification Element */}
      {notification && (
        <div 
          id="toast-notification"
          className="fixed top-20 right-6 z-50 bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slideIn text-xs font-black max-w-sm border-l-4 border-l-red-600"
        >
          <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping animate-bounce" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Application Bar */}
      <nav id="top-app-bar" className="fixed top-0 w-full z-40 bg-slate-900/95 text-white backdrop-blur-md shadow-md border-b border-slate-800 flex justify-between items-center px-6 h-16 transition-colors font-sans">
        <div className="flex items-center gap-3">
          <Siren className="w-5 h-5 text-red-500 animate-pulse" />
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-display font-bold tracking-wider text-white uppercase">
              TACTICAL GUARDIAN
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 font-semibold tracking-widest px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">
              FOUNDRY OS v4.2
            </span>
          </div>
          <div className="hidden md:flex gap-6 ml-8 text-xs font-mono font-semibold tracking-wider uppercase">
            <button
              onClick={() => setActiveTab('map')}
              className={`pb-1 border-b-2 hover:text-red-400 transition-colors ${
                activeTab === 'map' ? 'text-red-400 border-red-500 font-bold' : 'text-slate-400 border-transparent'
              }`}
            >
              DASHBOARD MAP
            </button>
            <button
              onClick={() => setActiveTab('supplies')}
              className={`pb-1 border-b-2 hover:text-red-400 transition-colors ${
                activeTab === 'supplies' ? 'text-red-400 border-red-500 font-bold' : 'text-slate-400 border-transparent'
              }`}
            >
              DEPOT LOGISTICS
            </button>
            <button
              onClick={() => setActiveTab('volunteer')}
              className={`pb-1 border-b-2 hover:text-red-400 transition-colors ${
                activeTab === 'volunteer' ? 'text-red-400 border-red-500 font-bold' : 'text-slate-400 border-transparent'
              }`}
            >
              DEPLOY MODULE
            </button>
          </div>
        </div>

        {/* Global actions top-right */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-md items-center gap-2 font-mono">
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">OFFLINE BUFFER</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">DUPLEX LINKED</span>
              </>
            )}
          </div>

          <button 
            onClick={() => setActiveTab('beacon')}
            className="p-2 text-slate-400 hover:text-white relative hover:bg-slate-800 rounded-lg transition-all border border-slate-800"
            title="Beacon Control Center"
          >
            <Bell className="w-4.5 h-4.5 shrink-0" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
        </div>
      </nav>

      {/* Side Navigation Rails (Desktop Only) */}
      <aside id="side-nav-rail" className="hidden lg:flex fixed left-0 top-16 flex-col h-[calc(100vh-64px)] py-6 px-4 w-72 bg-slate-900 border-r border-slate-800 text-slate-100 z-30 transition-colors">
        <div className="mb-8 px-2">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-red-500" />
            <h2 className="text-base font-display font-bold uppercase tracking-wider text-white">Tactical Command</h2>
          </div>
          <p className="text-[10px] font-mono font-medium text-slate-400 tracking-widest uppercase">NODE: SEC-04 // ID: PH-772</p>
        </div>

        <nav className="flex-grow space-y-1.5 text-xs font-mono font-medium tracking-wider uppercase">
          <button
            onClick={() => setActiveTab('map')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-left transition-all duration-150 border-l-2 ${
              activeTab === 'map'
                ? 'bg-slate-800/90 text-white border-red-500 font-bold shadow-xs'
                : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200 border-transparent'
            }`}
          >
            <Compass className="w-4 h-4 text-red-400 shrink-0" />
            <span>Incident Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('supplies')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-left transition-all duration-150 border-l-2 ${
              activeTab === 'supplies'
                ? 'bg-slate-800/90 text-white border-red-500 font-bold shadow-xs'
                : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200 border-transparent'
            }`}
          >
            <Package2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Supplies List</span>
          </button>

          <button
            onClick={() => setActiveTab('volunteer')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-left transition-all duration-150 border-l-2 ${
              activeTab === 'volunteer'
                ? 'bg-slate-800/90 text-white border-red-500 font-bold shadow-xs'
                : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200 border-transparent'
            }`}
          >
            <Users className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Evacuation Zones</span>
          </button>

          <button
            onClick={() => setActiveTab('comms')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-left transition-all duration-150 border-l-2 ${
              activeTab === 'comms'
                ? 'bg-slate-800/90 text-white border-red-500 font-bold shadow-xs'
                : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200 border-transparent'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Team Comms Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('beacon')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-md text-left transition-all duration-150 border-l-2 ${
              activeTab === 'beacon'
                ? 'bg-slate-800/90 text-white border-red-500 font-bold shadow-xs'
                : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200 border-transparent'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Survivor Beacon</span>
          </button>
        </nav>

        {/* Global SOS trigger at the sidebar base */}
        <button
          onClick={handleToggleSos}
          id="sos-sidebar-trigger"
          className={`mt-auto w-full py-3.5 text-center text-white text-xs font-mono font-bold tracking-widest rounded-md transition-all duration-200 uppercase border active:scale-98 ${
            isSosBroadcasting
              ? 'bg-red-700 border-red-500 ring-2 ring-red-500/50 animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.5)]'
              : 'bg-red-800/90 hover:bg-red-700 border-red-600'
          }`}
        >
          BROADCAST SOS
        </button>
      </aside>

      {/* Main Container */}
      <main className="pt-20 pb-24 lg:pl-80 px-4 sm:px-6 min-h-screen">
        {/* Offline Simulation Top Bar Banner */}
        <OfflineBanner
          isOffline={isOffline}
          setIsOffline={handleOfflineToggle}
          syncQueue={syncQueue}
          triggerSync={handleTriggerSync}
          isSyncing={isSyncing}
          lastSyncTime={lastSyncTime}
        />

        {/* Active Tab Routing Views */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Interactive Tactical Map */}
              <MapWorkspace
                mapImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAOJCCmHmN_NnI4IsHmZOzdIojaF51FieqIn4tp_Lurmhs_OqwxSUPjIpl7UM4XiaLAx3mRLOBWlchSnXl-aZFdMWh2hOKJfGSq33v_w4ab_JoCje4U_w3KZAYtuk3AokbqZcz_Fa8BLvpd9ckDaW1kpTVBeASRWQMY5YMvbiM4esA-tJ-TIfyiLsF02MO5FEIAAnNWA-Il62FRU7ak3zbsG58Dsm4zMn9NMjvtedGbVYPW9goUGPzhhVKZUzbDKgzho_Dzx2lMWgE"
                hazardZone={{
                  title: 'Active Hazard Zone',
                  description: 'Marikina River Basin Corridor',
                  risk: 'SIGNAL NO. 3 - FLOOD RISK TRIGGERED'
                }}
                incidents={incidents}
                supplyCenters={supplyCenters}
                beacons={beacons}
                activeOverlay={activeMapOverlay}
                setActiveOverlay={setActiveMapOverlay}
                onDropPin={handleDropCustomMapPin}
              />

              {/* Critical Alerts sidebar widget */}
              <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-l-red-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xs font-black tracking-widest text-red-700 dark:text-red-400 uppercase">
                      CRITICAL ALERTS FEED
                    </h2>
                    <span className="px-2 py-0.5 bg-red-700 text-white text-[9px] font-black rounded uppercase animate-pulse">
                      LIVE
                    </span>
                  </div>

                  <div className="space-y-5 max-h-[280px] overflow-y-auto pr-1">
                    {incidents.map((inc) => (
                      <div
                        key={inc.id}
                        className="relative pl-3 border-l-2 border-slate-200 dark:border-slate-800 pb-3 hover:border-red-600 transition-colors"
                      >
                        <p className="text-[9px] font-black text-slate-400 font-mono mb-0.5">
                          {inc.timeAgo || 'SEC AGO'}
                        </p>
                        <h4 className="font-extrabold text-sm text-slate-850 dark:text-white leading-tight">
                          {inc.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {inc.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Action Bento Grid Cards */}
                <div className="grid grid-cols-2 gap-4 h-full">
                  <button
                    id="trigger-incident-form-btn"
                    onClick={() => setShowIncidentForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-2xl flex flex-col justify-between hover:opacity-95 active:scale-95 transition-all text-left shadow-sm shrink-0"
                  >
                    <AlertTriangle className="w-7 h-7 text-white" />
                    <span className="font-black text-[10px] tracking-wider uppercase mt-4">Report New Incident</span>
                  </button>

                  <button
                    id="trigger-logistics-form-btn"
                    onClick={() => setShowLogisticsForm(true)}
                    className="bg-slate-200 dark:bg-slate-900 hover:bg-slate-300 dark:hover:bg-slate-850 text-slate-900 dark:text-slate-100 p-6 rounded-2xl flex flex-col justify-between active:scale-95 transition-all text-left border border-slate-200 dark:border-slate-800 shadow-xs shrink-0"
                  >
                    <Package2 className="w-7 h-7 text-blue-500 animate-bounce" />
                    <span className="font-black text-[10px] tracking-wider uppercase mt-4">Request Logistics</span>
                  </button>
                </div>
              </section>
            </div>

            {/* Team status dashboard section */}
            <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors">
              <header className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xs font-black tracking-widest text-slate-900 dark:text-slate-100 uppercase">
                  ACTIVE RESPONSE TEAMS STATUS
                </h3>
                <div className="flex gap-4 font-mono text-[9px] font-black">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    24 ACTIVE units
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    12 STANDBY units
                  </span>
                </div>
              </header>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-[10px]"
                    />
                    <div>
                      <h4 className="font-black text-xs text-slate-850 dark:text-white">{member.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{member.role}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[8px] font-black rounded dark:bg-blue-950/20 dark:text-blue-400">
                        {member.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'supplies' && (
          <SuppliesTracker
            supplyCenters={supplyCenters}
            updateInventory={handleUpdateInventory}
            isOffline={isOffline}
          />
        )}

        {activeTab === 'volunteer' && (
          <VolunteerDeployment
            assignments={assignments}
            onCompleteAssignment={handleCompleteAssignment}
            onAddAlert={handleAddCustomAlert}
            isOffline={isOffline}
          />
        )}

        {activeTab === 'comms' && (
          <TeamComms
            teamMembers={teamMembers}
            isOffline={isOffline}
          />
        )}

        {activeTab === 'beacon' && (
          <BeaconMonitor
            beacons={beacons}
            isSosBroadcasting={isSosBroadcasting}
            toggleSosBroadcast={handleToggleSos}
            onSendSms={handleSendBeaconSms}
          />
        )}
      </main>

      {/* Bottom Navigation Bars (Mobile/Tablet Handheld devices) */}
      <nav id="bottom-bar-mobile" className="md:hidden fixed bottom-0 w-full z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-100 dark:border-slate-900 flex justify-around items-center h-20 pb-safe px-3 transition-colors">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg active:scale-90 transition-transform ${
            activeTab === 'map'
              ? 'text-red-700 dark:text-red-500 bg-red-50 dark:bg-red-950/20 font-black'
              : 'text-slate-400 dark:text-slate-400'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase mt-1">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('supplies')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg active:scale-90 transition-transform ${
            activeTab === 'supplies'
              ? 'text-red-700 dark:text-red-500 bg-red-50 dark:bg-red-950/20 font-black'
              : 'text-slate-400 dark:text-slate-400'
          }`}
        >
          <Package2 className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase mt-1">Resources</span>
        </button>

        <button
          onClick={() => setActiveTab('volunteer')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg active:scale-90 transition-transform ${
            activeTab === 'volunteer'
              ? 'text-red-700 dark:text-red-500 bg-red-50 dark:bg-red-950/20 font-black'
              : 'text-slate-400 dark:text-slate-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase mt-1">Volunteer</span>
        </button>

        <button
          onClick={() => setActiveTab('comms')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg active:scale-90 transition-transform ${
            activeTab === 'comms'
              ? 'text-red-700 dark:text-red-500 bg-red-50 dark:bg-red-950/20 font-black'
              : 'text-slate-400 dark:text-slate-400'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase mt-1">Comms</span>
        </button>

        <button
          onClick={() => setActiveTab('beacon')}
          className={`flex flex-col items-center justify-center p-2.5 rounded-lg active:scale-90 transition-transform ${
            activeTab === 'beacon'
              ? 'text-red-700 dark:text-red-500 bg-red-50 dark:bg-red-950/20 font-black'
              : 'text-slate-400 dark:text-slate-400'
          }`}
        >
          <Radio className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase mt-1">Locator</span>
        </button>
      </nav>

      {/* Floating emergency FAB for quick panic loop */}
      <button
        onClick={handleToggleSos}
        id="floating-emergency-fab"
        className={`fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-40 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 active:scale-95 ${
          isSosBroadcasting
            ? 'bg-red-800 animate-pulse ring-4 ring-red-500/50 text-white'
            : 'bg-red-700 hover:bg-red-800 text-white'
        }`}
        title="Broadcast SOS Beacon Alert"
      >
        <Siren className="w-7 h-7" />
      </button>

      {/* Overlay Reporting Modals */}
      {showIncidentForm && (
        <ReportIncidentForm
          onClose={() => setShowIncidentForm(false)}
          onSubmit={handleAddIncident}
          isOffline={isOffline}
        />
      )}

      {showLogisticsForm && (
        <RequestLogisticsForm
          supplyCenters={supplyCenters}
          onClose={() => setShowLogisticsForm(false)}
          onSubmit={handleLogisticsRequest}
        />
      )}
    </div>
  );
}
