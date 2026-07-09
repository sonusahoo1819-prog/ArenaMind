'use client';

import React, { useState, useEffect } from 'react';
import { transportService, ParkingZone, ShuttleLine } from './transportService';
import { useAuthStore } from '../auth/authStore';
import { Car, Truck, Clock, Shield, Loader2, AlertCircle, CheckCircle, Navigation, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export const TransportPanel: React.FC = () => {
  const { token } = useAuthStore();
  const [parking, setParking] = useState<ParkingZone[]>([]);
  const [shuttles, setShuttles] = useState<ShuttleLine[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransportData = async () => {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const [parkingData, shuttleData] = await Promise.all([
          transportService.getParking(token),
          transportService.getShuttles(token),
        ]);
        setParking(parkingData);
        setShuttles(shuttleData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransportData();
  }, [token]);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-[350px] p-6 text-center border rounded-xl bg-zinc-950/20 border-zinc-800/40 shadow-inner">
        <Shield className="w-12 h-12 mb-4 text-[#00E5FF]" aria-hidden="true" />
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">Authentication Required</h2>
        <p className="max-w-md mt-2 text-zinc-500 text-xs">
          Please login to view active shuttle timelines and parking spot occupancy status.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELAYED':
        return (
          <span className="flex items-center space-x-1.5 text-[9px] px-2.5 py-1 rounded-full border border-[#FFB000]/25 bg-[#FFB000]/10 text-[#FFB000] font-extrabold uppercase tracking-wide">
            <AlertCircle className="w-3 h-3 animate-pulse" />
            <span>Delayed</span>
          </span>
        );
      case 'INACTIVE':
        return (
          <span className="flex items-center space-x-1.5 text-[9px] px-2.5 py-1 rounded-full border border-[#FF1744]/25 bg-[#FF1744]/10 text-[#FF1744] font-extrabold uppercase tracking-wide">
            <AlertCircle className="w-3 h-3" />
            <span>Inactive</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1.5 text-[9px] px-2.5 py-1 rounded-full border border-[#00FF88]/25 bg-[#00FF88]/10 text-[#00FF88] font-extrabold uppercase tracking-wide">
            <CheckCircle className="w-3 h-3" />
            <span>On Time</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 text-left">
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="w-7 h-7 text-[#00E5FF] animate-spin" />
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Fetching transit grids...</span>
        </div>
      )}

      {error && (
        <div className="p-4 border border-[#FF1744]/25 bg-[#FF1744]/10 rounded-xl text-xs text-[#FF1744] font-semibold">
          Failed to fetch transport status: {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Parking Status */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2 text-[#00E5FF] border-b border-zinc-800/40 pb-2">
              <Car className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Smart Parking Hub</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {parking.map((zone, index) => {
                const percent = Math.round((zone.occupiedSpots / zone.totalSpots) * 100);
                return (
                  <motion.div
                    key={zone.zoneId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3.5 border rounded-xl bg-zinc-950/20 border-zinc-800/40 shadow-inner flex flex-col justify-between space-y-3"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-white">{zone.name}</span>
                      <span className="text-[8px] bg-zinc-900 border border-zinc-800 text-zinc-500 font-black uppercase tracking-wider px-2 py-0.5 rounded">
                        {zone.zoneId}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                        <span>Occupied Spots</span>
                        <span>{zone.occupiedSpots} / {zone.totalSpots} ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50">
                        <div
                          style={{ width: `${percent}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent > 90 ? 'bg-[#FF1744]' : percent > 75 ? 'bg-[#FFB000]' : 'bg-[#00E5FF]'
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Shuttle Lines */}
          <div className="space-y-3.5">
            <div className="flex items-center space-x-2 text-[#00E5FF] border-b border-zinc-800/40 pb-2">
              <Truck className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Shuttle & Metro Transit</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {shuttles.map((shuttle, index) => (
                <motion.div
                  key={shuttle.shuttleId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3.5 border rounded-xl bg-zinc-950/20 border-zinc-800/40 shadow-inner flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">{shuttle.name}</h4>
                    <p className="text-[10px] text-zinc-500 font-bold">{shuttle.route}</p>
                    <div className="flex items-center space-x-2 pt-2">
                      <div className="p-1 rounded bg-[#00E5FF]/10">
                        <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
                      </div>
                      <span className="text-xs text-white font-extrabold tabular-nums">
                        Next Shuttle: {shuttle.nextArrivalMin} mins
                      </span>
                    </div>
                  </div>

                  <div>
                    {getStatusBadge(shuttle.status)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
