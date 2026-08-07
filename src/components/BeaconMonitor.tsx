import React, { useState } from 'react';
import { Radio, AlertTriangle, MessageSquare, Compass, Send, CheckCircle, Crosshair } from 'lucide-react';
import { Beacon } from '../types';

interface BeaconMonitorProps {
  beacons: Beacon[];
  isSosBroadcasting: boolean;
  toggleSosBroadcast: () => void;
  onSendSms: (phone: string, message: string) => void;
}

export default function BeaconMonitor({
  beacons,
  isSosBroadcasting,
  toggleSosBroadcast,
  onSendSms,
}: BeaconMonitorProps) {
  const [smsPhone, setSmsPhone] = useState('911-TACTICAL');
  const [smsMessage, setSmsMessage] = useState('CRITICAL RESCUE EN ROUTE');
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsConfirmToast, setSmsConfirmToast] = useState(false);

  const handleSmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim()) return;

    onSendSms(smsPhone, smsMessage);
    setSmsConfirmToast(true);
    setSmsMessage('');
    setTimeout(() => {
      setSmsConfirmToast(false);
      setShowSmsModal(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header telemetry details */}
      <header className="mb-4">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-red-700 dark:text-red-500 uppercase">
          Tactical Command Radar
        </h1>
        <p className="text-blue-900 dark:text-blue-200 font-extrabold text-xs tracking-wider uppercase mt-1 font-mono">
          RESPONDER ID: PH-772 • FIELD OPERATION SECTOR 04
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grayscale Radar Simulator Map */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden relative min-h-[420px] lg:min-h-[600px] shadow-lg">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2H5RqBuCIkG6Buc8JDKm9Qbhb57xprjrZudOGhsGl_b95MUek3kABg6GkulYCHWRs4TcY_Y5WLq7-iZ6UzzWzLWwqd9KIXnSdsuCWg5XNG5rQHMWuHnxPM3Q1K2DvLtaV9EWHBmSLCxuLE4YAULCW0o1RDeIieecBvEOk6fCtJIVsrk5oRucvysD1Ni9wfsCkNGv1cePfM1CoBoJBFLqwL7hn1MiHN9ZucRsrAu6FJl3XqxJm3SvGdoYKHSMSger-fR2Z_q7bo_I"
            alt="Tactical Topographical Coastal Mesh Map"
            className="w-full h-full object-cover grayscale contrast-125 opacity-40 mix-blend-lighten object-center"
          />

          {/* Compass layout grids */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[85%] h-[85%] border-2 border-red-900/10 rounded-full flex items-center justify-center">
              <div className="w-[65%] h-[65%] border border-red-900/10 rounded-full flex items-center justify-center">
                <div className="w-[35%] h-[35%] border border-red-900/5 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                </div>
              </div>
            </div>
            {/* Direct vertical vertical alignment lines */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-red-900/5" />
            <div className="absolute left-0 right-0 h-[1px] bg-red-900/5" />
          </div>

          {/* Real-time Beacons Pins Overlay on Radar Map */}
          {beacons.map((beacon) => (
            <div
              key={beacon.id}
              style={{
                left: `${15 + beacon.latitude * 5.5}%`,
                top: `${80 - beacon.longitude * 4.5}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
            >
              <div className="relative">
                {/* Ping rings */}
                <span className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                  beacon.pulseColor === 'primary' ? 'bg-red-600' : 'bg-amber-600'
                }`} />
                
                <div className={`relative h-7 w-7 rounded-full border-2 border-white flex items-center justify-center text-white ${
                  beacon.pulseColor === 'primary' ? 'bg-red-600' : 'bg-amber-600'
                }`}>
                  <Radio className="w-3.5 h-3.5 animate-pulse" />
                </div>

                {/* Info Tip Panel */}
                <div className="absolute left-10 top-0 bg-slate-900/95 dark:bg-slate-950/95 text-white p-3 rounded-lg shadow-2xl border-l-[3px] border-red-600 min-w-[160px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-200 z-40">
                  <p className="text-[10px] font-black uppercase text-red-500">{beacon.name}</p>
                  <p className="text-xs font-black mt-0.5">RANGE: {beacon.dist}</p>
                  <p className="text-[9px] text-slate-400">LAST SYNC: {beacon.lastPing}</p>
                  <p className="text-[9px] font-mono text-slate-500 mt-1">COORD: {beacon.coords}</p>
                </div>
              </div>
            </div>
          ))}

          {/* HUD Map Navigation elements */}
          <div className="absolute bottom-4 left-4 flex gap-2 z-20">
            <button className="bg-slate-950/95 p-3 rounded-lg text-red-500 font-bold shadow-lg border border-slate-800">
              <Crosshair className="w-4 h-4" />
            </button>
            <button className="bg-slate-950/95 p-3 rounded-lg text-blue-400 font-bold shadow-lg border border-slate-800">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </button>
          </div>
        </div>

        {/* Survivor Beacon Broadcast panel */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Active Broadcast card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm border-l-4 border-l-red-700">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-xl font-black text-red-700 dark:text-red-500 uppercase tracking-tight mb-4">
                SURVIVOR BEACON
              </h2>

              {/* Master round SOS Key toggling visual alarm */}
              <button
                id="emergency-sos-pulse-button"
                onClick={toggleSosBroadcast}
                className={`w-44 h-44 rounded-full flex flex-col items-center justify-center text-white transition-all duration-500 cursor-pointer shadow-2xl active:scale-95 border-4 border-white dark:border-slate-800 ${
                  isSosBroadcasting
                    ? 'bg-red-700 animate-pulse ring-8 ring-red-500/35 border-red-800'
                    : 'bg-slate-400 hover:bg-slate-500 dark:bg-slate-800'
                }`}
              >
                <Radio className="w-12 h-12 text-white mb-2 animate-bounce" />
                <span className="text-lg sm:text-xl font-black tracking-tight uppercase">
                  {isSosBroadcasting ? 'ACTIVE SOS' : 'BROADCAST SOS'}
                </span>
              </button>

              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-6 leading-relaxed">
                {isSosBroadcasting 
                  ? "🛰️ SAT-COMM OUTLET ON: Continuously broadcasting coordinates to search planes and satellites near Sector 4."
                  : "Standby mode. Tap key above to alert national disaster coordinators with your real-time secure telemetry."
                }
              </p>

              <div className="w-full space-y-3 mt-6">
                <button
                  id="open-satellite-sms-btn"
                  onClick={() => setShowSmsModal(true)}
                  className="w-full py-4 bg-slate-850 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-750 text-white font-black text-xs tracking-widest uppercase rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md"
                >
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <span>SEND SMS SIGNAL</span>
                </button>
                <p className="text-[10px] text-amber-700 dark:text-amber-500 font-extrabold tracking-widest uppercase font-mono">
                  USE IN ULTRA-LOW DATA SEC-NETS
                </p>
              </div>
            </div>
          </div>

          {/* Survivor Ping Streams list */}
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex-1 flex flex-col justify-between">
            <div>
              <header className="flex justify-between items-center mb-4">
                <h3 className="font-black text-xs tracking-widest uppercase text-slate-500">
                  Active Ping Monitor (In Sector)
                </h3>
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
              </header>

              <div className="space-y-3">
                {beacons.map((beacon) => (
                  <div
                    key={beacon.id}
                    className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850 flex justify-between items-center group hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                  >
                    <div className="flex gap-3 items-center">
                      <span className={`h-2.5 w-2.5 rounded-full ${
                        beacon.pulseColor === 'primary' ? 'bg-red-600 animate-pulse' : 'bg-amber-600'
                      }`} />
                      <div>
                        <p className="text-xs font-black text-slate-850 dark:text-white">{beacon.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{beacon.coords}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-red-600 font-mono">{beacon.dist}</p>
                      <p className="text-[9px] font-semibold text-slate-400">{beacon.lastPing}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 text-center mt-6 uppercase tracking-wider">
              🛰️ Sat-link telemetry updated via secure duplex grid
            </p>
          </div>
        </div>
      </div>

      {/* SMS Signal Dispatch Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn" id="sms-modal">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl animate-scaleUp">
            <header className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-sky-400" />
                <h3 className="font-black text-sm tracking-widest uppercase">SAT-LINK SMS DISPATCH</h3>
              </div>
              <button onClick={() => setShowSmsModal(false)} className="text-slate-400 font-bold text-lg hover:text-slate-600">✕</button>
            </header>

            {smsConfirmToast && (
              <div className="mb-4 bg-emerald-50 text-emerald-800 p-3 rounded-lg flex items-center gap-2 text-xs font-semibold border border-emerald-200">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>SMS uplink transmitted over secondary cellular transceivers!</span>
              </div>
            )}

            <form onSubmit={handleSmsSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Receiver Tactical Node / Emergency Group
                </label>
                <input
                  type="text"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-blue-600 text-slate-950 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  Low-Bandwidth Cryptographic Signal Message
                </label>
                <input
                  type="text"
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Draft emergency details..."
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg p-2.5 text-xs font-black focus:ring-2 focus:ring-blue-600 uppercase text-slate-950 dark:text-slate-100"
                  required
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSmsModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black tracking-widest text-[10px] py-3.5 rounded-lg uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-850 hover:bg-slate-800 dark:bg-sky-650 dark:hover:bg-sky-700 text-white font-black tracking-widest text-[10px] py-3.5 rounded-lg uppercase shadow-lg duration-100"
                >
                  Transmit SMS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
