import React, { useState } from 'react';
import { AlertTriangle, Send, Package2, ShieldAlert, CheckCircle, Smartphone } from 'lucide-react';
import { Alert, SupplyCenter } from '../types';

interface ReportIncidentFormProps {
  onClose: () => void;
  onSubmit: (title: string, details: string, severity: 'critical' | 'warning' | 'info', location: string) => void;
  isOffline: boolean;
}

export function ReportIncidentForm({ onClose, onSubmit, isOffline }: ReportIncidentFormProps) {
  const [type, setType] = useState('Structural Hazard');
  const [municipality, setMunicipality] = useState('Marikina City');
  const [details, setDetails] = useState('');
  const [severity, setSeverity] = useState<'critical' | 'warning' | 'info'>('critical');
  const [coordinates, setCoordinates] = useState('14.6284, 121.1018');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;
    
    const title = `${type}: ${municipality}`;
    onSubmit(title, details, severity, municipality);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp">
        <div className="bg-red-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <h3 className="font-black text-sm tracking-widest uppercase">TACTICAL REPORTING FORM</h3>
          </div>
          <button id="close-incident-form" onClick={onClose} className="text-white hover:text-slate-200 font-bold text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isOffline && (
            <div className="bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 flex gap-2">
              <Smartphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-800 dark:text-amber-400 font-bold leading-normal">
                OFFLINE QUEUE ACTIVE: Incident will be written locally and synchronized when online connection is restored.
              </p>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Hazard/Incident Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 border-none rounded-lg p-3 text-xs font-semibold focus:ring-2 focus:ring-red-600"
            >
              <option>Structural Hazard</option>
              <option>Resource Shortage</option>
              <option>Medical Urgent</option>
              <option>Road Blockage</option>
              <option>Flash Flood</option>
              <option>Power Outage</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Sector / Location
            </label>
            <input
              type="text"
              value={municipality}
              onChange={(e) => setMunicipality(e.target.value)}
              placeholder="e.g. Barangay Tumana, Marikina"
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 border-none rounded-lg p-3 text-xs font-semibold focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Risk Tier
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 border-none rounded-lg p-3 text-xs font-semibold focus:ring-2 focus:ring-red-600"
              >
                <option value="critical">Critical (Red)</option>
                <option value="warning">Low Stock/Warn (Orange)</option>
                <option value="info">General Info (Blue)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                GPS Lat, Lng
              </label>
              <input
                type="text"
                value={coordinates}
                onChange={(e) => setCoordinates(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 border-none rounded-lg p-3 text-xs font-semibold focus:ring-2 focus:ring-red-600 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Chronicle Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe situation limits, water depth, structure status, casualties..."
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 border-none rounded-lg p-3 text-xs font-semibold h-24 focus:ring-2 focus:ring-red-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-700 hover:bg-red-800 text-white font-black py-3.5 rounded-lg flex items-center justify-center gap-2 tracking-widest text-xs uppercase shadow-lg active:scale-95 duration-100 mt-2"
          >
            <Send className="w-4 h-4" />
            <span>TRANSMIT TACTICAL REPORT</span>
          </button>
        </form>
      </div>
    </div>
  );
}

interface RequestLogisticsFormProps {
  supplyCenters: SupplyCenter[];
  onClose: () => void;
  onSubmit: (centerId: string, requestedPacks: number, note: string) => void;
}

export function RequestLogisticsForm({ supplyCenters, onClose, onSubmit }: RequestLogisticsFormProps) {
  const [selectedCenterId, setSelectedCenterId] = useState(supplyCenters[0]?.id || '');
  const [amount, setAmount] = useState(250);
  const [category, setCategory] = useState('Food Packs');
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedCenterId, amount, `${category} requested: ${note}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-scaleUp">
        <div className="bg-slate-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package2 className="w-5 h-5 text-blue-400" />
            <h3 className="font-black text-sm tracking-widest uppercase">REQUEST LOGISTICS DISPATCH</h3>
          </div>
          <button id="close-logistics-form" onClick={onClose} className="text-white hover:text-slate-200 font-bold text-lg">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Select Destination Depot / Center
            </label>
            <select
              value={selectedCenterId}
              onChange={(e) => setSelectedCenterId(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 border-none rounded-lg p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-600"
            >
              {supplyCenters.map(center => (
                <option key={center.id} value={center.id}>
                  {center.name} ({center.barangay}, {center.municipality})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Material Class
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 border-none rounded-lg p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-600"
              >
                <option>Food Packs</option>
                <option>Medical Supplies</option>
                <option>Shelter Kits / Tarps</option>
                <option>Hygiene Packs</option>
                <option>Bottled Water Crates</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                Requested Volume
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 border-none rounded-lg p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-600"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
              Justification / Dispatch Directives
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Provide context for shipment, expected arrival threshold, local contact name..."
              className="w-full bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-slate-100 border-none rounded-lg p-3 text-xs font-semibold h-24 focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-black py-3.5 rounded-lg flex items-center justify-center gap-2 tracking-widest text-xs uppercase shadow-lg active:scale-95 duration-100 mt-2"
          >
            <Package2 className="w-4 h-4 text-blue-400 animate-bounce" />
            <span>TRANSMIT LOGISTICS ROUTING</span>
          </button>
        </form>
      </div>
    </div>
  );
}
