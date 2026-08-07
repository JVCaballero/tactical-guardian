import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Layers } from 'lucide-react';
import { OfflineSyncItem } from '../types';

interface OfflineBannerProps {
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  syncQueue: OfflineSyncItem[];
  triggerSync: () => void;
  isSyncing: boolean;
  lastSyncTime: string;
}

export default function OfflineBanner({
  isOffline,
  setIsOffline,
  syncQueue,
  triggerSync,
  isSyncing,
  lastSyncTime,
}: OfflineBannerProps) {
  const [showQueueDetails, setShowQueueDetails] = useState(false);

  return (
    <div className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden transition-all">
      <div className="px-4 py-3 sm:px-6 flex flex-wrap gap-4 items-center justify-between">
        {/* Left Side Status */}
        <div className="flex items-center gap-3">
          <button
            id="network-toggle-button"
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xs ${
              isOffline
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50 hover:bg-amber-200'
                : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-200'
            }`}
            title="Click to toggle Network Dropout mode"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 animate-pulse" />
                <span>OFFLINE MODE</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5" />
                <span>ONLINE CONNECTION</span>
              </>
            )}
          </button>

          <span className="text-xs text-slate-500 font-medium">
            {isOffline ? (
              <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                Local storage engine monitoring telemetry.
              </span>
            ) : (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Live operational payload synchronized.
              </span>
            )}
          </span>
        </div>

        {/* Right Side Sync Controls */}
        <div className="flex items-center gap-4 ml-auto sm:ml-0">
          {syncQueue.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                id="view-sync-queue-btn"
                onClick={() => setShowQueueDetails(!showQueueDetails)}
                className="text-[11px] font-black tracking-widest text-red-700 dark:text-red-500 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded hover:underline"
              >
                PNDG OUTBOUND: {syncQueue.length}
              </button>

              {!isOffline && (
                <button
                  id="force-sync-btn"
                  onClick={triggerSync}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded transition-all active:scale-95 shadow-sm"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'SYNCING...' : 'SYNC FILES'}</span>
                </button>
              )}
            </div>
          )}

          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Last Sync: <span className="font-mono">{lastSyncTime}</span>
          </div>
        </div>
      </div>

      {/* Sync Queue Details Dropdown */}
      {showQueueDetails && syncQueue.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 transition-all animate-fadIn">
          <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-2">
            Local Outbox (Action Logged)
          </h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            {syncQueue.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 px-3 py-2 rounded border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">
                    {item.action}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {JSON.stringify(item.data?.title || item.data?.name || 'Telemetry update')}
                  </span>
                </div>
                <span className="font-mono text-[9px] text-slate-400">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          {isOffline && (
            <p className="text-[10px] text-amber-700 dark:text-amber-500 mt-2 font-medium bg-amber-50 dark:bg-amber-950/20 p-2 rounded">
              ⚠️ Switch to <strong>ONLINE CONNECTION</strong> to push changes to the tactical command servers.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
