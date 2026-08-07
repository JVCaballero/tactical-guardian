import React, { useState } from 'react';
import { Layers, Compass, Pin, Crosshair, AlertTriangle, Home, Hammer, Eye, EyeOff, Sparkles } from 'lucide-react';
import { SupplyCenter, Beacon, Alert } from '../types';

interface MapWorkspaceProps {
  mapImage: string;
  hazardZone: {
    title: string;
    description: string;
    risk: string;
  };
  incidents: Alert[];
  supplyCenters: SupplyCenter[];
  beacons: Beacon[];
  activeOverlay: 'incidents' | 'units' | 'evac' | 'all';
  setActiveOverlay: (overlay: 'incidents' | 'units' | 'evac' | 'all') => void;
  onDropPin?: (lat: number, lng: number, title: string) => void;
}

export default function MapWorkspace({
  mapImage,
  hazardZone,
  incidents,
  supplyCenters,
  beacons,
  activeOverlay,
  setActiveOverlay,
  onDropPin,
}: MapWorkspaceProps) {
  const [isNightVision, setIsNightVision] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<{
    type: 'incident' | 'supply' | 'beacon';
    id: string;
    title: string;
    desc: string;
    x: number;
    y: number;
  } | null>(null);

  // Pre-configured marker coordinates to ensure stable overlay positioning relative to the background
  const initialMarkers = [
    { id: 'inc-1', type: 'incident', title: 'Flash Flood: Tumana', desc: 'Water levels at critical 18.2m.', x: 35, y: 28, visible: activeOverlay === 'all' || activeOverlay === 'incidents' },
    { id: 'inc-2', type: 'incident', title: 'Structure Collapse', desc: 'Commercial block down. Rescue team Echo deployed.', x: 70, y: 56, visible: activeOverlay === 'all' || activeOverlay === 'incidents' },
    { id: 'inc-3', type: 'incident', title: 'Power Outage', desc: 'Grid failure under investigation.', x: 50, y: 78, visible: activeOverlay === 'all' || activeOverlay === 'incidents' },
    
    { id: 'sup-1', type: 'supply', title: 'San Pedro Gym', desc: 'Critical supply level. Food packs 12/500.', x: 42, y: 46, visible: activeOverlay === 'all' || activeOverlay === 'evac' },
    { id: 'sup-2', type: 'supply', title: 'Biñan Evac Center', desc: 'Low supply. Food packs 140/800.', x: 25, y: 62, visible: activeOverlay === 'all' || activeOverlay === 'evac' },
    
    { id: 'beac-1', type: 'beacon', title: 'Beacon: Alpha-1', desc: 'Survivor signal (USER_7731). Dist: 1.2 KM.', x: 60, y: 38, visible: activeOverlay === 'all' || activeOverlay === 'units' },
    { id: 'beac-2', type: 'beacon', title: 'Beacon: Beta-9', desc: 'Survivor signal (USER_0411). Dist: 3.8 KM.', x: 80, y: 72, visible: activeOverlay === 'all' || activeOverlay === 'units' },
  ];

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if clicking close to the map
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const yPct = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // If clicking on general ground, clear popup
    if ((e.target as HTMLElement).tagName === 'IMG') {
      setSelectedMarker(null);
      
      // Feature: drop custom pin on double/shift click
      if (e.shiftKey && onDropPin) {
        const dummyLat = (14.5 + (0.1 * (yPct / 100))).toFixed(4);
        const dummyLng = (121.0 + (0.1 * (xPct / 100))).toFixed(4);
        onDropPin(parseFloat(dummyLat), parseFloat(dummyLng), `Custom Waypoint #${Math.floor(Math.random() * 1000)}`);
      }
    }
  };

  return (
    <section className={`col-span-12 lg:col-span-8 h-[500px] relative rounded-xl overflow-hidden bg-slate-900 border shadow-inner group transition-all duration-300 ${
      isNightVision 
        ? 'border-emerald-500/80 ring-2 ring-emerald-500/80 shadow-[0_0_30px_rgba(16,185,129,0.35)]' 
        : 'border-slate-200 dark:border-slate-800'
    }`}>
      {/* Interactive Map Visual */}
      <div 
        id="tactical-map-container"
        className="absolute inset-0 cursor-crosshair select-none"
        onClick={handleMapClick}
      >
        <img 
          src={mapImage} 
          alt="Tactical Map Overlay"
          className={`w-full h-full object-cover grayscale contrast-[1.3] opacity-75 object-center transition-all duration-300 ${
            isNightVision ? 'brightness-[1.1]' : ''
          }`}
          style={isNightVision ? { filter: 'sepia(100%) hue-rotate(85deg) saturate(500%) contrast(180%) brightness(85%)' } : undefined}
        />
        
        {/* CRT Scanline & Phosphor Overlay when Night Vision is Active */}
        {isNightVision && (
          <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(rgba(16,185,129,0.12)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] mix-blend-overlay opacity-90" />
        )}
        
        {/* Dynamic Map Pins */}
        {initialMarkers.map((marker) => {
          if (!marker.visible) return null;

          return (
            <div
              key={marker.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMarker({
                  type: marker.type as any,
                  id: marker.id,
                  title: marker.title,
                  desc: marker.desc,
                  x: marker.x,
                  y: marker.y,
                });
              }}
              style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 p-2 cursor-pointer z-20 group"
            >
              {/* Pulsing halo */}
              <div 
                className={`absolute inset-0 rounded-full animate-ping opacity-35 ${
                  isNightVision
                    ? 'bg-emerald-400'
                    : marker.type === 'incident' ? 'bg-red-500' : marker.type === 'supply' ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ animationDuration: marker.type === 'incident' ? '1.5s' : '3s' }}
              />

              <div 
                className={`relative w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform hover:scale-125 duration-250 ${
                  isNightVision
                    ? 'bg-emerald-600 text-slate-950 border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.8)] font-black'
                    : marker.type === 'incident' 
                    ? 'bg-red-600 text-white' 
                    : marker.type === 'supply' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-blue-600 text-white'
                }`}
              >
                {marker.type === 'incident' && <AlertTriangle className="w-3.5 h-3.5" />}
                {marker.type === 'supply' && <Home className="w-3.5 h-3.5" />}
                {marker.type === 'beacon' && <Crosshair className="w-3.5 h-3.5 animate-pulse" />}
              </div>
            </div>
          );
        })}

        {/* Selected Marker Detail Card Inside Map */}
        {selectedMarker && (
          <div 
            style={{ 
              left: `${selectedMarker.x}%`, 
              top: `${selectedMarker.y}%` 
            }}
            id="map-popup-card"
            className={`absolute -translate-x-1/2 -translate-y-[115%] p-4 rounded-lg shadow-xl border-l-4 z-40 max-w-[240px] pointer-events-auto animate-slideUp ${
              isNightVision
                ? 'bg-emerald-950 text-emerald-100 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-red-600'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <h4 className={`text-xs font-black uppercase tracking-tight ${isNightVision ? 'text-emerald-400' : 'text-red-600'}`}>
                {selectedMarker.title}
              </h4>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMarker(null);
                }}
                className={`${isNightVision ? 'text-emerald-400 hover:text-emerald-200' : 'text-slate-400 hover:text-slate-600'} font-bold text-xs pl-2`}
              >
                ✕
              </button>
            </div>
            <p className={`text-[11px] font-semibold leading-snug ${isNightVision ? 'text-emerald-200' : 'text-slate-600 dark:text-slate-300'}`}>
              {selectedMarker.desc}
            </p>
            <div className={`mt-2 text-[9px] font-mono px-1.5 py-0.5 rounded flex items-center justify-between ${
              isNightVision ? 'bg-emerald-900/50 text-emerald-300' : 'text-slate-400 bg-slate-50 dark:bg-slate-800'
            }`}>
              <span>COORD: {(14.5 + selectedMarker.y / 500).toFixed(4)}, {(121.0 + selectedMarker.x / 500).toFixed(4)}</span>
              <span className="font-bold">GRID SEC-4</span>
            </div>
          </div>
        )}
      </div>

      {/* Map Active Hazard Overlay - Top Left */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none z-30">
        <div className={`backdrop-blur-md p-4 rounded shadow-xl border-l-4 pointer-events-auto max-w-xs transition-colors ${
          isNightVision
            ? 'bg-emerald-950/90 text-emerald-100 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            : 'bg-white/95 dark:bg-slate-900/95 border-red-600'
        }`}>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className={`text-xs font-black tracking-tighter uppercase ${isNightVision ? 'text-emerald-400' : 'text-red-600'}`}>
              {hazardZone.title}
            </h3>
            {isNightVision && (
              <span className="bg-emerald-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                NVG ON
              </span>
            )}
          </div>
          <p className={`text-base font-black leading-tight ${isNightVision ? 'text-emerald-100' : 'text-slate-900 dark:text-slate-100'}`}>
            {hazardZone.description}
          </p>
          <p className={`text-[9px] font-black tracking-wider uppercase mt-1 ${isNightVision ? 'text-emerald-400' : 'text-slate-500'}`}>
            {hazardZone.risk}
          </p>
        </div>

        {/* Map Control Cluster - Top Right */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Night Vision Toggle Button */}
          <button 
            id="toggle-night-vision-btn"
            onClick={() => setIsNightVision(!isNightVision)}
            className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center active:scale-95 transition-all border ${
              isNightVision
                ? 'bg-emerald-500 text-slate-950 border-emerald-300 font-black animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.6)]'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-700'
            }`}
            title={isNightVision ? 'Disable Tactical Night-Vision' : 'Enable Tactical Night-Vision (NVG)'}
          >
            {isNightVision ? <Eye className="w-5 h-5 text-slate-950" /> : <EyeOff className="w-5 h-5 text-slate-600 dark:text-slate-300" />}
          </button>

          <button 
            onClick={() => setActiveOverlay(activeOverlay === 'all' ? 'incidents' : activeOverlay === 'incidents' ? 'units' : activeOverlay === 'units' ? 'evac' : 'all')}
            className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center active:scale-95 transition-all border ${
              isNightVision
                ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/50 hover:bg-emerald-900'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-900 dark:text-blue-200 border-slate-100 dark:border-slate-700'
            }`}
            title="Toggle Map Overlays"
          >
            <Layers className={`w-5 h-5 ${isNightVision ? 'text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`} />
          </button>
          
          <button 
            onClick={() => setSelectedMarker(null)}
            className={`w-10 h-10 rounded-lg shadow-lg flex items-center justify-center active:scale-95 transition-all border ${
              isNightVision
                ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/50 hover:bg-emerald-900'
                : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-blue-900 dark:text-blue-200 border-slate-100 dark:border-slate-700'
            }`}
            title="Recenter Radar Canvas"
          >
            <Compass className={`w-5 h-5 animate-spin-slow ${isNightVision ? 'text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`} />
          </button>
        </div>
      </div>

      {/* Map Interactive Filter Overlay - Bottom Row */}
      <div className={`absolute bottom-4 left-4 px-4 py-3 rounded-lg backdrop-blur-md shadow-xl pointer-events-auto border z-30 ${
        isNightVision
          ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
          : 'bg-slate-950/90 border-slate-800 text-white'
      }`}>
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black tracking-widest uppercase">
          <span className={isNightVision ? 'text-emerald-400 font-bold' : 'text-slate-400 font-bold'}>Overlays:</span>
          
          <button
            onClick={() => setActiveOverlay('all')}
            className={`flex items-center gap-1.5 transition-all px-1.5 py-0.5 rounded ${
              activeOverlay === 'all' 
                ? isNightVision ? 'text-emerald-300 font-black bg-emerald-800/50' : 'text-red-500 font-black bg-white/10' 
                : isNightVision ? 'text-emerald-400/80 hover:text-emerald-200' : 'text-slate-300 hover:text-white'
            }`}
          >
            All Areas
          </button>

          <button
            onClick={() => setActiveOverlay('incidents')}
            className={`flex items-center gap-1.5 transition-all px-1.5 py-0.5 rounded ${
              activeOverlay === 'incidents' 
                ? isNightVision ? 'text-emerald-300 font-black bg-emerald-800/50' : 'text-red-500 font-black bg-white/10' 
                : isNightVision ? 'text-emerald-400/80 hover:text-emerald-200' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full inline-block ${isNightVision ? 'bg-emerald-400 animate-pulse' : 'bg-red-600'}`} />
            Incidents ({incidents.length})
          </button>

          <button
            onClick={() => setActiveOverlay('units')}
            className={`flex items-center gap-1.5 transition-all px-1.5 py-0.5 rounded ${
              activeOverlay === 'units' 
                ? isNightVision ? 'text-emerald-300 font-black bg-emerald-800/50' : 'text-blue-500 font-black bg-white/10' 
                : isNightVision ? 'text-emerald-400/80 hover:text-emerald-200' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full inline-block ${isNightVision ? 'bg-emerald-400 animate-pulse' : 'bg-blue-600'}`} />
            Units ({beacons.length})
          </button>

          <button
            onClick={() => setActiveOverlay('evac')}
            className={`flex items-center gap-1.5 transition-all px-1.5 py-0.5 rounded ${
              activeOverlay === 'evac' 
                ? isNightVision ? 'text-emerald-300 font-black bg-emerald-800/50' : 'text-amber-500 font-black bg-white/10' 
                : isNightVision ? 'text-emerald-400/80 hover:text-emerald-200' : 'text-slate-300 hover:text-white'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full inline-block ${isNightVision ? 'bg-emerald-400 animate-pulse' : 'bg-amber-600'}`} />
            Centers ({supplyCenters.length})
          </button>

          <button
            onClick={() => setIsNightVision(!isNightVision)}
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all ml-auto font-black tracking-widest ${
              isNightVision
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>NVG {isNightVision ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
      
      {/* Double click instruction watermark */}
      <div className={`absolute bottom-4 right-4 text-[9px] font-bold tracking-widest px-2 py-1 rounded z-30 ${
        isNightVision ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/40' : 'bg-slate-900/80 text-slate-400 dark:text-slate-500'
      }`}>
        SHIFT + CLICK TO DROP WAYPOINT
      </div>
    </section>
  );
}
