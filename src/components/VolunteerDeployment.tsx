import React, { useState } from 'react';
import { CheckCircle, MapPin, ClipboardList, Camera, Map, ChevronRight, AlertTriangle, Send } from 'lucide-react';
import { Assignment, Alert } from '../types';

interface VolunteerDeploymentProps {
  assignments: Assignment[];
  onCompleteAssignment: (assignmentId: string) => void;
  onAddAlert: (title: string, details: string, severity: 'critical' | 'warning' | 'info') => void;
  isOffline: boolean;
}

export default function VolunteerDeployment({
  assignments,
  onCompleteAssignment,
  onAddAlert,
  isOffline,
}: VolunteerDeploymentProps) {
  // Safe / Ready toggle
  const [isSafe, setIsSafe] = useState(false);
  const [safeStatusLogged, setSafeStatusLogged] = useState('STANDBY DEPLOYMENT');

  // Observation form fields
  const [obsType, setObsType] = useState('Structural Hazard');
  const [obsDetails, setObsDetails] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [customGPS, setCustomGPS] = useState('14.5958° N, 120.9772° E');
  const [photoProgress, setPhotoProgress] = useState(false);
  const [showConfirmToast, setShowConfirmToast] = useState(false);

  // Active Assignment View (Default: first active assignment)
  const activeAssignment = assignments.find(a => !a.completed) || assignments[0];

  const handleSafetyCheckIn = () => {
    setIsSafe(!isSafe);
    setSafeStatusLogged(!isSafe ? 'RESOLVED SAFE / ACTIVE IN FIELD' : 'STANDBY DEPLOYMENT');
  };

  const handleAttachPhoto = () => {
    setPhotoProgress(true);
    setTimeout(() => {
      setHasPhoto(true);
      setPhotoProgress(false);
    }, 1200);
  };

  const handleSendGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCustomGPS(`${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`);
        },
        () => {
          setCustomGPS('14.5995° N, 120.9842° E (Simulated)');
        }
      );
    } else {
      setCustomGPS('14.5995° N, 120.9842° E (Simulated)');
    }
  };

  const handleObservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!obsDetails.trim()) return;

    const disasterTitle = `Field Report: ${obsType}`;
    const disasterDetails = `${obsDetails} | Coords: ${customGPS} ${hasPhoto ? '(Photo Attachment Authenticated)' : ''}`;
    
    onAddAlert(disasterTitle, disasterDetails, 'critical');
    
    setObsDetails('');
    setHasPhoto(false);
    setShowConfirmToast(true);
    setTimeout(() => {
      setShowConfirmToast(false);
    }, 4000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Hero Activation Container */}
      <section className="col-span-12">
        <div className="relative overflow-hidden bg-gradient-to-br from-red-800 to-red-950 p-6 sm:p-8 rounded-2xl shadow-xl text-white">
          <div className="flex flex-col gap-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              FIELD TACTICAL UNIT STATUS
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none mb-1">
              DEPLOYMENT MODULE ACTIVE
            </h1>
            <p className="text-red-200 text-xs sm:text-sm font-semibold mb-6 max-w-sm font-mono">
              Responder ID: PH-772 • Sector 4 Base (Cebu Hub)
            </p>

            <button
              id="safety-status-checkin"
              onClick={handleSafetyCheckIn}
              className={`w-full sm:max-w-md font-black py-4.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${
                isSafe
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                  : 'bg-white hover:bg-slate-100 text-red-900'
              }`}
            >
              <CheckCircle className={`w-6 h-6 ${isSafe ? 'fill-white text-emerald-600' : ''}`} />
              <span className="text-sm tracking-widest uppercase">
                {isSafe ? "I'M SAFE / DEPLOYED READY" : "CHECK-IN: SAFE / READY"}
              </span>
            </button>
            <div className="mt-2 text-[10px] text-red-300 font-bold tracking-widest font-mono">
              STATUS CLASSIFIED: <span className={isSafe ? "text-emerald-400 font-black underline" : ""}>{safeStatusLogged}</span>
            </div>
          </div>

          {/* Glowing Orb Accents */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-slate-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>
      </section>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-12">
        {/* Left Side: Current Assignments */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {activeAssignment ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-l-4 border-l-red-700 p-6 shadow-xs">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                <span className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-[9px] font-black px-2.5 py-1 rounded-md tracking-wider">
                  ACTIVE TASK ASSIGNMENT
                </span>
                <span className="text-[10px] text-slate-400 font-bold font-mono">
                  TASK ID: {activeAssignment.id}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-slate-100 mb-2">
                {activeAssignment.title}
              </h2>

              <div className="flex items-center gap-2 mb-6">
                <MapPin className="text-blue-600 w-4 h-4 shrink-0" />
                <span className="text-xs font-black text-blue-600 tracking-tight">
                  {activeAssignment.location}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mb-6">
                {activeAssignment.description}
              </p>

              <div className="space-y-4 mb-8">
                {activeAssignment.steps.map((step, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-xs text-slate-700 dark:text-slate-300">
                      {index + 1}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              {/* Assignment Graphic Map */}
              <div className="rounded-xl overflow-hidden aspect-video relative group mb-6 border border-slate-200 dark:border-slate-800">
                <img
                  src={activeAssignment.mapImage}
                  alt="Deployment Sector Outline"
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 duration-300 object-center"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/10 transition-colors">
                  <span className="bg-slate-900/90 text-white px-3 py-1.5 text-[9px] font-black tracking-widest rounded-lg flex items-center gap-1">
                    <Map className="w-3.5 h-3.5" />
                    SECTOR DETAILS
                  </span>
                </div>
              </div>

              <button
                id="complete-assignment-btn"
                onClick={() => onCompleteAssignment(activeAssignment.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold rounded-lg text-xs font-black tracking-widest uppercase transition-all shadow-md hover:shadow-lg"
              >
                COMPLETE ACTIVE MISSION
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center shadow-xs">
              <ClipboardList className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase">ALL MISSIONS SATISFIED</h3>
              <p className="text-xs text-slate-500 mt-1">Excellent work, responder. Standby for new operational parameters from tactical core.</p>
            </div>
          )}
        </div>

        {/* Right Side: Field Observation Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h3 className="text-sm font-black tracking-widest text-slate-900 dark:text-slate-100 mb-4 uppercase">
              FIELD OBSERVATION SUBMISSION
            </h3>

            {showConfirmToast && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-lg flex items-center gap-2 animate-fadeIn text-xs font-semibold">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Field observation transmission queued! Check Alerts feed.</span>
              </div>
            )}

            <form onSubmit={handleObservationSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  OBSERVATION CLASS
                </label>
                <select
                  value={obsType}
                  onChange={(e) => setObsType(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-none rounded-lg p-3 text-xs font-semibold focus:ring-2 focus:ring-blue-600"
                >
                  <option>Structural Hazard</option>
                  <option>Resource Shortage</option>
                  <option>Medical Urgent</option>
                  <option>Road Blockage</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">
                  DETAILED ANALYSIS
                </label>
                <textarea
                  value={obsDetails}
                  onChange={(e) => setObsDetails(e.target.value)}
                  placeholder="Draft physical parameters, blockage depths, damaged building structures..."
                  className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-none rounded-lg p-3 text-xs h-32 font-medium focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Geographic Info Indicator */}
              <div className="bg-slate-50 dark:bg-slate-800 px-3 py-2.5 rounded-lg border border-slate-100 dark:border-slate-800 font-mono text-[10px] text-slate-500 flex items-center justify-between">
                <span>GPS PIN: <strong className="text-slate-700 dark:text-slate-300">{customGPS}</strong></span>
                <span className="text-emerald-600 font-bold uppercase tracking-widest">VALIDATED</span>
              </div>

              {/* Action Buttons to attach files */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAttachPhoto}
                  disabled={photoProgress}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border-dashed border-2 text-xs font-black uppercase tracking-wider transition-colors shrink-0 ${
                    hasPhoto 
                      ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700 dark:text-emerald-400' 
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'
                  }`}
                >
                  <Camera className="w-4 h-4 shrink-0" />
                  <span>{photoProgress ? 'UPLOADING...' : hasPhoto ? '✓ PHOTO SET' : 'ATTACH PHOTO'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSendGPS}
                  className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors shrink-0"
                >
                  <MapPin className="w-4 h-4 shrink-0 text-blue-600" />
                  <span>REFRESH GPS</span>
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-red-700 hover:bg-red-850 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest shadow-md mt-2"
              >
                <Send className="w-4 h-4 shrink-0" />
                TRANSMIT TO FIELD CONTROL
              </button>
            </form>
          </div>

          {/* Warning System Widget */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-600 p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
              <span className="text-[10px] font-black text-amber-700 dark:text-amber-400 tracking-widest uppercase">
                URGENT SIGNAL INTERCEPT
              </span>
            </div>
            <p className="text-xs font-black text-amber-800 dark:text-amber-400 leading-normal">
              Heavy landslide advisory flags on major arterial roads leading to Cebu San Fernando river corridors. Deploy supply distribution with utmost weather vigilance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
