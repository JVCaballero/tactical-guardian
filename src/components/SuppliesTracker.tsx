import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle, Package, Edit, ShieldAlert } from 'lucide-react';
import { SupplyCenter } from '../types';

interface SuppliesTrackerProps {
  supplyCenters: SupplyCenter[];
  updateInventory: (centerId: string, foodPacks: number, medicalPct: number, capacityPct: number) => void;
  isOffline: boolean;
}

export default function SuppliesTracker({
  supplyCenters,
  updateInventory,
  isOffline,
}: SuppliesTrackerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'food' | 'medical' | 'shelter'>('all');
  const [editingCenter, setEditingCenter] = useState<SupplyCenter | null>(null);

  // Editing state fields
  const [editFood, setEditFood] = useState(0);
  const [editMedical, setEditMedical] = useState(0);
  const [editCapacity, setEditCapacity] = useState(0);

  // Filter and Search centers
  const filteredCenters = supplyCenters.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.barangay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.municipality.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Filter logic
    if (activeFilter === 'food') return center.foodPacks < center.maxFoodPacks * 0.4;
    if (activeFilter === 'medical') return center.medicalPct < 50;
    if (activeFilter === 'shelter') return center.capacityPct > 85; // highly occupied implies high shelter constraint

    return true;
  });

  const startEditing = (center: SupplyCenter) => {
    setEditingCenter(center);
    setEditFood(center.foodPacks);
    setEditMedical(center.medicalPct);
    setEditCapacity(center.capacityPct);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCenter) {
      updateInventory(editingCenter.id, editFood, editMedical, editCapacity);
      setEditingCenter(null);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[calc(100vh-180px)]">
      {/* List Panel */}
      <section className="w-full lg:w-[480px] flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Filter Toolbar */}
        <div className="p-6 space-y-4 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900">
          <div className="space-y-1">
            <h2 className="text-xl font-display font-bold tracking-wider text-slate-900 dark:text-slate-100 uppercase">
              RESOURCE TRACKER
            </h2>
            <p className="text-xs font-mono font-medium text-slate-500">
              REAL-TIME DEPOT TELEMETRY // REGION IV-A
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="relative font-mono">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Barangay or Municipality..."
                className="w-full pl-10 pr-16 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-md text-xs font-semibold focus:ring-2 focus:ring-slate-700 placeholder:text-slate-400 text-slate-900 dark:text-slate-100"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                LOCAL DB
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none font-mono">
              <button
                onClick={() => setActiveFilter('all')}
                className={`whitespace-nowrap px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                All Supplies
              </button>
              <button
                onClick={() => setActiveFilter('food')}
                className={`whitespace-nowrap px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                  activeFilter === 'food'
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Under-Supplied
              </button>
              <button
                onClick={() => setActiveFilter('medical')}
                className={`whitespace-nowrap px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md transition-colors ${
                  activeFilter === 'medical'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                Medical Alert
              </button>
            </div>
          </div>
        </div>

        {/* Center Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
          {filteredCenters.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-950 rounded-lg p-6 border border-dashed border-slate-200 dark:border-slate-800">
              <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-bold uppercase">No depots found matching search query</p>
            </div>
          ) : (
            filteredCenters.map((center) => {
              // Calculate status tags
              const isCrit = center.foodPacks < center.maxFoodPacks * 0.15 || center.medicalPct < 20;
              const isLow = !isCrit && (center.foodPacks < center.maxFoodPacks * 0.4 || center.medicalPct < 50);
              const isSufficient = !isCrit && !isLow;

              return (
                <div
                  key={center.id}
                  className={`bg-white dark:bg-slate-950 p-5 rounded-xl border-l-4 shadow-xs relative transition-all duration-250 hover:-translate-y-[2px] ${
                    isCrit 
                      ? 'border-red-600' 
                      : isLow 
                      ? 'border-amber-600' 
                      : 'border-emerald-600'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest inline-block mb-1 px-1.5 py-0.5 rounded ${
                          isCrit
                            ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400'
                            : isLow
                            ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'
                            : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {isCrit ? 'Critical Stock' : isLow ? 'Low Stock' : 'Sufficient'}
                      </span>
                      <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-slate-100">
                        {center.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {center.barangay}, {center.municipality}
                      </p>
                    </div>

                    <button
                      onClick={() => startEditing(center)}
                      className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded transition-colors"
                      title="Update inventory values"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Grid of Values */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Food Packs</p>
                      <p
                        className={`text-sm font-black ${
                          center.foodPacks < center.maxFoodPacks * 0.2 ? 'text-red-600' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {center.foodPacks} <span className="text-[10px] text-slate-400 font-semibold">/ {center.maxFoodPacks}</span>
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Medical Eqp</p>
                      <p
                        className={`text-sm font-black ${
                          center.medicalPct < 30 ? 'text-amber-600' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {center.medicalPct}%
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Capacity</p>
                      <p className="text-sm font-black text-slate-900 dark:text-slate-100">{center.capacityPct}%</p>
                    </div>
                  </div>

                  <button
                    onClick={() => startEditing(center)}
                    className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-black uppercase tracking-widest rounded-lg transition-transform active:scale-[0.98]"
                  >
                    UPDATE INVENTORY (OFFLINE OK)
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Map Segment / Stats */}
      <section className="flex-1 relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[350px]">
        {/* Map Image Hotlink */}
        <div 
          className="absolute inset-0 bg-cover bg-center grayscale contrast-[1.1] opacity-75"
          style={{ 
            backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCer9MiebMtYKbWNfVUKvTqZK7vQg2EBsuyefuQV-J4kP_JEKwF6DMKZrebi8uIobvzaplBUQWEWcIvE12BPuKfJ28n100AlCbeX8y7ZlscUP-bxMcH8WRPLmd3biFdOMH_itOvhWIukiTFHfjImXnTdOyd6Lvk1JXFNbg5nb8HUPFc7qi2aS-qF6i9rCIxTbJRCWB_ZHbUh9-hRb0MVnLhr6xwtmbaSCtHwQzogY_LYG4rCoytoRqBJKCcFfbxwe8MvVfuH4EosP0')" 
          }}
        />

        {/* Map HUD Overlay */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-3.5 py-3 rounded-lg shadow-xl border-l-4 border-blue-600">
            <span className="text-[9px] font-black uppercase text-blue-600 tracking-wider">Depot Locations</span>
            <p className="text-sm font-black text-slate-900 dark:text-slate-100">Laguna Disaster Command</p>
          </div>
        </div>

        {/* Active Pins */}
        <div className="absolute top-1/4 left-1/3 z-10 group cursor-pointer">
          <div className="relative">
            <div className="absolute w-8 h-8 bg-red-600 rounded-full animate-ping opacity-25"></div>
            <div className="relative w-6 h-6 bg-red-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded shadow whitespace-nowrap mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
              SAN PEDRO DEPO
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 z-10 group cursor-pointer">
          <div className="relative">
            <div className="relative w-6 h-6 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded shadow whitespace-nowrap mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
              RESOURCES DISPATCH CENTER
            </div>
          </div>
        </div>

        {/* Legend Panel overlay */}
        <div className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-950/95 p-4 rounded-xl shadow-xl max-w-xs border border-slate-100 dark:border-slate-900">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-3">Map Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-red-600 rounded text-white flex items-center justify-center text-[8px] font-black">C</div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Critical Supply (Below 10%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-amber-600 rounded text-white flex items-center justify-center text-[8px] font-black">L</div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Low Supply (10-40%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-emerald-600 rounded text-white flex items-center justify-center text-[8px] font-black">S</div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Sufficient (Above 40%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Editing overlay modal (OFFLINE INVENTORY EDIT) */}
      {editingCenter && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-scaleUp">
            <header className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-black text-sm tracking-widest uppercase text-blue-600">UPDATE DEPO INVENTORY</h3>
                <p className="text-xs font-bold text-slate-500">{editingCenter.name}</p>
              </div>
              <button onClick={() => setEditingCenter(null)} className="text-slate-400 font-bold text-lg hover:text-slate-600">✕</button>
            </header>

            <form onSubmit={handleUpdate} className="space-y-4">
              {isOffline && (
                <div className="bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                  <p className="text-[10px] text-amber-800 dark:text-amber-400 font-bold">
                    📡 SYNC DELAYED: Editing will write to local cache queue, synchronized later.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Food Packs Stock (Critical Threshold)
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={editFood}
                    onChange={(e) => setEditFood(parseInt(e.target.value) || 0)}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-2.5 text-xs font-bold focus:ring-2 focus:ring-blue-600 text-slate-950 dark:text-slate-100"
                    min="0"
                    max={editingCenter.maxFoodPacks}
                  />
                  <span className="text-xs font-semibold text-slate-400 font-mono">/ {editingCenter.maxFoodPacks} MAX</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Medical Supplies Level (%)
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    value={editMedical}
                    min="0"
                    max="100"
                    onChange={(e) => setEditMedical(parseInt(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-xs font-sans font-black bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded min-w-[50px] text-center text-slate-900 dark:text-slate-100">
                    {editMedical}%
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Shelter Occupancy Capacity (%)
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    value={editCapacity}
                    min="0"
                    max="100"
                    onChange={(e) => setEditCapacity(parseInt(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-xs font-sans font-black bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded min-w-[50px] text-center text-slate-900 dark:text-slate-100">
                    {editCapacity}%
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCenter(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black tracking-widest text-[10px] py-3.5 rounded-lg uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black tracking-widest text-[10px] py-3.5 rounded-lg uppercase shadow-lg active:scale-95 duration-100"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
