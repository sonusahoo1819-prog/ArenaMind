'use client';

import React, { useState, useEffect } from 'react';
import { securityService, Incident } from './securityService';
import { useAuthStore } from '../auth/authStore';
import { ShieldAlert, AlertTriangle, UserCheck, CheckCircle2, Navigation, Loader2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IncidentPanelProps {
  simMode?: 'NORMAL' | 'HALFTIME' | 'EXIT' | 'EMERGENCY';
  setSimMode?: (mode: 'NORMAL' | 'HALFTIME' | 'EXIT' | 'EMERGENCY') => void;
}

export const IncidentPanel: React.FC<IncidentPanelProps> = ({ simMode = 'NORMAL', setSimMode }) => {
  const { token, user } = useAuthStore();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  
  const sosActive = simMode === 'EMERGENCY';
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('SECURITY');
  const [zone, setZone] = useState('Section 204');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStaff = user && ['SECURITY', 'MEDICAL', 'OPERATIONS', 'ADMIN'].includes(user.role);

  const fetchIncidents = async () => {
    if (!token || !isStaff) return;
    setIsLoading(true);
    try {
      const data = await securityService.getIncidents(token);
      setIncidents(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [token, isStaff]);

  const handleSOS = async () => {
    if (!token) return;
    
    if (sosActive) {
      // Toggle OFF
      if (setSimMode) {
        setSimMode('NORMAL');
      }
      try {
        alert('Emergency SOS deactivated. Returning to normal status.');
        fetchIncidents();
      } catch (err: any) {
        alert('Failed to deactivate: ' + err.message);
      }
    } else {
      // Toggle ON
      if (setSimMode) {
        setSimMode('EMERGENCY');
      }
      try {
        await securityService.triggerSOS({ zoneId: 'Current Zone', level: '1' }, token);
        alert('⚠️ EMERGENCY SOS ACTIVE. Medical & Security dispatched to your seat.');
        fetchIncidents();
      } catch (err: any) {
        alert('SOS Trigger Failed: ' + err.message);
        if (setSimMode) {
          setSimMode('NORMAL');
        }
      }
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await securityService.reportIncident(title, desc, type, { zoneId: zone }, token);
      setTitle('');
      setDesc('');
      alert('Incident logged successfully.');
      fetchIncidents();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      await securityService.updateIncidentStatus(id, status, token);
      fetchIncidents();
    } catch (err: any) {
      alert('Status update failed: ' + err.message);
    }
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] p-6 text-center border rounded-xl bg-zinc-950/20 border-zinc-800/40 shadow-inner">
        <Shield className="w-12 h-12 mb-4 text-[#FF1744]" aria-hidden="true" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Authentication Required</h2>
        <p className="max-w-md mt-2 text-zinc-500 text-xs">
          Please login to report incidents or trigger emergency SOS dispatch alerts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      
      {/* Redesigned Volumetric Emergency SOS Header */}
      <div className="p-5 border rounded-2xl bg-[#FF1744]/5 border-[#FF1744]/25 shadow-xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF1744]/5 to-transparent pointer-events-none" />
        
        <div className="flex items-center space-x-3.5">
          <div className="p-3 rounded-2xl bg-[#FF1744]/15 border border-[#FF1744]/30 animate-pulse flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-[#FF1744]" />
          </div>
          <div>
            <h2 className="text-sm font-black text-[#FF1744] uppercase tracking-wider">Emergency SOS Dispatch Gateway</h2>
            <p className="text-[10px] text-zinc-500 leading-normal mt-0.5 max-w-sm">
              Press the SOS activator to dispatch paramedics and security responders to your current stadium seating zone.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleSOS}
          className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border shadow-[0_0_20px_rgba(255,23,68,0.2)] ${
            sosActive 
              ? 'bg-[#FF1744]/15 border-[#FF1744]/40 text-[#FF1744] hover:bg-[#FF1744]/25 shadow-[0_0_25px_rgba(255,23,68,0.35)]' 
              : 'bg-[#FF1744] hover:bg-[#FF1744]/90 border-[#FF1744]/40 text-white'
          }`}
        >
          {sosActive ? 'Deactivate SOS' : 'Activate SOS Panic'}
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Report form */}
        <div className="p-5 border rounded-2xl bg-zinc-950/20 border-zinc-800/40 shadow-inner space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-zinc-800/40 pb-2">
            <AlertTriangle className="w-4 h-4 text-[#FFB000]" />
            <span>Log Stadium Incident</span>
          </h3>

          <form onSubmit={handleReport} className="space-y-3.5">
            <div>
              <label htmlFor="inc-title" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">
                Incident Title
              </label>
              <input
                id="inc-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Turnstile scanner error"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-800/80 bg-[#05070D]/60 text-white placeholder:text-zinc-650 focus:outline-none focus:border-[#007BFF] text-xs transition-all"
              />
            </div>

            <div>
              <label htmlFor="inc-desc" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">
                Incident Description
              </label>
              <textarea
                id="inc-desc"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe details of the issue..."
                required
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-800/80 bg-[#05070D]/60 text-white placeholder:text-zinc-650 focus:outline-none focus:border-[#007BFF] text-xs transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="inc-type" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">
                  Category
                </label>
                <select
                  id="inc-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-zinc-800/80 bg-[#05070D] text-white focus:outline-none focus:border-[#007BFF] text-xs transition-all cursor-pointer"
                >
                  <option value="SECURITY">Security</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="SOS">SOS / Critical</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="CROWD">Crowd Blockage</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="inc-zone" className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 block">
                  Location Zone
                </label>
                <input
                  id="inc-zone"
                  type="text"
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  placeholder="e.g. Sector 03"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-zinc-800/80 bg-[#05070D]/60 text-white placeholder:text-zinc-650 focus:outline-none focus:border-[#007BFF] text-xs transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-[#007BFF] hover:bg-[#007BFF]/90 text-white font-extrabold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_15px_rgba(0,123,255,0.3)]"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Log Incident File</span>}
            </button>
          </form>
        </div>

        {/* Dispatch Console (Staff-Only) */}
        {isStaff && (
          <div className="p-5 border rounded-2xl bg-zinc-950/20 border-zinc-800/40 shadow-inner space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2 border-b border-zinc-800/40 pb-2">
              <UserCheck className="w-4 h-4 text-[#00E5FF]" />
              <span>Incident Response Console</span>
            </h3>

            {isLoading && (
              <div className="flex justify-center p-6">
                <Loader2 className="w-6 h-6 text-[#00E5FF] animate-spin" />
              </div>
            )}

            {!isLoading && incidents.length === 0 && (
              <p className="text-xs text-zinc-500 text-center py-12 font-bold uppercase tracking-wider">No outstanding incidents reported.</p>
            )}

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-3 border rounded-xl bg-[#05070D]/40 border-zinc-800/40 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">{inc.title}</h4>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                        Type: {inc.type} | {inc.location?.zoneId || 'General'}
                      </p>
                    </div>
                    <span className="text-[9px] uppercase font-black text-[#FF1744] tracking-wider bg-[#FF1744]/10 border border-[#FF1744]/25 px-2 py-0.5 rounded">
                      {inc.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-normal">{inc.description}</p>

                  <div className="flex gap-2 pt-1">
                    {inc.status === 'REPORTED' && (
                      <button
                        onClick={() => updateStatus(inc.id, 'DISPATCHED')}
                        className="px-2.5 py-1 rounded bg-[#007BFF] hover:bg-[#007BFF]/95 text-white text-[9px] font-extrabold uppercase tracking-wide cursor-pointer"
                      >
                        Dispatch Responder
                      </button>
                    )}
                    {inc.status === 'DISPATCHED' && (
                      <button
                        onClick={() => updateStatus(inc.id, 'RESOLVED')}
                        className="px-2.5 py-1 rounded bg-[#00FF88] hover:bg-[#00FF88]/95 text-zinc-950 text-[9px] font-extrabold uppercase tracking-wide cursor-pointer"
                      >
                        Resolve Alert
                      </button>
                    )}
                    <button
                      onClick={() => updateStatus(inc.id, 'CANCELLED')}
                      className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white text-[9px] font-extrabold uppercase tracking-wide cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
